export interface ILayoutView {
    name: string;
    rect: [number, number, number, number];
    children: Array<ILayoutView>;

    left: number;
    top: number;
    right: number;
    bottom: number;
    readonly width: number;
    readonly height: number;

    [Symbol.iterator](): Iterator<ILayoutView>;
}

export namespace ILayoutView {
    export interface JSON {
        name: string;
        rect: [number, number, number, number];
        children?: Array<ILayoutView.JSON>;
    } 
}

export class LayoutView implements ILayoutView, Iterable<ILayoutView> {
    public name: string;
    public rect: [number, number, number, number];
    public children: Array<LayoutView>;
    
    constructor(json: ILayoutView.JSON) {
        this.name = json.name;
        this.rect = json.rect;
        this.children = (json.children || []).map((json) => {
            return new LayoutView(json);
        });
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
            children: this.children.map((child) => child.json)
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
