import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import VObject from './VObject';

export interface TreeViewCommon {
  nodeStyle?: StyleProp<ViewStyle>;
  autoExtendRoot?: boolean;
  onExtend?: (object: VObject) => void;
  logToConsole?: boolean;
  tailRenderer?: (target: VObject) => React.ReactElement;
  onCopy?: (string: string) => void;
}

export interface TreeViewContextValues extends TreeViewCommon {
  fontSize: number;
}

const TreeContext = React.createContext<TreeViewContextValues>({
  fontSize: 9,
});

export default TreeContext