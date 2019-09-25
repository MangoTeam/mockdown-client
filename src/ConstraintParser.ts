import kiwi from 'kiwi.js';
import { VariableMap } from './types';

class ConstraintParser {
    private _variableMap: VariableMap;
    constructor(variableMap: VariableMap) {
        this._variableMap = variableMap;
    }
    parse(json: any) {
        const variableMap = this._variableMap;
        const y = variableMap[json.y];
        const x = variableMap[json.x];
        const { b, op, a } = json;
        let rhs = new kiwi.Expression(x).multiply(a).plus(b);
        let kiwiOperator = (op === "≥") ?
            kiwi.Operator.Ge :
            kiwi.Operator.Le;
        return new kiwi.Constraint(y, kiwiOperator, rhs, kiwi.Strength.required);
    }
}
