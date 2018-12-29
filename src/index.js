const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

const canvasCenterX = canvas.width / 2
const canvasCenterY = canvas.height / 2
const circleRadius = 100
const circleX = canvasCenterX
const circleY = canvasCenterY + 70

const oneDegreeAsRadian = 0.01745329

let currentRadian = 0
let numberOfRotations = 0

const ballRadius = 10
const ballStartX = 0
const ballStartY = circleY - circleRadius - 10
let ballMovementX = ballStartX
let ballMovementY = -2
let ballX = canvasCenterX
let ballY = ballStartY

function drawCircle(numberOfSections) {
	const sizeOfLine = (Math.PI * 2) / numberOfSections
	const sizeOfHole = 0.3141592653589793
	ctx.save()
	for (let i = 0; i < numberOfSections; i++) {
		const start = (i * sizeOfLine - currentRadian) + sizeOfHole
		const stop = (i === numberOfSections)
			? Math.PI * 2 - currentRadian
			: (i + 1) * sizeOfLine - currentRadian
		const color = (i + 1 === numberOfSections) ? 'red' : 'blue'
		drawArc(start, stop, color)
		ctx.stroke()
		ctx.closePath()
	}
	ctx.restore()
}

function drawArc(start, stop, color = 'blue') {
	ctx.beginPath()
	ctx.arc(circleX, circleY, circleRadius, start, stop)
	ctx.strokeStyle = color
}

function addRadian(baseRadian, numberToAdd) {
	const combinedRadian = baseRadian + numberToAdd
	return (baseRadian > 6.283185)
		? 0
		: combinedRadian
}

function writeScore(msg) {
	document.getElementById('score').innerText = msg
}

function drawBall() {
	ctx.beginPath()
	ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2)
	ctx.fillColor = 'black'
	ctx.fill()
	ctx.closePath()

	if ((ballY < 100) || (ballY > ballStartY)) {
		ballMovementY = -ballMovementY
	}

	ballX += ballMovementX
	ballY += ballMovementY
}

function ballCircleAreColliding() {
	const a2 = Math.pow(ballY - circleY, 2)
	const b2 = Math.pow(ballX - circleX, 2)
	const c2 = a2 + b2
	const distance = Math.sqrt(c2)

	return distance < ((ballRadius + circleRadius))
}

function rotate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	const sectionsForCircle = numberOfRotations + 2

	drawCircle(sectionsForCircle < 10 ? sectionsForCircle : 10)
	drawBall()

	if (ballCircleAreColliding()) {
		let message = ''
		const imageData = ctx.getImageData(circleX, circleY - circleRadius, 1, 1).data
		if (imageData.every(element => !element)) {
			writeScore(':(')
		} else {
			writeScore(numberOfRotations)
		}

	}

	currentRadian = addRadian(currentRadian, oneDegreeAsRadian)
	numberOfRotations = currentRadian === 0 ? numberOfRotations + 1 : numberOfRotations

	window.requestAnimationFrame(rotate)
}

rotate()
