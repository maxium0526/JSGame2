// import {Item, MovableItem} from './Item.js';
// import {frameTime} from './settings.js';

class MapItem extends Item{
	constructor(config){
		super(config);
	}
	
	onTouch(item, type){
		if(item.constructor.name==="Player"){
			if(type==="up"){
					if(item.vy>0) {
						item.y=this.y-item.height;
						item.vy=0;	
					}		
					item.touched.down = true;
			} else if(type==="down"){				
					if(item.vy<0) {
						item.y=this.y+this.height;
						item.vy=-0;
					}
					item.touched.up = true;
			} else if(type==="left"){
					item.x=this.x-item.width;
					item.vx=0;
					item.touched.right = true;
			} else if(type==="right"){
					item.x = this.x+this.width;
					item.vx=0;
					item.touched.left = true;
			}
		} else if(item.constructor.name==="MovableItem"){
			if(type==="up"){
				if(item.vy>0) {
					item.y=this.y-item.height;
					item.vy*=-1;	
				}		
				item.touched.down = true;
			} else if(type==="down"){				
					if(item.vy<0) {
						item.y=this.y+this.height;
						item.vy*=-1;
					}
					item.touched.up = true;
			} else if(type==="left"){
					item.x=this.x-item.width;
					item.vx*=-1;
					item.touched.right = true;
			} else if(type==="right"){
					item.x = this.x+this.width;
					item.vx*=-1;
					item.touched.left = true;
			}
		}
	}
	
	draw(gc){
		if(this.image){
			super.draw(gc);
			return;
		}
		gc.fillStyle = this.color;
		gc.fillRect(this.x,this.y,this.width, this.height);
	}
}

class MapItemFactory{
	static get(name, config){
		switch(name){
			case "MapItem":
				config.color = "#000000";
				config.image_src = "img/mapitem.png";
				return new MapItem(config);
			case "Bounce":
				config.color = "#FFFF33";
				config.image_src = "img/bounce.png";
				config.speeds = {up:-10,down:10,left:-10,right:10};
				return new Bounce(config);
			case "StickyWall":
				config.color = "#00FF00";
				config.image_src = "img/stickywall.png";
				return new StickyWall(config);
			case "SmoothWall":
				config.color = "#8EF9F6";
				config.image_src = "img/smoothwall.png";
				return new SmoothWall(config);
			case "SuckWall":
				config.color = "#1A005B";
				config.accs = {};
				return new SuckWall(config);
			case "GravityWall":
				config.color = "#888888";
				config.accs = {};
				config.image_src = "img/gravitywall.png";
				return new GravityWall(config);
			case "MediumWall":
				config.color = "#1A005B";
				config.image_src = "img/mediumwall.png";
				return new MediumWall(config);
			case "NonTouchWall":
				config.color = "#CECECE"
				config.image_src = "img/nontouchwall.png";
				return new NonTouchWall(config);
			default: return null;
		}
	}

	static getById(id){
		switch(id){
			case '00':
				break;
			case "01"://MapItem
				config.color = "#000000";
				config.image_src = "img/mapitem.png";
				return new MapItem(config);
			case "02"://Bounce
				config.color = "#FFFF33";
				config.image_src = "img/bounce.png";
				config.speeds = {up:-10,down:10,left:-10,right:10};
				return new Bounce(config);
			case "03"://StickyWall
				config.color = "#00FF00";
				config.image_src = "img/stickywall.png";
				return new StickyWall(config);
			case "04"://SmoothWall
				config.color = "#8EF9F6";
				config.image_src = "img/smoothwall.png";
				return new SmoothWall(config);
			case "05"://SuckWall
				config.color = "#1A005B";
				config.accs = {};
				return new SuckWall(config);
			case "06"://GravityWall
				config.color = "#888888";
				config.accs = {};
				config.image_src = "img/gravitywall.png";
				return new GravityWall(config);
			case "07"://MediumWall
				config.color = "#1A005B";
				config.image_src = "img/mediumwall.png";
				return new MediumWall(config);
			case "08"://NonTouchWall
				config.color = "#CECECE"
				config.image_src = "img/nontouchwall.png";
				return new NonTouchWall(config);
			default: return null;
		}
	}
}

class Bounce extends MapItem{	
	constructor(config){
		super(config);
		this.speeds = config.speeds;
	}
	
	onTouch(item, type){
		if(type==="up"){				
			item.y=this.y-item.height;
			item.vy=this.speeds.up;		
			item.touched.down = false;				
		} else if(type==="down"){				
			item.y=this.y+this.height;
			item.vy=this.speeds.down;				
			item.touched.up = false;				
		} else if(type==="left"){
			item.x=this.x-item.width;
			item.vx=this.speeds.left;
			item.touched.right = false;				
		} else if(type==="right"){
			item.x = this.x+this.width;
			item.vx=this.speeds.right;
			item.touched.left = false;			
		}
	}	
	// draw(gc){
	// 	gc.fillStyle = this.color;
	// 	gc.fillRect(this.x,this.y,this.width, this.height);
	// }
}

class StickyWall extends MapItem{
	constructor(config){
		super(config);
	}
	
	onTouch(item, type){
		if(type==="up"){				
			item.y=this.y-item.height;
			item.vy=0;	
			item.vx=0;
			item.touched.down = true;				
		} else if(type==="down"){				
			item.y=this.y+this.height;
			item.vy=-0;
			item.vx=-0;
			item.touched.up = true;				
		} else if(type==="left"){
			item.x=this.x-item.width;
			item.vy=0;	
			item.vx=0;					
			item.y = parseInt(item.y);
			item.touched.right = true;	
		} else if(type==="right"){
			item.x = this.x+this.width;
			item.vy=0;	
			item.vx=0;
			item.y = parseInt(item.y);
			item.touched.left = true;
		}
	}
	
