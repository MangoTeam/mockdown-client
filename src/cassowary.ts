import kiwi from 'kiwi.js';
import {Attribute, VariableMap, IViewBox, IViewBoxJSON} from './types';

function createSolverVariableMap(boxes: Array<IViewBox>) {
    const attrs =  Object.values(Attribute);

    const variables = boxes.flatMap((b) => {
        return attrs.map((a) => new kiwi.Variable(`${b.name}.${a}`));
    });

    const variableMap = variables.reduce((acc: VariableMap, val) => {
        acc[val.name()] = val;
        return acc;
    }, {});

    return variableMap;
}

function createSolver(boxes: Array<IViewBox>, variableMap: VariableMap) {
    // Create a solver
    let solver = new kiwi.Solver();
    Object.values(variableMap).forEach(variable => {
        solver.addEditVariable(variable, kiwi.Strength.strong);
    });

    // maps `${boxName}.${attr}` to numbers
    const boxesDictionary = boxes.reduce((acc: {[key: string]: number}, box: IViewBox) => {
        const attrs: Attribute[]  = Object.values(Attribute);
        attrs.forEach(a => acc[`${box.name}.${a}`] = box[a]);
        return acc;
    }, {});

    const varsWithValues = Object.values(variableMap).filter(kiwiVar => boxesDictionary[kiwiVar.name()]);
    varsWithValues.forEach(v => {
        solver.suggestValue(v, boxesDictionary[v.name()]);
    });

    return solver;
}

function createAxiomaticConstraints(boxes: Array<IViewBox>, variables: VariableMap) {
    const operator = kiwi.Operator.Eq;
    const strength = kiwi.Strength.required;

    const axioms = boxes.reduce((acc: Array<kiwi.Constraint>, box) => {
        let [left, top, right, bottom, width, height] = [
            "left", "top", "right", "bottom", "width", "height"
        ].map((attr) => variables[`${box.name}.${attr}`]);

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