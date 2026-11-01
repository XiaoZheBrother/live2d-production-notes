// SPDX-License-Identifier: MIT
// Semantic notifications only: not an async loader or transition renderer.
export function createSemanticHandoff() {
  let visible = 'day', requested = 'idle';
  const playing = {day: 'idle', night: 'idle'};
  const check = side => { if (!Object.hasOwn(playing, side)) throw Error('unknown side'); };
  return {
    request(id) { requested = id; },
    change(side, id) {
      check(side);
      const previous = playing[side]; playing[side] = id;
      if (side !== visible) return;
      if (id !== 'idle') requested = id;
      else if (requested === previous) requested = 'idle';
    },
    handoff(side) { check(side); visible = side; return requested; },
    intent: () => requested,
  };
}
