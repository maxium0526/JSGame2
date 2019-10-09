class JSGame{

	constructor(canvas, config){
		this.settings = {
			mode: 0,
			tickTime: 0.005,
			scale: 90,
			camera: 1,
		};
		this.server = {
			url: null,
			sid: null,
			socket: null,
		}
		this.objects = {
			players: [new Player({
				name: 'Max',
				x: 31,
				y: 0,
				width: 25,
				height: 50,
				image_src: "img/player.png",
				keySet: {"up":87,"left":65,"right":68,"down":83, "up2":256},
				weight: 1,
				fx: 0,
				fy: 0,
				ax: 0,
				ay: 9.8,
			})],
			fields: [],
			mapItems: [
				// new MapItem({
				// 	x: 0,
				// 	y:300,
				// 	width:100,
				// 	height:20
				// })
			],
			movableItems: [],
			networkPlayers: [],
		}
		this.objects.allMovableItems = this.objects.players.concat(this.objects.movableItems);

		this.mainTimer = null;
		this.frameTimer = null;
		this.ioTimer = null;

		this.input = new Input({numHistory:5, recordSize:300});

		this.canvas = canvas;
		this.config = config;

		if(config.settings){
			this.settings.mode = config.settings.mode ? config.settings.mode : this.settings.mode;
			this.settings.tickTime = config.settings.tickTime ? config.settings.tickTime : this.settings.tickTime;
			this.settings.scale = config.settings.scale ? config.settings.scale : this.settings.scale;
			this.settings.camera = config.settings.camera ? config.settings.camera : this.settings.camera;
		}

		if(config.server){
			this.server.url = config.server.url ? config.server.url : this.server.url;
		}

		if(config.objects){
			this.objects.players = config.objects.players ? config.objects.players : this.objects.players;
			this.objects.fields = config.objects.fields ? config.objects.fields : this.objects.fields;
			this.objects.mapItems = config.objects.mapItems ? config.objects.mapItems : this.objects.mapItems;
			this.objects.movableItems = config.objects.movableItems ? config.objects.movableItems : this.objects.movableItems;
		}
	}

	start(){
		this.init();
	}

	init(){
		let _this = this;
		let canvas = this.canvas;
		let ctx = this.canvas.getContext('2d');
		let frameTimer = this.frameTimer;

		window.onkeydown = function(e){
			_this.input.keyDown(e.keyCode);
		}
		window.onkeyup = function(e){
			_this.input.keyUp(e.keyCode);
		}

		if(this.settings.mode==1 && this.server.url){

			//only take the first player
			this.objects.players = this.objects.players.slice(0, 1);
			//remove all Items
			this.objects.fields = [];
			this.objects.mapItems = [];
			this.objects.movableItems = [];

			//setup connection
			this.server.socket = io(this.server.url);

			this.server.socket.on("addMapItems",(mapItems)=>{
				for(let mapItem of mapItems){
					_this.objects.mapItems.push(MapItemFactory.get(mapItem.name, mapItem));
				}
				_this.initMapItems();
			});
			this.server.socket.on("getPlayers",(players)=>{
				for(let player of players){
					_this.updateNetworkPlayerPosition(player);
				}
			});
			this.server.socket.on("receiveSid",(receivedSid)=>{
				_this.server.sid = receivedSid;
				let prep = {x:0,y:0};
				let playerInfo = null;
				let player = _this.objects.players[0];
				_this.ioTimer = setInterval(()=>{
					playerInfo = {
						name: player.name,
						x: player.x,
						y: player.y,
						width: player.width,
						height: player.height,
						color: player.color, 
					}
					if(Math.abs(player.x-prep.x)>0.01 || Math.abs(player.y-prep.y)>0.01){
						_this.server.socket.emit("updatePlayerPosition", playerInfo);
						prep.x = player.x;
						prep.y = player.y;
					}					
				},10);
			});
			this.server.socket.on("refreshPlayerPosition",(player)=>{
				_this.updateNetworkPlayerPosition(player);
			});
			this.server.socket.on("removePlayer",(sid)=>{
				_this.removeNetworkPlayer(sid);
			});

			//get items from server
			this.server.socket.emit("getMapItems",0);
			this.server.socket.emit("getPlayers");

			//send the player to server
			let player = _this.objects.players[0];
			this.server.socket.emit("appendPlayer",{
				name: player.name,
				x: player.x,
				y: player.y,
				width: player.width,
				height: player.height,
				weight: player.m,
				color: player.color, 
				image_src: player.image_src
			});
		} else {
			console.log('The game is in online mode, please specify the url in config.server.url.');
		}

		for(let players of this.objects.players){
			players.JSGame = this;
		}
		for(let fields of this.objects.fields){
			fields.JSGame = this;
		}

		this.initMapItems();
	
		for(let movableItems of this.objects.movableItems){
			movableItems.JSGame = this;
		}
		for(let networkPlayers of this.objects.networkPlayers){
			networkPlayers.JSGame = this;
		}

		//reset the timer
		if(this.mainTimer!=null){
			clearInterval(mainTimer);
		}

		let tick = function(){
			for(let i = 0; i<_this.objects.players.length; i++){
				_this.objects.players[i].initState();
			}
			for(let i = 0; i<_this.objects.mapItems.length; i++){
				_this.objects.mapItems[i].initState();
			}

			for(let i=0;i<_this.objects.allMovableItems.length;i++){
				_this.objects.allMovableItems[i].calcF();
			}
			for(let i=0;i<_this.objects.allMovableItems.length;i++){
				for(let j=0;j<_this.objects.fields.length;j++){
					_this.objects.allMovableItems[i].touch(_this.objects.fields[j]);
				}
			}	
			for(let i = 0; i<_this.objects.players.length; i++){
				_this.objects.players[i].calcAcc(0,0,_this.settings.tickTime,_this.settings.scale);
			}
			for(let i = 0; i<_this.objects.movableItems.length; i++){
				_this.objects.movableItems[i].calcAcc(0,0,_this.settings.tickTime,_this.settings.scale);
			}
			for(let i = 0; i<_this.objects.players.length; i++){
				for(let j=0; j<_this.objects.mapItems.length; j++){
					_this.objects.players[i].touch(_this.objects.mapItems[j]);
				}
			}
			for(let i = 0; i<_this.objects.players.length; i++){
				for(let j=0; j<_this.objects.networkPlayers.length; j++){
					_this.objects.players[i].touch(_this.objects.networkPlayers[j]);
				}
			}	
			for(let i = 0; i<_this.objects.allMovableItems.length-1; i++){
				for(let j = i+1; j<_this.objects.allMovableItems.length; j++){
					Player.impact(_this.objects.allMovableItems[i],_this.allMovableItems[j]);
				}
			}	
			for(let i = 0; i<_this.objects.movableItems.length; i++){
				for(let j=0; j<_this.objects.mapItems.length; j++){
					_this.objects.movableItems[i].impactTouch(_this.objects.mapItems[j]);
				}
			}	
			for(let i = 0; i<_this.objects.players.length; i++){
				_this.objects.players[i].doTriggerEvent(_this.input, _this.settings.tickTime,_this.settings.scale);
			}
			for(let i = 0; i<_this.objects.players.length; i++){
				_this.objects.players[i].calcNxtPosi(_this.settings.tickTime,_this.settings.scale);
			}
			for(let i = 0; i<_this.objects.movableItems.length; i++){
				_this.objects.movableItems[i].calcNxtPosi(_this.settings.tickTime,_this.settings.scale);
			}

			_this.input.tick();
		}
		this.mainTimer = setInterval(tick, this.settings.tickTime * 1000);

		let renderC1 = function(){
			frameTimer = requestAnimationFrame(renderC1);
				
			ctx.clearRect(0,0,canvas.width, canvas.height);

			let offsetx = 0;
			let offsety = 0;

			if(_this.objects.players[0]){
				offsetx = _this.objects.players[0].x-canvas.width/2;
				offsety = _this.objects.players[0].y-canvas.height/2;

			}
			
			ctx.save();
			ctx.translate(-offsetx, -offsety);
			for(let i = 0; i<_this.objects.players.length; i++){
				_this.objects.players[i].draw(ctx);
			}

			for(let i=0; i<_this.objects.mapItems.length; i++){
				_this.objects.mapItems[i].draw(ctx);
			}
			for(let i = 0; i<_this.objects.movableItems.length; i++){
				_this.objects.movableItems[i].draw(ctx);
			};

			for(let i = 0; i<_this.objects.fields.length;i++){
				_this.objects.fields[i].draw(ctx);
			}

			for(let i=0; i<_this.objects.networkPlayers.length;i++){
				_this.objects.networkPlayers[i].draw(ctx);
			}
			ctx.restore();
		}

		let renderC2 = function(){
			frameTimer = requestAnimationFrame(renderC2);
				
			ctx.clearRect(0,0,canvas.width, canvas.height);

			let offsetx = (_this.objects.players[0].x+_this.objects.players[1].x)/2-canvas.width/2;
			let offsety = (_this.objects.players[0].y+_this.objects.players[1].y)/2-canvas.height/2;
			
			ctx.save();
			ctx.translate(-offsetx, -offsety);
			for(let i = 0; i<_this.objects.players.length; i++){
				_this.objects.players[i].draw(ctx);
			}

			for(let i=0; i<_this.objects.mapItems.length; i++){
				_this.objects.mapItems[i].draw(ctx);
			}
			for(let i = 0; i<_this.objects.movableItems.length; i++){
				_this.objects.movableItems[i].draw(ctx);
			};
			for(let i = 0; i<_this.objects.fields.length;i++){
				_this.objects.fields[i].draw(ctx);
			}
			for(let i=0; i<_this.objects.networkPlayers.length;i++){
				_this.objects.networkPlayers[i].draw(ctx);
			}
			ctx.restore();
		}

		let renderC3 = function(){
			frameTimer = requestAnimationFrame(renderC3);
				
			ctx.clearRect(0,0,canvas.width, canvas.height);

			for(let i = 0; i<_this.objects.players.length; i++){
				_this.objects.players[i].draw(ctx);
			}
			for(let i=0; i<_this.objects.mapItems.length; i++){
				_this.objects.mapItems[i].draw(ctx);
			}
			for(let i = 0; i<_this.objects.movableItems.length; i++){
				_this.objects.movableItems[i].draw(ctx);
			}
			for(let i = 0; i<_this.objects.fields.length;i++){
				_this.objects.fields[i].draw(ctx);
			}
			for(let i=0; i<_this.objects.networkPlayers.length;i++){
				_this.objects.networkPlayers[i].draw(ctx);
			}
		}

		switch(this.settings.camera){
			case 1:
				this.frameTimer = requestAnimationFrame(renderC1);
				break;
			case 2:
				this.frameTimer = requestAnimationFrame(renderC2);
				break;
			case 3:
				this.frameTimer = requestAnimationFrame(renderC3);
				break;
		}

	}

	initPlayers(){
		for(let player of this.objects.players){
			player.JSGame = this;
		}
	}

	initFields(){
		for(let field of this.objects.fields){
			field.JSGame = this;
		}
	}

	initMapItems(){
		for(let mapItem of this.objects.mapItems){
			mapItem.JSGame = this;
		}
	}

	initMovableItems(){
		for(let item of this.objects.movableItems){
			item.JSGame = this;
		}
	}

	initNetworkPlayers(){
		for(let player of this.objects.networkPlayers){
			player.JSGame = this;
		}
	}

	loadMap(json){
		if(this.settings.mode==0){
			let mapItemInfoList = JSON.parse(json);
			let mapItems = [];
			for(let mapItemInfo of mapItemInfoList){
				mapItems.push(MapItemFactory.get(mapItemInfo.type, mapItemInfo))
			}
			this.objects.mapItems = this.objects.mapItems.concat(mapItems);
		} else {
			console.log('The game is not in solo mode, please check the mode before using loadMap().')
		}

	}

	updateNetworkPlayerPosition(p){
		if(this.objects.networkPlayers.filter(player=>player.sid==p.sid).length==0){
			let newPlayer = new Player({
				name: p.name,
				x: p.x,
				y: p.y,
				width: p.width,
				height: p.height,
				color: p.color,
				image_src: p.image_src,
				sid: p.sid,
			});
			this.objects.networkPlayers.push(newPlayer);
		} else {
			let player = this.objects.networkPlayers.filter(player=>player.sid==p.sid);
			if(player.length>0){
				player = player[0];
				player.x = p.x;
				player.y = p.y;
			}
		}
	}

	removeNetworkPlayer(pSid){
		this.objects.networkPlayers = this.objects.networkPlayers.filter(p=>p.sid!=pSid);
	}

}