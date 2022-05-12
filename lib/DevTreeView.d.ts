import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { TreeViewCommon } from './TreeContext';
export interface DevTreeViewProps extends TreeViewCommon {
    data: any;
    fontSize?: number;
    style?: StyleProp<ViewStyle>;
}
export default function DevTreeView({ data, style, nodeStyle, fontSize, autoExtendRoot, onExtend, logToConsole, tailRenderer, onCopy, }: DevTreeViewProps): React.ReactElement;
