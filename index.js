import React, { Component } from 'react';
import {
  View,
  Text,
  Clipboard,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Triangle from 'react-native-trangle-view';

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#333',
  },
  v:{
    fontSize:9,
    color:'white',
  },
  toggleContainer:{
    width:10,
    height:10,
    backgroundColor:'transparent',
    alignItems:'center',
    justifyContent:'center'
  },
  childs:{
    marginLeft:10,
    borderLeftWidth:StyleSheet.hairlineWidth,
    borderLeftColor:'rgba(255,255,255,0.1)',
    backgroundColor:'rgba(255,255,255,0.01)',
  },
  typeDesc: {
    fontSize:7,
    color:'#eeeeee44',
    fontWeight:'normal',
  },
  typeObject:       {color:'silver'},
  typeArray:        {color:'silver'},
  typeMap:          {color:'silver'},
  typeDate:         {color:'deepskyblue'},
  typeArguments:    {color:'yellow'},
  typeUndefined:    {color:'gray'},
  typeNull:         {color:'gray'},
  typeNumber:       {color:'rgb(250,50,50)'},
  typeBoolean:      {color:'rgb(250,50,50)'},
  typeString:       {color:'rgb(50,200,50)'},
  typeFunction:     {color:'yellow'},
});

function VObject( value, parent, depth = 0, key = 'root' ) {
  let type = typeof value;

  this.value = value;
  this.desc = '';
  this.depth  = depth;
  this.parent = parent;
  this.key = key;

  if( type == 'undefined' ){
    this.desc  = 'undefined';
    this.type   = 'undefined';
  }
  else if( value == null ){
    this.desc  = 'null';
    this.type   = 'null';
  }
  else if( type == 'function') {
    this.desc  = 'function {...}';
    this.container  = ['function {','}'];
    this.type  = 'function';
    this.length = 1;

    this.toggle   = ()=>{
      this.toggleOn = !this.toggleOn;

      if( !this.child ) this.child = [{
        type:'function',
        desc:value.toLocaleString(),
      }];
    };
    this.toggleOn = false;
  }
  else if( type == 'object' ) {
    if( value.constructor == Array ){
      this.toggle   = ()=>{
        this.toggleOn = !this.toggleOn;

        if( !this.child ) {
          let prev = null;
          this.child = Object.keys(value).map( (k,i)=>{
             let child = new VObject( value[k], this,  depth + 1, k );
             child.prev = prev;
             if( prev ) prev.next = child;
             prev = child;
             return child;
          });
        }
      };

      this.length = Object.keys(value).length;
      this.desc   = '[...]';
      this.type   = 'array';
      this.container  = ['[',']'];
      this.childName = 'item';
      this.toggleOn = false;
    }
    else if( value.constructor === Set ) {
      this.toggle   = ()=>{
        this.toggleOn = !this.toggleOn;

        if( !this.child ){
          this.child = [];
          let prev = null;
          value.forEach( ( v, k )=>{
            let child = new VObject( v, this, depth + 1, k );
            child.prev = prev;
            if( prev ) prev.next = child;
            prev = child;
            this.child.push( child );
          } );
        }
      };

      this.length = value.size;
      this.desc   = 'Set {...}';
      this.type   = 'set';
      this.container  = ['Set {','}'];
      this.childName = 'item';
      this.toggleOn = false;
    }
    else if( value.constructor === Map ) {
      this.toggle   = ()=>{
        this.toggleOn = !this.toggleOn;

        if( !this.child ){
          this.child = [];
          let prev = null;
          value.forEach( ( v, k )=>{
            let child = new VObject( v, this, depth + 1,k );
            child.prev = prev;
            if( prev ) prev.next = child;
            prev = child;
            this.child.push( child )
          } );
        }
      };

      this.length = value.size;
      this.desc   = 'Map {...}';
      this.type   = 'map';
      this.container  = ['Map {','}'];
      this.childName = 'key';
      this.toggleOn = false;
    }
    else if( value.constructor === Date ) {
      this.desc = value.format('yyyy-MM-dd HH:mm:ss');
      this.type = 'date';
    }
    else { // pure object
      this.toggle   = ()=>{
        this.toggleOn = !this.toggleOn;

        if( !this.child ) {
          let prev = null;
          this.child = Object.keys( value ).map( k=> {
            let child = new VObject( value[k], this, depth + 1, k);
            child.prev = prev;
            if( prev ) prev.next = child;
            prev = child;

            return child;
          });
        }
      };

      this.length = Object.keys( value ).length;
      this.desc   = '{...}';
      this.container  = ['{','}'];
      this.type   = value.constructor.name;
      this.childName = 'key';
      this.toggleOn = false;
    }
  }
  else {
    if( type == 'string' && value.length > 100 ) {
      this.desc   = JSON.stringify(value.trunc(100));
    }
    else {
      this.desc   = JSON.stringify(value);
    }
    this.type   = type;
  }
  this.path = ()=>{
    let path = this.key;
    let parent = this.parent;

    while( parent != null && parent.key != 'root') {
      path = parent.key + '.' + path;
      parent = parent.parent;
    }

    return path;
  }

  this.toString = ()=>{
    return JSON.stringify( value, undefined, 2 );
  }

  return this;
}

