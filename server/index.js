var io = require("socket.io")();
var mapItems = require("./map.json");

var mid = 0;
function getMid(){
	return ++mid;
}

for(let mapItem of mapItems){
	mapItem.mid = getMid();
}

// var mapItems = map.convertMapItems(0,0,32,32);

var players = [];

io.on('connection', function(socket){
	socket.on("getMapItems",(fromMid)=>{
		result = mapItems.filter((mapItem)=>{return mapItem.mid>=fromMid});
		socket.emit("addMapItems",result);
	});

	socket.on("getPlayers",()=>{
		socket.emit("getPlayers",players);
	})

	socket.on("appendPlayer",function({name,width,height,color,weight, image_src}){
		players.push({sid: socket.id, name:name, x:0,y:0,width:width,height:height,weight:weight, color:color, image_src: image_src});
		console.log(players[players.length-1]);
		socket.emit("receiveSid",socket.id);
	});

	socket.on("updatePlayerPosition",function({x,y,fx,fy,ax,ay}){
		let player = players.filter(p=>p.sid===socket.id)[0];
		if(player){
			player.x = x;
			player.y = y;
			
			socket.broadcast.emit("refreshPlayerPosition",player);
		}		
	});

	socket.on("disconnect",()=>{
		players = players.filter(p=>p.sid!=socket.id);
		socket.broadcast.emit("removePlayer",socket.id);
	});
})

io.listen(3000);


