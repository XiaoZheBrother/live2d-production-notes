import test from 'node:test';
import assert from 'node:assert/strict';
import { checkSampledCoverage } from './coverage-sampling.mjs';

// Independently specified target: a simple strip, not a character silhouette.
// These synthetic coordinates are unrelated to the private case's pixel sizes.
const target = ({ x, y }) => x >= 0 && x <= 10 && y >= 0 && y <= 30;
const required = Array.from({ length: 31 }, (_, y) => ({ x: 1, y }));
const protectedPoints = [{ x: -1, y: 16 }, { x: 11, y: 16 }];

// A premature rejoin leaves an inward notch below the upper sampling region.
const clipped = point => target(point) &&
  !(point.y >= 12 && point.y <= 20 && point.x < 3) ? 1 : 0;

test('upper-region samples pass while the independent full-region target fails', () => {
  const upper = checkSampledCoverage({
    required: required.filter(point => point.y <= 9),
    protectedPoints,
    sampleAlpha: clipped,
  });
  assert.equal(upper.passed, true);
  assert.equal(upper.checked.required, 10);

  const full = checkSampledCoverage({ required, protectedPoints, sampleAlpha: clipped });
  assert.equal(full.passed, false);
  assert.equal(full.missing.length, 9);
  assert.deepEqual(full.missing.map(point => point.y), [12, 13, 14, 15, 16, 17, 18, 19, 20]);
});

test('a fully opaque oversized patch passes coverage but fails protection', () => {
  const result = checkSampledCoverage({ required, protectedPoints, sampleAlpha: () => 1 });
  assert.equal(result.missing.length, 0);
  assert.equal(result.intrusions.length, 2);
  assert.equal(result.passed, false);
});

test('a corrected strip passes the declared finite sample set', () => {
  const result = checkSampledCoverage({
    required, protectedPoints, sampleAlpha: point => Number(target(point)),
  });
  assert.equal(result.passed, true);
  assert.deepEqual(result.checked, { required: 31, protected: 2 });
});

test('missing samples and invalid alpha cannot silently pass', () => {
  assert.throws(() => checkSampledCoverage({
    required: [], protectedPoints, sampleAlpha: clipped,
  }), TypeError);
  assert.throws(() => checkSampledCoverage({
    required, protectedPoints, sampleAlpha: () => NaN,
  }), RangeError);
});
