class Game{
	constructor() {
		this.log = new Log()
		this.initData()
		this.registerListener()
	}
	initData() {
		clearInterval(this.timer)
		this.cav = new Canvas()
		this.ctx = this.cav.getCtx()
		this.x = 20
		this.y = 20
		this.solveCount = 0
		this.totalTime =  600
		this.step = 600 / this.totalTime
		this.remainderTime = this.totalTime
		this.heroPositionMap = {}
		const displayTime = document.querySelector('#totalTime')
		const countdown = document.querySelector('#countdown')
		countdown.style.width = '600px'
		this.timer = setInterval(() => {
			this.remainderTime--
			countdown.style.width = (parseInt(countdown.style.width) - +(600 / this.totalTime).toFixed(1)) + 'px'
			displayTime.innerHTML = `剩余时间:${(this.remainderTime / 10).toFixed(1)}s`
			if (this.remainderTime === 0) this.gameOver('fail')
		}, 100)
		this.initHeroMap()
		this.generateMap()
		this.triggerLogHelper('GAME_START', '')
	}
	// 获取所有精灵数
	getTotal() {
		// 要除去四边的channel(航道)
		return this.x * this.y - 2 * (this.x + this.y) + 4
	}
	initHeroMap() {
		this.heroCountMap = {}
		const ramainCount = (this.getTotal() - this.solveCount) / 2
		const heroList = Object.keys(heroMap)
		const heroLength = heroList.length
		const groups = Math.floor(ramainCount / heroLength)
		const remainder = ramainCount % heroLength
		let point = 0
		while(point < heroLength) {
			if (point < remainder) {
				this.heroCountMap[heroList[point]] = groups * 2 + 2
			} else {
				this.heroCountMap[heroList[point]] = groups * 2
			}
			point++
		}
	}
 	registerListener() {
		this.selectArr = []
		const cav = document.getElementById('my-canvas')

		const minLeft = cav.offsetLeft
		const maxLeft = cav.offsetLeft + GRID_WIDTH * this.x
		const minTop = cav.offsetTop
		const maxTop = cav.offsetTop + GRID_WIDTH * this.y
		document.addEventListener('click', (e) => {
			console.log(e)
			if (e.pageX >= minLeft && e.pageX <= maxLeft && e.pageY >= minTop && e.pageY <= maxTop) {
				const position = this.computeSelect(e.pageX - cav.offsetLeft, e.pageY - cav.offsetTop)
				if (this.arr[position[1]][position[0]].type !== 'sprite') {
					console.log('无效点击')
					if (this.selectArr.length) {
						const pos = this.selectArr.pop()
						this.arr[pos[1]][pos[0]].isSelect = false
						this.arr[pos[1]][pos[0]].unDrawSelect(this.ctx)
					}
					return
				}
				if (this.selectArr.length === 1) {
					const first = this.selectArr[0]
					if (first[0] ===  position[0] && first[1] === position[1]) return 
				}
				this.selectArr.push(position)
				this.arr[position[1]][position[0]].isSelect = true
				this.arr[position[1]][position[0]].drawSelect(this.ctx)
				if (this.selectArr.length === 2) {
					const result = this.computePath(this.selectArr[0], this.selectArr[1])
					if (result) {
						this.handleCorrectMatch(result)
					} else {
						this.handleWrongMatch()
					}
				}
			}
		})
	}
	saveMap() {
		localStorage.setItem('llk_map', JSON.stringify(this.arr))
		localStorage.setItem('llk_solveCount', this.solveCount)
		localStorage.setItem('llk_heroPositionMap', JSON.stringify(this.heroPositionMap))
	}
	handleWrongMatch() {
		this.triggerLogHelper('MATCH_WRONG', ``)
		this.selectArr.forEach(v => {
			this.arr[v[1]][v[0]].unDrawSelect(this.ctx)
			this.arr[v[1]][v[0]].isSelect = false
		})
		this.selectArr = []
	}
	//  计算路径
	computePath(pos1, pos2) {
		let _this = this
		const spirit1 = this.arr[pos1[1]][pos1[0]]
		const spirit2 = this.arr[pos2[1]][pos2[0]]
		// 若选中的两个元素不一致, 则直接返回false
		if (spirit1.name !== spirit2.name) {
			return false
		}
		// 方向map 上右下左
		const dirMap = [[0, -1], [1, 0], [0, 1], [-1, 0]]
		const sx = pos1[0]
		const sy = pos1[1]
		const ex = pos2[0]
		const ey = pos2[1]
		let count = 0
		let flag = 0   // 标志是否已经产生解
		let resultPath // 最终解的全部路径
		
		const result = dfs(sx, sy, -1, count, [[sx, sy]])
		// 清除访问记录
		for(let i = 0; i < this.arr.length; i++) {
			for(let j = 0; j < this.arr[i].length; j++) {
				this.arr[i][j].visited = false
			}
		}
		if (result) {
			return resultPath
		} else {
			return false
		}
		// 判断边界
		function judge(x, y) {
			if (x >= 0 && y >= 0 && x < _this.x && y < _this.y) return true
			return false
		}
		/*
		@ sx 当前x坐标
		@ sy 当前y坐标
		@ direction 方向(初始方向为-1)
		@ count 拐弯次数
		@ path 记录路径 
		*/
		function dfs(x, y, direction, count, path) {
			// 如果已经有解, 则其他路径无需继续计算
			if (flag) return false
			// 拐弯次数达到3次返回false
			if(count === 3) {
				return false
			}
			// 剪枝, 当拐弯次数到达2次时意味着无法拐弯,拿当前点与结果点做对比, 可得出之后需要改变的方向, 如果此时方向与需要改变的方向不一致, 则返回false, 例如 当前点[1, 2] , 结果点[1. 3],可得出只能往右走. 
			if (count === 2) {
				if ((x === ex && y < ey && direction != 2) || (x === ex && y > ey && direction != 0) || (x > ex && y === ey && direction != 3) || (x < ex && y === ey && direction != 1)) return false
			}
			for (let i = 0; i < 4 ;i++) {
				let addDir = 0   // 标志是否需要改变方向
				const nextX = dirMap[i][0] + x
				const nextY = dirMap[i][1] + y
				// 边界判断
				if (nextX < 0 || nextX >= _this.x || nextY < 0 || nextY >= _this.y) {
					continue
				}
				// 如果当前点为起点, 或者与之前方向不一致, 则标志需要改变方向
				if (direction !== i && direction !== -1) addDir = 1
				// 因为每个点都4个方向, 访问过的点不能再回头
				if ( _this.arr[nextY][nextX].visited) {
					continue
				}
				// 跳出判断
				if ( _this.arr[nextY][nextX].type !== 'channel' ) {
					if (nextY === ey && nextX === ex && count + addDir < 3) {
						flag = 1
						path.push([nextX, nextY])
						// 保存结果路径
						resultPath = path
						return true
					}
					continue
				}
				// if (judge(nextX, nextY)) {
					// 标记访问过的点
					_this.arr[nextY][nextX].visited = true
					const newPath = path.slice()
					newPath.push([nextX, nextY])
					if (dfs(nextX, nextY, i ,count + addDir, newPath)) {
						return true
					}
					// 走到这步意味这条路已经失败了, 将之前标志过的点重置, 为另一条路做准备
					_this.arr[nextY][nextX].visited = false
				// } 
			}
			return false
		}
	}
	// 日志输出辅助函数
	triggerLogHelper(type, message) {
		this.log.triggerLog(type, message, (this.remainderTime / 10).toFixed(1) + '秒')
	}
	// 处理正确匹配情况
	handleCorrectMatch(resultPath) {
		const countdown = document.querySelector('#countdown')
		countdown.style.width = parseInt(countdown.style.width) + 3 * this.step + 'px'
		this.remainderTime += 3
		this.drawCorrectPath(resultPath)
		this.triggerLogHelper('MATCH_CORRECT', '')
		this.handleDelete2Pos()
		this.solveCount += 2
		this.selectArr = []
		if (this.solveCount === this.getTotal()) {
			// setTimeout(() => {
				this.gameOver('win')
			// }, 200)
		} else {
			if (this._computeHasSolution()) {
				console.log('剩余地图有解')
			} else {
				this.resetMap(this.arr)
			}
		}
	}
	// 重置地图
	resetMap() {
		this.triggerLogHelper('MAP_RESET', '')
		const ramainCount = (this.getTotal() - this.solveCount) / 2
		const heroList = Object.keys(heroMap)
		const heroLength = heroList.length
		const groups = Math.floor(ramainCount / heroLength)
		const remainder = ramainCount % heroLength
		// return
		while(!this._computeHasSolution()) {
			let point = 0
			while(point < heroLength) {
				if (point < remainder) {
					this.heroCountMap[heroList[point]] = groups * 2 + 2
				} else {
					this.heroCountMap[heroList[point]] = groups * 2
				}
				point++
			}
			Object.keys(this.heroPositionMap).forEach(v => {
				this.heroPositionMap[v] = []
			})
			for(let i = 0; i < this.arr.length;i++) {
				for(let j = 0; j < this.arr[i].length; j++) {
					if (this.arr[i][j].type === 'sprite') {
						const name = this.getRandomHero()
						this.arr[i][j].name = name
						this.heroPositionMap[name].push([j, i])
					}
				}
			}
		}
		this._updataCanvas()
	}
	// 恢复地图
	recoverMap(arr) {
		console.log('恢复地图')
		const newArr = []
		for(let i = 0; i < arr.length;i++) {
			const innerArr = []
			for(let j = 0; j < arr[i].length; j++) {
				if (arr[i][j].type === 'channel') {
					const channel = new Sprite(this.ctx, j, i, 'channel', false)
					innerArr.push(channel)
				}
				if (arr[i][j].type === 'sprite') {
					const sprite = new Sprite(this.ctx, j, i, 'sprite', arr[i][j].name, false)
					innerArr.push(sprite)
				}
			}
			newArr.push(innerArr)
		}
		return newArr
	}
	// 成功配对消除后, 从坐标map中删除
	handleDelete2Pos() {
		const pos1 = this.selectArr[0]
		const pos2 = this.selectArr[1]
		let heroName = this.arr[pos1[1]][pos1[0]].name
		let index1 = this.heroPositionMap[heroName].findIndex(v => {
			return v[0] === pos1[0] && v[1] === pos1[1]
		})
		this.heroPositionMap[heroName].splice(index1, 1)
		let index2 = this.heroPositionMap[heroName].findIndex(v => {
			return v[0] === pos2[0] && v[1] === pos2[1]
		})
		this.heroPositionMap[heroName].splice(index2, 1)
		this.selectArr = []
	}
	// 计算剩余地图是否还有解
	_computeHasSolution() {
		const keys = Object.keys(this.heroPositionMap)
		for (let i  = 0; i < keys.length; i++) {
			const list = this.heroPositionMap[keys[i]]
			if (!list.length) continue
			let point = 0
			while(point < list.length) {
				const pos1 = list[point]
				for(let j = point + 1; j < list.length; j++) {
					const result = this.computePath(pos1, list[j])
					if (result) {
						console.log('有解了')
						return result
					}
				}
				point++
			}
		}
		return false
	}
	gameOver(type) {
		clearInterval(this.timer)
		setTimeout(() => {
			switch(type) {
				case 'win': 
					this.handleWinGame()
					break;
				case 'fail': 
					this.handleLoseGame()
					break;
			}
		}, 200)
	}
	handleLoseGame() {
		this.triggerLogHelper('GAME_OVER', `菜鸡, 你输了`)
		const result = confirm(`菜鸡, 你输了`)
		if (result) this.initData()
	}
	handleWinGame() {
		this.triggerLogHelper('GAME_OVER', `牛逼的, 你赢了`)
		const result = confirm(`牛逼的, 你赢了, 耗时${(this.remainderTime / 10).toFixed(1)}秒`)
		if (result) this.initData()
	}
	handleCleanPath(resultPath) {
		resultPath.forEach(v => {
			this.arr[v[1]][v[0]].cleanWay(this.ctx)
		})
		
	}
	drawCorrectPath(resultPath) {
		const first = resultPath[0]
		const last = resultPath[resultPath.length - 1]
		this.arr[first[1]][first[0]].type = 'channel'
		this.arr[last[1]][last[0]].type = 'channel'
		for(let i = 0; i < resultPath.length; i++) {
			const cur = resultPath[i]
			if (i === 0) {
				const next = resultPath[i + 1]
				let go = this._judgeDir(cur, next, 'go')
				this.arr[cur[1]][cur[0]].drawWay(this.ctx, null, go)
			} else if (i === resultPath.length - 1) {
				const prev = resultPath[i - 1]
				let come = this._judgeDir(prev, cur, 'come')
				this.arr[cur[1]][cur[0]].drawWay(this.ctx, come, null)
			} else {
				const next = resultPath[i + 1]
				const prev = resultPath[i - 1]
				let come = this._judgeDir(prev, cur, 'come')
				let go = this._judgeDir(cur, next, 'go')
				this.arr[cur[1]][cur[0]].drawWay(this.ctx, come, go)
			}
		}
		setTimeout(() => {
			this.handleCleanPath(resultPath)
		}, 300) 
	}
	_judgeDir(prev, next, type) {
		if (type === 'go') {
			if (prev[0] === next[0]) {
				if (prev[1] < next[1]) {
					return 'b'
				} else {
					return 't'
				}
			} 
			if (prev[1] === next[1]) {
				if (prev[0] < next[0]) {
					return 'r'
				} else {
					return 'l'
				}
			} 
		} else {
			if (prev[0] === next[0]) {
				if (prev[1] < next[1]) {
					return 't'
				} else {
					return 'b'
				}
			} 
			if (prev[1] === next[1]) {
				if (prev[0] < next[0]) {
					return 'l'
				} else {
					return 'r'
				}
			} 
		}
		
	}
	drawSelect(position) {
		this.arr[position[0]][position[1]].drawSelect(this.ctx)
	}
	computeSelect(x, y) {
		return [Math.floor(x / GRID_WIDTH), Math.floor(y / GRID_WIDTH)]
	}
	generateMap() {
		if (localStorage.getItem('llk_map')) {
			const solveCount = JSON.parse(localStorage.getItem('llk_solveCount'))
			const arr = JSON.parse(localStorage.getItem('llk_map'))
			const heroPositionMap = JSON.parse(localStorage.getItem('llk_heroPositionMap'))
			this.arr = this.recoverMap(arr)
			this.solveCount = solveCount
			this.heroPositionMap = heroPositionMap
		} else {
			const arr = []
			for (let i = 0; i < this.y; i++) {
				const innerarr = []
				for (let j = 0; j < this.x; j++) {
					if (i ==0 || i == this.y - 1 || j== 0 || j == this.x - 1) {
						const channel = new Sprite(this.ctx, j, i, 'channel', false)
						innerarr.push(channel)	
					}else {
						let sprite
						const hero = this.getRandomHero()
						sprite = new Sprite(this.ctx, j, i, 'sprite', hero, false)
						if (this.heroPositionMap[hero]) {
							this.heroPositionMap[hero].push([j, i])
						} else {
							this.heroPositionMap[hero] = [[j, i]]
						}
						innerarr.push(sprite)	
					}
				}
				arr.push(innerarr)
			}
			this.arr = arr
		}
		if (this._computeHasSolution()) {
			this._updataCanvas()
		} else {
			this.resetMap(this.arr)
		}
	}
	getRandomHero() {
		const heroLength = Object.keys(heroMap).length
		let hero = ''
		while(!this.heroCountMap[hero] || this.heroCountMap[hero] === 0) {
			const randomHeroIndex = Math.floor(Math.random() * heroLength)
			 hero = Object.keys(heroMap)[randomHeroIndex]
		}
		this.heroCountMap[hero]--
		return hero
	}
	drawSpirit() {
		this.arr.forEach(arr => {
			arr.forEach(v => {
				if (v.type === 'sprite') v.draw(this.ctx)
			})
		})
	}
	prompt() {
		const path = this._computeHasSolution()
		const first = path[0]
		const last = path[path.length - 1]
		console.log(first, last)
		this.arr[first[1]][first[0]].drawPrompt(this.ctx)
		this.arr[last[1]][last[0]].drawPrompt(this.ctx)
	}
	_updataCanvas() {
		this.drawSpirit()
  }
}