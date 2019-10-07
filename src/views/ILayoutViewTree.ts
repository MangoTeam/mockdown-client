import { ILayoutView } from './ILayoutView';

export interface ILayoutViewTree extends ILayoutView {
    view: ILayoutView

    // todo: these don't necessarily have to be readonly, there just isn't a write API yet.
    readonly children: Iterable<ILayoutViewTree>;
    readonly parent: ILayoutViewTree | undefined;

    findChild(name: string, recursive?: boolean): ILayoutViewTree | undefined;

    readonly json: ILayoutViewTree.JSON;

    [Symbol.iterator](): Iterator<ILayoutViewTree>;
}

export namespace ILayoutViewTree {
    export interface JSON {
        name: string;
        rect: ILayoutView.Rect;
        children?: Array<ILayoutViewTree.JSON>;
    }
}