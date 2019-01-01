// // @flow
import Game from './Game'

const canvas = document.getElementById('game')
const currentScoreElement = document.getElementById('current-score')
const highScoreElement = document.getElementById('high-score')
const playButtonElement = document.getElementById('play-button')

if (canvas instanceof HTMLCanvasElement &&
	currentScoreElement instanceof HTMLElement &&
	highScoreElement instanceof HTMLElement &&
	playButtonElement instanceof HTMLElement) {
	new Game({canvas, currentScoreElement, highScoreElement, playButtonElement})
}
