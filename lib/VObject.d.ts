/// <reference types="react" />
export declare type ETypes = 'object' | 'array' | 'Set' | 'Map' | 'date' | 'arguments' | 'undefined' | 'null' | 'number' | 'bigint' | 'symbol' | 'boolean' | 'string' | 'function' | 'getter';
export declare type ETypesName = 'Object' | 'Array' | 'Set' | 'Map' | 'Date' | 'Arguments' | 'Undefined' | 'Null' | 'Number' | 'Bigint' | 'Symbol' | 'Boolean' | 'String' | 'Function' | 'Getter';
export default class VObject {
    type: ETypes;
    typeName: ETypesName;
    value: any;
    desc: string;
    depth: number;
    parent?: VObject;
    key: number | string;
    childName?: string;
    toggleOn?: boolean;
    container?: [string | undefined, string | undefined];
    length: number;
    child?: VObject[];
    getChilds?: () => VObject[] | undefined;
    updateGetterChild: ((object: VObject) => void) | null;
    hasChild: boolean;
    lengthDescription: string;
    constructor({ value, parent, depth, key, updateGetterChild, }: {
        value: any;
        parent?: VObject;
        depth?: number;
        key?: number | string | 'root';
        updateGetterChild?: ((object: VObject) => void) | null;
    });
    path(): import("react").Key;
    toString(): string;
}
