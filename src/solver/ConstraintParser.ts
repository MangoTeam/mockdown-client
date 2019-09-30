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

    parse(json: any, strength = kiwi.Strength.required) {
        const variableMap = this._variableMap;
        const y = variableMap.get(json.y);
        if (y === undefined) {
            throw new Error(`Parsing failed: variable ${json.y} does not exist.`);
        }

        const x = variableMap.get(json.x);
        if (x === undefined) {
            throw new Error(`Parsing failed: variable ${json.x} does not exist.`);
        }

        const { b, op, a } = json;
        let rhs = new kiwi.Expression(x).multiply(a || 1).plus(b || 0);

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
