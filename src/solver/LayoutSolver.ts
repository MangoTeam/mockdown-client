import { 
    Constraint, 
    Expression, 
    Operator,
    Solver, 
    Strength, 
    Variable 
} from 'kiwi.js';

import { Attribute } from '../types';
import { ILayoutView } from '../views';

export interface ILayoutSolver {
    readonly variableMap: Map<string, Variable>;

    getVariable(name: string): Variable | undefined;
    getVariables(...names: Array<string>): Array<Variable | undefined>;
    getView(name: string): ILayoutView | undefined;
}

export class LayoutSolver extends Solver implements ILayoutSolver {
    /// The root of the view hierarchy being solved over.
    private _root: ILayoutView;

    /// Index for all variables by name (e.g. 'foo.left').
    private _variableMap: Map<string, Variable>;

    /// Index for all views by name (e.g. 'foo').
    private _viewMap: Map<string, ILayoutView>;

    get variableMap(): Map<string, Variable> {
        return this._variableMap;
    }

    public getVariable(name: string): Variable | undefined {
        return this._variableMap.get(name);
    }

    public getVariables(...names: Array<string>): Array<Variable | undefined> {
        return names.map((name) => this.getVariable(name));
    }

    public getView(name: string): ILayoutView | undefined {
        return this._viewMap.get(name);
    }

    constructor(root: ILayoutView) {
        super();

        const views = Array.from(root);
        const attrs = Object.values(Attribute);

        this._root = root;
        const viewMap = this._viewMap = new Map(
            views.map((view: ILayoutView) => {
                return [view.name, view];
            })
        );

        // Create all of the necessary variables.
        const variableMap = this._variableMap = new Map(
            views.flatMap((view: ILayoutView) => {
                return attrs.map((attr) => {
                    const name = `${view.name}.${attr}`;
                    return [name, new Variable(name)];
                })
            })
        );

        // Add the axiomatic constraints, e.g. width = right - left.
        for (let view of viewMap.values()) {
            let [left, top, right, bottom, width, height] = attrs.map((attr) => {
                return variableMap.get(`${view.name}.${attr}`)!;
            });

            let widthAxiomRHS = new Expression(right.minus(left));
            let widthAxiom = new Constraint(
                width, Operator.Eq, widthAxiomRHS, 
                Strength.required
            );
            this.addConstraint(widthAxiom);

            let heightAxiomRHS = new Expression(bottom.minus(top));
            let heightAxiom = new Constraint(
                height, Operator.Eq, heightAxiomRHS, 
                Strength.required
            );
            this.addConstraint(heightAxiom);
        }
    }
}
