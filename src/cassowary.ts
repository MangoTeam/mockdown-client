import kiwi from 'kiwi.js';
import { Attribute, VariableMap } from './types';
import { ILayoutView } from './LayoutView';

function createSolverVariableMap(views: Array<ILayoutView>) {
    const attrs = Object.values(Attribute);

    const variables = views.flatMap((b) => {
        return attrs.map((a) => new kiwi.Variable(`${b.name}.${a}`));
    });

    const variableMap = variables.reduce((acc: VariableMap, val) => {
        acc[val.name()] = val;
        return acc;
    }, {});

    return variableMap;
}

function createSolver(views: Array<ILayoutView>, variableMap: VariableMap) {
    // Create a solver
    let solver = new kiwi.Solver();
    Object.values(variableMap).forEach(variable => {
        solver.addEditVariable(variable, kiwi.Strength.strong);
    });

    // maps `${viewName}.${attr}` to numbers
    const viewsDictionary = views.reduce((acc: { [key: string]: number }, view: ILayoutView) => {
        const attrs: Attribute[] = Object.values(Attribute);
        attrs.forEach(a => acc[`${view.name}.${a}`] = view[a]);
        return acc;
    }, {});

    const varsWithValues = Object.values(variableMap).filter(kiwiVar => viewsDictionary[kiwiVar.name()]);
    varsWithValues.forEach(v => {
        solver.suggestValue(v, viewsDictionary[v.name()]);
    });

    return solver;
}

function createAxiomaticConstraints(views: Array<ILayoutView>, variables: VariableMap) {
    const operator = kiwi.Operator.Eq;
    const strength = kiwi.Strength.required;

    const axioms = views.reduce((acc: Array<kiwi.Constraint>, view) => {
        let [left, top, right, bottom, width, height] = [
            "left", "top", "right", "bottom", "width", "height"
        ].map((attr) => variables[`${view.name}.${attr}`]);

        let widthAxiomRHS = new kiwi.Expression(right.minus(left));
        let widthAxiom = new kiwi.Constraint(width, operator, widthAxiomRHS, strength);

        let heightAxiomRHS = new kiwi.Expression(bottom.minus(top));
        let heightAxiom = new kiwi.Constraint(height, operator, heightAxiomRHS, strength);

        acc.push(widthAxiom);
        acc.push(heightAxiom);

        return acc;
    }, []);

    return axioms;
}

export {
    createSolver,
    createSolverVariableMap,
    createAxiomaticConstraints
};