/* eslint-disable vitest/no-import-node-test, vitest/prefer-importing-vitest-globals */
import assert from 'node:assert/strict';
import test from 'node:test';
import { shouldSkipProductSection } from './changelogUtils.mjs';

test('skips an internal product without commits even when its package was bumped', () => {
  assert.equal(
    shouldSkipProductSection({ hasNoCommits: true, packageBumped: true, internal: true }),
    true,
  );
});

test('keeps a regular product without commits when its package was bumped', () => {
  assert.equal(
    shouldSkipProductSection({ hasNoCommits: true, packageBumped: true, internal: false }),
    false,
  );
});

test('keeps an internal product with commits', () => {
  assert.equal(
    shouldSkipProductSection({ hasNoCommits: false, packageBumped: true, internal: true }),
    false,
  );
});
