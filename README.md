# React Native Dev TreeView
Pure javascript component that Tree View for debug on screen when development using react-native.
Make objects are visualizated on screen.

![Alt text](https://github.com/SniperAK/react-native-dev-treeview/blob/master/example.png?raw=true "Title")

## Installation

- using npm
```
$ npm i react-native-dev-treeview --save
```


## How to use it

```
import DevTreeView from 'react-native-dev-treeview';

... 

// somewhere render
<DevTreeView data={objectWhatYouWantToSee}/>

```

## Supportred data types
- Object included getter function
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

# Change Logs
> 1.4.1 
>   - Fix object getter update

> 1.4 
>   - All codes transforted to TS

> 1.3 
>   - Change property for initial extend root 
>   - Remove dependency react-native-triangle-view
>   - Change extendsed indicator.
>   - Assing fontSize property not affected descrption

> 1.2.1
>   - Fix miss typed example on readme

> 1.2 
>   - Improve analysis object property that defiend after creation using Object.defineProperty

> 1.1.2 
>   - Container extended instance handle

## Todo
- [x] Anaysis object own properties
- [x] Anaysis object own properties for dynamically using Object.defineProperty