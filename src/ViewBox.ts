import { IViewBox, IViewBoxJSON } from './types';

export class ViewBox implements IViewBox {
    public name: string;
    public rect: [number, number, number, number];
    public children: Array<ViewBox>;
    
    constructor(json: IViewBoxJSON) {
        this.name = json.name;
        this.rect = json.rect;
        this.children = json.children.map((json) => new ViewBox(json));
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
    public get json(): IViewBoxJSON {
        return {
            name: this.name,
            rect: this.rect,
            children: this.children.map((child) => child.json)
        }
    }
}