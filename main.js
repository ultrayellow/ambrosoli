import { Game } from "./game.js"

let game;
let raf;

function _run() {
	if (game === undefined) {
		game = new Game(performance.now());
	}

	const layer_game = document.getElementById("game-layer");
	const layer_background = document.getElementById("background-layer");
	const layer_ui = document.getElementById("ui-layer");

	const width = window.innerWidth;
	const height = window.innerHeight;

	const ctx = layer_game.getContext("2d");
	const bg = layer_background.getContext("2d");
	const ui = layer_ui.getContext("2d");

	layer_game.width = layer_background.width = layer_ui.width = width;
	layer_game.height = layer_background.height = layer_ui.height = height;

	game.setCanvas(ctx, bg, ui);
	game.setSize(width, height);

	raf = window.requestAnimationFrame(_step);
}

function _step(timestamp) {
	if (game.update(timestamp)) {
		raf = window.requestAnimationFrame(_step);
	}
}

function _break() {
	window.cancelAnimationFrame(raf);
}

window.onload = (ev) => {
	_run();
};

window.onresize = (ev) => {
	_break();
	_run();
};

window.onkeydown = (ev) => {
	if (ev.repeat) {
		return;
	}

	const keyName = ev.key;

	if (keyName === "Control") {
		// do not alert when only Control key is pressed.
		return;
	}

	if (ev.ctrlKey) {
		// Even though event.key is not 'Control' (e.g., 'a' is pressed),
		// event.ctrlKey may be true if Ctrl key is pressed at the same time.
		alert(`Combination of ctrlKey + ${keyName}`);
	} else {
		alert(`Key pressed ${keyName}`);
	}
};

window.onkeyup = (ev) => {
	const keyName = ev.key;

	// As the user releases the Ctrl key, the key is no longer active,
	// so event.ctrlKey is false.
	if (keyName === "Control") {
		alert("Control key was released");
	}
};

window.onmousedown = (ev) => { console.dir(ev); };

window.onmouseup = (ev) => { console.dir(ev); };

window.onmousemove = (ev) => { };

window.onwheel = (ev) => { console.dir(ev); };