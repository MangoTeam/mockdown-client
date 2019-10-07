import { ILayoutViewTree } from '../views';

export interface Identifiable<I> {
    readonly id: I;
}

export class IndexedTree<I, T extends Identifiable<I>> {
    public value: T;
    public parent?: IndexedTree<I, T>;

    private _childMap: Map<I, IndexedTree<I, T>>;

    public constructor(value: T, children: Iterable<IndexedTree<I, T>>) {
        this.value = value;

        this._childMap = new Map(
            Array.from(children, (child) => {
                return [child.value.id, child];
            })
        );
    }

    public get children(): Iterable<IndexedTree<I, T>> {
        return this._childMap.values();
    }

    public findChild(id: I, recursive?: boolean): IndexedTree<I, T> | undefined {
        let needle = this._childMap.get(id);

        if (!needle && recursive) {
            for (let haystack of this.children) {
                needle = haystack.findChild(name, recursive);
                if (needle) return needle;
            }
        }

        return needle;
    }

    public [Symbol.iterator](): Iterator<IndexedTree<I, T>> {
        const root = this;

        function* iterator() {
            yield root;
            for (let child of root.children) {
                yield* child;
            }
        }

        return iterator();
    }
}