import React from 'react';
import { View, StyleSheet } from 'react-native';
import ObjectNode from './ObjectNode';
import TreeContext from './TreeContext';
import VObject from './VObject';
export default function DevTreeView(_a) {
  var data = _a.data,
      style = _a.style,
      nodeStyle = _a.nodeStyle,
      _b = _a.fontSize,
      fontSize = _b === void 0 ? 9 : _b,
      _c = _a.autoExtendRoot,
      autoExtendRoot = _c === void 0 ? false : _c,
      _d = _a.onExtend,
      onExtend = _d === void 0 ? function () {} : _d,
      _e = _a.logToConsole,
      logToConsole = _e === void 0 ? false : _e,
      tailRenderer = _a.tailRenderer,
      onCopy = _a.onCopy;

  var _f = React.useState(new VObject({
    value: data
  })),
      root = _f[0],
      setRoot = _f[1];

  React.useEffect(function () {
    setRoot(new VObject({
      value: data
    }));
  }, [data]);
  var value = React.useMemo(function () {
    return {
      nodeStyle: nodeStyle,
      fontSize: fontSize,
      autoExtendRoot: autoExtendRoot,
      onExtend: onExtend,
      logToConsole: logToConsole,
      tailRenderer: tailRenderer,
      onCopy: onCopy
    };
  }, [nodeStyle, fontSize, autoExtendRoot, onExtend, logToConsole, tailRenderer, onCopy]);
  return React.createElement(TreeContext.Provider, {
    value: value
  }, React.createElement(View, {
    style: [styles.container, style]
  }, React.createElement(ObjectNode, {
    object: root
  })));
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333'
  }
});