import { Game } from "./game.js"

let game;
let raf;

function _step(timestamp) {
	if (game.update(timestamp)) {
		raf = window.requestAnimationFrame(_step);
	}
}

function _run() {
	if (game === undefined) {
		game = new Game(performance.now());
	}

	const width = window.innerWidth;
	const height = window.innerHeight;

	const layer_game = document.getElementById("game-layer");
	const layer_background = document.getElementById("background-layer");
	const layer_ui = document.getElementById("ui-layer");

	const ctx = layer_game.getContext("2d");
	const bg = layer_background.getContext("2d");
	const ui = layer_ui.getContext("2d");

	layer_game.width = layer_background.width = layer_ui.width = width;
	layer_game.height = layer_background.height = layer_ui.height = height;

	game.setCanvas(ctx, bg, ui);
	game.setSize(width, height);

	raf = window.requestAnimationFrame(_step);
}

function _break() {
	window.cancelAnimationFrame(raf);
}

function _resize() {
	_break();
	_run();
}

window.onload = _run;
window.onresize = _resize;