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

	rotationHandlers: Map<number, () => any>
	idIncrementer: number
	colors: Array<string>
	startingHoleRotationValue: number
	hasSkippedFirstRotation: boolean

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

		this.rotationHandlers = new Map()
		this.idIncrementer = 0

		this.hasSkippedFirstRotation = false

		this.startingHoleRotationValue = (120 * Math.PI / 180)

		this.colors = ['#762973', '#495900']
	}

	render = (freeze?: boolean) => {
		const {ctx, numberOfRotations, maxSections} = this
		const rotationPosX = this.xPos
		const rotationPosY = this.yPos
		const sectionAmount = numberOfRotations + 1

		this.numberOfSections = (sectionAmount <= maxSections)
			? sectionAmount :
			this.maxSections

		ctx.translate(rotationPosX, rotationPosY)
		ctx.rotate(-this.startingHoleRotationValue)
		ctx.translate(-rotationPosX, -rotationPosY)

		this.drawPlatform()

		ctx.translate(rotationPosX, rotationPosY)
		ctx.rotate(this.startingHoleRotationValue)
		ctx.translate(-rotationPosX, -rotationPosY)

		if (!freeze) {
			this.handleRadianCalculation()
			this.handleRotation()
		}
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
		let incrementor = this.oneDegreeAsRadian

		if (reset) {
			radianStartVal = 0
			incrementor = 0
		}

		const combinedRadian = radianStartVal + incrementor
		this.currentRadian = (combinedRadian > 6.283185)
			? 0
			: combinedRadian
	}

	handleRotation = (reset?: boolean) => {
		if (reset) {
			this.numberOfRotations = 0
		} else if (this.currentRadian === 0) {
			this.numberOfRotations += 1
			this.rotationHandlers.forEach(handler => handler())
		}
	}

	reset = () => {
		this.handleRadianCalculation(true)
		this.handleRotation(true)
	}

	subscribeOnRotation = (func: () => any): number => {
		this.idIncrementer++
		this.rotationHandlers.set(this.idIncrementer, func)
		return this.idIncrementer
	}

	unsubscribeOnRotation = (handlerId: number) => {
		this.rotationHandlers.delete(handlerId)
	}
}
