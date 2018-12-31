export default class Ball {
	constructor(ctx, config) {
		this.ctx = ctx
		this.ballStartX = config.ballStartX
		this.ballStartY = config.ballStartY
		this.ballMovementX = 0
		this.ballMovementY = -1
		this.ballX = this.ballStartX
		this.ballY = this.ballStartY
		this.ballRadius = 10
		this.canvas = document.getElementById("game")
		this.ctx = this.canvas.getContext("2d")

	}

	render() {
		const ctx = this.ctx
		ctx.beginPath()
		ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2)
		ctx.fillStyle = 'black'
		ctx.fill()
		ctx.closePath()


		if ((this.ballY < 100) || (this.ballY > this.ballStartY)) {
			this.ballMovementY = -this.ballMovementY
		}
		this.ballX += this.ballMovementX
		this.ballY += this.ballMovementY
	}
}