	// draw(gc){
	// 	gc.fillStyle = this.color;
	// 	gc.fillRect(this.x,this.y,this.width, this.height);
	// }
}

class SmoothWall extends MapItem{
	constructor(config){
		super(config);
	}
	
	onTouch(item, type){
		if(type==="up"){				
			item.y=this.y-item.height;
			item.vy=0;	
			item.touched.down = true;				
		} else if(type==="down"){		
			item.y=this.y+this.height;
			item.vy=-0;				
			item.touched.up = true;				
		} else if(type==="left"){
			item.x=this.x-item.width;					
			item.vx=0;
			item.touched.right = true;				
		} else if(type==="right"){
			item.x = this.x+this.width;					
			item.vx=0;
			item.touched.left = true;			
		}
		if(item.constructor.name==="Player"){
			item.vx*=1.08;
			item.tax=0;
		}
	}
	
	// draw(gc){
	// 	gc.fillStyle = this.color;
	// 	gc.fillRect(this.x,this.y,this.width, this.height);
	// }
}

class SuckWall extends MapItem{
	constructor(config){
		super(config);
		this.accs = config.accs;
	}
	
	onTouch(item, type){
		if(type==="up"){				
			item.tay+=30;	
			item.touched.down = true;			
		} else if(type==="down"){		
			item.tay-=30;	
			item.touched.up = true;				
		} else if(type==="left"){
			item.tax +=30;
			item.touched.right = true;				
		} else if(type==="right"){
			item.tax -=30;
			item.touched.left = true;			
		}
	}
	
	// draw(gc){
	// 	gc.fillStyle = this.color;
	// 	gc.fillRect(this.x,this.y,this.width, this.height);
	// }
}

class GravityWall extends MapItem{
	constructor(config){
		super(config);
		this.accs = config.accs;
	}
	
	onTouch(item, type){
		if(type==="up"){
			item.y=this.y-item.height;
			item.vy = 0;
			item.touched.down = true;				
		} else if(type==="down"){			
			item.y = this.y + this.height;
			item.tay-=19.8;
			item.vy = 0;
			item.touched.up = true;				
			if("down" in item.key && this.JSGame.input.getState(item.key["down"])===true){
				item.vy += 6;
				item.tay +=9.8;
			}				
		} else if(type==="left"){
				item.x = this.x - item.width;
				item.tax +=9.8;
				item.tay = 0;
				item.vy = 0;
				item.vx = 0;	
				item.touched.right = true;				
				if("up" in item.key && this.JSGame.input.getState(item.key["up"])===true){
					item.vy -= 4;
				}				
				if("down" in item.key && this.JSGame.input.getState(item.key["down"])===true){
					item.vy += 4;					
				}				
		} else if(type==="right"){
				item.x = this.x + this.width;
				item.tax -=9.8;
				item.tay = 0;
				item.vy = 0;
				item.vx = 0;	
				item.touched.left = true;				
				if("up" in item.key && this.JSGame.input.getState(item.key["up"])===true){
					item.vy -= 4;
				}				
				if("down" in item.key && this.JSGame.input.getState(item.key["down"])===true){
					item.vy += 4;					
				}			
		}
	}	
	// draw(gc){
	// 	gc.fillStyle = this.color;
	// 	gc.fillRect(this.x,this.y,this.width, this.height);
	// }
}

class MediumWall extends MapItem{
	constructor(config){
		super(config);		
		this.fl = null;
		this.fr = null;
		this.fu = null;
		this.fd = null;
	}

	initState(){
			if(this.fl!=null){
				super.onTouch(this.fl,"left");
			}
			if(this.fr!=null){
				super.onTouch(this.fr,"right");
			}
			if(this.fu!=null){
				super.onTouch(this.fu,"up");
			}
			if(this.fd!=null){
				super.onTouch(this.fd,"down");
			}
			this.fl = null;
			this.fr = null;
			this.fu = null;
			this.fd = null;
	}
	
	onTouch(item, type){
		if(type==="up"){
				if(this.fd!=null){
					MovableItem.doImpact(item,this.fd);
					console.log(item,this.fd);					
				} else {
					this.fu = item;
				}
		} else if(type==="down"){
				if(this.fu!=null){
					MovableItem.doImpact(this.fu,item);
					console.log(item,this.fu);
				} else {
					this.fd = item;
				}				
		} else if(type==="left"){
				if(this.fr!=null){
					MovableItem.doImpact(item,this.fr);
					this.fr = null;
				} else {
					this.fl = item;
				}				
		} else if(type==="right"){
				if(this.fl!=null){
					MovableItem.doImpact(item,this.fl);
					this.fl = null;
				} else {
					this.fr = item;
				}			
		}
	}
	
	// draw(gc){
	// 	gc.fillStyle = this.color;
	// 	gc.fillRect(this.x,this.y,this.width, this.height);
	// }
}

class NonTouchWall extends MapItem{
	constructor(config){
		super(config);
	}
	
	onTouch(item, type){
		if(type==="up"){				
				super.onTouch(item,type);
				item.touched.down = false;				
		} else if(type==="down"){							
				super.onTouch(item,type);				
				item.touched.up = false;				
		} else if(type==="left"){
				super.onTouch(item,type);
				item.touched.right = false;				
		} else if(type==="right"){
				super.onTouch(item,type);
				item.touched.left = false;			
		}		
	}
}

// export {MapItem, MapItemFactory, Bounce, StickyWall, SmoothWall, SuckWall, GravityWall, MediumWall, NonTouchWall};