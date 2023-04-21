import { Particle } from "./particle.js"
import { DisappearParticleStrategy, DelayedDisappearParticleStrategy } from "./particle.js"

export class Ball {
	x = 100;
	y = 100;
	vx = 0.5;
	vy = 0.2;
	radius = 25;
	color = "blue";

	update(game, t, dt) {
		let strategy1 = new DisappearParticleStrategy(0.99);
		let strategy2 = new DelayedDisappearParticleStrategy(0.95, 200);

		game.particles.registerParticle(new Particle(0, this.x, this.y, this.vx / 5, this.vy / 5, this.radius / 2, "red", strategy1));
		game.particles.registerParticle(new Particle(0, this.x, this.y, this.vx / 3, this.vy / 3, this.radius / 3, "#faa", strategy1));
		game.particles.registerParticle(new Particle(0, this.x, this.y, this.vx / 2, this.vy / 2, this.radius / 5, "#fee", strategy1));
		this.vy += 0.001 * dt;
		this.x += this.vx * dt;
		this.y += this.vy * dt;

		// TODO: collision
		if (this.y + this.radius >= game.height || this.y - this.radius <= 0) {
			if (Math.abs(this.vy) > 0.001 * dt) {
				for (let i = 0; i < 11; i++) {
					game.particles.registerParticle(new Particle(1, this.x, this.y, -this.vx + (0.5 - Math.random()), -this.vy + (0.5 - Math.random()), this.radius / 7, "lime", strategy2));
				}
			}
			if (this.y + this.radius >= game.height) {
				this.y = game.height - this.radius;
			} else {
				this.y = this.radius;
			}
			this.vy = -this.vy * .9;
		}
		if (this.x + this.radius >= game.width || this.x - this.radius <= 0) {
			if (Math.abs(this.vx) > 0.001 * dt) {
				for (let i = 0; i < 11; i++) {
					game.particles.registerParticle(new Particle(1, this.x, this.y, -this.vx + (0.5 - Math.random()), -this.vy + (0.5 - Math.random()), this.radius / 7, "lime", strategy2));
				}
			}
			if (this.x + this.radius >= game.width) {
				this.x = game.width - this.radius;
			} else {
				this.x = this.radius;
			}
			this.vx = -this.vx * .9;
		}
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}