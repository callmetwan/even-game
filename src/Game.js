// @flow
import Ball from './Ball'
import RotatingPlatform from './RotatingPlatform'

type GameConfig = {
	canvas: HTMLCanvasElement,
	currentScoreElement: HTMLElement,
	highScoreElement: HTMLElement,
	playButtonElement: HTMLElement,
}

export default class Game {
	canvas: HTMLCanvasElement
	currentScoreElement: HTMLElement
	highScoreElement: HTMLElement
	playButtonElement: HTMLElement
	ctx: CanvasRenderingContext2D

	ball: Ball
	rotatingPlatform: RotatingPlatform

	canvasCenterX: number
	canvasCenterY: number

	userFailed: boolean

	currentScore: string | number
	highScore: number

	constructor(config: GameConfig) {
		this.userFailed = false
		this.currentScoreElement = config.currentScoreElement
		this.highScoreElement = config.highScoreElement
		this.playButtonElement = config.playButtonElement
		this.canvas = config.canvas
		this.ctx = this.canvas.getContext('2d')
		this.canvasCenterX = this.canvas.width / 2
		this.canvasCenterY = this.canvas.height / 2
		this.currentScore = '0'
		this.highScore = 0

		this.rotatingPlatform = new RotatingPlatform(this.ctx, {
			xPos: this.canvasCenterX,
			yPos: this.canvasCenterY + 45,
			radius: 150,
			maxSections: 10,
		})

		const ballRadius = 10

		this.ball = new Ball(this.ctx, {
			radius: ballRadius,
			xPos: this.canvasCenterX,
			yPos: this.rotatingPlatform.yPos - this.rotatingPlatform.radius - ballRadius,
		})

		this.playButtonElement.onclick = this.render
	}

	render = () => {
		this.rotatingPlatform.reset()
		this.setupKeypressHandlers()
		this.setupDOM()
		this.drawGame()
	}

	drawGame = () => {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.rotatingPlatform.render(this.userFailed)
			this.ball.render(this.userFailed)
			this.updateUserStatus()
			this.handleScore()

		window.requestAnimationFrame(this.drawGame)
	}

	updateUserStatus() {
		if (this.ballIsColliding() && !this.userFailed) {
			const imageData = this.ctx.getImageData(
				this.rotatingPlatform.xPos,
				this.rotatingPlatform.yPos - this.rotatingPlatform.radius,
				1,
				1).data

			if (imageData.every(element => !element)) {
				this.userFailed = true
				this.onUserFailed()
			}
		}
	}

	handleScore = () => {
		if (this.ballIsColliding()) {
			const {numberOfRotations} = this.rotatingPlatform
			let score = numberOfRotations

			if (this.userFailed) {
				score = ':('
			}

			if (this.currentScore !== score) {
				// writing to the DOM is slow, only do so when necessary
				this.currentScore = score
				this.currentScoreElement.innerText = `${score}`
				this.handleHighScore()
			}
		}
	}

	handleHighScore = () => {
		if (typeof this.currentScore === 'number' && this.currentScore > this.highScore) {
			this.highScore = this.currentScore
			this.highScoreElement.innerText = `${this.highScore}`
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

	onUserFailed = () => {
		this.playButtonElement.style.display = 'block'
	}

	onPlayAgain = () => {
		this.playButtonElement.style.display = 'none'
		this.userFailed = false
		this.rotatingPlatform.reset()
	}

	setupDOM = () => {
		this.canvas.style.display = 'block'
		this.playButtonElement.style.display = 'none'
		this.playButtonElement.innerText = 'Play Again'
	}

	setupKeypressHandlers = () => {
		this.playButtonElement.onclick = this.onPlayAgain

		document.addEventListener("keydown", (event: KeyboardEvent) => {
			if (event.key === " " && !this.userFailed) {
				this.ball.ballMovementHandler()
			}
		})

		document.addEventListener('touchstart', () => {
			this.ball.ballMovementHandler()
		})
	}
}
