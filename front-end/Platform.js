// import {MapItem} from './MapItem.js';

class Platform extends MapItem{
	constructor(config){
		super(config);
	}

	onTouch(item, type){
		if(type==='up'){
			if(item.vy>0){
				item.vy = 0;
				item.y = this.x - item.height;
			}
		} else if(type==='down'){

		} else if(type==='left'){
			
		} else if(type==='right'){
			
		}
	}
}

// export {Platform};