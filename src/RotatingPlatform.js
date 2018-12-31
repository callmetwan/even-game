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
		this.oneDegreeAsRadian = 0.01745329

		this.rotationHandlers = new Map()
		this.idIncrementer = 0
	}

	render = () => {
		const {ctx, numberOfSections, currentRadian, numberOfRotations, oneDegreeAsRadian} = this
		const sectionAmount = numberOfRotations + 2
		this.numberOfSections = (sectionAmount <= this.maxSections) ? sectionAmount : this.maxSections
		const sizeOfLine = (Math.PI * 2) / numberOfSections
		const sizeOfHole = 0.3141592653589793

		ctx.save()
		for (let i = 0; i < numberOfSections; i++) {
			const start = (i * sizeOfLine - currentRadian) + sizeOfHole
			const stop = (i === numberOfSections)
				? Math.PI * 2 - currentRadian
				: (i + 1) * sizeOfLine - currentRadian
			const color = (i + 1 === numberOfSections) ? 'red' : 'blue'
			this.drawArc(start, stop, color)
			ctx.stroke()
			ctx.closePath()
		}
		ctx.restore()

		this.handleRadianCalculation()
		this.handleRotation()
	}

	drawArc = (start: number, stop: number, color: string = 'blue') => {
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

	handleRotation = () => {
		if (this.currentRadian === 0) {
			this.numberOfRotations += 1
			this.rotationHandlers.forEach(handler => handler())
		}
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
