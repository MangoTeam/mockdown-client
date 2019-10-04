import { Solver, Variable } from "kiwi.js";
import { ILayoutView } from "../views";

export interface ILayoutSolver extends Solver {
    readonly root: ILayoutView;
    readonly variableMap: ILayoutSolver.VariableMap;

    getVariable(name: string): Variable | undefined;

    getVariables(...names: Array<string>): Array<Variable | undefined>;

    getView(name: string): ILayoutView | undefined;

    updateView(): void;
}

export namespace ILayoutSolver {
    export type VariableMap = Map<string, Variable>;
}