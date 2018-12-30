// @flow

export default class Game {
	canvas: HTMLElement | null
	ctx: CanvasRenderingContext2D
	canvasCenterX: number
	canvasCenterY: number
	circleRadius: number
	circleX: number
	circleY: number
	oneDegreeAsRadian: number
	currentRadian: number
	numberOfRotations: number
	ballRadius: number
	ballStartX: number
	ballStartY: number
	ballMovementX: number
	ballMovementY: number
	ballX: number
	ballY: number

	constructor() {
		this.canvas = document.getElementById("game")
		if (this.canvas instanceof HTMLCanvasElement && this.canvas.width && this.canvas.height) {
			this.ctx = this.canvas.getContext("2d")
			this.canvasCenterX = this.canvas.width / 2
			this.canvasCenterY = this.canvas.height / 2
			this.circleRadius = 100
			this.circleX = this.canvasCenterX
			this.circleY = this.canvasCenterY + 70
			this.oneDegreeAsRadian = 0.01745329
			this.currentRadian = 0
			this.numberOfRotations = 0
			this.ballRadius = 10
			this.ballStartX = 0
			this.ballStartY = this.circleY - this.circleRadius - 10
			this.ballMovementX = this.ballStartX
			this.ballMovementY = -2
			this.ballX = this.canvasCenterX
			this.ballY = this.ballStartY

			this.rotate()
		}
	}

	drawCircle = (numberOfSections: number) => {
		const sizeOfLine = (Math.PI * 2) / numberOfSections
		const sizeOfHole = 0.3141592653589793
		this.ctx.save()
		for (let i = 0; i < numberOfSections; i++) {
			const start = (i * sizeOfLine - this.currentRadian) + sizeOfHole
			const stop = (i === numberOfSections)
				? Math.PI * 2 - this.currentRadian
				: (i + 1) * sizeOfLine - this.currentRadian
			const color = (i + 1 === numberOfSections) ? 'red' : 'blue'
			this.drawArc(start, stop, color)
			this.ctx.stroke()
			this.ctx.closePath()
		}
		this.ctx.restore()
	}

	drawArc = (start: number, stop: number, color: string = 'blue') => {
		this.ctx.beginPath()
		this.ctx.arc(this.circleX, this.circleY, this.circleRadius, start, stop)
		this.ctx.strokeStyle = color
	}

	addRadian = (baseRadian: number, numberToAdd: number) => {
		const combinedRadian = baseRadian + numberToAdd
		return (baseRadian > 6.283185)
			? 0
			: combinedRadian
	}

	writeScore = (msg: string | number) => {
		const score = document.getElementById('score')
		if (score) {
			score.innerText = `${msg}`
		}
	}

	drawBall = () => {
		this.ctx.beginPath()
		this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2)
		this.ctx.fillColor = 'black'
		this.ctx.fill()
		this.ctx.closePath()

		if ((this.ballY < 100) || (this.ballY > this.ballStartY)) {
			this.ballMovementY = -this.ballMovementY
		}

		this.ballX += this.ballMovementX
		this.ballY += this.ballMovementY
	}

	ballCircleAreColliding = () => {
		const a2 = Math.pow(this.ballY - this.circleY, 2)
		const b2 = Math.pow(this.ballX - this.circleX, 2)
		const c2 = a2 + b2
		const distance = Math.sqrt(c2)

		return distance < ((this.ballRadius + this.circleRadius))
	}

	rotate = () => {
		console.log(this)
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

		const sectionsForCircle = this.numberOfRotations + 2

		this.drawCircle(sectionsForCircle < 10 ? sectionsForCircle : 10)
		this.drawBall()

		if (this.ballCircleAreColliding()) {
			let message = ''
			const imageData = this.ctx.getImageData(this.circleX, this.circleY - this.circleRadius, 1, 1).data
			if (imageData.every(element => !element)) {
				this.writeScore(':(')
			} else {
				this.writeScore(this.numberOfRotations)
			}

		}

		this.currentRadian = this.addRadian(this.currentRadian, this.oneDegreeAsRadian)
		this.numberOfRotations = this.currentRadian === 0 ? this.numberOfRotations + 1 : this.numberOfRotations

		window.requestAnimationFrame(this.rotate)
	}
}
