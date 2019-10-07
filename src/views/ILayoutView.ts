export interface ILayoutView {
    name: string;
    rect: ILayoutView.Rect;

    left: number;
    top: number;
    right: number;
    bottom: number;
    readonly width: number;
    readonly height: number;
}

export namespace ILayoutView {
    export type Rect = [number, number, number, number];
}