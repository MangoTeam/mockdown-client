export interface ILayoutView {
    name: string;
    rect: [number, number, number, number];

    // todo: these don't necessarily have to be readonly, there just isn't a write API yet.
    readonly children: Iterable<ILayoutView>;
    readonly parent: ILayoutView | undefined;

    findChild(name: string, recursive?: boolean): ILayoutView | undefined;

    left: number;
    top: number;
    right: number;
    bottom: number;
    readonly width: number;
    readonly height: number;

    readonly json: ILayoutView.JSON;

    [Symbol.iterator](): Iterator<ILayoutView>;
}

export namespace ILayoutView {
    export interface JSON {
        name: string;
        rect: [number, number, number, number];
        children?: Array<ILayoutView.JSON>;
    }
}