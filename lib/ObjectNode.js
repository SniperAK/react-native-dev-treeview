import { __spreadArrays } from "tslib";
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Arrow, { Direction } from './Arrow';
import TreeContext from './TreeContext';
var styles = StyleSheet.create({
  v: {
    fontSize: 9,
    color: 'white'
  },
  toggleContainer: {
    width: 10,
    height: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  childs: {
    marginLeft: 10,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.01)'
  },
  typeDesc: {
    color: '#eeeeee44',
    fontWeight: 'normal'
  },
  Object: {
    color: 'silver'
  },
  Array: {
    color: 'lightsteelblue'
  },
  Set: {
    color: 'rebeccapurple'
  },
  Map: {
    color: 'springgreen'
  },
  Date: {
    color: 'deepskyblue'
  },
  Arguments: {
    color: 'yellow'
  },
  Undefined: {
    color: 'gray'
  },
  Null: {
    color: 'darkgrey'
  },
  Symbol: {
    color: 'rgb(60,60,60)'
  },
  Bigint: {
    color: 'rgb(180,80,50)'
  },
  Number: {
    color: 'rgb(250,150,50)'
  },
  Boolean: {
    color: 'rgb(150,50,50)'
  },
  String: {
    color: 'rgb(20,140,20)'
  },
  Function: {
    color: 'goldenrod'
  },
  Getter: {
    color: 'rgb(120,30,120)'
  }
});
export default function ObjectNode(_a) {
  var _b, _c, _d;

  var object = _a.object,
      onNodeExtend = _a.onNodeExtend;

  var _e = React.useContext(TreeContext),
      nodeStyle = _e.nodeStyle,
      fontSize = _e.fontSize,
      autoExtendRoot = _e.autoExtendRoot,
      onExtend = _e.onExtend,
      logToConsole = _e.logToConsole,
      tailRenderer = _e.tailRenderer,
      onCopy = _e.onCopy;

  var _f = React.useState(),
      childs = _f[0],
      setChilds = _f[1];

  var pastObject = React.useRef(object);
  React.useEffect(function () {
    if (pastObject.current !== object) {
      setChilds(undefined);
    }

    if (!autoExtendRoot || object.key !== 'root') return;
    extend(object);
  }, [autoExtendRoot, object]);

  var extend = function (target) {
    setChilds(function (prev) {
      var _a;

      return prev ? undefined : __spreadArrays(((_a = target === null || target === void 0 ? void 0 : target.getChilds) === null || _a === void 0 ? void 0 : _a.call(target)) || []);
    });
    onExtend === null || onExtend === void 0 ? void 0 : onExtend(target);
    onNodeExtend === null || onNodeExtend === void 0 ? void 0 : onNodeExtend(target);
  }; // const extendTo = (target?: VObject2, toDepth: number = -1) => {
  //   if (toDepth > -1 && (target?.depth ?? 0) > toDepth) return;
  //   const _target = target ?? root;
  //   _target.toggleOn = true;
  //   if (_target.child) _target.child.forEach((c) => extendTo(c));
  //   // if (_target === root) this.setState({ shouldUpdate: true });
  // };


  var handleCopy = function (target) {
    try {
      onCopy === null || onCopy === void 0 ? void 0 : onCopy(target.toString());
      console.log((target === null || target === void 0 ? void 0 : target.path()) + ' has been copied.');
    } catch (e) {
      console.log((target === null || target === void 0 ? void 0 : target.path()) + ' can not be copied for the following reasons: ' + e);
    }
  };

  var handlePressTarget = function (target) {
    if (target.type === 'getter') {
      console.log('handlePressTarget', target);
      extend(target);
    } else {
      handleCopy(target);
    }
  };

  var consoleLog = function (target) {
    if (target.type === 'getter') {
      console.log(target.value());
    } else {
      console.log(target.value);
    }
  };

  var isOpened = object.hasChild && !!childs ? true : false;
  var style = [styles[object.typeName], {
    fontSize: fontSize
  }];
  return React.createElement(View, null, React.createElement(TouchableOpacity, {
    style: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: !object.hasChild ? fontSize : 0
    },
    activeOpacity: 0.9,
    onPress: function () {
      return extend(object);
    }
  }, object.hasChild && React.createElement(View, {
    style: [styles.toggleContainer, {
      width: fontSize,
      height: fontSize
    }]
  }, React.createElement(Arrow, {
    direction: isOpened ? Direction.Up : Direction.Right,
    width: fontSize * 0.4,
    height: fontSize * 0.8,
    borderWidth: fontSize / 9
  })), typeof object.key !== 'undefined' && object.key !== 'function_child' && React.createElement(Text, {
    style: [styles.v, {
      fontSize: fontSize
    }]
  }, object.key + ' : '), React.createElement(TouchableOpacity, {
    activeOpacity: 0.9,
    onPress: function () {
      return handlePressTarget(object);
    }
  }, React.createElement(Text, {
    style: [styles.v, style]
  }, isOpened ? (_b = object.container) === null || _b === void 0 ? void 0 : _b[0] : object.desc, object.lengthDescription, React.createElement(Text, {
    style: [styles.typeDesc, {
      fontSize: Math.max(7, fontSize - 2)
    }]
  }, " ", object.typeName))), logToConsole && React.createElement(TouchableOpacity, {
    activeOpacity: 0.9,
    onPress: function () {
      return consoleLog(object);
    }
  }, React.createElement(Text, {
    style: [styles.typeDesc, {
      fontSize: fontSize
    }]
  }, " _")), tailRenderer && tailRenderer(object)), isOpened && React.createElement(View, {
    style: [styles.childs, nodeStyle]
  }, childs && childs.map(function (c, i) {
    return React.createElement(ObjectNode, {
      key: i,
      object: c,
      onNodeExtend: function () {
        setChilds(function (prev) {
          var _a;

          return prev ? __spreadArrays(((_a = object === null || object === void 0 ? void 0 : object.getChilds) === null || _a === void 0 ? void 0 : _a.call(object)) || []) : undefined;
        });
      }
    });
  })), isOpened && ((_c = object.container) === null || _c === void 0 ? void 0 : _c[1]) && React.createElement(Text, {
    style: [styles.v, style, object.depth > 0 && {
      marginLeft: fontSize
    }]
  }, (_d = object.container) === null || _d === void 0 ? void 0 : _d[1]));
}