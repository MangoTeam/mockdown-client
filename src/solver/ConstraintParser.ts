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
            && ('a' in obj ? (typeof(obj.a) === 'number') : true)
            && ('b' in obj ? (typeof(obj.b) === 'number') : true)
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
            throw new Error(`Parsing failed: variable ${json.y} does not exist.`);
        }

        const x = json.x ? variableMap.get(json.x) : undefined;
        if (x === undefined && kind !== "absolute_size") {
            console.error('variables:');
            console.error([...variableMap.keys()]);
            throw new Error(`Parsing failed: variable ${json.x} does not exist.`);
        }

        const { b, op, a } = json;

        const strength = ConstraintParser.pickStrength(
            json.strength,
            options.strength
        ) || kiwi.Strength.required;

        // console.log('parsing with fixed')

        // let clamp = (x: number) => Number(x.toFixed(3))
        let clamp = (x: number) => x

        let rhs;
        if (x) {
            rhs = new kiwi.Expression(x).multiply(clamp(a || 1)).plus(clamp(b || 0));
        } else {
            rhs = new kiwi.Expression(clamp(b!));
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
        a?: number;
        b?: number;
        x?: string;
        y: string;
        op: '=' | '==' | '≥' | '>=' | '≤' | '<=';
        strength?: number | [number, number, number];
    }

    export interface IParseOptions {
        strength?: number | [number, number, number];
    }
}
