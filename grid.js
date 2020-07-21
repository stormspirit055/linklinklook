class Grid{
	constructor(x, y, type) {
		this.type = type
		this.x = x              // x坐
		this.y = y				// y坐标		
	}
	drawLine(ctx, comeDirection, goDirection) {
		ctx.beginPath()
		ctx.moveTo((this.x + 0.5) * GRID_WIDTH, (this.y + 0.5) * GRID_WIDTH)
		comeDirection && this.getLine(ctx, goDirection)
		goDirection && this.getLine(ctx, comeDirection)
		ctx.closePath()
		ctx.strokeStyle = "red";
		ctx.stroke();
	}
	getLine(ctx, direction) {
		direction += ''
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
