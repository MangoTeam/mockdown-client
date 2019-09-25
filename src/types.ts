import kiwi from 'kiwi.js';

export enum Attribute {
    Left = "left",
    Top = "top",
    Right = "right",
    Bottom = "bottom",
    Width = "width",
    Height = "height"
}

export type VariableMap = { [key: string]: kiwi.Variable };

export interface IViewBoxJSON {
    name: string;
    rect: [number, number, number, number];
    children: Array<IViewBoxJSON>;
}

export interface IViewBox extends IViewBoxJSON {
    children: Array<IViewBox>;

    left: number;
    top: number;
    right: number;
    bottom: number;
    readonly width: number;
    readonly height: number;
}