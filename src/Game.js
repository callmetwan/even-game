// @flow
import Ball from './Ball'
import RotatingPlatform from './RotatingPlatform'

type GameConfig = {
	canvas: HTMLCanvasElement,
	scoreElement: HTMLElement
}

export default class Game {
	scoreElement: HTMLElement
	canvas: HTMLElement | null
	ctx: CanvasRenderingContext2D

	ball: Ball
	rotatingPlatform: RotatingPlatform

	canvasCenterX: number
	canvasCenterY: number

	constructor(config: GameConfig) {
		this.scoreElement = config.scoreElement
		this.canvas = config.canvas
		this.ctx = this.canvas.getContext('2d')
		this.canvasCenterX = this.canvas.width / 2
		this.canvasCenterY = this.canvas.height / 2

		this.rotatingPlatform = new RotatingPlatform(this.ctx, {
			xPos: this.canvasCenterX,
			yPos: this.canvasCenterY + 70,
			radius: 100,
			maxSections: 10,
		})

		this.ball = new Ball(this.ctx, {
			xPos: this.canvasCenterX,
			yPos: this.rotatingPlatform.yPos - this.rotatingPlatform.radius - 10,
			radius: 10,
		})
	}

	handleScore = () => {
		if (this.ballIsColliding()) {
			let msg = this.rotatingPlatform.numberOfRotations
			
			const imageData = this.ctx.getImageData(
				this.rotatingPlatform.xPos,
				this.rotatingPlatform.yPos - this.rotatingPlatform.radius,
				1,
				1).data

			if (imageData.every(element => !element)) {
				msg = ':('
			}

			this.scoreElement.innerText = `${msg}`
		}
	}

	ballIsColliding = (): boolean => {
		// ball at a standstill can fall in and thus should be considered colliding so we offset by one
		// we don't offeset the actual position because we don't want the ball visually overlayed atop platform
		const ballY = this.ball.yPos + 1
		const a2 = Math.pow(ballY - this.rotatingPlatform.yPos, 2)
		const b2 = Math.pow(this.ball.xPos - this.rotatingPlatform.xPos, 2)
		const c2 = a2 + b2
		const distance = Math.sqrt(c2)

		return distance < ((this.ball.radius + this.rotatingPlatform.radius))
	}

	render = () => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

		this.rotatingPlatform.render()
		this.ball.render()
		this.handleScore()

		window.requestAnimationFrame(this.render)
	}
}
