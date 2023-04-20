import { Particle, ParticlePool, DisappearParticleStrategy, DelayedDisappearParticleStrategy } from "./particle.js"

class Game {
	beginTimestamp;
	previousTimestamp;
	currentTimestamp;
	accumulateTime;

	layer_ui;
	layer_game;
	layer_background;

	ui;
	ctx;
	bg;

	width;
	height;

	ball = {
		x: 100,
		y: 100,
		vx: 0.5,
		vy: 0.2,
		radius: 25,
		color: "blue",
		draw(ctx) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fillStyle = this.color;
			ctx.fill();
		},
		update(t, dt) {
			let strategy1 = new DisappearParticleStrategy(0.99);
			let strategy2 = new DelayedDisappearParticleStrategy(0.95, 200);

			game.particles.registerParticle(new Particle(this.x, this.y, this.vx / 5, this.vy / 5, this.radius / 2, "red", strategy1));
			game.particles.registerParticle(new Particle(this.x, this.y, this.vx / 3, this.vy / 3, this.radius / 3, "#faa", strategy1));
			game.particles.registerParticle(new Particle(this.x, this.y, this.vx / 2, this.vy / 2, this.radius / 5, "#fee", strategy1));
			this.vy += 0.001 * dt;
			this.x += this.vx * dt;
			this.y += this.vy * dt;

			// TODO: collision
			if (this.y + this.radius >= game.height || this.y - this.radius <= 0) {
				if (Math.abs(this.vy) > 0.001 * dt) {
					game.particles.registerParticle(new Particle(this.x, this.y, -this.vx, -this.vy, this.radius / 7, "lime", strategy2));
				}
				if (this.y + this.radius >= game.height) {
					this.y = game.height - this.radius;
				} else {
					this.y = this.radius;
				}
				this.vy = -this.vy * 0.9;
			}
			if (this.x + this.radius >= game.width || this.x - this.radius <= 0) {
				if (Math.abs(this.vx) > 0.001 * dt) {
					game.particles.registerParticle(new Particle(this.x, this.y, -this.vx, -this.vy, this.radius / 7, "lime", strategy2));
				}
				if (this.x + this.radius >= game.width) {
					this.x = game.width - this.radius;
				} else {
					this.x = this.radius;
				}
				this.vx = -this.vx * 0.9;
			}
		}
	};
	particles = new ParticlePool();

	constructor(timestamp) {
		this.beginTimestamp = timestamp;
		this.previousTimestamp = timestamp;
		this.currentTimestamp = timestamp;
		this.accumulateTime = 0;

		this.layer_ui = document.getElementById("ui-layer");
		this.layer_game = document.getElementById("game-layer");
		this.layer_background = document.getElementById("background-layer");

		this.ui = this.layer_ui.getContext("2d");
		this.ctx = this.layer_game.getContext("2d");
		this.bg = this.layer_background.getContext("2d");

		this.fit();
	}

	fit() {
		this.width = this.layer_game.width;
		this.height = this.layer_game.height;
	}

	update(timestamp) {
		this.currentTimestamp = timestamp;
		const elapsed = this.currentTimestamp - this.previousTimestamp;
		this.accumulateTime += elapsed;

		for (const dt = 10; this.accumulateTime >= dt; this.accumulateTime -= dt) {
			const t = this.previousTimestamp + dt;
			this.ball.update(t, dt);
			this.particles.update(t, dt);
			this.previousTimestamp = t;
		}

		{
			this.ctx.clearRect(0, 0, this.width, this.height);
			this.ball.draw(this.ctx);
			this.particles.draw(this.ctx);
			this.previousTimestamp = this.currentTimestamp;
		}

		return true;
	}
}

let raf;
let game;

function _fit() {
	const width = window.innerWidth;
	const height = window.innerHeight;

	let layer_ui = document.getElementById("ui-layer");
	let layer_game = document.getElementById("game-layer");
	let layer_background = document.getElementById("background-layer");

	layer_ui.width = width;
	layer_ui.height = height;
	layer_game.width = width;
	layer_game.height = height;
	layer_background.width = width;
	layer_background.height = height;
}

function _step(timestamp) {
	if (game.update(timestamp)) {
		raf = window.requestAnimationFrame(_step);
	}
}

function _run() {
	_fit();
	if (game === undefined) {
		game = new Game(performance.now());
	}
	raf = window.requestAnimationFrame(_step);
}

function _break() {
	window.cancelAnimationFrame(raf);
}

function _resize() {
	_fit();
	game.fit();
}

window.drawGame = _run;
window.onresize = _resize;