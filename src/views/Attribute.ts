export enum Attribute {
    Left = "left",
    Top = "top",
    Right = "right",
    Bottom = "bottom",
    Width = "width",
    Height = "height"
}

export namespace Attribute {
    export const writables: Array<Attribute.Left | Attribute.Top | Attribute.Right | Attribute.Bottom> = [
        Attribute.Left,
        Attribute.Top,
        Attribute.Right,
        Attribute.Bottom
    ];
}