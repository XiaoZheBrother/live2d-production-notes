// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import {createSemanticHandoff} from './semantic-handoff.mjs';

test('replay idle notification followed by action start restores handoff intent', () => {
  const state = createSemanticHandoff(); state.handoff('night');
  state.request('wave'); state.change('night', 'wave');
  state.request('wave'); state.change('night', 'idle'); state.change('night', 'wave');
  assert.equal(state.handoff('day'), 'wave');
});

test('hidden-side callbacks cannot change active intent', () => {
  const state = createSemanticHandoff();
  state.request('book'); state.change('day', 'book');
  state.change('night', 'success'); state.change('night', 'idle');
  assert.equal(state.intent(), 'book');
});

test('finishing the old action does not erase a queued different action', () => {
  const state = createSemanticHandoff();
  state.request('book'); state.change('day', 'book'); state.request('shy');
  state.change('day', 'idle'); assert.equal(state.intent(), 'shy');
  state.change('day', 'shy'); state.change('day', 'idle');
  assert.equal(state.intent(), 'idle');
});
