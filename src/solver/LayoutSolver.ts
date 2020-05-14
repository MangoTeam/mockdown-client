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
                    reachedFixed = false;
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
        // console.log(`length: ${views.length}`);
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
        for (const view of viewMap.values()) {
            // console.log(`adding axioms for ${view.name}`)
            const axStrength = Strength.required;
            let [left, top, right, bottom, width, height, centerx, centery] = attrs.map((attr) => {
                return variableMap.get(`${view.name}.${attr}`)!;
            });

            
            let centerYAxiom = new Constraint(
                centery, Operator.Eq, (top.plus(bottom)).divide(2.0),
                axStrength
            );
            let centerXAxiom = new Constraint(
                centerx, Operator.Eq, (left.plus(right)).divide(2.0),
                axStrength
            );

            let widthAxiomRHS = right.minus(left);
            let widthAxiom = new Constraint(
                width, Operator.Eq, widthAxiomRHS,
                axStrength
            );

            let heightAxiomRHS = bottom.minus(top);
            let heightAxiom = new Constraint(
                height, Operator.Eq, heightAxiomRHS,
                axStrength
            );
            
            this.addConstraint(centerYAxiom);
            this.addConstraint(centerXAxiom);
            this.addConstraint(heightAxiom);
            this.addConstraint(widthAxiom);
            
            for (const anchor of [left, top, right, bottom, width, height, centerx, centery]) {
                let positiveAnchor = new Constraint(anchor, Operator.Ge, new Expression(0), axStrength);
                this.addConstraint(positiveAnchor);
            }

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
