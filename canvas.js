
class Canvas {
	constructor(w, h) {
		this.canv = document.querySelector('#my-canvas')
		this.ctx = this.canv.getContext('2d')
		console.log(this.ctx)
	}
	getCtx() {
		return this.ctx
	}
}