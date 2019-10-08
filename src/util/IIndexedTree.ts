import { IIdentifiable } from './IIdentifiable';

export interface IIndexedTree<TKey, TValue extends IIdentifiable<TKey>> {
    value: TValue;
    readonly parent: this | undefined;
    readonly children: ReadonlyArray<this>;

    clear(): void;
    add(child: this): this;
    delete(key: TKey): boolean;

    find(key: TKey, recursive?: boolean): this | undefined;

    [Symbol.iterator](): Iterator<this>
}