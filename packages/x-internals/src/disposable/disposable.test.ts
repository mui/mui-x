import { expect } from 'vitest';
import {
  AsyncDisposableStack,
  DisposableStack,
  asyncDisposeSymbol,
  disposeSymbol,
  unwrapSuppressedErrors,
} from './index';

describe('disposable', () => {
  describe('disposeSymbol / asyncDisposeSymbol', () => {
    it('should export disposeSymbol as a symbol', () => {
      expect(typeof disposeSymbol).to.equal('symbol');
    });

    it('should export asyncDisposeSymbol as a symbol', () => {
      expect(typeof asyncDisposeSymbol).to.equal('symbol');
    });

    it('should let `[disposeSymbol]() {}` class syntax key methods correctly', () => {
      class Disposable {
        public ran = false;

        [disposeSymbol]() {
          this.ran = true;
        }
      }
      const instance = new Disposable();
      instance[disposeSymbol]();
      expect(instance.ran).to.equal(true);
    });

    it('should let DisposableStack#use find a method keyed on disposeSymbol', () => {
      let ran = false;
      const stack = new DisposableStack();
      stack.use({
        [disposeSymbol]() {
          ran = true;
        },
      });
      stack.dispose();
      expect(ran).to.equal(true);
    });
  });

  describe('exports', () => {
    it('should export a constructable DisposableStack', () => {
      expect(typeof DisposableStack).to.equal('function');
      expect(new DisposableStack().disposed).to.equal(false);
    });

    it('should export a constructable AsyncDisposableStack', () => {
      expect(typeof AsyncDisposableStack).to.equal('function');
      expect(new AsyncDisposableStack().disposed).to.equal(false);
    });
  });

  describe('unwrapSuppressedErrors', () => {
    it('should return a single-element array for a non-SuppressedError', () => {
      const error = new Error('plain');
      expect(unwrapSuppressedErrors(error)).to.deep.equal([error]);
    });

    it('should flatten a SuppressedError chain outermost-first', () => {
      const innermost = new Error('inner');
      const middle = { error: new Error('middle'), suppressed: innermost };
      const outer = { error: new Error('outer'), suppressed: middle };

      const result = unwrapSuppressedErrors(outer);

      expect(result).to.have.lengthOf(3);
      expect((result[0] as Error).message).to.equal('outer');
      expect((result[1] as Error).message).to.equal('middle');
      expect((result[2] as Error).message).to.equal('inner');
    });

    it('should unwrap a real SuppressedError thrown by DisposableStack.dispose', () => {
      const stack = new DisposableStack();
      stack.defer(() => {
        throw new Error('first');
      });
      stack.defer(() => {
        throw new Error('second');
      });

      let caught: unknown;
      try {
        stack.dispose();
      } catch (error) {
        caught = error;
      }

      const result = unwrapSuppressedErrors(caught);
      const messages = result.map((entry) => (entry as Error).message);
      expect(messages).to.include('first');
      expect(messages).to.include('second');
    });
  });
});
