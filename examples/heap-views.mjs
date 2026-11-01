// SPDX-License-Identifier: MIT
// A synthetic copying heap. No Cubism code, private fields or model assets.
export class CopyingHeap {
  constructor(length = 4) { this.values = new Float32Array(length); }
  grow() {
    const next = new Float32Array(this.values.length * 2);
    next.set(this.values);
    this.values = next;
  }
  view(offset) { return new Float32Array(this.values.buffer, offset * 4, 1); }
  update(inputSlot, outputSlot) { this.values[outputSlot] = this.values[inputSlot] * 2; }
}

export function bindSyntheticModel(heap, inputSlot = 0, outputSlot = 1) {
  const parameters = {values: heap.view(inputSlot)};
  const drawables = {vertices: heap.view(outputSlot)};
  // Simulate a renderer retaining the original drawables container.
  const renderView = drawables;
  return {
    parameters, drawables,
    renderValue: () => renderView.vertices[0],
    refresh() {
      Object.assign(parameters, {values: heap.view(inputSlot)});
      Object.assign(drawables, {vertices: heap.view(outputSlot)});
    },
  };
}
