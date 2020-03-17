# React Native Dev TreeView
Pure javascript component that Tree View for debug on screen when development using react-native.
Make objects are visualizated on screen.

![Alt text](https://github.com/SniperAK/react-native-dev-treeview/blob/master/example.png?raw=true "Title")

# Change Logs
> 1.3 
>   - Change property for initial extend root 
>   - Remove dependency react-native-triangle-view
>   - Change extendsed indicator.
>   - Assing fontSize property not affected descrption

> 1.2 
>   - Improve analysis object property that defiend after creation using Object.defineProperty


## Installation

- using npm
```
$ npm i react-native-dev-treeview --save
```


## How to use it

```
import TreeView from 'react-native-dev-treeview';

... 

// somewhere render
<TreeView data={objectWhatYouWantToSee}/>

```

## Supportred data types
- Object
- Array
- Map
- Set
- String
- Number
- String
- Date
- Boolean
- Null
- Undefined

## Changed Logs
- 1.2.1 : Fix miss typed example on readme
- 1.2.0 : Supported dynamically created getter 
- 1.1.2 : Container extended instance handle

## Todo
- [ ] Anaysis object own properties
- [x] Anaysis object own properties for dynamically using Object.defineProperty