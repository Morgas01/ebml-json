
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

let EbmlStructure = function (options = {})
{
	this.tagObjectStack=[];
	this.useValues=options.useValues===true;
	Transform.call(this,{ ...options, readableObjectMode: true, objectMode: true });

};
EbmlStructure.prototype=Object.assign(Object.create(Transform.prototype),
{
	_transform([type,data],enc,done)
	{
		switch(type)
		{
			case "start":
			{
				let obj = {
					_name:data.name,
					_raw:data
				};
				let parent=this.tagObjectStack[0];
				this.tagObjectStack.unshift(obj);
				if(parent) setChildTag(parent,obj,data.name);
				break;
			}
			case "end":
			{
				let obj=this.tagObjectStack.shift()
				if(this.tagObjectStack.length===0) this.push(obj);
				break;
			}
			case "tag":
			{
				let parent=this.tagObjectStack[0];
				let value=data;
				if(this.useValues) value=data.value;
				if(parent) setChildTag(parent,value,data.name);
				else this.push(data);
				break;
			}
		}
		done();
	}
});

EbmlStructure.wrapRoot=function(tags)
{
	return tags.reduce(function(root,tag)
	{
		setChildTag(root,tag,tag._name);
		return root;
	},{})
};

module.exports=EbmlStructure;