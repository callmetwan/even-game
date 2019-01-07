// @flow

type RotatingCirclePlatformConfig = {
	xPos: number,
	yPos: number,
	radius: number,
	maxSections: number,
}

export default class RotatingPlatform {
	ctx: CanvasRenderingContext2D

	radius: number
	xPos: number
	yPos: number

	maxSections: number
	numberOfSections: number
	startRadian: number
	currentRadian: number
	numberOfRotations: number
	oneDegreeAsRadian: number

	idIncrementer: number
	colors: Array<string>
	startingHoleRotationValue: number

	constructor(ctx: CanvasRenderingContext2D, config: RotatingCirclePlatformConfig) {
		this.ctx = ctx

		this.radius = config.radius
		this.xPos = config.xPos
		this.yPos = config.yPos

		this.maxSections = config.maxSections
		this.numberOfSections = 2
		this.startRadian = 0
		this.currentRadian = this.startRadian
		this.numberOfRotations = 0
		this.oneDegreeAsRadian = 0.017453292519943295
		this.startingHoleRotationValue = (120 * Math.PI / 180)

		this.idIncrementer = 0
		this.colors = ['#762973', '#495900']
	}

	render = (freeze?: boolean) => {
		const {numberOfRotations, maxSections} = this
		const sectionAmount = numberOfRotations + 1

		this.numberOfSections = (sectionAmount <= maxSections)
			? sectionAmount :
			this.maxSections

		this.adjustForStartingPosition(-this.startingHoleRotationValue)
		this.drawPlatform()
		this.adjustForStartingPosition(this.startingHoleRotationValue)

		if (!freeze) {
			this.handleRadianCalculation()
			this.handleRotation()
		}
	}

	adjustForStartingPosition = (rotationValue: number) => {
		// Rotates canvas so initial hole/pit is in the desired
		// starting position. Rotate back so remainder of canvas appears normal.
		this.ctx.translate(this.xPos, this.yPos)
		this.ctx.rotate(rotationValue)
		this.ctx.translate(-this.xPos, -this.yPos)
	}

	drawPlatform = () => {
		const {ctx, numberOfSections, currentRadian} = this
		const sizeOfLine = (Math.PI * 2) / numberOfSections
		const sizeOfHole = 0.3141592653589793

		for (let i = 0; i < numberOfSections; i++) {
			const color = this.colors[i % 2]
			const start = (i * sizeOfLine - currentRadian) + sizeOfHole
			const stop = (i === numberOfSections)
				? Math.PI * 2 - currentRadian
				: (i + 1) * sizeOfLine - currentRadian
			this.drawArc(start, stop, color)
			ctx.stroke()
			ctx.closePath()
		}
	}

	drawArc = (start: number, stop: number, color: string) => {
		this.ctx.beginPath()
		this.ctx.arc(this.xPos, this.yPos, this.radius, start, stop)
		this.ctx.strokeStyle = color
	}

	handleRadianCalculation = (reset?: boolean) => {
		let radianStartVal = this.currentRadian
		let incrementer = this.oneDegreeAsRadian

		if (reset) {
			radianStartVal = 0
			incrementer = 0
		}

		const combinedRadian = radianStartVal + incrementer
		this.currentRadian = (combinedRadian > 6.283185)
			? 0
			: combinedRadian
	}

	handleRotation = (reset?: boolean) => {
		if (reset) {
			this.numberOfRotations = 0
		} else if (this.currentRadian === 0) {
			this.numberOfRotations += 1
		}
	}

	reset = () => {
		this.handleRadianCalculation(true)
		this.handleRotation(true)
	}
}
