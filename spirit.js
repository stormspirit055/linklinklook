class Spirit extends Grid{
	constructor(ctx, x, y, type, name, isSelect) {
		super(x, y, type)
		// if (type == 'block') this.drawBg(ctx)
		this.ctx = ctx
		this.name = name
		this.isSelect = isSelect
	}
	draw(ctx) {
		if (this.type === 'block') {
			this.drawBg(ctx)
		}
		if (this.type === 'spirit') {
			this.fillGrid(ctx)
			console.log(this.isSelect)
			if (this.isSelect) {
				this.drawSelect(ctx)
			}
		}
	}
	fillGrid(ctx) {
		const img = new Image(GRID_WIDTH, GRID_WIDTH);
		const imgSrc = `./images/${this.name}.jpg`
		img.src = imgSrc;
		img.onload = () => {
			ctx.drawImage(img, GRID_WIDTH*(this.x), GRID_WIDTH*(this.y), GRID_WIDTH, GRID_WIDTH)	
		}	
	}
	drawSelect(ctx) {
		console.log(1)
		ctx.beginPath()
		ctx.moveTo(this.x * GRID_WIDTH + 0.5, this.y * GRID_WIDTH + 0.5)
		ctx.lineTo((this.x + 1) * GRID_WIDTH - 0.5, this.y * GRID_WIDTH + 0.5)
		ctx.lineTo((this.x + 1) * GRID_WIDTH - 0.5, (this.y + 1) * GRID_WIDTH - 0.5)
		ctx.lineTo((this.x) * GRID_WIDTH + 0.5, (this.y + 1) * GRID_WIDTH - 0.5)
		ctx.lineTo(this.x * GRID_WIDTH + 0.5, this.y * GRID_WIDTH + 0.5)
		ctx.strokeStyle = "red";//设置线条颜色
		ctx.stroke();//用于绘制线条
	}
	drawBg(ctx) {
		ctx.fillStyle = '000'
		ctx.fillRect(this.x * GRID_WIDTH, this.y * GRID_WIDTH, GRID_WIDTH, GRID_WIDTH)
	}
	drawLine(ctx, goDirection, comeDirection) {
		ctx.beginPath()
		ctx.moveTo((this.x + 0.5) * GRID_WIDTH, (this.y + 0.5) * GRID_WIDTH)
		this.getLine(ctx, goDirection)
		this.getLine(ctx, comeDirection)
		ctx.closePath()
     	ctx.strokeStyle = "red";//设置线条颜色
        ctx.stroke();//用于绘制线条
	}
	getLine(ctx, direction) {
		switch (direction) {
			case 't':
				ctx.lineTo((this.x + 0.5) * GRID_WIDTH, (this.y) * GRID_WIDTH)
				break;
			case 'b':
				ctx.lineTo((this.x + 0.5) * GRID_WIDTH, (this.y + 1) * GRID_WIDTH)
				break;
			case 'l':
				ctx.lineTo((this.x) * GRID_WIDTH, (this.y + 0.5) * GRID_WIDTH)
				break;
			case 'r':
				ctx.lineTo((this.x + 1) * GRID_WIDTH, (this.y + 0.5) * GRID_WIDTH)
				break;

		}
		ctx.moveTo((this.x + 0.5) * GRID_WIDTH, (this.y + 0.5) * GRID_WIDTH)
	}
}