import kiwi from 'kiwi.js';

/// This file contains a few typings used throughout the project.

export enum Attribute {
    Left = "left",
    Top = "top",
    Right = "right",
    Bottom = "bottom",
    Width = "width",
    Height = "height"
}

export type VariableMap = Map<string, kiwi.Variable>;