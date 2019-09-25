import { ILayoutView, LayoutView } from '../LayoutView';

describe(LayoutView, () => {
    test(`can be constructed from JSON.`, () => {
        const view = new LayoutView({
            name: "root",
            rect: [0, 0, 100, 100],
            children: []
        });
    });

    test(`can be constructed from JSON without 'children'.`, () => {
        const view = new LayoutView({
            name: "root",
            rect: [0, 0, 100, 100]
        });
    });

    test(`can be converted into JSON (and back)`, () => {
        const json: ILayoutView.JSON = {
            name: "root",
            rect: [0, 0, 100, 100],
            children: [
                {name: "a", rect: [0, 0, 50, 50], children: []},
                {name: "b", rect: [50, 50, 100, 100], children: []},
            ]
        };

        const view = new LayoutView(json);

        expect(view.json).toEqual(json);
    });

    test(`implements attribute getters.`, () => {
        const view = new LayoutView({
            name: "root",
            rect: [10, 10, 100, 100],
            children: []
        });

        expect(view.left).toBe(10);
        expect(view.top).toBe(10);
        expect(view.right).toBe(100);
        expect(view.bottom).toBe(100);
        expect(view.width).toBe(90);
        expect(view.height).toBe(90);
    });

    test(`implements attribute setters.`, () => {
        const view = new LayoutView({
            name: "root",
            rect: [0, 0, 100, 100],
            children: []
        });

        view.left = 10;
        view.top = 10;
        view.right = 90;
        view.bottom = 90;

        expect(view.left).toBe(10);
        expect(view.top).toBe(10);
        expect(view.right).toBe(90);
        expect(view.bottom).toBe(90);
        expect(view.width).toBe(80);
        expect(view.height).toBe(80);
    });

    test(`implements Iterable.`, () => {
        const view = new LayoutView({
            name: "root",
            rect: [0, 0, 100, 100],
            children: [
                {name: "a", rect: [0, 0, 50, 50], children: []},
                {name: "b", rect: [50, 50, 100, 100], children: []},
            ]
        });

        const views = Array.from(view).map((v) => v.name);
        expect(views).toContain("root");
        expect(views).toContain("a");
        expect(views).toContain("b");
    });
})