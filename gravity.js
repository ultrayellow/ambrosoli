import { Particle } from "./particle.js"
import { DisappearParticleStrategy, DelayedDisappearParticleStrategy } from "./particle.js"

export class GravityObject {
	id = 0;

	mass;
	pinned = false;

	x;
	y;

	vx = 0;
	vy = 0;

	radius;
	color;

	constructor(mass, x, y, radius, color) {
		this.mass = mass;
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
	}

	impact(vx, vy) {
		this.pinned = false;
		this.vx = vx;
		this.vy = vy;
		return this;
	}

	pin() {
		this.pinned = true;
		this.vx = 0;
		this.vy = 0;
		return this;
	}

	update(game, pool, t, dt) {
		if (this.pinned) {
			return;
		}

		let strategy1 = new DisappearParticleStrategy(0.99);
		let strategy2 = new DelayedDisappearParticleStrategy(0.95, 200);

		let ax = 0;
		let ay = 0;
		for (const [k, v] of pool.objects) {
			if (v != this) {
				const dx = v.x - this.x;
				const dy = v.y - this.y;
				const distanceSq = dx ** 2 + dy ** 2;
				if (distanceSq <= (this.radius + v.radius) ** 2) {
					for (let i = 0; i < 11; i++) {
						game.particles.registerParticle(new Particle(1, this.x, this.y, -this.vx + (0.5 - Math.random()), -this.vy + (0.5 - Math.random()), this.radius / 7, "lime", strategy2));
					}

					const cx = this.x - this.radius * dx / (this.radius + v.radius);
					const cy = this.y - this.radius * dy / (this.radius + v.radius);

					this.x = cx;
					this.y = cy;

					const nx = -dy / distanceSq ** .5;
					const ny = dx / distanceSq ** .5;
					const rvx = v.vx - this.vx;
					const rvy = v.vy - this.vy;
					const t_dot = nx * rvx + ny * rvy;
					const cvx = rvx - t_dot * nx;
					const cvy = rvy - t_dot * ny;
					const elasticity = 0.85;

					this.vx += 2 * elasticity * cvx;
					this.vy += 2 * elasticity * cvy;

					ax = 0;
					ay = 0;
					break;
				}

				const g = v.mass * distanceSq ** (-3 / 2);
				ax += g * dx;
				ay += g * dy;
			}
		}
		game.particles.registerParticle(new Particle(0, this.x, this.y, this.vx / 5, this.vy / 5, this.radius / 2, "red", strategy1));
		game.particles.registerParticle(new Particle(0, this.x, this.y, this.vx / 3, this.vy / 3, this.radius / 3, "#faa", strategy1));
		game.particles.registerParticle(new Particle(0, this.x, this.y, this.vx / 2, this.vy / 2, this.radius / 5, "#fee", strategy1));
		this.vx += ax * dt;
		this.vy += ay * dt;
		this.x += this.vx * dt;
		this.y += this.vy * dt;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

export class GravityPool {
	static #idCounter = 0;

	objects = new Map();

	addObject(object) {
		object.id = ++GravityPool.#idCounter;
		this.objects.set(object.id, object);
		return object;
	}

	removeObject(id) {
		this.objects.delete(id);
	}

	update(game, t, dt) {
		for (const [k, v] of this.objects) {
			v.update(game, this, t, dt);
		}
	}

	draw(ctx) {
		for (const [k, v] of this.objects) {
			v.draw(ctx);
		}
	}
}