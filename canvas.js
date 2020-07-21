
class Canvas {
	constructor(w, h) {
		const canv = document.querySelector('#my-canvas')
		const ctx = canv.getContext('2d')
		this.ctx = ctx
	}
	getCtx() {
		return this.ctx
	}
}