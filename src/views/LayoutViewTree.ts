import { ILayoutViewTree } from './ILayoutViewTree';
import { ILayoutView } from './ILayoutView';
import { LayoutView } from './LayoutView';
import { IndexedTree } from '../util';

export class LayoutViewTree extends IndexedTree<string, ILayoutView> implements ILayoutViewTree {


    private constructor(value: ILayoutView) {
        super(value, 0);
    }

    static fromJSON(json: ILayoutViewTree.JSON) {

        const value = new LayoutView(json.name, [...json.rect] as ILayoutView.Rect) as ILayoutView;
        const root = new this(value);

        for (const childJSON of (json.children || [])) {
            root.add(this.fromJSON(childJSON));
        }

        return root;
    }

    public get view(): ILayoutView { return this.value; }

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
