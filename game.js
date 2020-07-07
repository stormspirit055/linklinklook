class Game{
	constructor(obj) {
		this.cav = new Canvas()
		this.ctx = this.cav.getCtx()
		this.x = obj.x + 2 || 42   // 宽度
		this.y = obj.y + 2 || 32   // 长度
		this.start()
		this._updataCanvas()
		this.selectArr = []
		const cav = document.getElementById('my-canvas')
		let cavRect = cav.getBoundingClientRect()
		const minLeft = cavRect.left + GRID_WIDTH * 1
		const maxLeft = cavRect.left + GRID_WIDTH * 7
		const minTop = cavRect.top + GRID_WIDTH * 1
		const maxTop = cavRect.top + GRID_WIDTH * 7
		document.addEventListener('click', (e) => {
			if (e.x >= minLeft && e.x <= maxLeft && e.y >= minTop && e.y <= maxTop) {
				const position = this.computeSelect(e.x - cavRect.left, e.y - cavRect.top)
				this.selectArr.push(position)
				this.arr[position[0]][position[1]].isSelect = true
				if (this.selectArr.length > 2) {
					const shiftPosistion = this.selectArr.shift()
					this.arr[shiftPosistion[0]][shiftPosistion[1]].isSelect = false
					this.computePath()
				}
			}
		})
	}
	unDrawSelect(position) {
		this.arr[position[0]][position[1]].unDrawSelect(this.ctx)
	}
	computePath() {
		console.log('计算路径')
	}
	drawSelect(position) {
		this.arr[position[0]][position[1]].drawSelect(this.ctx)
	}
	computeSelect(x, y) {
		return [Math.floor(x / GRID_WIDTH), Math.floor(y / GRID_WIDTH)]
	}
	start() {
		const arr = []
		for (let i = 0; i < this.x; i++) {
			const innerarr = []
			for (let j = 0; j < this.y; j++) {
				if (i ==0 || i == this.x - 1 || j== 0 || j == this.y - 1) {
					const block = new Spirit(this.ctx, i, j, 'block', false)
					innerarr.push(block)	
				} else if (i ==1 || i == this.x - 2 || j== 1 || j == this.y - 2) {
					const channel = new Spirit(this.ctx, i, j, 'channel', false)
					innerarr.push(channel)	
				} else {
					let spirit
					if (Math.random() > 0.5 ) {
						 spirit = new Spirit(this.ctx, i, j, 'spirit', heroList[Math.floor(Math.random() * 10)], false)
					} else {
						 spirit = new Spirit(this.ctx, i, j, 'channel', false)
					}
					
					// spirit.fillGrid(this.ctx)
					innerarr.push(spirit)	
				}
			}
			arr.push(innerarr)
		}
		this.arr = arr
	}
	drawSpirit() {
		this.arr.forEach(arr => {
			arr.forEach(v => {
				v.draw(this.ctx)
			})
		})
	}
	_updataCanvas() {
    // this.timer = setTimeout(() => {
      this.drawSpirit()
    //   this._updataCanvas()
    // }, 200)
  }
}