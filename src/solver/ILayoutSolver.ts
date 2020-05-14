import { Solver, Variable, Constraint } from "flightlessbird.js";
import { ILayoutViewTree } from "../views";
import { ConstraintParser } from "./ConstraintParser";

export interface ILayoutSolver extends Solver {
    readonly root: ILayoutViewTree;
    readonly variableMap: ILayoutSolver.VariableMap;
    readonly sourceConstraints : Set<Constraint>;

    getVariable(name: string): Variable | undefined;

    getVariables(...names: Array<string>): Array<Variable | undefined>;

    getConstraint(name: string) : Set<Constraint>;
    getConnectedConstraints(name: string) : Set<Constraint>;
    // getConstraints(names: Set<string>) : Set<Constraint>;

    getView(name: string): ILayoutViewTree | undefined;

    updateView(): void;

    
}

export namespace ILayoutSolver {
    export type VariableMap = Map<string, Variable>;
}
