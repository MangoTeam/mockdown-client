import {Variable} from "kiwi.js";
import {ILayoutView} from "../views";

export interface ILayoutSolver {
    readonly root: ILayoutView;
    readonly variableMap: ILayoutSolver.VariableMap;

    getVariable(name: string): Variable | undefined;

    getVariables(...names: Array<string>): Array<Variable | undefined>;

    getView(name: string): ILayoutView | undefined;
}

export namespace ILayoutSolver {
    export type VariableMap = Map<string, Variable>;
}