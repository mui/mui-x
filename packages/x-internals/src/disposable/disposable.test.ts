import { expect } from 'vitest';
import { DisposableStack, AsyncDisposableStack } from './index';

describe('disposable', () => {
  describe('Symbol.dispose / Symbol.asyncDispose shim', () => {
    it('defines Symbol.dispose on the global Symbol', () => {
      expect(typeof Symbol.dispose).to.equal('symbol');
    });

    it('defines Symbol.asyncDispose on the global Symbol', () => {
      expect(typeof Symbol.asyncDispose).to.equal('symbol');
    });

    it('lets `[Symbol.dispose]() {}` class syntax key methods correctly', () => {
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

  describe('exports', () => {
    it('exports a constructable DisposableStack', () => {
      expect(typeof DisposableStack).to.equal('function');
      expect(new DisposableStack().disposed).to.equal(false);
    });

    it('exports a constructable AsyncDisposableStack', () => {
      expect(typeof AsyncDisposableStack).to.equal('function');
      expect(new AsyncDisposableStack().disposed).to.equal(false);
    });
  });
});
