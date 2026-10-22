// Independent teaching example, not a Cubism controller or private project code.
// Contract: a turned face requires enough of its authored expression to remain.
// This threshold belongs to this example; derive real limits from your own art.
export const MIN_TURN_FACE = 0.45;

function unit(value) {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

export function isSupportedPose(pose) {
  return pose !== null && typeof pose === 'object'
    && unit(pose.face) && unit(pose.turn)
    && (pose.turn === 0 || pose.face >= MIN_TURN_FACE);
}

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

/**
 * Capture the current pose, turn to front, then fade the expression.
 * Progress is normalized over a caller-chosen return duration.
 * Follow may resume only after completion; input smoothing is the host's job.
 * This demonstrates the parameter-domain invariant, not visual seam quality,
 * velocity continuity with an interrupted action, blinking or physical motion.
 */
export function createOrderedReturn(pose) {
  if (!isSupportedPose(pose)) {
    throw new RangeError('Return must start inside the authored pose domain');
  }
  const start = { face: pose.face, turn: pose.turn };
  // No unnecessary turn stage when already facing front.
  const turnEnd = start.turn > 0 ? 0.55 : 0;

  return (progress) => {
    if (!unit(progress)) {
      throw new RangeError('Progress must be finite and between 0 and 1');
    }
    if (progress === 1) {
      return { face: 0, turn: 0, phase: 'idle', restoreFollow: true };
    }
    if (progress < turnEnd) {
      return {
        face: start.face,
        turn: start.turn * (1 - smoothstep(progress / turnEnd)),
        phase: 'turn-to-front',
        restoreFollow: false,
      };
    }
    const fade = smoothstep((progress - turnEnd) / (1 - turnEnd));
    return {
      face: start.face * (1 - fade),
      turn: 0,
      phase: 'release-expression',
      restoreFollow: false,
    };
  };
}
