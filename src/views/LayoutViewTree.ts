import {ILayoutViewTree} from './ILayoutViewTree';
import { ILayoutView } from './ILayoutView';
import { LayoutView } from './LayoutView';

export class LayoutViewTree implements ILayoutViewTree, Iterable<ILayoutViewTree> {
    public view: ILayoutView;

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


    private _childMap: Map<string, ILayoutViewTree>;
    private _parent?: ILayoutViewTree;

    public constructor(json: ILayoutViewTree.JSON, parent?: ILayoutViewTree) {
        this.view = new LayoutView(json.name, [...json.rect] as ILayoutView.Rect);
        this._childMap = new Map(
            (json.children || []).map((json) => {
                return [json.name, new LayoutViewTree(json, this)];
            })
        );

        this._parent = parent;
    }

    public get children(): Iterable<ILayoutViewTree> { return this._childMap.values(); }
    public get parent(): ILayoutViewTree | undefined { return this._parent;}

    findChild(name: string, recursive?: boolean): ILayoutViewTree | undefined {
        let needle = this._childMap.get(name);

        if (!needle && recursive) {
            for (let haystack of this.children) {
                needle = haystack.findChild(name, recursive);
                if (needle) {
                    return needle;
                }
            }
        }

        return needle;
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

    /// Iterate over all views in this view hierarchy (including `this`!).
    [Symbol.iterator](): Iterator<ILayoutViewTree> {
        const root = this;

        function* iterator(): Iterator<ILayoutViewTree> {
            yield root;
            for (let child of root.children) {
                yield* child;
            }
        }

        return iterator();
    }
}
