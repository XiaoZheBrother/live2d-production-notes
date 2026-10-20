// SPDX-License-Identifier: MIT
// Educational patterns; this is not a Cubism runtime.

function finiteNonnegative(value, label) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be finite and nonnegative`);
  }
}

export class ActionClock {
  constructor(duration, rate = 1) {
    finiteNonnegative(duration, 'duration');
    if (!Number.isFinite(rate) || rate <= 0) throw new RangeError('rate must be positive');
    this.duration = duration;
    this.rate = rate;
    this.time = 0;
    this.paused = false;
  }

  advance(realDeltaSeconds) {
    finiteNonnegative(realDeltaSeconds, 'delta');
    if (!this.paused) {
      // Do not clamp away elapsed time to stabilize a different subsystem.
      this.time = Math.min(this.duration, this.time + realDeltaSeconds * this.rate);
    }
    return this.time;
  }

  reset() {
    this.time = 0;
    this.paused = false;
  }
}

export function follow(value, target, realDeltaSeconds, timeConstantSeconds) {
  finiteNonnegative(realDeltaSeconds, 'delta');
  if (![value, target, timeConstantSeconds].every(Number.isFinite) || timeConstantSeconds <= 0) {
    throw new RangeError('finite values and a positive time constant are required');
  }
  return value + (target - value) * -Math.expm1(-realDeltaSeconds / timeConstantSeconds);
}

export function createAppearanceCoordinator(initial, requiredParts, load) {
  let serial = 0;
  let current = structuredClone(initial);
  const required = [...requiredParts];
  return {
    current: () => structuredClone(current),
    async select(selection) {
      const request = ++serial;
      let candidate;
      try {
        candidate = await load(structuredClone(selection));
      } catch (error) {
        if (request !== serial) return {status: 'superseded'};
        throw error; // current is unchanged
      }
      if (request !== serial) return {status: 'superseded'};
      const missing = required.filter(part => !Object.hasOwn(candidate?.parts ?? {}, part)
        || candidate.parts[part] == null);
      if (missing.length) throw new Error(`Missing appearance parts: ${missing.join(', ')}`);
      // A real renderer would commit all prepared resources here.
      current = structuredClone(candidate);
      return {status: 'committed'};
    },
  };
}
