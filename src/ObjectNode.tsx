import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Arrow, { Direction } from './Arrow';
import TreeContext from './TreeContext';
import VObject from './VObject';

const styles = StyleSheet.create({
  v: {
    fontSize: 9,
    color: 'white',
  },
  toggleContainer: {
    width: 10,
    height: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  childs: {
    marginLeft: 10,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  typeDesc: {
    color: '#eeeeee44',
    fontWeight: 'normal',
  },
  Object: { color: 'silver' },
  Array: { color: 'lightsteelblue' },
  Set: { color: 'rebeccapurple' },
  Map: { color: 'springgreen' },
  Date: { color: 'deepskyblue' },
  Arguments: { color: 'yellow' },
  Undefined: { color: 'gray' },
  Null: { color: 'darkgrey' },
  Symbol: { color: 'rgb(60,60,60)' },
  Bigint: { color: 'rgb(180,80,50)' },
  Number: { color: 'rgb(250,150,50)' },
  Boolean: { color: 'rgb(150,50,50)' },
  String: { color: 'rgb(20,140,20)' },
  Function: { color: 'goldenrod' },
  Getter: { color: 'rgb(120,30,120)' },
});

export default function ObjectNode({ object, onNodeExtend }: { object: VObject, onNodeExtend?: (object: VObject) => void }): React.ReactElement {
  const { nodeStyle, fontSize, autoExtendRoot, onExtend, logToConsole, tailRenderer, onCopy } =
    React.useContext(TreeContext);
  const [childs, setChilds] = React.useState<VObject[] | undefined>();
  const pastObject = React.useRef<VObject>(object);

  React.useEffect(() => {
    if (pastObject.current !== object) {
      setChilds(undefined);
    }
    if (!autoExtendRoot || object.key !== 'root') return;
    extend(object);
  }, [autoExtendRoot, object]);

  const extend = (target: VObject) => {
    setChilds((prev) => {
      return prev ? undefined : [...(target?.getChilds?.() || [])];
    });
    onExtend?.(target);
    onNodeExtend?.(target);
  };

  // const extendTo = (target?: VObject2, toDepth: number = -1) => {
  //   if (toDepth > -1 && (target?.depth ?? 0) > toDepth) return;
  //   const _target = target ?? root;

  //   _target.toggleOn = true;

  //   if (_target.child) _target.child.forEach((c) => extendTo(c));
  //   // if (_target === root) this.setState({ shouldUpdate: true });
  // };

  const handleCopy = (target: VObject) => {
    try {
      onCopy?.(target.toString());
      console.log(target?.path() + ' has been copied.');
    } catch (e) {
      console.log(target?.path() + ' can not be copied for the following reasons: ' + e);
    }
  };

  const handlePressTarget = (target: VObject) => {
    if (target.type === 'getter') {
      console.log( 'handlePressTarget',target);
      extend(target);
    } else {
      handleCopy(target);
    }
  };

  const consoleLog = (target: VObject) => {
    if (target.type === 'getter') {
      console.log(target.value());
    } else {
      console.log(target.value);
    }
  };

  const isOpened = object.hasChild && !!childs ? true : false;
  const style = [styles[object.typeName], { fontSize }];

  return (
    <View>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: !object.hasChild ? fontSize : 0 }}
        activeOpacity={0.9}
        onPress={() => extend(object)}
      >
        {object.hasChild && (
          <View style={[styles.toggleContainer, { width: fontSize, height: fontSize }]}>
            <Arrow
              direction={isOpened ? Direction.Up : Direction.Right}
              width={fontSize * 0.4}
              height={fontSize * 0.8}
              borderWidth={fontSize / 9}
            />
          </View>
        )}
        {typeof object.key !== 'undefined' && object.key !== 'function_child' && (
          <Text style={[styles.v, { fontSize }]}>{object.key + ' : '}</Text>
        )}
        <TouchableOpacity activeOpacity={0.9} onPress={() => handlePressTarget(object)}>
          <Text style={[styles.v, style]}>
            {isOpened ? object.container?.[0] : object.desc}
            {object.lengthDescription}
            <Text style={[styles.typeDesc, { fontSize: Math.max(7, fontSize - 2) }]}> {object.typeName}</Text>
          </Text>
        </TouchableOpacity>
        {logToConsole && (
          <TouchableOpacity activeOpacity={0.9} onPress={() => consoleLog(object)}>
            <Text style={[styles.typeDesc, { fontSize }]}> _</Text>
          </TouchableOpacity>
        )}
        {tailRenderer && tailRenderer(object)}
      </TouchableOpacity>
      {isOpened && (
        <View style={[styles.childs, nodeStyle]}>
          {childs && childs.map((c, i) => <ObjectNode key={i} object={c} onNodeExtend={()=>{
            setChilds(prev=>prev ? [...(object?.getChilds?.() || [])] : undefined);
          }}/>)}
        </View>
      )}
      {isOpened && object.container?.[1] && (
        <Text style={[styles.v, style, object.depth > 0 && { marginLeft: fontSize }]}>{object.container?.[1]}</Text>
      )}
    </View>
  );
}
