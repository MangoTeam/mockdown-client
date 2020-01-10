import * as kiwi from 'kiwi.js';

import {ILayoutSolver} from "./ILayoutSolver";
import VariableMap = ILayoutSolver.VariableMap;

// Currently unused.
const constraintRegex = 
    /^([\w.]+)\s*(=|≥|≤|>=|<=)\s*(\d+)?\s*\*?\s*([\w.]+)\s+([+-])\s+(\d+)$/;

export class ConstraintParser {
    private _variableMap: VariableMap;

    constructor(variableMap: VariableMap) {
        this._variableMap = variableMap;
    }

    parse(json: any, strengthOverride?: [number, number, number]) {
        const variableMap = this._variableMap;

        const kind = json.kind;

        const y = variableMap.get(json.y);
        if (y === undefined) {
            throw new Error(`Parsing failed: variable ${json.y} does not exist.`);
        }

        const x = variableMap.get(json.x);
        if (x === undefined && kind !== "absolute_size") {
            throw new Error(`Parsing failed: variable ${json.x} does not exist.`);
        }

        const { b, op, a } = json;

        const jsonStrength = json.get('strength') as ([number, number, number] | undefined);
        if (jsonStrength && jsonStrength.length !== 3) {
            throw new Error("now you have fucked up");
        }

        const strengthParams = strengthOverride || jsonStrength;
        const strength = strengthParams ? kiwi.Strength.create(...strengthParams) : undefined;

        let rhs;
        if (x) {
            rhs = new kiwi.Expression(x).multiply(a || 1).plus(b || 0);
        } else {
            rhs = new kiwi.Expression(b);
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
