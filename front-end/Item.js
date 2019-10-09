//import {Bound} from './Bound.js';

class Item{
	constructor(config){
		this.x = config.x;
		this.y = config.y;
		this.width = config.width;
		this.height = config.height;
		this.color = config.color || "#000000";
		this.image_src = config.image_src || null;
		if(this.image_src){
			this.image = new Image(32,32);

			
			this.image.src = this.image_src;
			this.image.onload = function(){
				this.width = this.naturalWidth;
				this.height = this.naturalHeight;
			}
			// this.image = document.createElement('div');
			// this.image.style["background-image"] = this.image_src;
			// this.image.style["background-repeat"] = "repeat";
			// this.image.style["width"] = this.width + "px";
			// this.image.style["height"] = this.height + "px";
		}
		
		this.key = config.keySet||{};
	}

	initState(){

	}
	
	setKey(key, kc){
		this.key[key] = kc;
	}

	getCenter(){
		return [this.x+this.width/2,this.y+this.height/2];
	}
	
	getHalfWidth(){
		return this.width/2;
	}
	getHalfHeight(){
		return this.height/2;
	}
	
	nearBy(item, offset){
		return Math.abs(this.getCenter()[0]-item.getCenter()[0])< this.getHalfWidth() + item.getHalfWidth() + offset 
				&&Math.abs(this.getCenter()[1]-item.getCenter()[1])< this.getHalfHeight() + item.getHalfHeight() + offset;
	}
	
	doTriggerEvent(input, frameTime, scale){
	}
	
	draw(gc){
		if(this.image){
			// gc.drawImage(this.image, this.x, this.y, this.width, this.height);
			// return;
			let xoffset = this.width % this.image.width;
			let yoffset = this.height % this.image.height;
			let numx = Math.floor(this.width / this.image.width);
			let numy = Math.floor(this.height / this.image.height);
			let xscale = xoffset / numx;
			let yscale = yoffset / numy;

			for(let y=0;y<numy;y++){
				for(let x=0;x<numx;x++){
					gc.drawImage(this.image, this.x + x * (this.image.width+xscale), this.y + y * (this.image.height+yscale), this.image.width + xscale, this.image.height + yscale);
				}
			}
			// gc.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
			return;
		}
		gc.fillStyle = this.color;
		gc.fillRect(this.x,this.y,this.width,this.height);
	}

