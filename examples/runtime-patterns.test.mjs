// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import {ActionClock, follow, createAppearanceCoordinator} from './runtime-patterns.mjs';

const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-10, `${a} != ${b}`);
const parts = ['idleBody', 'bookCuff', 'admirationBody'];
const outfit = name => ({name, parts: Object.fromEntries(parts.map(p => [p, name]))});

test('dropped frames do not discard action time; the final time is bounded', () => {
  const clock = new ActionClock(9);
  for (const dt of [.016, .18, .9, .04, 2.1]) clock.advance(dt);
  near(clock.time, 3.236);
  assert.equal(clock.advance(20), 9);
});

test('pause does not accumulate time, and 1.35x is duration / 1.35', () => {
  const clock = new ActionClock(9, 1.35);
  near(clock.advance(1), 1.35);
  clock.paused = true;
  near(clock.advance(4), 1.35);
  clock.paused = false;
  near(clock.advance(9 / 1.35 - 1), 9);
  clock.reset();
  assert.equal(clock.time, 0);
});

test('constant-target following agrees at 30, 60 and 120 Hz', () => {
  const values = [30, 60, 120].map(hz => {
    let x = 0;
    for (let i = 0; i < hz; i++) x = follow(x, 1, 1 / hz, .23);
    return x;
  });
  for (const x of values) near(x, 1 - Math.exp(-1 / .23));
});

test('invalid time input is rejected instead of poisoning animation state', () => {
  const clock = new ActionClock(2);
  assert.throws(() => clock.advance(NaN), RangeError);
  assert.throws(() => clock.advance(-1), RangeError);
  assert.equal(clock.time, 0);
  assert.throws(() => follow(0, 1, .01, 0), RangeError);
});

test('a slower old appearance cannot overwrite a newer completed selection', async () => {
  const pending = new Map();
  const coordinator = createAppearanceCoordinator(outfit('default'), parts,
    name => new Promise(resolve => pending.set(name, resolve)));
  const a = coordinator.select('A');
  const b = coordinator.select('B');
  pending.get('B')(outfit('B'));
  assert.equal((await b).status, 'committed');
  pending.get('A')(outfit('A'));
  assert.equal((await a).status, 'superseded');
  assert.equal(coordinator.current().name, 'B');
});

test('missing special-action coverage and loading failures retain the old outfit', async () => {
  const coordinator = createAppearanceCoordinator(outfit('default'), parts, async name => {
    if (name === 'broken') throw new Error('load failed');
    return {name, parts: {idleBody: 'new', bookCuff: 'new'}};
  });
  await assert.rejects(coordinator.select('incomplete'), /admirationBody/);
  await assert.rejects(coordinator.select('broken'), /load failed/);
  assert.deepEqual(coordinator.current(), outfit('default'));
});

test('external mutation of a returned snapshot cannot change committed state', async () => {
  const coordinator = createAppearanceCoordinator(outfit('default'), parts, async name => outfit(name));
  await coordinator.select('night');
  const snapshot = coordinator.current();
  snapshot.parts.bookCuff = 'wrong';
  assert.equal(coordinator.current().parts.bookCuff, 'night');
});
