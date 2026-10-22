/**
 * Teaching-only spatial sampling. sampleAlpha returns the REPAIR LAYER'S alpha,
 * not the final character composite. Required and protected points must come
 * from an independently specified target. No mesh, texture, or SDK is loaded.
 */
export function checkSampledCoverage({
  required,
  protectedPoints,
  sampleAlpha,
  minCoverage = 0.95,
  maxIntrusion = 0.01,
}) {
  if (!Array.isArray(required) || required.length === 0 ||
      !Array.isArray(protectedPoints) || protectedPoints.length === 0) {
    throw new TypeError('Specify both coverage and protection samples');
  }
  if (![minCoverage, maxIntrusion].every(value =>
    Number.isFinite(value) && value >= 0 && value <= 1)) {
    throw new RangeError('Alpha thresholds must be finite values in [0, 1]');
  }

  const read = point => {
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      throw new TypeError('Sample coordinates must be finite');
    }
    const alpha = sampleAlpha(point);
    if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1) {
      throw new RangeError('Sample alpha must be a finite value in [0, 1]');
    }
    return { ...point, alpha };
  };
  const missing = required.map(read).filter(point => point.alpha < minCoverage);
  const intrusions = protectedPoints.map(read)
    .filter(point => point.alpha > maxIntrusion);

  return {
    checked: { required: required.length, protected: protectedPoints.length },
    missing,
    intrusions,
    passed: missing.length === 0 && intrusions.length === 0,
  };
}
