// // @flow
import Game from './Game'
const canvas = document.getElementById('game')
const scoreElement = document.getElementById('score')
if(canvas instanceof HTMLCanvasElement && scoreElement instanceof HTMLElement) {
	new Game({canvas, scoreElement}).render()
}
