import React from 'react';
export declare enum Direction {
    Up = "270deg",
    Down = "180deg",
    Left = "90deg",
    Right = "0deg"
}
declare type ArrowProp = {
    color?: string;
    direction: Direction;
    width: number;
    height: number;
    borderWidth: number;
};
export default function Arrow({ color, direction, width, height, borderWidth, }: ArrowProp): React.ReactElement;
export {};
