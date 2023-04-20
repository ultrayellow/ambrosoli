import { ParticlePool } from "./particle.js"
import { Ball } from "./ball.js"

export class Game {
	beginTimestamp;
	previousTimestamp;
	currentTimestamp;
	accumulateTime;

	ctx;
	bg;
	ui;

	width;
	height;

	ball = new Ball();
	particles = new ParticlePool();

	constructor(timestamp) {
		this.beginTimestamp = timestamp;
		this.previousTimestamp = timestamp;
		this.currentTimestamp = timestamp;
		this.accumulateTime = 0;
	}

	setCanvas(ctx, bg, ui) {
		this.ctx = ctx;
		this.bg = bg;
		this.ui = ui;
	}

	setSize(width, height) {
		this.width = width;
		this.height = height;
	}

	update(timestamp) {
		this.currentTimestamp = timestamp;
		const elapsed = this.currentTimestamp - this.previousTimestamp;
		this.accumulateTime += elapsed;

		for (const dt = 10; this.accumulateTime >= dt; this.accumulateTime -= dt) {
			const t = this.previousTimestamp + dt;
			this.ball.update(this, t, dt);
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