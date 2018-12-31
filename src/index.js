// // @flow
import Game from './Game'
const canvas = document.getElementById('game')
const score = document.getElementById('score')
if(canvas instanceof HTMLCanvasElement && score instanceof HTMLElement) {
	new Game({canvas, score}).render()
}
