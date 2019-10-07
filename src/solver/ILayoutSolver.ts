import { Solver, Variable } from "kiwi.js";
import { ILayoutTree } from "../views";

export interface ILayoutSolver extends Solver {
    readonly root: ILayoutTree;
    readonly variableMap: ILayoutSolver.VariableMap;

    getVariable(name: string): Variable | undefined;

    getVariables(...names: Array<string>): Array<Variable | undefined>;

    getView(name: string): ILayoutTree | undefined;

    updateView(): void;
}

export namespace ILayoutSolver {
    export type VariableMap = Map<string, Variable>;
}