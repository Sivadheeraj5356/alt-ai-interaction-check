import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreInteraction, validateInteraction } from '../src/ai_interaction_check.js';

const interaction = {
  name: 'alt-profile-refinement',
  states: { loading: true, empty: true, error: true, retry: true, success: true },
  aiAssisted: true,
  disclosure: 'Shows when Alt is generating or using remembered context',
  persistsContext: true,
  contextReset: 'User can clear remembered context'
};

test('accepts a complete polished AI interaction', () => {
  const result = scoreInteraction(interaction);
  assert.equal(result.ready, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.metrics.stateCount, 5);
});

test('rejects missing interaction states', () => {
  const incomplete = { name: 'chat', states: { loading: true, success: true }, aiAssisted: false };
  assert.deepEqual(validateInteraction(incomplete), ['missing state empty', 'missing state error', 'missing state retry']);
});

test('AI context needs disclosure and reset', () => {
  const opaque = { name: 'memory-chat', states: { loading: true, empty: true, error: true, retry: true, success: true }, aiAssisted: true, persistsContext: true };
  const result = scoreInteraction(opaque);
  assert.equal(result.ready, false);
  assert.deepEqual(result.errors, ['AI-assisted flows need disclosure', 'persistent context needs a reset path']);
});
