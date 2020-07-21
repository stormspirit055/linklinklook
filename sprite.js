class Sprite extends Grid{
	constructor(ctx, x, y, type, name, isSelect) {
		super(x, y, type)
		this.ctx = ctx
		this.name = name
		this.isSelect = isSelect
	}
	draw(ctx) {
		this.fillGrid(ctx)
	}
	fillGrid(ctx) {
		const img = new Image(GRID_WIDTH, GRID_WIDTH);
		const imgSrc = `./images/${this.name}.jpg`
		img.src = imgSrc;
		img.onload = () => {
			ctx.drawImage(img, GRID_WIDTH * (this.x), GRID_WIDTH * (this.y), GRID_WIDTH, GRID_WIDTH)	
			if(this.isSelect) this.drawSelect(ctx)
		}		
	}
	drawWay(ctx,come, go) {
		this.drawLine(ctx, go, come)
	}
	cleanWay(ctx){
		ctx.clearRect(this.x * GRID_WIDTH,this.y * GRID_WIDTH,GRID_WIDTH,GRID_WIDTH);  
	}
 	drawSelect(ctx) {
		ctx.beginPath()
		ctx.moveTo(this.x * GRID_WIDTH + 0.5, this.y * GRID_WIDTH + 0.5)
		ctx.lineTo((this.x + 1) * GRID_WIDTH - 0.5, this.y * GRID_WIDTH + 0.5)
		ctx.lineTo((this.x + 1) * GRID_WIDTH - 0.5, (this.y + 1) * GRID_WIDTH - 0.5)
		ctx.lineTo((this.x) * GRID_WIDTH + 0.5, (this.y + 1) * GRID_WIDTH - 0.5)
		ctx.lineTo(this.x * GRID_WIDTH + 0.5, this.y * GRID_WIDTH + 0.5)
		ctx.strokeStyle = "red";
		ctx.stroke();
	}
	unDrawSelect(ctx) {
		this.fillGrid(ctx)
	}
	drawPrompt(ctx) {
		ctx.fillStyle = 'rgba(206, 35, 9, .3)'
		ctx.beginPath();
		ctx.fillRect(this.x * GRID_WIDTH, this.y * GRID_WIDTH, GRID_WIDTH, GRID_WIDTH);
		ctx.fill();
	}
}