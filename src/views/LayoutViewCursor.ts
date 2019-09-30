import { ILayoutView } from "./ILayoutView";

export class LayoutViewCursor implements ILayoutView {
    private _root: ILayoutView;
    private _cursor: ILayoutView;

    constructor(root: ILayoutView) {
        this._root = root;
        this._cursor = root;
    }

    /// Additions provided by LayoutViewCursor.

    goUp() {
        if (!this.parent) return;
        this._cursor = this.parent;
    }

    goDown(name: string): boolean {
        const child = this.findChild(name);
        if (child) {
            this._cursor = child;
            return true;
        } else {
            return false;
        }
    }

    /// Implementation of ILayoutView by delegation follows.

    get name(): string {
        return this._cursor.name;
    }

    set name(newName: string) {
        return
    }

    get rect(): [number, number, number, number] {
        return this._cursor.rect;
    }

    set rect(newRect: [number, number, number, number]) {
        this._cursor.rect = newRect;
    }

    get children(): Iterable<ILayoutView> {
        return this._cursor.children;
    }

    findChild(name: string, recursive?: boolean): ILayoutView | undefined {
        return this._cursor.findChild(name, recursive);
    }

    get parent(): ILayoutView | undefined {
        return this._cursor.parent;
    }

    get left(): number {
        return this._cursor.left;
    }

    set left(newLeft) {
        this._cursor.left = newLeft;
    }

    get top(): number {
        return this._cursor.top;
    }

    set top(newTop) {
        this._cursor.top = newTop;
    }

    get right(): number {
        return this._cursor.right;
    }

    set right(newRight) {
        this._cursor.right = newRight;
    }

    get bottom(): number {
        return this._cursor.bottom;
    }

    set bottom(newBottom) {
        this._cursor.bottom = newBottom;
    }

    get width() {
        return this._cursor.width;
    }

    get height() {
        return this._cursor.height;
    }

    get json() {
        return this._cursor.json;
    }

    [Symbol.iterator](): Iterator<ILayoutView> {
        return this._cursor[Symbol.iterator]();
    }

}