import { ILayoutTree } from "./ILayoutTree";

export class LayoutViewCursor implements ILayoutTree {
    private _root: ILayoutTree;
    private _current: ILayoutTree;

    constructor(root: ILayoutTree) {
        this._root = root;
        this._current = root;
    }

    /// Additions provided by LayoutViewCursor.

    get current(): ILayoutTree {
        return this._current;
    }

    goUp() {
        if (!this.parent) return;
        this._current = this.parent;
    }

    goDown(name: string): boolean {
        const child = this.findChild(name);
        if (child) {
            this._current = child;
            return true;
        } else {
            return false;
        }
    }

    /// Implementation of ILayoutTree by delegation follows.

    get name(): string {
        return this._current.name;
    }

    set name(newName: string) {
        return
    }

    get rect(): ILayoutTree.Rect {
        return this._current.rect;
    }

    set rect(newRect: ILayoutTree.Rect) {
        this._current.rect = newRect;
    }

    get children(): Iterable<ILayoutTree> {
        return this._current.children;
    }

    findChild(name: string, recursive?: boolean): ILayoutTree | undefined {
        return this._current.findChild(name, recursive);
    }

    get parent(): ILayoutTree | undefined {
        return this._current.parent;
    }

    get left(): number {
        return this._current.left;
    }

    set left(newLeft) {
        this._current.left = newLeft;
    }

    get top(): number {
        return this._current.top;
    }

    set top(newTop) {
        this._current.top = newTop;
    }

    get right(): number {
        return this._current.right;
    }

    set right(newRight) {
        this._current.right = newRight;
    }

    get bottom(): number {
        return this._current.bottom;
    }

    set bottom(newBottom) {
        this._current.bottom = newBottom;
    }

    get width() {
        return this._current.width;
    }

    get height() {
        return this._current.height;
    }

    get json() {
        return this._current.json;
    }

    [Symbol.iterator](): Iterator<ILayoutTree> {
        return this._current[Symbol.iterator]();
    }

}