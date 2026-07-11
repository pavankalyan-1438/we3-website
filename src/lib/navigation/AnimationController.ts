import type { SpringConfig } from "./PhysicsConfig";

export class SpringValue {
  private value: number;
  private velocity = 0;
  private target: number;

  constructor(initial = 0) {
    this.value = initial;
    this.target = initial;
  }

  setTarget(target: number) {
    this.target = target;
  }

  setImmediate(value: number) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
  }

  get current() {
    return this.value;
  }

  step(config: SpringConfig, deltaMs: number) {
    const dt = Math.min(deltaMs, 32) / 1000;
    const displacement = this.value - this.target;
    const springForce = -config.stiffness * displacement;
    const dampingForce = -config.damping * this.velocity;
    const acceleration = (springForce + dampingForce) / config.mass;

    this.velocity += acceleration * dt;
    this.value += this.velocity * dt;

    if (
      Math.abs(this.velocity) < 0.001 &&
      Math.abs(this.value - this.target) < 0.0005
    ) {
      this.value = this.target;
      this.velocity = 0;
    }

    return this.value;
  }

  isSettled() {
    return Math.abs(this.value - this.target) < 0.0005 && Math.abs(this.velocity) < 0.001;
  }
}

export class AnimationController {
  private rafId: number | null = null;
  private lastTime = 0;
  private listeners = new Set<(deltaMs: number) => void>();

  start() {
    if (this.rafId !== null) return;
    this.lastTime = performance.now();
    const tick = (time: number) => {
      const deltaMs = time - this.lastTime;
      this.lastTime = time;
      this.listeners.forEach((listener) => listener(deltaMs));
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  subscribe(listener: (deltaMs: number) => void) {
    this.listeners.add(listener);
    this.start();
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) this.stop();
    };
  }
}

let sharedController: AnimationController | null = null;

export function getAnimationController() {
  if (!sharedController) {
    sharedController = new AnimationController();
  }
  return sharedController;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Liquid neck profile — thin in the middle as separation increases */
export function neckWidth(progress: number, baseWidth: number) {
  const p = clamp(progress, 0, 1);
  const pinch = Math.sin(p * Math.PI);
  return baseWidth * (1 - p * 0.92) * (0.35 + 0.65 * pinch);
}
