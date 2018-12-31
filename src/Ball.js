// @flow

type BallConfig = {
	xPos: number,
	yPos: number,
	radius: number,
}

export default class Ball {
	ctx: CanvasRenderingContext2D
	xPos: number
	yPos: number
	radius: number
	xPosStart: number
	yPosStart: number
	ballMovementX: number
	ballMovementY: number
	radius: number

	constructor(ctx: CanvasRenderingContext2D, config: BallConfig) {
		this.ctx = ctx
		this.xPosStart = config.xPos
		this.yPosStart = config.yPos
		this.ballMovementX = 0
		this.ballMovementY = -1
		this.xPos = this.xPosStart
		this.yPos = this.yPosStart
		this.radius = config.radius
	}

	render() {
		const ctx = this.ctx
		ctx.beginPath()
		ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2)
		ctx.fillStyle = 'black'
		ctx.fill()
		ctx.closePath()


		if ((this.yPos < 100) || (this.yPos > this.yPosStart)) {
			this.ballMovementY = -this.ballMovementY
		}
		this.xPos += this.ballMovementX
		this.yPos += this.ballMovementY
	}
}
