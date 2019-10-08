import { IIdentifiable } from '../util';

export interface ILayoutView extends IIdentifiable<string> {
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