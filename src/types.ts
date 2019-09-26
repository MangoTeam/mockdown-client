import kiwi from 'kiwi.js';

export enum Attribute {
    Left = "left",
    Top = "top",
    Right = "right",
    Bottom = "bottom",
    Width = "width",
    Height = "height"
}

export type VariableMap = Map<string, kiwi.Variable>;