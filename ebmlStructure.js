
let Transform = require('stream').Transform;

let setChildTag=function(parent,child,name)
{
	if(!(name in parent)) parent[name]=child;
	else
	{
		if(!Array.isArray(parent[name])) parent[name]=[parent[name]];
		parent[name].push(child);
	}
};
let processTag=function(tagStack,[type,data],useValues=false)
{
	switch(type)
	{
		case "start":
		{
			let obj = {
				_name:data.name,
				_raw:data
			};
			let parent=tagStack[0];
			tagStack.unshift(obj);
			if(parent) setChildTag(parent,obj,data.name);
			break;
		}
		case "end":
		{
			let obj=tagStack.shift()
			obj._rawEnd=data;
			if(tagStack.length===0) return obj;
			break;
		}
		case "tag":
		{
			let parent=tagStack[0];
			let value=data;
			if(useValues) value=data.value===undefined?Buffer.from(data.data).toString("hex"):data.value;
			if(parent) setChildTag(parent,value,data.name);
			else return data;
			break;
		}
	}
	return undefined;
};

let EbmlStructure = function (options = {})
{
	this.tagObjectStack=[];
	this.useValues=options.useValues===true;
	Transform.call(this,{ ...options, readableObjectMode: true, objectMode: true });

};
EbmlStructure.prototype=Object.assign(Object.create(Transform.prototype),
{
	constructor:EbmlStructure,
	_transform(tag,enc,done)
	{
		let obj=processTag(this.tagObjectStack,tag,this.useValues);
		if(obj) this.push(obj);
		done();
	}
});

EbmlStructure.parse=function(tags,useValues=false)
{
	let stack=[];
	let rtn=[];
	for(let i=0,l=tags.length;i<l;i++)
	{
		let obj=processTag(stack,tags[i],useValues);
		if(obj) rtn.push(obj);
	}
	return rtn;
};
EbmlStructure.wrapRoot=function(tags)
{
	return tags.reduce(function(root,tag)
	{
		setChildTag(root,tag,tag._name);
		return root;
	},{})
};

EbmlStructure.taggify=function(structure)
{
	let tags=[];
	let isRoot=!("_name" in structure);
	let todo=isRoot?Object.values(structure):[structure];
	let step=todo[0];
	while(step=todo.shift())
	{
		if(Array.isArray(step))
		{
			todo.unshift(...step);
			continue;
		}
		if("_name" in step)
		{
			tags.push(["start",step._raw]);
			let entries=Object.keys(step).filter(k=>!k.startsWith("_")).map(k=>step[k]);
			tags.push(...EbmlStructure.taggify(entries));
			tags.push(["end",step._rawEnd||step._raw]);
		}
		else
		{
			tags.push(["tag",step]);
		}
	}
	return tags;
}

module.exports=EbmlStructure;