	onTouch(item, type, input){//test
		if(item.constructor.name==="Player"){
			if(type==="up"){

					if(item.vy>0) {
						item.y=this.y-item.height;
						item.vy=-0;	
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
	
}

class MovableItem extends Item{
	constructor(config){
		super(config);
		this.m = config.weight;
		this.fx = config.fx;
		this.fy = config.fy;
		this.ax = config.ax;
		this.ay = config.ay;
		this.tfx = 0;
		this.tfy = 0;
		this.tax = 0;
		this.tay = 0;
		this.vx = 0;
		this.vy = 0;
		
		this.touched = {up:false,down:false,left:false,right:false};
	}

	calcF(){
		this.tfx = this.fx;
		this.tfy = this.fy;
	}
	
	calcAcc(fx, fy,frameTime, scale){
		this.tax = this.ax;
		this.tay = this.ay;
		this.tax += this.tfx / this.m;
		this.tay += this.tfy / this.m;
		// this.tax += fx / this.m;
		// this.tay += fy / this.m;
	}
	
	touch(item){
		if(this.nearBy(item,0)){//上下左右
			if(Math.abs(this.getCenter()[1]-item.getCenter()[1])-this.getHalfHeight()-item.getHalfHeight()<Math.abs(this.getCenter()[0]-item.getCenter()[0])-this.getHalfWidth()-item.getHalfWidth()){
				if(this.getCenter()[0]>item.getCenter()[0]){//a右b左
					item.onTouch(this,"right");
				} else {//a左b右
					item.onTouch(this,"left");
				}
			} else {
				if(this.getCenter()[1]>item.getCenter()[1]){
					item.onTouch(this,"down");
				} else {
					item.onTouch(this,"up");
				}			
			}
		}
	}
	
	impactTouch(item){
		if(this.nearBy(item,0)){//上下左右
			if(Math.abs(this.getCenter()[1]-item.getCenter()[1])-this.getHalfHeight()-item.getHalfHeight()<Math.abs(this.getCenter()[0]-item.getCenter()[0])-this.getHalfWidth()-item.getHalfWidth()){
				if(this.getCenter()[0]>item.getCenter()[0]){//a右b左
					item.onTouch(this,"right");					
				} else {//a左b右
					item.onTouch(this,"left");
				}
			} else {
				if(this.getCenter()[1]>item.getCenter()[1]){
					item.onTouch(this,"down");
				} else {
					item.onTouch(this,"up");
				}			
			}
		}
	}
	
	static impact(a,b){
		let t1, t2;
		if(a.nearBy(b,0)){//上下左右
			if(Math.abs(a.getCenter()[1]-b.getCenter()[1])-a.getHalfHeight()-b.getHalfHeight()<Math.abs(a.getCenter()[0]-b.getCenter()[0])-a.getHalfWidth()-b.getHalfWidth()){
				if(a.getCenter()[0]>b.getCenter()[0]){//a右b左
					t1 = (a.vx * (a.m - b.m) + 2 * b.m * b.vx) / (a.m+b.m);
					t2 = (b.vx * (b.m - a.m) + 2 * a.m * a.vx) / (a.m+b.m);
					a.vx = t1;
					b.vx = t2;
					
					t1 = b.x+b.width;
					t2 = a.x - b.width;
					a.x = t1;
					b.x = t2;

					a.touched.left = true;
					b.touched.right = true;
				} else {//a左b右
					t1 = (a.vx * (a.m - b.m) + 2 * b.m * b.vx) / (a.m+b.m);
					t2 = (b.vx * (b.m - a.m) + 2 * a.m * a.vx) / (a.m+b.m);
					a.vx = t1;
					b.vx = t2;
					
					t1 = b.x-a.width;
					t2 = a.x+a.width;
					a.x = t1;
					b.x = t2;

					b.touched.left = true;
					a.touched.right = true;
				}
			} else {
				if(a.getCenter()[1]>b.getCenter()[1]){
					t1 = (a.vy * (a.m - b.m) + 2 * b.m * b.vy) / (a.m+b.m);
					t2 = (b.vy * (b.m - a.m) + 2 * a.m * a.vy) / (a.m+b.m);
					a.vy = t1;
					b.vy = t2;
					b.y=a.y-b.height;

					a.touched.up = true;
					b.touched.down= true;
				} else {
					t1 = (a.vy * (a.m - b.m) + 2 * b.m * b.vy) / (a.m+b.m);
					t2 = (b.vy * (b.m - a.m) + 2 * a.m * a.vy) / (a.m+b.m);
					a.vy = t1;
					b.vy = t2;
					a.y=b.y-a.height;//prevent stuck

					a.touched.down=true;
					b.touched.up = true;
				}			
			}
		}
	}
	
	static doImpact(a,b){
		let t1, t2;
		
			if(Math.abs(a.getCenter()[1]-b.getCenter()[1])-a.getHalfHeight()-b.getHalfHeight()<Math.abs(a.getCenter()[0]-b.getCenter()[0])-a.getHalfWidth()-b.getHalfWidth()){
				if(a.getCenter()[0]>b.getCenter()[0]){//a右b左
					t1 = (a.vx * (a.m - b.m) + 2 * b.m * b.vx) / (a.m+b.m);
					t2 = (b.vx * (b.m - a.m) + 2 * a.m * a.vx) / (a.m+b.m);
					a.vx = t1;
					b.vx = t2;
				} else {//a左b右
					t1 = (a.vx * (a.m - b.m) + 2 * b.m * b.vx) / (a.m+b.m);
					t2 = (b.vx * (b.m - a.m) + 2 * a.m * a.vx) / (a.m+b.m);
					a.vx = t1;
					b.vx = t2;
				}
			} else {
				if(a.getCenter()[1]>b.getCenter()[1]){
					t1 = (a.vy * (a.m - b.m) + 2 * b.m * b.vy) / (a.m+b.m);
					t2 = (b.vy * (b.m - a.m) + 2 * a.m * a.vy) / (a.m+b.m);
					a.vy = t1;
					b.vy = t2;

					// b.touched.down=true;
				} else {
					t1 = (a.vy * (a.m - b.m) + 2 * b.m * b.vy) / (a.m+b.m);
					t2 = (b.vy * (b.m - a.m) + 2 * a.m * a.vy) / (a.m+b.m);
					a.vy = t1;
					b.vy = t2;

					// a.touched.down=true;
				}			
			}
	}
		
	calcNxtPosi(frameTime, scale){
		this.vx += this.tax * frameTime;
		this.vy += this.tay * frameTime;
		this.x += this.vx * scale * frameTime;
		this.y += this.vy * scale * frameTime;
				
		this.vx /=1.003;
		// this.vy /=1.003;

		if(Math.abs(this.vx)<0.0001) this.vx = 0;//防止無限小
	}
}

// export {Item, MovableItem};