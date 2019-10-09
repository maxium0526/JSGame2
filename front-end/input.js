class Input{
	constructor(config){
		this.config = config;

		this.numHistory = config.numHistory || 1;
		this.recordSize = config.recordSize || 300;

		this.inputHistory = [];

		this.init();
	}
	init(){
		for(let i=0; i<this.numHistory+1; i++){
			let input = [];
			for(let j=0; j<this.recordSize;j++){
				input.push(false);
			}
			this.inputHistory.push(input);
		}
	}	
	keyDown(kc){
		this.inputHistory[0][kc] = true;
	}
	keyUp(kc){
		this.inputHistory[0][kc] = false;

	}
	getState(kc){
		return this.inputHistory[0][kc];
	}
	isPressed(kc){
		return this.inputHistory[0][kc]===true && this.inputHistory[1][kc]===false;		
	}

	isReleased(kc){
		return this.inputHistory[0][kc]===false && this.inputHistory[1][kc]===true;
	}

	getMousePosi(canvas,e){
		var canvasPosi = canvas.getBoundingClientRect();
		var x = e.clientX - canvasPosi.left;
		var y = e.clientY - canvasPosi.top;
		
		return [x,y];
	}
	tick(){
		let lastHistory = this.inputHistory.pop();
		let input = [];
		this.inputHistory.unshift(lastHistory);	
		for(let i=0;i<this.recordSize;i++){
			this.inputHistory[0][i] = this.inputHistory[1][i];
		}
	}
}