import {
    ILayoutView,
    LayoutView,
    LayoutViewCursor
} from '../..';

describe(LayoutViewCursor, () => {
    test(`can go up and down.`, () => {
        const json: ILayoutView.JSON = {
            name: "root",
            rect: [0, 0, 100, 100],
            children: [
                {name: "a", rect: [0, 0, 50, 50], children: []},
            ]
        };

        const root = new LayoutView(json);
        const cursor = new LayoutViewCursor(root);

        cursor.goDown("a");
        expect(cursor.current).toBe(root.findChild("a")!);

        cursor.goUp();
        expect(cursor.current).toBe(root);
    });
});