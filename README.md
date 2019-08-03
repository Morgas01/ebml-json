# ebml-json
organizes the ebml tags in a json structure


For easier use the Array of Ebml tags, which represents an xml like structure, is parsed to a json tree structure

## Example
 ```js
['start',{tagStr:'1a45dfa3',type:'m',dataSize:35,tag:172351395,name:'EBML',start:0,end:40}]
['tag',{tagStr:'4286',type:'u',dataSize:1,tag:646,name:'EBMLVersion',start:5,end:9,data:<Buffer 01>,discardable:false,keyframe:false,payload:null,track:undefined,value:1}]
['tag',{tagStr:'42f7',type:'u',dataSize:1,tag:759,name:'EBMLReadVersion',start:9,end:13,data:<Buffer 01>,discardable:false,keyframe:false,payload:null,track:undefined,value:1}]
['tag',{tagStr:'42f2',type:'u',dataSize:1,tag:754,name:'EBMLMaxIDLength',start:13,end:17,data:<Buffer 04>,discardable:false,keyframe:false,payload:null,track:undefined,value:4}]
['tag',{tagStr:'42f3',type:'u',dataSize:1,tag:755,name:'EBMLMaxSizeLength',start:17,end:21,data:<Buffer 08>,discardable:false,keyframe:false,payload:null,track:undefined,value:8}]
['tag',{tagStr:'4282',type:'s',dataSize:8,tag:642,name:'DocType',start:21,end:32,data:<Buffer 6d 61 74 72 6f 73 6b 61>,discardable:false,keyframe:false,payload:null,track:undefined,value:'matroska'}]
['tag',{tagStr:'4287',type:'u',dataSize:1,tag:647,name:'DocTypeVersion',start:32,end:36,data:<Buffer 01>,discardable:false,keyframe:false,payload:null,track:undefined,value:1}]
['tag',{tagStr:'4285',type:'u',dataSize:1,tag:645,name:'DocTypeReadVersion',start:36,end:40,data:<Buffer 01>,discardable:false,keyframe:false,payload:null,track:undefined,value:1}]
['end',{tag:172351395,tagStr:'1a45dfa3',type:'m',name:'EBML',start:0,end:40,dataSize:35}]
 ```
into
```js
{
	_name:'EBML',
	_raw:{tagStr:'1a45dfa3',type:'m',dataSize:35,tag:172351395,name:'EBML',start:0,end:40},
	EBMLVersion:{tagStr:'4286',type:'u',dataSize:1,tag:646,name:'EBMLVersion',start:5,end:9,data:<Buffer 01>,discardable:false,keyframe:false,payload:null,track:undefined,value:1},
	EBMLReadVersion:{tagStr:'42f7',type:'u',dataSize:1,tag:759,name:'EBMLReadVersion',start:9,end:13,data:<Buffer 01>,discardable:false,keyframe:false,payload:null,track:undefined,value:1},
	EBMLMaxIDLength:{tagStr:'42f2',type:'u',dataSize:1,tag:754,name:'EBMLMaxIDLength',start:13,end:17,data:<Buffer 04>,discardable:false,keyframe:false,payload:null,track:undefined,value:4},
	EBMLMaxSizeLength:{tagStr:'42f3',type:'u',dataSize:1,tag:755,name:'EBMLMaxSizeLength',start:17,end:21,data:<Buffer 08>,discardable:false,keyframe:false,payload:null,track:undefined,value:8},
	DocType:{tagStr:'4282',type:'s',dataSize:8,tag:642,name:'DocType',start:21,end:32,data:<Buffer 6d 61 74 72 6f 73 6b 61>,discardable:false,keyframe:false,payload:null,track:undefined,value:'matroska'},
	DocTypeVersion:{tagStr:'4287',type:'u',dataSize:1,tag:647,name:'DocTypeVersion',start:32,end:36,data:<Buffer 01>,discardable:false,keyframe:false,payload:null,track:undefined,value:1},
	DocTypeReadVersion:{tagStr:'4285',type:'u',dataSize:1,tag:645,name:'DocTypeReadVersion',start:36,end:40,data:<Buffer 01>,discardable:false,keyframe:false,payload:null,track:undefined,value:1},
	_rawEnd:{tag:172351395,tagStr:'1a45dfa3',type:'m',name:'EBML',start:0,end:40,dataSize:35}
}
```
with the useValues option set to true
```js
{
	_name:'EBML',
	_raw:{tagStr:'1a45dfa3',type:'m',dataSize:35,tag:172351395,name:'EBML',start:0,end:40},
	EBMLVersion:1,
	EBMLReadVersion:1,
	EBMLMaxIDLength:4,
	EBMLMaxSizeLength:8,
	DocType:'matroska',
	DocTypeVersion:1,
	DocTypeReadVersion:1,
	_rawEnd:{tag:172351395,tagStr:'1a45dfa3',type:'m',name:'EBML',start:0,end:40,dataSize:35}
}
```


#Install
This package is intended to be used with the [ebml](https://www.npmjs.com/package/ebml) package!

npm\
``npm install --save ebml-json``


#Usage
* as a transform stream
```js
let Ebml=require("ebml");
let EbmlJson=require("ebml-json");

myStream.pipe(new Ebml.Decoder()).pipe(new EbmlJson()).on("data",function(root)
{
    //do stuff with roots here
});
```
* as a parser

```js
let Ebml=require("ebml");
let EbmlJson=require("ebml-json");

let roots=EbmlJson.parse(myTagArray);
//do stuff with roots here
// or
let ebmlStructure=EbmlJson.wrapRoot(roots);
```


# Reverse
The json structure can also be reverted into a tag array.

**_!! It is not possible if you used the "useValues" option !!_** 

```js
let EbmlJson=require("ebml-json");
let tags=EbmlJson.taggify(ebmlStructure); // can also consume wrapped roots
```



#Api
###new ebml-json([options])
**params**
* `[options]` **{Object}**
* `[options.useValues=false]` **{Boolean}** use value instead of tag contents
* `returns` **stream.Transform** 
###ebml-json.parse(tags,[options])
**params**
* `[tags]` **{Array}** array of decoded tags
* `[options]` **{Object}**
* `[options.useValues=false]` **{Boolean}** use value instead of tag contents
* `returns` **{Array\<EbmlStructure>}** array of parsed roots
###ebml-json.wrapRoot(roots)
**params**
* `roots` **{Array\<EbmlStructure>}** array of parsed roots
* `returns` **{Object}** object containing roots (keys correspond to _name)
###ebml-json.taggify(EbmlStructure)
**params**
* `EbmlStructure` **{Array\<EbmlStructure>}** array of parsed roots
* `returns` **{Array}** array of ebml tags