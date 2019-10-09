// import {Item} from './Item.js';

class Field extends Item{
	constructor(config){
		super(config);
		this.fEffects = config.fEffects || {};
	}

	onTouch(item, type){
		if(item.constructor.name==="Player"){
			if(type==="up"){
					// if(this.fEffects.up){
					
					// }
			} else if(type==="down"){				
					
			} else if(type==="left"){
					
			} else if(type==="right"){
					
			}
				item.tfy += -9.8;
				
		} else if(item.constructor.name==="MovableItem"){
			if(type==="up"){
				
			} else if(type==="down"){				
					
			} else if(type==="left"){
					
			} else if(type==="right"){
					
			}
			item.tfy += -9.8;
		}
	}
}

// export {Field};