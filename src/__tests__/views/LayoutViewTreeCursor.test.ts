import {
    ILayoutViewTree,
    LayoutViewTree,
    LayoutViewTreeCursor
} from '../..';

describe(LayoutViewTreeCursor, () => {
    test(`can go up and down.`, () => {
        const json: ILayoutViewTree.JSON = {
            name: "root",
            rect: [0, 0, 100, 100],
            children: [
                {name: "a", rect: [0, 0, 50, 50], children: []},
            ]
        };

        const root = new LayoutViewTree(json);
        const cursor = new LayoutViewTreeCursor(root);

        cursor.goDown("a");
        expect(cursor.current).toBe(root.findChild("a")!);

        cursor.goUp();
        expect(cursor.current).toBe(root);
    });
});