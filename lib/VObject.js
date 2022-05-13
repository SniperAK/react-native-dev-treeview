function toCapitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

var VObject =
/** @class */
function () {
  function VObject(_a) {
    var _this = this;

    var value = _a.value,
        parent = _a.parent,
        _b = _a.depth,
        depth = _b === void 0 ? 0 : _b,
        _c = _a.key,
        key = _c === void 0 ? 'root' : _c,
        _d = _a.updateGetterChild,
        updateGetterChild = _d === void 0 ? null : _d;

    var _e;

    this.length = 0;
    this.type = typeof value;
    this.value = value;
    this.desc = '';
    this.depth = depth;
    this.parent = parent;
    this.key = key;
    this.updateGetterChild = updateGetterChild;

    if (updateGetterChild) {
      this.getChilds = function () {
        if (!_this.key) return [];

        var _object = new VObject({
          value: parent === null || parent === void 0 ? void 0 : parent.value[_this.key],
          parent: _this,
          depth: depth + 1,
          key: key
        });

        updateGetterChild(_object);
        _this.child = [_object];
        return _this.child;
      };

      this.desc = '( ... )';
      this.type = 'getter';
      this.length = -1;
      this.childName = 'value';
      this.toggleOn = false;
    } else if (this.type === 'undefined') {
      this.desc = 'undefined';
      this.type = 'undefined';
    } else if (this.value == null) {
      this.desc = 'null';
      this.type = 'null';
    } else if (this.type === 'function') {
      if (((_e = this.parent) === null || _e === void 0 ? void 0 : _e.type) === 'function') {
        this.desc = value.toLocaleString();
      } else {
        this.desc = 'function { ... }';
        this.container = [undefined, undefined];
        this.type = 'function';
        this.length = 1;

        this.getChilds = function () {
          _this.toggleOn = !_this.toggleOn;
          if (_this.child) return _this.child;
          _this.child = [new VObject({
            value: _this.value,
            parent: _this,
            depth: _this.depth + 1,
            key: 'function_child'
          })];
          return _this.child;
        };

        this.toggleOn = false;
      }
    } else if (this.type === 'object') {
      if (this.value instanceof Array) {
        this.getChilds = function () {
          _this.toggleOn = !_this.toggleOn;
          if (_this.child) return _this.child;
          _this.child = Object.keys(_this.value).map(function (k) {
            return new VObject({
              value: _this.value[k],
              parent: _this,
              depth: _this.depth + 1,
              key: k
            });
          });
          return _this.child;
        };

        this.length = Object.keys(value).length;
        this.desc = '[ ... ]';
        this.type = value.constructor.name;
        this.container = ['[', ']'];
        this.childName = 'item';
        this.toggleOn = false;
      } else if (value.constructor === Set) {
        this.getChilds = function () {
          _this.toggleOn = !_this.toggleOn;
          if (_this.child) return _this.child;
          var _child = [];
          value.forEach(function (v, k) {
            _child.push(new VObject({
              value: v,
              parent: _this,
              depth: _this.depth + 1,
              key: k
            }));
          });
          _this.child = _child;
          return _this.child;
        };

        this.length = value.size;
        this.desc = value.constructor.name + " { ... }";
        this.type = 'Set';
        this.container = [value.constructor.name + " {", '}'];
        this.childName = 'item';
        this.toggleOn = false;
      } else if (value instanceof Map) {
        this.getChilds = function () {
          _this.toggleOn = !_this.toggleOn;
          if (_this.child) return _this.child;
          var _child = [];
          value.forEach(function (v, k) {
            _child.push(new VObject({
              value: v,
              parent: _this,
              depth: depth + 1,
              key: k
            }));
          });
          _this.child = _child;
          return _this.child;
        };

        this.length = value.size;
        this.desc = value.constructor.name + " { ... }";
        this.type = 'Map';
        this.container = [value.constructor.name + " {", '}'];
        this.childName = 'key';
        this.toggleOn = false;
      } else if (value instanceof Date) {
        this.desc = value.toISOString();
        this.type = 'date';
      } else {
        // pure object
        this.getChilds = function () {
          _this.toggleOn = !_this.toggleOn;
          if (_this.child) return _this.child;
          var properties = Object.getOwnPropertyDescriptors(value);
          _this.child = Object.keys(properties).map(function (k, i) {
            return new VObject({
              value: value[k],
              parent: _this,
              depth: _this.depth + 1,
              key: k,
              updateGetterChild: typeof properties[k].get === 'function' ? function (object) {
                var _a;

                (_a = _this.child) === null || _a === void 0 ? void 0 : _a.splice(i, 1, object);
              } : undefined
            });
          });
          return _this.child;
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
    this.lengthDescription = this.length >= 0 && this.childName ? ' ' + this.length + ' ' + (this.childName + (this.length > 1 ? 's' : '')) : '';
    this.typeName = toCapitalize(this.type);
  }

  VObject.prototype.path = function () {
    var path = this.key;
    var parent = this.parent;

    while (parent != null && parent.key !== 'root') {
      path = parent.key + '.' + path;
      parent = parent.parent;
    }

    return path;
  };

  VObject.prototype.toString = function () {
    return JSON.stringify(this.value, undefined, 2);
  };

  return VObject;
}();

export default VObject;