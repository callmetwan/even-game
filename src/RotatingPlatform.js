// @flow

type RotatingCirclePlatformConfig = {
	xPos: number,
	yPos: number,
	radius: number,
}

export default class RotatingPlatform {
	ctx: CanvasRenderingContext2D
	currentRadian: number
	numberOfRotations: number
	xPos: number
	yPos: number
	radius: number
	oneDegreeAsRadian: number

	constructor(ctx: CanvasRenderingContext2D, config: RotatingCirclePlatformConfig) {
		this.ctx = ctx
		this.currentRadian = 0
		this.numberOfRotations = 0
		this.xPos = config.xPos
		this.yPos = config.yPos
		this.radius = config.radius
		this.oneDegreeAsRadian = 0.01745329
	}

	render = (numberOfSections: number) => {
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

		this.currentRadian = this.addRadian(this.currentRadian, this.oneDegreeAsRadian)
		this.numberOfRotations = this.currentRadian === 0 ? this.numberOfRotations + 1 : this.numberOfRotations
	}

	drawArc = (start: number, stop: number, color: string = 'blue') => {
		this.ctx.beginPath()
		this.ctx.arc(this.xPos, this.yPos, this.radius, start, stop)
		this.ctx.strokeStyle = color
	}

	addRadian = (baseRadian: number, numberToAdd: number) => {
		const combinedRadian = baseRadian + numberToAdd
		return (baseRadian > 6.283185)
			? 0
			: combinedRadian
	}
}
