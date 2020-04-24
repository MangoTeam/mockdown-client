import { Constraint, Expression, Operator, Strength, Variable} from 'flightlessbird.js';
import { Solver } from 'flightlessbird.js';

import { Attribute, ILayoutViewTree } from '../views';
import { ILayoutSolver } from "./ILayoutSolver";
import { ConstraintParser } from "./ConstraintParser";

import { filter, any, union } from "../util";

export class LayoutSolver extends Solver implements ILayoutSolver {
    /// The root of the view hierarchy being solved over.
    readonly root: ILayoutViewTree;

    /// Index for all variables by name (e.g. 'foo.left').
    readonly variableMap: Map<string, Variable>;

    readonly sourceConstraints : Set<Constraint>;
    

    /// Index for all views by name (e.g. 'foo').
    private _viewMap: Map<string, ILayoutViewTree>;

    public getVariable(name: string): Variable | undefined {
        return this.variableMap.get(name);
    }

    public getVariables(...names: Array<string>): Array<Variable | undefined> {
        return names.map((name) => this.getVariable(name));
    }

    public getConstraint(name: string) : Set<Constraint> {

        const out = new Set<Constraint>();
        
        for (let constr of this.sourceConstraints) {
            // for (let pr of constr.expression().terms()) {
            for (let pr of constr.expression().terms().array) {
                const term = pr.first;
                if (term.name() == name) out.add(constr)
            }
        }

        return out;
    }

    public getConnectedConstraints(name: string) : Set<Constraint> {

        const out = new Set<Constraint>();
        let names = new Set<string>();
        names.add(name);
        let reachedFixed = false;
    
        while (!reachedFixed) {
            reachedFixed = true;
            const inspect = filter(this.sourceConstraints, (t) => !out.has(t));
            for (let constr of inspect) {

                const terms = new Set<string>(constr.expression().terms().array.map(v => v.first.name()));

                if (any(terms, t => names.has(t))) {
                    names = union(names, terms);
                    out.add(constr);
                    reachedFixed = true;
                }
            }
        }

        // console.log([...names]);
        
        return out;
    }


    public getView(name: string): ILayoutViewTree | undefined {
        return this._viewMap.get(name);
    }

    public addConstraint(constraint: Constraint) : void {
        super.addConstraint(constraint);
        this.sourceConstraints.add(constraint);
    }
    

    constructor(root: ILayoutViewTree) {
        super();

        const views = Array.from(root);
        const attrs = Object.values(Attribute);

        this.root = root;
        const viewMap = this._viewMap = new Map(
            views.map((view: ILayoutViewTree) => {
                return [view.name, view];
            })
        );

        // Create all of the necessary variables.
        const variableMap = this.variableMap = new Map(
            views.flatMap((view: ILayoutViewTree) => {
                return attrs.map((attr) => {
                    const name = `${view.name}.${attr}`;
                    return [name, new Variable(name)];
                })
            })
        );

        this.sourceConstraints = new Set();

        // Add the axiomatic constraints, e.g. width = right - left, width >= 0.
        let fuzzyAxioms = false;
        for (const view of viewMap.values()) {
            let [left, top, right, bottom, width, height, centerx, centery] = attrs.map((attr) => {
                return variableMap.get(`${view.name}.${attr}`)!;
            });

            let widthAxiomRHS = right.minus(left);
            let heightAxiomRHS = bottom.minus(top);
            let cyRHS = top.multiply(2).plus(height);
            let cxRHS = left.multiply(2).plus(width);

            if (fuzzyAxioms) {

                const fuzz = 0.01;

                this.addConstraint(new Constraint(
                    centery.multiply(2), Operator.Le, cyRHS.plus(fuzz),
                    Strength.required
                ));
                this.addConstraint(new Constraint(
                    centery.multiply(2), Operator.Ge, cyRHS.minus(fuzz),
                    Strength.required
                ));
                this.addConstraint(new Constraint(
                    centerx.multiply(2), Operator.Le, cxRHS.plus(fuzz),
                    Strength.required
                ));
                this.addConstraint(new Constraint(
                    centerx.multiply(2), Operator.Ge, cxRHS.minus(fuzz),
                    Strength.required
                ));
                this.addConstraint(new Constraint(
                    height, Operator.Le, heightAxiomRHS.plus(fuzz),
                    Strength.required
                ));
                this.addConstraint(new Constraint(
                    height, Operator.Ge, heightAxiomRHS.plus(fuzz),
                    Strength.required
                ));
                this.addConstraint(new Constraint(
                    width, Operator.Le, widthAxiomRHS.plus(fuzz),
                    Strength.required
                ));
                this.addConstraint(new Constraint(
                    width, Operator.Ge, widthAxiomRHS.minus(fuzz),
                    Strength.required
                ));

            } else {
                this.addConstraint(new Constraint(
                    centery.multiply(2), Operator.Eq, top.multiply(2).plus(height),
                    Strength.required
                ));
                this.addConstraint(new Constraint(
                    centerx.multiply(2), Operator.Eq, left.multiply(2).plus(width),
                    Strength.required
                ));
                this.addConstraint(new Constraint(
                    height, Operator.Eq, heightAxiomRHS,
                    Strength.required
                ));
                this.addConstraint(new Constraint(
                    width, Operator.Eq, widthAxiomRHS,
                    Strength.required
                ));
            }

            let positiveWidthAxiom = new Constraint(width, Operator.Ge, new Expression(0));
            let positiveHeightAxiom = new Constraint(height, Operator.Ge, new Expression(0));

            this.addConstraint(positiveWidthAxiom);
            this.addConstraint(positiveHeightAxiom);


        }
    }

    updateView(): void {
        for (const view of this.root) {
            for (const attr of Attribute.writables) {
                const variable = this.variableMap.get(`${view.name}.${attr}`);
                if (variable === undefined) {
                    throw new Error(`unknown variable ${view.name}.${attr}`);
                }
                view[attr] = variable.value();
            }
        }
    }
}
