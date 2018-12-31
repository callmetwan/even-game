// // @flow
import Game from './Game'
const canvas = document.getElementById('game')

if(canvas instanceof HTMLCanvasElement) {
	new Game(canvas).render()
}
