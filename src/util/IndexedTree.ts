import { IIdentifiable } from './IIdentifiable';
import { IIndexedTree } from './IIndexedTree';

export class IndexedTree<TKey, TValue extends IIdentifiable<TKey>> implements IIndexedTree<TKey, TValue> {
    public value: TValue;

    private _childMap: Map<TKey, this>;
    private _parent?: this;

    public constructor(value: TValue) {
        this.value = value;
        this._childMap = new Map();
    }

    public get children(): ReadonlyArray<this> {
        return Array.from(this._childMap.values());
    }

    public clear() {
        this._childMap.clear();
    }

    public add(child: this) {
        this._childMap.set(child.value.id, child);
        return this;
    }

    public delete(key: TKey) {
        return this._childMap.delete(key);
    }

    public get parent(): this | undefined {
        return this._parent;
    }

    public set parent(newParent: this | undefined) {
        this._parent = newParent;
    }

    public find(id: TKey, recursive?: boolean): this | undefined {
        let needle: this | undefined = this._childMap.get(id);

        if (!needle && recursive) {
            for (let haystack of this.children) {
                needle = haystack.find(name, recursive);
                if (needle) return needle;
            }
        }

        return needle;
    }

    public [Symbol.iterator](): Iterator<this, void> {
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