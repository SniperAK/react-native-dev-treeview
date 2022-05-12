import React from 'react';
import { View } from 'react-native';
export var Direction;

(function (Direction) {
  Direction["Up"] = "270deg";
  Direction["Down"] = "180deg";
  Direction["Left"] = "90deg";
  Direction["Right"] = "0deg";
})(Direction || (Direction = {}));

export default function Arrow(_a) {
  var _b = _a.color,
      color = _b === void 0 ? '#ccc' : _b,
      _c = _a.direction,
      direction = _c === void 0 ? Direction.Right : _c,
      _d = _a.width,
      width = _d === void 0 ? 6 : _d,
      _e = _a.height,
      height = _e === void 0 ? 12 : _e,
      _f = _a.borderWidth,
      borderWidth = _f === void 0 ? 2 : _f;
  var barWidth = Math.sqrt(Math.pow((height - borderWidth) / 2, 2) + Math.pow(width, 2));
  var size = Math.max(width * 1.5, height * 1.5);
  return React.createElement(View, {
    style: {
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement(View, {
    style: [{
      position: 'relative',
      width: height,
      height: height,
      transform: [{
        rotate: direction
      }, {
        translateX: height / 4
      }]
    }]
  }, React.createElement(View, {
    style: [{
      position: 'absolute',
      backgroundColor: color,
      height: borderWidth,
      width: barWidth,
      transform: [{
        rotate: '45deg'
      }],
      top: width / 2 - borderWidth / 4,
      left: -borderWidth,
      borderRadius: borderWidth / 2
    }]
  }), React.createElement(View, {
    style: [{
      position: 'absolute',
      backgroundColor: color,
      height: borderWidth,
      width: barWidth,
      transform: [{
        rotate: '-45deg'
      }],
      bottom: width / 2 - borderWidth / 4,
      left: -borderWidth,
      borderRadius: borderWidth / 2
    }]
  })));
}