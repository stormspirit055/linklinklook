class Way{
	constructor(startP, endP, arr) {
		this.inflect = 0
		this.startP = startP
		this.currentP = {}
		this.endP = endP
		this.direction = 'l'
		this.nextP = {}
		this.line = [this.startP]
		this.turnCount = -1
		this.arr = arr
		this.findWay(startP, endP, arr)
	}
	findWay(startP, endP, arr) {
		// let result = []
		// function dfs(startP){
		// 	if
		// }
		console.log(arr)
	}
}