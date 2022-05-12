import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import ObjectNode from './ObjectNode';
import TreeContext, { TreeViewCommon } from './TreeContext';
import VObject from './VObject';
export interface DevTreeViewProps extends TreeViewCommon {
  data: any;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
}

export default function DevTreeView({
  data,
  style,
  nodeStyle,
  fontSize = 9,
  autoExtendRoot = false,
  onExtend = () => {},
  logToConsole = false,
  tailRenderer,
  onCopy,
}: DevTreeViewProps): React.ReactElement {
  const [root, setRoot] = React.useState<VObject>(new VObject({ value: data }));

  React.useEffect(() => {
    setRoot(new VObject({ value: data }));
  }, [data]);

  const value = React.useMemo(() => {
    return {
      nodeStyle,
      fontSize,
      autoExtendRoot,
      onExtend,
      logToConsole,
      tailRenderer,
      onCopy,
    };
  }, [nodeStyle, fontSize, autoExtendRoot, onExtend, logToConsole, tailRenderer, onCopy]);

  return (
    <TreeContext.Provider value={value}>
      <View style={[styles.container, style]}>
        <ObjectNode object={root} />
      </View>
    </TreeContext.Provider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
});