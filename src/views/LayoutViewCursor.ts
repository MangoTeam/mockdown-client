import { ILayoutView } from "./ILayoutView";

export class LayoutViewCursor implements ILayoutView {
    private _root: ILayoutView;
    private _current: ILayoutView;

    constructor(root: ILayoutView) {
        this._root = root;
        this._current = root;
    }

    /// Additions provided by LayoutViewCursor.

    get current(): ILayoutView {
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

    /// Implementation of ILayoutView by delegation follows.

    get name(): string {
        return this._current.name;
    }

    set name(newName: string) {
        return
    }

    get rect(): ILayoutView.Rect {
        return this._current.rect;
    }

    set rect(newRect: ILayoutView.Rect) {
        this._current.rect = newRect;
    }

    get children(): Iterable<ILayoutView> {
        return this._current.children;
    }

    findChild(name: string, recursive?: boolean): ILayoutView | undefined {
        return this._current.findChild(name, recursive);
    }

    get parent(): ILayoutView | undefined {
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

    [Symbol.iterator](): Iterator<ILayoutView> {
        return this._current[Symbol.iterator]();
    }

}