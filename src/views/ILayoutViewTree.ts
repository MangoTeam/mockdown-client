import { IIndexedTree } from '../util';
import { ILayoutView } from './ILayoutView';

export interface ILayoutViewTree extends IIndexedTree<string, ILayoutView>, ILayoutView {
    view: ILayoutView
    readonly json: ILayoutViewTree.JSON;
}

export namespace ILayoutViewTree {
    export interface JSON {
        name: string;
        rect: ILayoutView.Rect;
        children?: Array<ILayoutViewTree.JSON>;
    }
}