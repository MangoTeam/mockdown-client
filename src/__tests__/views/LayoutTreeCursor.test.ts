import {
    ILayoutTree,
    LayoutTree,
    LayoutViewCursor
} from '../..';

describe(LayoutViewCursor, () => {
    test(`can go up and down.`, () => {
        const json: ILayoutTree.JSON = {
            name: "root",
            rect: [0, 0, 100, 100],
            children: [
                {name: "a", rect: [0, 0, 50, 50], children: []},
            ]
        };

        const root = new LayoutTree(json);
        const cursor = new LayoutViewCursor(root);

        cursor.goDown("a");
        expect(cursor.current).toBe(root.findChild("a")!);

        cursor.goUp();
        expect(cursor.current).toBe(root);
    });
});