import { expect } from 'vitest';
import { spy } from 'sinon';
import { DisposableStack, AsyncDisposableStack } from './index';

describe('disposable', () => {
  describe('Symbol.dispose / Symbol.asyncDispose globals', () => {
    it('defines Symbol.dispose on the global Symbol', () => {
      expect(typeof Symbol.dispose).to.equal('symbol');
    });

    it('defines Symbol.asyncDispose on the global Symbol', () => {
      expect(typeof Symbol.asyncDispose).to.equal('symbol');
    });

    it('lets `[Symbol.dispose]() {}` class syntax key methods on the well-known symbol', () => {
      class Disposable {
        public ran = false;

        [Symbol.dispose]() {
          this.ran = true;
        }
      }
      const instance = new Disposable();
      instance[Symbol.dispose]();
      expect(instance.ran).to.equal(true);
    });
  });

  describe('DisposableStack', () => {
    it('runs deferred callbacks in reverse order on dispose', () => {
      const stack = new DisposableStack();
      const calls: string[] = [];
      stack.defer(() => calls.push('first'));
      stack.defer(() => calls.push('second'));
      stack.defer(() => calls.push('third'));
      stack.dispose();
      expect(calls).to.deep.equal(['third', 'second', 'first']);
    });

    it('flips `disposed` from false to true', () => {
      const stack = new DisposableStack();
      expect(stack.disposed).to.equal(false);
      stack.dispose();
      expect(stack.disposed).to.equal(true);
    });

    it('is idempotent: a second dispose() is a no-op', () => {
      const stack = new DisposableStack();
      const cb = spy();
      stack.defer(cb);
      stack.dispose();
      stack.dispose();
      expect(cb.callCount).to.equal(1);
    });

    it('disposes a value registered via use() by calling its [Symbol.dispose]()', () => {
      const inner = {
        ran: false,
        [Symbol.dispose]() {
          this.ran = true;
        },
      };
      const stack = new DisposableStack();
      stack.use(inner);
      stack.dispose();
      expect(inner.ran).to.equal(true);
    });

    it('returns the value passed to use()', () => {
      const inner = { [Symbol.dispose]() {} };
      const stack = new DisposableStack();
      const returned = stack.use(inner);
      expect(returned).to.equal(inner);
    });

    it('exposes [Symbol.dispose] as an alias of dispose()', () => {
      const stack = new DisposableStack();
      const cb = spy();
      stack.defer(cb);
      stack[Symbol.dispose]();
      expect(stack.disposed).to.equal(true);
      expect(cb.callCount).to.equal(1);
    });
  });

  describe('AsyncDisposableStack', () => {
    it('exists as a constructor', () => {
      expect(typeof AsyncDisposableStack).to.equal('function');
      const stack = new AsyncDisposableStack();
      expect(stack.disposed).to.equal(false);
    });
  });
});
