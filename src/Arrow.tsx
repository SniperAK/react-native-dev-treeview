import React from 'react';
import { View } from 'react-native';

export enum Direction {
  Up = '270deg',
  Down = '180deg',
  Left = '90deg',
  Right = '0deg',
}
type ArrowProp = {
  color?: string;
  direction: Direction;
  width: number;
  height: number;
  borderWidth: number;
};

export default function Arrow({
  color = '#ccc',
  direction = Direction.Right,
  width = 6,
  height = 12,
  borderWidth = 2,
}: ArrowProp): React.ReactElement {
  const barWidth = Math.sqrt(Math.pow((height - borderWidth) / 2, 2) + Math.pow(width, 2));
  const size = Math.max(width * 1.5, height * 1.5);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={[
          {
            position: 'relative',
            width: height,
            height,
            transform: [{ rotate: direction }, { translateX: height / 4 }],
          },
        ]}
      >
        <View
          style={[
            {
              position: 'absolute',
              backgroundColor: color,
              height: borderWidth,
              width: barWidth,
              transform: [{ rotate: '45deg' }],
              top: width / 2 - borderWidth / 4,
              left: -borderWidth,
              borderRadius: borderWidth / 2,
            },
          ]}
        />
        <View
          style={[
            {
              position: 'absolute',
              backgroundColor: color,
              height: borderWidth,
              width: barWidth,
              transform: [{ rotate: '-45deg' }],
              bottom: width / 2 - borderWidth / 4,
              left: -borderWidth,
              borderRadius: borderWidth / 2,
            },
          ]}
        />
      </View>
    </View>
  );
}
