// @flow
import Ball from './Ball'
import RotatingPlatform from './RotatingPlatform'

type GameConfig = {
	canvas: HTMLCanvasElement,
	score: HTMLElement
}

export default class Game {
	canvas: HTMLElement | null
	ctx: CanvasRenderingContext2D

	ball: Ball
	rotatingPlatform: RotatingPlatform

	canvasCenterX: number
	canvasCenterY: number

	constructor(config: GameConfig) {
		this.canvas = config.canvas
		this.ctx = this.canvas.getContext('2d')
		this.canvasCenterX = this.canvas.width / 2
		this.canvasCenterY = this.canvas.height / 2

		this.rotatingPlatform = new RotatingPlatform(this.ctx, {
			xPos: this.canvasCenterX,
			yPos: this.canvasCenterY + 70,
			radius: 100,
		})
		
		this.ball = new Ball(this.ctx, {
			xPos: this.canvasCenterX,
			yPos: this.rotatingPlatform.yPos - this.rotatingPlatform.radius - 10,
			radius: 10,
		})
	}

	writeScore = (msg: string | number) => {
		const score = document.getElementById('score')
		if (score) {
			score.innerText = `${msg}`
		}
	}

	ballCircleAreColliding = () => {
		const a2 = Math.pow(this.ball.yPos - this.rotatingPlatform.yPos, 2)
		const b2 = Math.pow(this.ball.xPos - this.rotatingPlatform.xPos, 2)
		const c2 = a2 + b2
		const distance = Math.sqrt(c2)

		return distance < ((this.ball.radius + this.rotatingPlatform.radius))
	}

	render = () => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		const sectionsForCircle = this.rotatingPlatform.numberOfRotations + 2

		this.rotatingPlatform.render(sectionsForCircle)
		this.ball.render()

		if (this.ballCircleAreColliding()) {
			const imageData = this.ctx.getImageData(
				this.rotatingPlatform.xPos,
				this.rotatingPlatform.yPos - this.rotatingPlatform.radius,
				1,
				1).data
			if (imageData.every(element => !element)) {
				this.writeScore(':(')
			} else {
				this.writeScore(this.rotatingPlatform.numberOfRotations)
			}

		}

		window.requestAnimationFrame(this.render)
	}
}
