import { ILayoutView, LayoutView, LayoutSolver } from '..';
import { Strength, Variable } from 'kiwi.js';

describe(LayoutSolver, () => {
    test(`creates edit variables for all attributes.`, () => {
        const view = new LayoutView({
            name: 'root',
            rect: [0, 0, 100, 100]
        });
        const solver = new LayoutSolver(view);
        solver.updateVariables();

        const [left, top, right, bottom, width, height] = solver.getVariables(
            'root.left', 'root.top', 
            'root.right', 'root.bottom', 
            'root.width', 'root.height'
        );

        expect(left).not.toBeUndefined();
        expect(top).not.toBeUndefined();
        expect(right).not.toBeUndefined();
        expect(bottom).not.toBeUndefined();
        expect(width).not.toBeUndefined();
        expect(height).not.toBeUndefined();
    });
    
    test(`allows view lookup by name.`, () => {
        const view = new LayoutView({
            name: 'root',
            rect: [0, 0, 100, 100]
        });
        const solver = new LayoutSolver(view);
        expect(solver.getView('root')).toBe(view);
    });

    test(`solves for width when left and right are suggested (width axiom).`, () => {
        const view = new LayoutView({
            name: 'root',
            rect: [0, 0, 100, 100] // note: this doesn't matter wrt the solver.
        });
        
        const solver = new LayoutSolver(view);
        const [left, right, width] = solver.getVariables(
            'root.left', 
            'root.right', 
            'root.width'
        ) as Array<Variable>;

        solver.addEditVariable(left, Strength.strong);
        solver.suggestValue(left, 0);

        solver.addEditVariable(right, Strength.strong);
        solver.suggestValue(right, 100);

        solver.updateVariables();

        expect(width.value()).toBe(100);
    });

    test(`solves for height when top and bottom are suggested (height axiom).`, () => {
        const view = new LayoutView({
            name: 'root',
            rect: [0, 0, 100, 100] // note: this doesn't matter wrt the solver.
        });
        
        const solver = new LayoutSolver(view);
        const [top, bottom, height] = solver.getVariables(
            'root.top', 
            'root.bottom', 
            'root.height'
        ) as Array<Variable>;

        solver.addEditVariable(top, Strength.strong);
        solver.suggestValue(top, 0);

        solver.addEditVariable(bottom, Strength.strong);
        solver.suggestValue(bottom, 100);

        solver.updateVariables();

        expect(height.value()).toBe(100);
    });
});