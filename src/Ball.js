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
	radius: number
	shouldMove: boolean

	constructor(ctx: CanvasRenderingContext2D, config: BallConfig) {
		const {xPos, yPos, radius, keybind = 'Space'} = config

		this.ctx = ctx
		this.xPosStart = config.xPos
		this.yPosStart = config.yPos
		this.ballMovementX = 0
		this.ballMovementY = -2
		this.xPos = this.xPosStart
		this.yPos = this.yPosStart
		this.radius = config.radius
		this.shouldMove = false

		document.addEventListener("keydown", this.keyDownHandler, false);
	}

	render() {
		const ctx = this.ctx
		ctx.beginPath()
		ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2)
		ctx.fillStyle = 'black'
		ctx.fill()
		ctx.closePath()

		if ((this.yPos < 100)) {
			this.reverseBallMovement()
		}

		if(this.shouldMove) {
			this.xPos += this.ballMovementX
			this.yPos += this.ballMovementY
		}

		if((this.yPos > this.yPosStart)) {
			this.shouldMove = false
			this.reverseBallMovement()
			this.yPos += this.ballMovementY
		}
	}

	keyDownHandler = (event: KeyboardEvent) => {
		console.log(event)
		if(event.key === " ") {
			console.log('set to true')
			this.shouldMove = true;
		}
	}

	reverseBallMovement() {
		this.ballMovementY = -this.ballMovementY
	}
}
