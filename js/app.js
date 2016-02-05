(function(){
	function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
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
	
	tag$.defineTag('message', 'li', function(tag){
		
		tag.prototype.render = function (){
			var t0, t1, t2;
			return this.setChildren([
				(t0 = this.$a=this.$a || tag$.$div().flag('date')).setContent(this.object().created().toLocaleString(),3).end(),
				(t1 = this.$b=this.$b || tag$.$div().flag('message')).setContent([
					(t2 = t1.$$a=t1.$$a || tag$.$span().flag('name')).setContent(this.object().author(),3).end(),
					" - " + this.object().text()
				],1).end()
			],2).synced();
		};
	});
	
	tag$.defineTag('app', function(tag){
		
		tag.prototype.messages = function(v){ return this._messages; }
		tag.prototype.setMessages = function(v){ this._messages = v; return this; };
		
		tag.prototype.build = function (){
			this.messages().push(new Message('I am a fake message.'));
			this.messages().push(new Message('Hello'));
			this.messages().push(new Message('Sup?','Bob'));
			return this.schedule();
		};
		
		tag.prototype.onsubmit = function (e){
			var v_;
			e.cancel().halt();
			this.messages().push(new Message(this._text.value(),this._name.value() || undefined));
			return (this._text.setValue(v_ = ''),v_);
		};
		
		tag.prototype.hallo = function (e){
			return console.log(e);
		};
		
		tag.prototype.reversed = function (){
			return this.messages().sort(function(a,b) { return b.created() - a.created(); });
		};
		
		tag.prototype.render = function (){
			var t0, self = this, t1;
			return this.setChildren([
				(this.$a = this.$a || tag$.$h1().setHandler('tap','hallo',this)).setText("An Imba Chat Room").end(),
				(t0 = this.$b=this.$b || tag$.$form()).setContent([
					(this._name = this._name || tag$.$input().setRef('name',this).setPlaceholder('Your Alias')).end(),
					(this._text = this._text || tag$.$input().setRef('text',this).setPlaceholder('Enter Message')).end(),
					(t0.$$c = t0.$$c || tag$.$button().setType('submit')).setText('Submit').end()
				],2).end(),
				(this.messages().length > 0) ? (
					(t1 = self.$c=self.$c || tag$.$ul().flag('messages')).setContent(
						(function(t1) {
							for (var i = 0, ary = iter$(self.reversed()), len = ary.length, message, res = []; i < len; i++) {
								message = ary[i];
								res.push((t1['_' + message.id()] = t1['_' + message.id()] || tag$.$message()).setObject(message).end());
							};
							return res;
						})(t1)
					,3).end()
				) : void(0)
			],1).synced();
		};
	});
	
	var app = tag$.$app().setMessages([]).end();
	return (q$$('#chatapp')).append(app);

})()