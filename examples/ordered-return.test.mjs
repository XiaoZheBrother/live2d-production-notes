import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MIN_TURN_FACE, isSupportedPose, createOrderedReturn,
} from './ordered-return.mjs';

test('valid endpoints do not make a simultaneous fade a valid path', () => {
  const naive = (p) => ({ face: 1 - p, turn: 1 - p });
  assert.equal(isSupportedPose(naive(0)), true);
  assert.equal(isSupportedPose(naive(1)), true);
  assert.equal(isSupportedPose(naive(0.7)), false);
});

test('ordered return preserves the domain from a grid of valid interruption poses', () => {
  const faces = [0, 0.2, MIN_TURN_FACE, 0.6, 0.8, 1];
  const turns = [0, 0.001, 0.1, 0.5, 1];
  for (const face of faces) {
    for (const turn of turns) {
      const pose = { face, turn };
      if (!isSupportedPose(pose)) continue;
      const sample = createOrderedReturn(pose);
      const initial = sample(0);
      assert.equal(initial.face, face);
      assert.equal(initial.turn, turn);
      let previous = initial;
      for (let i = 0; i <= 200; i++) {
        const value = sample(i / 200);
        assert.ok(isSupportedPose(value), JSON.stringify({ pose, i, value }));
        assert.ok(value.face <= previous.face);
        assert.ok(value.turn <= previous.turn);
        assert.equal(value.restoreFollow, i === 200);
        previous = value;
      }
      assert.deepEqual(sample(1), {
        face: 0, turn: 0, phase: 'idle', restoreFollow: true,
      });
    }
  }
});

test('stage boundary keeps the expression until the face has returned to front', () => {
  const sample = createOrderedReturn({ face: MIN_TURN_FACE, turn: 0.8 });
  const before = sample(0.55 - 1e-8);
  const boundary = sample(0.55);
  const after = sample(0.55 + 1e-8);
  assert.equal(before.face, MIN_TURN_FACE);
  assert.ok(before.turn < 1e-12);
  assert.equal(boundary.turn, 0);
  assert.equal(boundary.face, MIN_TURN_FACE);
  assert.equal(after.turn, 0);
  assert.ok(Math.abs(after.face - boundary.face) < 1e-12);
});

test('restarting a return captures the current pose without a position jump', () => {
  const original = { face: 0.8, turn: 0.7 };
  const sample = createOrderedReturn(original);
  original.face = 0; // Caller mutation cannot corrupt the captured start.
  const current = sample(0.37);
  const resumed = createOrderedReturn(current);
  assert.equal(resumed(0).face, current.face);
  assert.equal(resumed(0).turn, current.turn);
  for (let i = 0; i <= 100; i++) {
    assert.ok(isSupportedPose(resumed(i / 100)));
  }
});

test('reject unsupported and non-finite inputs rather than silently accepting them', () => {
  for (const pose of [null, {}, { face: 0.2, turn: 0.1 },
    { face: NaN, turn: 0 }, { face: 1, turn: Infinity },
    { face: -0.1, turn: 0 }, { face: 1, turn: 1.1 }]) {
    assert.equal(isSupportedPose(pose), false);
    assert.throws(() => createOrderedReturn(pose), RangeError);
  }
  const sample = createOrderedReturn({ face: 0.8, turn: 0 });
  assert.ok(sample(0.25).face < 0.8); // No artificial wait for a zero turn.
  for (const progress of [NaN, Infinity, -0.1, 1.1, '0.5']) {
    assert.throws(() => sample(progress), RangeError);
  }
});
