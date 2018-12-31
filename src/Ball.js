// @flow

type BallConfig = {
	xPos: number,
	yPos: number,
	radius: number,
	keybind?: string
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
	peakBallMovementY: number
	radius: number
	shouldMove: boolean

	constructor(ctx: CanvasRenderingContext2D, config: BallConfig) {
		const {xPos, yPos, radius} = config

		this.ctx = ctx
		this.xPosStart = xPos
		this.yPosStart = yPos
		this.ballMovementX = 0
		this.ballMovementY = -2.5
		this.xPos = this.xPosStart
		this.yPos = this.yPosStart
		this.peakBallMovementY = this.yPosStart - 50
		this.radius = radius
		this.shouldMove = false
	}

	render() {
		this.drawBall()

		if (this.ballReachedPeakHeight()) {
			this.reverseBallDirection()
		}

		if(this.shouldMove) {
			this.moveBall()
		}

		if(this.ballHasLanded()) {
			this.handleBallLanding()
		}
	}

	drawBall() {
		const ctx = this.ctx
		ctx.beginPath()
		ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2)
		ctx.fillStyle = 'black'
		ctx.fill()
		ctx.closePath()
	}

	ballReachedPeakHeight() {
		return this.yPos < this.peakBallMovementY
	}

	ballHasLanded() {
		return this.yPos > this.yPosStart
	}

	reverseBallDirection() {
		this.ballMovementY = -this.ballMovementY
	}

	moveBall() {
		this.xPos += this.ballMovementX
		this.yPos += this.ballMovementY
	}

	handleBallLanding() {
		this.shouldMove = false
		this.reverseBallDirection()
		this.yPos += this.ballMovementY
	}

	ballMovementHandler = (event: KeyboardEvent) => {
		this.shouldMove = true;
	}
}