export default class TreeView extends Component {
  static defaultProps = {
    fontSize:9,
    autoExtendRoot:true,
    onExtend:(object)=>{}
  }

  constructor( props ){
    super( props );
    this.state = {
      root:new VObject( this.props.data ),
      shouldUpdate:false,
    };
    this.props.autoExtendRoot && this.state.root.toggle && this.state.root.toggle();
    this.keyEvent = this.keyEvent.ubind(this,10);
  }

  assignToggle( d, r){
    if( !r ) return;
    if( d.key == r.key && r.toggleOn === true ) {
      d.toggle && d.toggle();
      d.assignToggle = true;
    }

    d.child && d.child.forEach((child,i)=>this.assignToggle(child,r.child[i]));
  }

  componentWillReceiveProps( nextProps ){
    if( nextProps.data != this.props.data && nextProps.data ) {
      let root = new VObject(nextProps.data);
      if( root && this.state.root ) this.assignToggle(root, this.state.root);
      if( this.props.autoExtendRoot == false && nextProps.autoExtendRoot && root && root.toggle && root.toggleOn ) {
        root.toggle();
      }
      this.setState({root});
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return (
      this.state.root != nextState.root ||
      this.props.fontSize != nextProps.fontSize ||
      nextState.shouldUpdate
    );
  }

  extend( desc ){
    desc.toggle && desc.toggle();
    this.setState({shouldUpdate:true,focusedDesc:desc},()=>{
      this.props.onExtend( desc );
    });
  }

  extendTo( desc = null, toDepth = -1 ) {
    if( toDepth > -1 && desc.depth ) return;
    if( !desc ) desc = this.state.root;

    desc.toggleOn = true;

    if( desc.child ) desc.child.forEach( this.extendTo.bind(this) );
    if( desc === this.state.root ) this.setState({shouldUpdate:true});
  }

  copy(desc){
    try {
      Clipboard.setString( desc.toString() );
      console.log(desc.path() + ' has been copied.')
    } catch( e ) {
      console.log(desc.path() + ' can not be copied for the following reasons: ' + e.toString())
    }
  }

  consoleLog(desc){
    console.log( desc.value );
  }

  renderObject(desc, index, datas){
    let hasChild = desc.toggle && desc.length > 0;
    let isOpened = (desc.toggle && desc.toggleOn === true) ? true : false;
    let {fontSize, tailRenderer} = this.props;
    let {focusedDesc} = this.state;
    let style = [styles['type' + desc.type.toCapitalize()],{fontSize}];

    let length = '';
    if( desc.length >= 0 && desc.childName ){
      length = desc.length + ' ' + ( desc.childName + (desc.length > 1 ? 's' : '') );
    }

    return (
      <View key={index + '_' + desc.depth}>
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} opacity={0.9} onPress={this.extend.bind(this, desc)}>
          <View style={styles.toggleContainer}>
            {hasChild && <Triangle direction={desc.toggleOn?'up':'down'} width={fontSize * 0.5} height={this.props.fontSize*0.4}/>}
          </View>
          {typeof desc.key !== 'undefined' && <Text style={[styles.v,{fontSize}]}>{desc.key + ': '}</Text>}
          <TouchableOpacity opacity={0.9} onPress={this.copy.bind(this,desc)}>
            <Text style={[styles.v, style]}>{isOpened ? desc.container[0] : desc.desc}{length && ' ' + length}<Text style={styles.typeDesc}> {desc.type.toCapitalize()}</Text></Text>
          </TouchableOpacity>
          <TouchableOpacity opacity={0.9} onPress={this.consoleLog.bind(this,desc)}>
            <Text style={styles.typeDesc}> _</Text>
          </TouchableOpacity>
          {tailRenderer && tailRenderer( desc, index, datas )}
        </TouchableOpacity>
        {isOpened && (
          <View style={styles.childs}>
            {desc.child && desc.child.map( this.renderObject.bind(this) )}
            <Text style={[styles.v, style]}>{desc.container[1]}</Text>
          </View>
        )}
      </View>
    );
  }

  render(){
    return (
      <View style={[styles.container, this.props.style]}>
        {this.renderObject( this.state.root )}
      </View>
    );
  }
}