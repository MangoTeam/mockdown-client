import { ILayoutViewTree } from './ILayoutViewTree';
import { ILayoutView } from './ILayoutView';

export class LayoutViewTreeCursor implements ILayoutViewTree {
    private _root: ILayoutViewTree;
    private _current: ILayoutViewTree;

    constructor(root: ILayoutViewTree) {
        this._root = root;
        this._current = root;
    }

    /// Additions provided by LayoutViewCursor.

    get current(): ILayoutViewTree {
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

    // Implement ILayoutView by delegation.

    public get name(): string { return this.view.name; }
    public set name(newName: string) { this.view.name = newName; }

    public get rect(): ILayoutView.Rect { return this.view.rect; }
    public set rect(newRect: ILayoutView.Rect) { this.view.rect = newRect; }

    public get left(): number { return this.view.left; }
    public set left(newLeft: number) { this.view.left = newLeft; }

    public get top(): number { return this.view.top; }
    public set top(newTop: number) { this.view.top = newTop; }

    public get right(): number { return this.view.right; }
    public set right(newRight: number) { this.view.right = newRight; }

    public get bottom(): number { return this.view.bottom; }
    public set bottom(newBottom: number) { this.view.bottom = newBottom; }

    public get width(): number { return this.view.width; }
    public get height(): number { return this.view.height; }

    // Implement ILayoutTree by delegation.

    get view(): ILayoutView {
        return this._current.view;
    }

    set view(newView: ILayoutView) {
        this._current.view = newView;
    }

    get children(): Iterable<ILayoutViewTree> {
        return this._current.children;
    }

    findChild(name: string, recursive?: boolean): ILayoutViewTree | undefined {
        return this._current.findChild(name, recursive);
    }

    get parent(): ILayoutViewTree | undefined {
        return this._current.parent;
    }

    get json() {
        return this._current.json;
    }

    [Symbol.iterator](): Iterator<ILayoutViewTree> {
        return this._current[Symbol.iterator]();
    }

}