import { ILayoutView } from './ILayoutView';

export class LayoutView implements ILayoutView {
    public name: string;
    public rect: ILayoutView.Rect;

    constructor(name: string, rect: ILayoutView.Rect) {
        this.name = name;
        this.rect = rect;
    }

    // Implement Identifiable.
    public get id(): string { return this.name }

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
}