(function(){
	function Message(text,author){
		if(author === undefined) author = 'Anon';
		this._id = id++;
		this._text = text;
		this._author = author;
		this._created = new Date();
	};
	
	var id = 0;
	
	Message.prototype.author = function(v){ return this._author; }
	Message.prototype.setAuthor = function(v){ this._author = v; return this; };
	Message.prototype.text = function(v){ return this._text; }
	Message.prototype.setText = function(v){ this._text = v; return this; };
	Message.prototype.created = function(v){ return this._created; }
	Message.prototype.setCreated = function(v){ this._created = v; return this; };
	
	Message.prototype.id = function (){
		return this._id;
	};
	return Message;

})()