/* eslint-env mocha */
import { createXMochaHooks } from './mochaHooks';

const mochaHooks = createXMochaHooks();

beforeEach(function beforeEachHook() {
  mochaHooks.beforeEach.forEach((mochaHook) => {
    mochaHook.call(this);
  });
});

afterEach(function beforeEachHook() {
  mochaHooks.afterEach.forEach((mochaHook) => {
    mochaHook.call(this);
  });
});
