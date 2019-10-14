// import {MovableItem} from './Item.js';
//import {Bound} from './Bound.js'

class Player extends MovableItem{
	constructor(config){
		config.color = config.color ? config.color : Player.getRandomColor();
		super(config);
		this.name = config.name;
		this.dead = false;
		this.sid = config.sid;
		this.isNameVisible = true;
	}
	
	initState(){
		this.touched.up = false;
		this.touched.down = false;
		this.touched.left = false;
		this.touched.right = false;
		this.isNameVisible = true;
	}
	
	doTriggerEvent(input, frameTime, scale){
		if("up" in this.key && input.getState(this.key["up"])=== true){
			if(this.touched.down===true){
				this.vy =-6;
			}
		}
		if("up2" in this.key && input.getState(this.key["up2"])=== true){
			if(this.touched.down===true){
				this.vy =-6;
			}
		}
		if("left" in this.key && input.getState(this.key["left"])=== true){
			this.tax-=30;
		}
		if("right" in this.key && input.getState(this.key["right"])=== true){
			this.tax+=30;
		}
	}
		
	calcNxtPosi(frameTime, scale){
		this.vx += this.tax * frameTime;
		this.vy += this.tay * frameTime;
		this.x += this.vx * scale * frameTime;
		this.y += this.vy * scale * frameTime;
		
		this.vx /= 1.08;	

		if(Math.abs(this.vx)<0.0001) this.vx = 0;//防止無限小	
	}

	draw(gc){
		if(this.image){
			super.draw(gc);
			

		} else {
			gc.fillStyle = this.color;
			// gc.fillRect(this.x,this.y,this.width,this.height);
			gc.fillRect(this.x, this.y, Math.min(this.width,this.height), Math.min(this.width,this.height));
			gc.fillRect(this.x, this.y+this.height * 6/10, this.width, this.height * 1/10);
			gc.fillRect(this.x + this.width * 4/10,this.y, this.width * 2/10, this.height * 8.5/10);
			gc.fillRect(this.x, this.y+ this.height * 8/10, this.width, this.height * 1/10);
			gc.fillRect(this.x, this.y + this.height * 8/10, this.width * 2/10, this.height * 2/10);
			gc.fillRect(this.x + this.width * 8/10, this.y + this.height * 8/10, this.width * 2/10, this.height * 2/10);
		}

		if(this.isNameVisible){
			gc.font = "12px sans-serif";
			gc.fillText(this.name, this.x + this.width/2 - gc.measureText(this.name).width/2, this.y-16);
		}
		
	}

	static getRandomColor() {
		  var letters = '0123456789ABCDEF';
		  var color = '#';
		  for (var i = 0; i < 3; i++) {
		  	color += letters[Math.floor(Math.random() * 12)];
		    color += letters[Math.floor(Math.random() * 16)];
		  }
		  return color;
		}
}

// export {Player};