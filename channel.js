class Channel extends Grid{
	constructor(x, y, type) {
		super(x, y, type)
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