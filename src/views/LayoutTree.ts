import {ILayoutTree} from './ILayoutTree';

export class LayoutTree implements ILayoutTree, Iterable<ILayoutTree> {
    public name: string;
    public rect: ILayoutTree.Rect;
    private _childMap: Map<string, ILayoutTree>;
    private _parent?: ILayoutTree;

    public constructor(json: ILayoutTree.JSON, parent?: ILayoutTree) {
        this.name = json.name;
        this.rect = [...json.rect] as ILayoutTree.Rect; // arrays are reference types!
        this._childMap = new Map(
            (json.children || []).map((json) => {
                return [json.name, new LayoutTree(json, this)];
            })
        );

        this._parent = parent;
    }

    public get children(): Iterable<ILayoutTree> { return this._childMap.values(); }
    public get parent(): ILayoutTree | undefined { return this._parent;}

    findChild(name: string, recursive?: boolean): ILayoutTree | undefined {
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

    public get left(): number { return this.rect[0]; }
    public set left(newLeft: number) { this.rect[0] = newLeft; }

    public get top(): number { return this.rect[1]; }
    public set top(newTop: number) { this.rect[1] = newTop; }

    public get right(): number { return this.rect[2]; }
    public set right(newRight: number) { this.rect[2] = newRight; }

    public get bottom(): number { return this.rect[3]; }
    public set bottom(newBottom: number) { this.rect[3] = newBottom; }

    public get width(): number { return this.right - this.left; }
    public get height(): number { return this.bottom - this.top; }

    /// Get the canonical JSON representation, which does not
    /// contain convenience accessors for left, right,
    /// top, bottom, width, height, center_x, center_y, etc.
    public get json(): ILayoutTree.JSON {
        return {
            name: this.name,
            rect: [...this.rect] as ILayoutTree.Rect,
            children: Array.from(this.children, (child) => child.json)
        }
    }

    /// Iterate over all views in this view hierarchy (including `this`!).
    [Symbol.iterator](): Iterator<ILayoutTree> {
        const root = this;

        function* iterator(): Iterator<ILayoutTree> {
            yield root;
            for (let child of root.children) {
                yield* child;
            }
        }

        return iterator();
    }
}
