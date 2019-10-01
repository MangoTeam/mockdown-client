import {ILayoutView} from './ILayoutView';

export class LayoutView implements ILayoutView, Iterable<ILayoutView> {
    public name: string;
    public rect: [number, number, number, number];
    private _childMap: Map<string, ILayoutView>;
    private _parent?: ILayoutView;

    public constructor(json: ILayoutView.JSON, parent?: ILayoutView) {
        this.name = json.name;
        this.rect = [json.rect[0], json.rect[1], json.rect[2], json.rect[3]]; // arrays are reference types!
        this._childMap = new Map(
            (json.children || []).map((json) => {
                return [json.name, new LayoutView(json, this)];
            })
        );

        this._parent = parent;
    }

    public get children(): Iterable<ILayoutView> { return this._childMap.values(); }
    public get parent(): ILayoutView | undefined { return this._parent;}

    findChild(name: string, recursive?: boolean): ILayoutView | undefined {
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
    public get json(): ILayoutView.JSON {
        return {
            name: this.name,
            rect: this.rect,
            children: Array.from(this.children, (child) => child.json)
        }
    }

    /// Iterate over all views in this view hierarchy (including `this`!).
    [Symbol.iterator](): Iterator<ILayoutView> {
        const root = this;

        function* iterator(): Iterator<ILayoutView> {
            yield root;
            for (let child of root.children) {
                yield* child;
            }
        }

        return iterator();
    }
}
