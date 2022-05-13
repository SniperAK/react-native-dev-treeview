/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import DevTreeView from 'react-native-dev-treeview';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const data = React.useMemo(() => {
    const set = new Set<any>();
    const map = new Map();
    set.add(1);
    map.set(set, 1);
    const object = {
      object: {},
      array: [],
      Set: set,
      Map: map,
      date: new Date(),
      undefined: undefined,
      null: null,
      // symbol :
      // bigint
      number: 1234,
      boolean: true,
      string: 'string value',
      function: () => {
        return 'haha';
      },
      get getter() {
        return 'getter value';
      },
    };
    object.object = object;
    object.array = [object, object];
    return object;
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{backgroundColor: 'white'}}>
        <DevTreeView autoExtendRoot data={data} logToConsole />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
