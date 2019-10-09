export type Rect = [number, number, number, number];

export type Region = Set<Rect>;

export namespace Region {

}

export namespace Rect {
    export function left(rect: Rect) { return rect[0]; }

    export function top(rect: Rect) { return rect[1]; }

    export function right(rect: Rect) { return rect[2]; }

    export function bottom(rect: Rect) { return rect[3]; }

    export function width(rect: Rect) { return Rect.right(rect) - Rect.left(rect); }

    export function height(rect: Rect) { return Rect.bottom(rect) - Rect.top(rect); }

    export function area(rect: Rect) { return Rect.width(rect) * Rect.height(rect); }

    export function isDegenerate(rect: Rect) { return Rect.area(rect) == 0; }

    export function difference(rect1: Rect, rect2: Rect): Region {
        /*
                X = intersection (might be empty, we don't care)
            0 - 7 = possible difference rects.

               x1  x2  x3  x4
            y1 +---+---+---+
               | 0 | 1 | 2 |
            y2 +---+---+---+
               | 3 | X | 4 |
            y3 +---+---+---+
               | 5 | 6 | 7 |
            y4 +---+---+---+
        */

        const [l1, t1, r1, b1] = rect1;
        const [l2, t2, r2, b2] = rect2;

        const x1 = Math.min(l1, l2);
        const x2 = Math.max(l1, l2);
        const x3 = Math.min(r1, r2);
        const x4 = Math.max(r1, r2);

        const y1 = Math.min(t1, t2);
        const y2 = Math.max(t1, t2);
        const y3 = Math.min(b1, b2);
        const y4 = Math.max(b1, b2);

        // See above diagram.
        const diffs: Rect[] = [
            [x1, y1, x2, y2],
            [x2, y1, x3, y2],
            [x3, y1, x4, y2],

            [x1, y2, x2, y3],
            [x3, y2, x4, y3],

            [x1, y3, x2, y4],
            [x2, y3, x3, y4],
            [x3, y3, x4, y4]
        ];

        const region = new Set<Rect>();

        for (const i of [1, 3, 4, 6]) {
            if (!isDegenerate(diffs[i])) {
                region.add(diffs[i]);
            }
        }

        if (l1 == x1 && t1 == y1 || l2 == x1 && t2 == y1) {
            for (const i of [0, 7]) {
                if (!isDegenerate(diffs[i])) {
                    region.add(diffs[i]);
                }
            }
        } else {
            for (const i of [2, 5]) {
                if (!isDegenerate(diffs[i])) {
                    region.add(diffs[i]);
                }
            }
        }

        return region;
    }
}

