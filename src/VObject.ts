export type ETypes =
  | 'object'
  | 'array'
  | 'Set'
  | 'Map'
  | 'date'
  | 'arguments'
  | 'undefined'
  | 'null'
  | 'number'
  | 'bigint'
  | 'symbol'
  | 'boolean'
  | 'string'
  | 'function'
  | 'get';

export default class VObject {
  type: ETypes;
  value: any;
  desc: string;
  depth: number;
  parent?: VObject;
  key: number | string;
  childName?: string;
  toggleOn?: boolean;
  container?: [string | undefined, string | undefined];
  length: number = 0;
  child?: VObject[];
  getChilds?: () => VObject[] | undefined;
  updateGetterChild: ((object: VObject) => void) | null;

  hasChild: boolean;
  lengthDescription: string;

  constructor({
    value,
    parent,
    depth = 0,
    key = 'root',
    updateGetterChild = null,
  }: {
    value: any;
    parent?: VObject;
    depth?: number;
    key?: number | string | 'root';
    updateGetterChild?: ((object: VObject) => void) | null;
  }) {
    this.type = typeof value;
    this.value = value;
    this.desc = '';
    this.depth = depth;
    this.parent = parent;
    this.key = key;
    this.updateGetterChild = updateGetterChild;

    if (updateGetterChild) {
      this.getChilds = () => {
        if (!this.key) return [];
        let _object = new VObject({
          value: parent?.value[this.key],
          parent: this,
          depth: depth + 1,
          key,
        });
        updateGetterChild(_object);
        this.child = [_object];
        return this.child;
      };
      this.desc = '( ... )';
      this.type = 'get';
      this.childName = 'value';
      this.toggleOn = false;
    } else if (this.type === 'undefined') {
      this.desc = 'undefined';
      this.type = 'undefined';
    } else if (this.value == null) {
      this.desc = 'null';
      this.type = 'null';
    } else if (this.type === 'function') {
      if (this.parent?.type === 'function') {
        this.desc = value.toLocaleString();
      } else {
        this.desc = 'function { ... }';
        this.container = [undefined, undefined];
        this.type = 'function';
        this.length = 1;

        this.getChilds = () => {
          this.toggleOn = !this.toggleOn;

          if (this.child) return this.child;
          this.child = [
            new VObject({
              value: this.value,
              parent: this,
              depth: this.depth + 1,
              key: 'function_child',
            }),
          ];
          return this.child;
        };

        this.toggleOn = false;
      }
    } else if (this.type === 'object') {
      if (this.value instanceof Array) {
        this.getChilds = () => {
          this.toggleOn = !this.toggleOn;

          if (this.child) return this.child;
          this.child = Object.keys(this.value).map((k) => {
            return new VObject({ value: this.value[k], parent: this, depth: this.depth + 1, key: k });
          });
          return this.child;
        };

        this.length = Object.keys(value).length;
        this.desc = '[ ... ]';
        this.type = value.constructor.name;
        this.container = ['[', ']'];
        this.childName = 'item';
        this.toggleOn = false;
      } else if (value.constructor === Set) {
        this.getChilds = () => {
          this.toggleOn = !this.toggleOn;

          if (this.child) return this.child;

          const _child: VObject[] = [];
          value.forEach((v, k) => {
            _child.push(new VObject({ value: v, parent: this, depth: this.depth + 1, key: k }));
          });
          this.child = _child;
          return this.child;
        };

        this.length = value.size;
        this.desc = `${value.constructor.name} { ... }`;
        this.type = 'Set';
        this.container = [`${value.constructor.name} {`, '}'];
        this.childName = 'item';
        this.toggleOn = false;
      } else if (value instanceof Map) {
        this.getChilds = () => {
          this.toggleOn = !this.toggleOn;
          if (this.child) return this.child;

          const _child: VObject[] = [];
          value.forEach((v, k) => {
            _child.push(new VObject({ value: v, parent: this, depth: depth + 1, key: k }));
          });
          this.child = _child;
          return this.child;
        };

        this.length = value.size;
        this.desc = `${value.constructor.name} { ... }`;
        this.type = 'Map';
        this.container = [`${value.constructor.name} {`, '}'];
        this.childName = 'key';
        this.toggleOn = false;
      } else if (value instanceof Date) {
        this.desc = value.toISOString();
        this.type = 'date';
      } else {
        // pure object
        this.getChilds = () => {
          this.toggleOn = !this.toggleOn;

          if (this.child) return this.child;
          let properties = Object.getOwnPropertyDescriptors(value);
          this.child = Object.keys(properties).map((k, i) => {
            return new VObject({
              value: value[k],
              parent: this,
              depth: this.depth + 1,
              key: k,
              updateGetterChild:
                typeof properties[k].get === 'function'
                  ? (object: VObject) => {
                      this.child?.splice(i, 1, object);
                    }
                  : undefined,
            });
          });
          return this.child;
        };

        this.length = Object.keys(value).length;
        this.desc = '{ ... }';
        this.container = ['{', '}'];
        this.type = value.constructor.name;
        this.childName = 'key';
        this.toggleOn = false;
      }
    } else {
      if (this.type === 'string' && value.length > 100) {
        this.desc = JSON.stringify(value.trunc(100));
      } else {
        this.desc = JSON.stringify(value);
      }
    }

    this.hasChild = !!this.getChilds && this.length > 0;
    this.lengthDescription = this.length >= 0 && this.childName
        ? ' ' + this.length + ' ' + (this.childName + (this.length > 1 ? 's' : ''))
        : '';
    
  }

  path() {
    let path = this.key;
    let parent = this.parent;

    while (parent != null && parent.key !== 'root') {
      path = parent.key + '.' + path;
      parent = parent.parent;
    }

    return path;
  }

  toString() {
    return JSON.stringify(this.value, undefined, 2);
  }
}