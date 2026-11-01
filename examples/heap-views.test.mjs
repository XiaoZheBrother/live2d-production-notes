// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import {CopyingHeap, bindSyntheticModel} from './heap-views.mjs';

test('a copying growth leaves nonempty finite but stale parameter and geometry views', () => {
  const heap = new CopyingHeap(), model = bindSyntheticModel(heap);
  model.parameters.values[0] = 3; heap.update(0, 1);
  assert.equal(model.renderValue(), 6);
  const old = model.parameters.values.buffer;
  heap.grow(); assert.notEqual(heap.values.buffer, old);
  model.parameters.values[0] = 9; heap.update(0, 1);
  assert.equal(model.parameters.values.length, 1);
  assert.ok(model.drawables.vertices.every(Number.isFinite));
  assert.equal(heap.values[0], 3); // The engine never received 9.
  assert.equal(model.renderValue(), 6);
});

test('refresh preserves retained containers and both live models respond after each growth', () => {
  const heap = new CopyingHeap();
  const models = [bindSyntheticModel(heap), bindSyntheticModel(heap, 2, 3)];
  const containers = models.map(m => m.drawables);
  for (let round = 0; round < 3; round++) {
    heap.grow(); models.forEach(m => m.refresh());
    models.forEach((m, i) => {
      assert.equal(m.drawables, containers[i]);
      m.parameters.values[0] = round + i + 4;
      heap.update(i * 2, i * 2 + 1);
      assert.equal(m.renderValue(), (round + i + 4) * 2);
    });
  }
});

test('an allocation can grow memory before it fails, so refresh belongs in cleanup too', () => {
  const heap = new CopyingHeap(), model = bindSyntheticModel(heap);
  assert.throws(() => {
    try { heap.grow(); throw Error('allocation failed after growth'); }
    finally { model.refresh(); }
  });
  model.parameters.values[0] = 7; heap.update(0, 1);
  assert.equal(model.renderValue(), 14);
});
