export class Particle {
	id;

	x;
	y;

	vx;
	vy;

	radius;
	color;

	strategy;

	constructor(x, y, vx, vy, radius, color, strategy) {
		this.id = 0;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.radius = radius;
		this.color = color;
		this.strategy = strategy;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	update(t, dt) {
		this.x += this.vx * dt;
		this.y += this.vy * dt;
		return this.strategy?.update(this, t, dt) ?? true;
	}
}

export class ParticlePool {
	static #idCounter;

	static {
		ParticlePool.idCounter = 0;
	}

	particles = new Map();

	registerParticle(particle) {
		particle.id = ++ParticlePool.idCounter;
		this.particles.set(particle.id, particle);
		return particle;
	}

	update(t, dt) {
		for (const [k, v] of this.particles) {
			if (!v.update(t, dt)) {
				this.particles.delete(k);
			}
		}
	}

	draw(ctx) {
		for (const [k, v] of this.particles) {
			v.draw(ctx);
		}
	}
}

export class DisappearParticleStrategy {
	ratio;

	constructor(ratio) {
		this.ratio = ratio;
	}

	update(particle, t, dt) {
		particle.radius *= this.ratio ** dt;
		return particle.radius > 1e-6;
	}
}

export class DelayedDisappearParticleStrategy {
	ratio;
	delay;

	constructor(ratio, delay) {
		this.ratio = ratio;
		this.delay = delay;
	}

	update(particle, t, dt) {
		if (particle.strategy_timer === undefined) {
			particle.strategy_timer = this.delay;
		} else if (particle.strategy_timer > 0) {
			particle.strategy_timer -= dt;
		} else {
			particle.radius *= this.ratio ** dt;
		}
		return particle.radius > 1e-6;
	}
}