import { IIndexedTree } from '../util';
import { ILayoutView } from './ILayoutView';

export interface ILayoutViewTree extends IIndexedTree<string, ILayoutView>, ILayoutView {
    readonly view: ILayoutView
    readonly pojo: ILayoutViewTree.POJO;
}

export namespace ILayoutViewTree {
    export interface POJO {
        name: string;
        rect: ILayoutView.Rect;
        children: Array<ILayoutViewTree.POJO>;
    }

    export interface RelaxedPOJO {
        name: string;
        rect: ILayoutView.Rect;
        children?: Array<ILayoutViewTree.POJO>;
    }

    export namespace POJO {
        export function fromRelaxed(relaxed: RelaxedPOJO): POJO {
            const {name, rect, children} = relaxed;
            return {
                name,
                rect,
                children: children || []
            };
        }

        export function preorderIterator(root: POJO): Iterator<POJO> & Iterable<POJO> {
            function* iterator(pojo: POJO): Generator<POJO> {
                yield pojo;
                for (let child of pojo.children || []) {
                    yield* iterator(child);
                }
            }

            return iterator(root);
        }

        export function find(pojo: POJO, predicate: (pojo: POJO) => boolean): POJO | undefined {
            const it = preorderIterator(pojo);
            const nodes = Array.from(it);
            return nodes.find(predicate);
        }
    }
}
