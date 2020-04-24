import * as kiwi from 'flightlessbird.js';

import {ILayoutSolver} from "./ILayoutSolver";
import VariableMap = ILayoutSolver.VariableMap;
import IParseOptions = ConstraintParser.IParseOptions;

// Currently unused.
const constraintRegex = 
    /^([\w.]+)\s*(=|≥|≤|>=|<=)\s*(\d+)?\s*\*?\s*([\w.]+)\s+([+-])\s+(\d+)$/;

export class ConstraintParser {
    private readonly _variableMap: VariableMap;

    constructor(variableMap: VariableMap) {
        this._variableMap = variableMap;
    }

    static VALID_OPS = new Set(['=', '==', '≥', '>=', '≤', '<=']);

    static isConstraintJSON(obj: any): obj is ConstraintParser.IConstraintJSON {
        return (
            ('kind' in obj ? (typeof(obj.kind) === 'string') : true)
            && ('a' in obj ? (typeof(obj.a) === 'string') : true)
            && ('b' in obj ? (typeof(obj.b) === 'string') : true)
            && ('x' in obj ? (typeof(obj.x) === 'string') : true)
            && ('y' in obj && (typeof(obj.y) === 'string'))
            && 'op' in obj && ConstraintParser.VALID_OPS.has(obj.op)
        )
    }

    static normalizeStrength(param: number | [number, number, number] | undefined): (number | undefined) {
        if (typeof param === 'number') return param;
        if (typeof param === 'undefined') return param;
        return kiwi.Strength.create(...param);
    }

    static pickStrength(...strengths: (number | [number, number, number] | undefined)[]) : (number | undefined) {
        function reduction(z: number | undefined, strength: number | [number, number, number] | undefined) {
            return z || ConstraintParser.normalizeStrength(strength);
        }
        return strengths.reduce(reduction, undefined);
    }

    parse(json: any, options: IParseOptions = {}) {
        if (!ConstraintParser.isConstraintJSON(json)) {
            throw new Error("Got malformed constraint JSON.");
        }

        const variableMap = this._variableMap;

        const kind = json.kind;

        const y = variableMap.get(json.y);
        if (y === undefined) {
            throw new Error(`Parsing failed: y variable ${json.y} does not exist.`);
        }

        const x = json.x ? variableMap.get(json.x) : undefined;
        if (x === undefined && kind !== "size_constant") {
            console.error('variables:');
            console.error([...variableMap.keys()]);
            throw new Error(`Parsing failed: x variable ${json.x} does not exist.`);
        }

        const { b, op, a } = json;
        const [fA, fB] = [Number.parseFloat(a || "1"), Number.parseFloat(b || "0")];


        // const [num_a, num_b] = [Number.parseFloat(a), Number.parseFloat(b)]

        const strength = ConstraintParser.pickStrength(
            json.strength,
            options.strength
        ) || kiwi.Strength.required;


        let rhs;
        if (x) {
            rhs = new kiwi.Expression(x).multiply(fA).plus(fB);
        } else {
            if (b) {
                rhs = new kiwi.Expression(fB);
            } else {
                throw new Error("Expected 'b' when x is undefined");
            }
            
        }

        let kiwiOp: kiwi.Operator | undefined = undefined;
        switch (op) {
            case "=":
            case "==": 
                kiwiOp = kiwi.Operator.Eq;
                break;
            case "≥":
            case ">=":
                kiwiOp = kiwi.Operator.Ge;
                break;
            case "≤":
            case "<=":
                kiwiOp = kiwi.Operator.Le;
                break;
        }

        if (kiwiOp === undefined) {
            throw new Error(`Parsing failed: ${op} is not a valid operator.`);
        }

        return new kiwi.Constraint(y, kiwiOp, rhs, strength);
    }
}

export namespace ConstraintParser {
    export interface IConstraintJSON {
        kind?: string,
        a?: string;
        b?: string;
        x?: string;
        y: string;
        op: '=' | '==' | '≥' | '>=' | '≤' | '<=';
        strength?: number | [number, number, number];
    }

    // return {
    //     'y': str(self.y_id),
    //     'op': {
    //         operator.eq: '=',
    //         operator.le: '≤',
    //         operator.ge: '≥'
    //     }[self.op],
    //     'a': str(self.a),
    //     'b': str(self.b),
    //     'priority': str(self.priority),
    //     'kind': self.kind.value
    // }

    export interface IParseOptions {
        strength?: number | [number, number, number];
    }
}
