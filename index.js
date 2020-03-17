import React, { Component } from 'react';
import {
  View,
  Text,
  Clipboard,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

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
  typeGet:          {color:'purple'},
});

function toCapitalize( text ) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function VObject( value, parent, depth = 0, key = undefined, updateGetterChild = false ) {
  let type = typeof value;

  this.value = value;
  this.desc = '';
  this.depth  = depth;
  this.parent = parent;
  this.key = key;

  if( updateGetterChild ){
    this.toggle   = ()=>{
      let _object = new VObject( parent.value[key], parent, depth + 1, key );
      updateGetterChild ( _object );
    };
    this.desc   = '(...)';
    this.type   = 'get';
    this.childName = 'value';
    this.toggleOn = false;
  }
  else if( type == 'undefined' ){
    this.desc  = 'undefined';
    this.type   = 'undefined';
  }
  else if( value == null ){
    this.desc  = 'null';
    this.type   = 'null';
  }
  else if( type == 'function') {
    this.desc  = 'function {...}';
    this.container  = ['',''];
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
    if( value instanceof Array ){
      this.toggle   = ()=>{
        this.toggleOn = !this.toggleOn;

        if( !this.child ) {
          let prev = null;
          this.child = Object.keys(value).map( (k,i)=>{
             return new VObject( value[k], this,  depth + 1, k );
          });
        }
      };

      this.length = Object.keys(value).length;
      this.desc   = '[...]';
      this.type   = value.constructor.name;
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
            this.child.push( new VObject( v, this, depth + 1, k ) );
          } );
        }
      };

      this.length = value.size;
      this.desc   = `${value.constructor.name} {...}`;
      this.type   = value.constructor.name;
      this.container  = [`${value.constructor.name} {`,'}'];
      this.childName = 'item';
      this.toggleOn = false;
    }
    else if( value instanceof Map ) {
      this.toggle   = ()=>{
        this.toggleOn = !this.toggleOn;

        if( !this.child ){
          this.child = [];
          let prev = null;
          value.forEach( ( v, k )=>{
            this.child.push( new VObject( v, this, depth + 1,k ) );
          } );
        }
      };

      this.length = value.size;
      this.desc   = `${value.constructor.name} {...}`;
      this.type   = value.constructor.name;
      this.container  = [`${value.constructor.name} {`,'}'];
      this.childName = 'key';
      this.toggleOn = false;
    }
    else if( value instanceof Date ) {
      this.desc = value.format('yyyy-MM-dd HH:mm:ss');
      this.type = 'date';
    }
    else { // pure object
      this.toggle   = ()=>{
        this.toggleOn = !this.toggleOn;

        if( !this.child ) {
          let prev = null;
          let properties = Object.getOwnPropertyDescriptors( value )
          this.child = Object.keys( properties ).map( (k, i)=>{
            return new VObject( value[k], this, depth + 1, k, typeof properties[k].get == 'function' ? ( object )=>{
              this.child.splice(i, 1, object);
            }:false)
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

class Arrow extends Component {
  static defaultProps = {
    color:'#ccc',
    direction:'right',
    width:6,
    height:12,
    borderWidth:2,
  };

  constructor( props ) {
    super( props );
    this.state = {

    }
  }

  get direction(){
    switch (this.props.direction ) {
      case 'up': return '270deg';
      case 'left': return '180deg';
      case 'down': return '90deg';
      case 'right':
      default : return '0deg';
    }
  }

  render(){
    let {color, direction, width, height, borderWidth} = this.props;
    let barWidth = Math.sqrt( Math.pow( (height - borderWidth) / 2, 2) + Math.pow( width ,2 ) );
    let size = Math.max( width * 1.5, height* 1.5 );
    return (
      <View style={{width:size, height:size, alignItems:'center', justifyContent:'center'}}>
        <View style={[{position:'relative', width:height, height, transform:[{rotate:this.direction}, {translateX:height/4}]}]}>
          <View style={[{
            position:'absolute',
            backgroundColor:color, 
            height:borderWidth, 
            width:barWidth, 
            transform:[{rotate:'45deg'}], 
            top:width / 2 - borderWidth  / 4, 
            left:-borderWidth,
            borderRadius:borderWidth / 2 }
          ]} />
          <View style={[{
            position:'absolute',
            backgroundColor:color, 
            height:borderWidth, 
            width:barWidth, 
            transform:[{rotate:'-45deg'}], 
            bottom:width / 2 - borderWidth  / 4, 
            left:-borderWidth,
            borderRadius:borderWidth / 2} 
          ]} />
        </View>
      </View>
    )
  }
}

export default class TreeView extends Component {
  static defaultProps = {
    fontSize:9,
    autoExtendRoot:false,
    onExtend:(object)=>{}, 
    logToConsole:false,
  }

  constructor( props ){
    super( props );
    let {data, autoExtendRoot} = props;
    let root = new VObject( data );
    this.state = {
      root,
      shouldUpdate:false,
    };
    console.log( {autoExtendRoot, root});
    if( autoExtendRoot && root.toggle ) root.toggle();
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
      // if( root && this.state.root ) this.assignToggle(root, this.state.root);
      if( this.props.autoExtendRoot == false && nextProps.autoExtendRoot && root && root.toggle && root.toggleOn ) {
        // root.toggle();
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
    console.log( desc , !!desc.toggle);
    desc.toggle && desc.toggle();
    this.setState({shouldUpdate:true,focusedDesc:desc},()=>{
      console.log( 'didFinish extended ');
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

  _onPressDesc( desc ){
    if( desc.type == 'get' ){
      this.extend( desc );
    }
    else {
      this.copy( desc ); 
    }
  }

  consoleLog(desc){
    console.log( desc.value );
  }

  renderObject(desc, index, datas){
    let hasChild = desc.toggle && desc.length > 0;
    let isOpened = (desc.toggle && desc.toggleOn === true) ? true : false;
    let {fontSize, tailRenderer, logToConsole} = this.props;
    let {focusedDesc} = this.state;
    let style = [styles['type' + toCapitalize( desc.type )],{fontSize}];

    let length = '';
    if( desc.length >= 0 && desc.childName ){
      length = desc.length + ' ' + ( desc.childName + (desc.length > 1 ? 's' : '') );
    }

    return (
      <View key={index + '_' + desc.depth}>
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} opacity={0.9} onPress={this.extend.bind(this, desc)}>
          {hasChild && (
            <View style={[styles.toggleContainer, {width:fontSize, height:fontSize}]}>
              <Arrow direction={desc.toggleOn?'up':'right'} width={fontSize*0.4} height={fontSize * 0.8} borderWidth={fontSize / 9}/>
            </View>
          )}
          {typeof desc.key !== 'undefined' && <Text style={[styles.v,{fontSize}]}>{desc.key + ': '}</Text>}
          <TouchableOpacity opacity={0.9} onPress={this._onPressDesc.bind(this, desc )}>
            <Text style={[styles.v, style]}>{isOpened ? desc.container[0] : desc.desc}{length && ' ' + length}<Text style={[styles.typeDesc,{fontSize:Math.max(7, fontSize - 2 )}]}> {toCapitalize(desc.type)}</Text></Text>
          </TouchableOpacity>
          {logToConsole && desc.type != 'get' && (
            <TouchableOpacity opacity={0.9} onPress={this.consoleLog.bind(this,desc)}>
              <Text style={[styles.typeDesc,{fontSize}]}> _</Text>
            </TouchableOpacity>
          )}
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