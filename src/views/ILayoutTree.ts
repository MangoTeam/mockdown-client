export interface ILayoutTree {
    name: string;
    rect: ILayoutTree.Rect;

    // todo: these don't necessarily have to be readonly, there just isn't a write API yet.
    readonly children: Iterable<ILayoutTree>;
    readonly parent: ILayoutTree | undefined;

    findChild(name: string, recursive?: boolean): ILayoutTree | undefined;

    left: number;
    top: number;
    right: number;
    bottom: number;
    readonly width: number;
    readonly height: number;

    readonly json: ILayoutTree.JSON;

    [Symbol.iterator](): Iterator<ILayoutTree>;
}

export namespace ILayoutTree {
    export type Rect = [number, number, number, number];

    export interface JSON {
        name: string;
        rect: Rect;
        children?: Array<ILayoutTree.JSON>;
    }
}