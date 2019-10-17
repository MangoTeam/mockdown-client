import { ILayoutViewTree, LayoutViewTree, LayoutSolver } from '../../index';
import { Strength, Variable } from 'kiwi.js';

describe(LayoutSolver, () => {
    test(`creates edit variables for all attributes.`, () => {
        const tree = LayoutViewTree.fromJSON({
            name: 'root',
            rect: [0, 0, 100, 100]
        });
        const solver = new LayoutSolver(tree);
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
        const tree = LayoutViewTree.fromJSON({
            name: 'root',
            rect: [0, 0, 100, 100]
        });
        const solver = new LayoutSolver(tree);
        expect(solver.getView('root')).toBe(tree);
    });

    test(`solves for width when left and right are suggested (width axiom).`, () => {
        const tree = LayoutViewTree.fromJSON({
            name: 'root',
            rect: [0, 0, 100, 100] // note: this doesn't matter wrt the solver.
        });
        
        const solver = new LayoutSolver(tree);
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
        const tree = LayoutViewTree.fromJSON({
            name: 'root',
            rect: [0, 0, 100, 100] // note: this doesn't matter wrt the solver.
        });
        
        const solver = new LayoutSolver(tree);
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

    test(`modifying variables`, () => {
        const tree = LayoutViewTree.fromJSON({
            name: 'root',
            rect: [0, 0, 100, 100] // note: this doesn't matter wrt the solver.
        });
        
        const solver = new LayoutSolver(tree);
        const [top, bottom, height] = solver.getVariables(
            'root.top', 
            'root.bottom', 
            'root.height'
        ) as Array<Variable>;

        top.setValue(10);
        
        solver.updateView();
        expect(solver.root.json.rect).toBe([0, 10, 100, 100]);
    })

    test(`adding and modifying children`, () => {
        const tree = LayoutViewTree.fromJSON({
            name: 'root',
            rect: [0, 0, 100, 100] // note: this doesn't matter wrt the solver.
        });
        
        const solver = new LayoutSolver(tree); 

        const newRectJSON : ILayoutViewTree.JSON = { name: "c"
                            , rect: [25, 25, 75, 75]
                            , children: []
                            };

        const retrievedRoot = solver.getView('root');
        const retrievedRootJSON = retrievedRoot.json;
        
        expect(retrievedRootJSON.children);

        retrievedRootJSON.children.push(newRectJSON);

        const view = LayoutViewTree.fromJSON(retrievedRootJSON);
        const newSolver = new LayoutSolver(view);

        const [left, top, right, bottom] = newSolver.getVariables(
            `c.left`,
            `c.top`, 
            `c.right`,
            `c.bottom`
        ) as Array<Variable>;

        debugger

        newSolver.addEditVariable(left, Strength.strong);
        newSolver.suggestValue(left, 50);

        newSolver.addEditVariable(top, Strength.strong);
        newSolver.suggestValue(top, 50);

        newSolver.addEditVariable(right, Strength.strong);
        newSolver.suggestValue(right, 80);

        newSolver.addEditVariable(bottom, Strength.strong);
        newSolver.suggestValue(bottom, 80);

        newSolver.updateVariables();
        newSolver.updateView();

        const updatedRoot = newSolver.getView('root') as ILayoutViewTree

        expect(updatedRoot.rect).toEqual([0, 0, 100, 100]);
        // is actually [0,0,0,0]

    });
});