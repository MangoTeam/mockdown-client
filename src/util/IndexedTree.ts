import { Identifiable } from './Identifiable';

export interface IIndexedTree<I, T extends Identifiable<I>, Self extends IIndexedTree<I, T, Self>> {
    value: T;

    // todo: these don't necessarily have to be readonly, there just isn't a write API yet.
    readonly children: Iterable<Self>;
    readonly parent: Self | undefined;

    findChild(id: I, recursive?: boolean): Self | undefined;

    // [Symbol.iterator](): Iterator<T>;
}

export class IndexedTree<I, T extends Identifiable<I>, Self extends IIndexedTree<I, T, Self>> implements IIndexedTree<I, T, Self> {
    public value: T;

    private _childMap: Map<I, Self>;
    private _parent?: Self;

    public constructor(value: T, children: Iterable<Self>, parent?: Self) {
        this.value = value;
        this._childMap = new Map(
            Array.from(children, (child) => {
                return [child.value.id, child];
            })
        );
        this._parent = parent;
    }

    public get children(): Iterable<Self> {
        return this._childMap.values();
    }

    public get parent(): Self | undefined {
        return this._parent;
    }

    public findChild(id: I, recursive?: boolean): Self | undefined {
        let needle: Self | undefined = this._childMap.get(id);

        if (!needle && recursive) {
            for (let haystack of this.children) {
                needle = haystack.findChild(name, recursive);
                if (needle) return needle;
            }
        }

        return needle;
    }
    //
    // public [Symbol.iterator](): Iterator<T> {
    //     const root = this;
    //
    //     function* iterator() {
    //         yield root.value;
    //         for (let child of root.children) {
    //             yield* child;
    //         }
    //     }
    //
    //     return iterator();
    // }
}