$.createElement = function(selector){
	if(/^</.test(selector)){
		return $(selector);
	}
	var tag = selector.match(/^\w+/)[0];
	var dom = document.createElement(tag);
	var element = $(dom);
	var pattern = /\.([\w|-]+)/g;
	var classes = pattern.exec(selector);
	while(classes != null){
		element.addClass(classes[1]);
		classes = pattern.exec(selector);
	}
	pattern = /#([\w|-]+)/;
	var id = pattern.exec(selector);
	if(id != null){
		element.attr('id', id[1]);
	}
return element;
};

$.fn.createElement = function(selector){
	var element = $.createElement(selector);
	this.append(element);
	return element;
};

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+S4());
};

var includeJavascriptFile = function(src, attributes)
{
	try {
		attributes = attributes || {};
		attributes.type = "text/javascript";
		attributes.src = src;

		var script = document.createElement("script");
		for(aName in attributes)
			script[aName] = attributes[aName];

		document.getElementsByTagName("head")[0].appendChild(script);
		return true;
	} catch(e) { return false; }
};