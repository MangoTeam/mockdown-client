import { ILayoutViewTree } from './ILayoutViewTree';
import { ILayoutView } from './ILayoutView';
import { LayoutView } from './LayoutView';
import { IIndexedTree, IndexedTree } from '../util';

export class LayoutViewTree implements ILayoutViewTree {
    private _tree: IIndexedTree<string, ILayoutView, ILayoutViewTree>;

    public constructor(json: ILayoutViewTree.JSON, parent?: ILayoutViewTree) {
        const value = new LayoutView(json.name, [...json.rect] as ILayoutView.Rect) as ILayoutView;
        const children = (json.children || []).map((json) => {
            return new LayoutViewTree(json, this) as ILayoutViewTree;
        });

        this._tree = new IndexedTree(value, children, parent);
    }

    public get view(): ILayoutView { return this.value; }

    public set view(newView: ILayoutView) { this.value = newView; }

    // Implement ILayoutView by delegation.

    public get name(): string { return this.view.name; }

    public set name(newName: string) { this.view.name = newName; }

    public get id(): string { return this.name; }

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

    // Implement IIndexedTree by delegation.
    public get value(): ILayoutView { return this._tree.value; }

    public set value(newValue: ILayoutView) { this._tree.value = newValue; }

    public get children(): Iterable<ILayoutViewTree> {
        return this._tree.children;
    }

    public get parent(): ILayoutViewTree | undefined {
        return this._tree.parent;
    }

    findChild(id: string, recursive?: boolean | undefined): ILayoutViewTree | undefined {
        return this._tree.findChild(id, recursive);
    }

    [Symbol.iterator](): Iterator<ILayoutViewTree> {
        const root = this;

        function* iterator() {
            yield root;
            for (let child of root.children) {
                yield* child;
            }
        }

        return iterator();
    }

    /// Get the canonical JSON representation, which does not
    /// contain convenience accessors for left, right,
    /// top, bottom, width, height, center_x, center_y, etc.
    public get json(): ILayoutViewTree.JSON {
        return {
            name: this.view.name,
            rect: [...this.view.rect] as ILayoutView.Rect,
            children: Array.from(this.children, (child) => child.json)
        }
    }
}
