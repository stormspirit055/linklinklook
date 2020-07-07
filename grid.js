class Grid{
	constructor(x, y, type) {
		this.type = type
		this.x = x              // x坐
		this.y = y				// y坐标		
		this.direction = '',	// 当前方向
		this.prevdirection		// 之前方向	
		this.directionMap = {   // 剩余可选择方向
			t: false,
			l: false,
			b: false,
			r: false
		}
		this.directionArr = ['t','l','b','r'] //剩余可选择方向
	}
}
