import { Solver, Variable } from "flightlessbird.js";
import { ILayoutViewTree } from "../views";

export interface ILayoutSolver extends Solver {
    readonly root: ILayoutViewTree;
    readonly variableMap: ILayoutSolver.VariableMap;

    getVariable(name: string): Variable | undefined;

    getVariables(...names: Array<string>): Array<Variable | undefined>;

    getView(name: string): ILayoutViewTree | undefined;

    updateView(): void;
}

export namespace ILayoutSolver {
    export type VariableMap = Map<string, Variable>;
}
