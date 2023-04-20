import { Particle, ParticlePool, DisappearParticleStrategy, DelayedDisappearParticleStrategy } from "./particle.js"

class Game {
	beginTimestamp;
	previousTimestamp;
	currentTimestamp;
	accumulateTime;

	layer_ui;
	layer_game;
	layer_background;

	width;
	height;

	ui;
	ctx;
	bg;

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
		updateMomentum(t, dt, width, height) {
			let strategy1 = new DisappearParticleStrategy(0.99);
			let strategy2 = new DelayedDisappearParticleStrategy(0.95, 200);

			game.particles.registerParticle(new Particle(this.x, this.y, this.vx / 5, this.vy / 5, this.radius / 2, "red", strategy1));
			game.particles.registerParticle(new Particle(this.x, this.y, this.vx / 3, this.vy / 3, this.radius / 3, "#faa", strategy1));
			game.particles.registerParticle(new Particle(this.x, this.y, this.vx / 2, this.vy / 2, this.radius / 5, "#fee", strategy1));
			this.x += this.vx * dt;
			this.y += this.vy * dt;

			if (this.y + this.radius >= height || this.y - this.radius <= 0) {
				game.particles.registerParticle(new Particle(this.x, this.y, -this.vx, -this.vy, this.radius / 7, "lime", strategy2));
				this.vy = -this.vy * 0.999;
			} else {
				this.vy += 0.001 * dt;
			}
			if (this.x + this.radius >= width || this.x - this.radius <= 0) {
				game.particles.registerParticle(new Particle(this.x, this.y, -this.vx, -this.vy, this.radius / 7, "lime", strategy2));
				this.vx = -this.vx * 0.999;
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

		this.width = this.layer_game.width;
		this.height = this.layer_game.height;

		this.ui = this.layer_ui.getContext("2d");
		this.ctx = this.layer_game.getContext("2d");
		this.bg = this.layer_background.getContext("2d");
	}

	update(timestamp) {
		this.currentTimestamp = timestamp;
		const elapsed = this.currentTimestamp - this.previousTimestamp;
		this.accumulateTime += elapsed;

		for (const dt = 10; this.accumulateTime >= dt; this.accumulateTime -= dt) {
			const t = this.previousTimestamp + dt;
			this.ball.updateMomentum(t, dt, this.width, this.height);
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

function _step(timestamp) {
	if (game === undefined) {
		game = new Game(timestamp);
	}
	if (game.update(timestamp)) {
		raf = window.requestAnimationFrame(_step);
	}
}

function _run() {
	raf = window.requestAnimationFrame(_step);
}

function _break() {
	window.cancelAnimationFrame(raf);
}

window.drawGame = _run;