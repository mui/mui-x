import * as React from 'react';
import { expect } from 'vitest';
import { createRenderer } from '@mui/internal-test-utils';
import { spy, type SinonSpy } from 'sinon';
import { disposeSymbol } from '../disposable';
import { useDisposable } from './useDisposable';

interface TestDisposable {
  dispose: SinonSpy;
  [disposeSymbol](): void;
}

function createDisposable(): TestDisposable {
  const dispose = spy();
  return {
    dispose,
    [disposeSymbol]() {
      this.dispose();
    },
  };
}

describe('useDisposable', () => {
  // `createRenderer().render` wraps the tree in `<React.StrictMode>` by default,
  // so the default render exercises the mount → unmount → mount replay.
  const { render } = createRenderer();

  function setup() {
    let instance: TestDisposable | undefined;
    let effectMounts = 0;
    const factory = spy(() => {
      instance = createDisposable();
      return instance;
    });
    function TestComponent() {
      useDisposable(factory);
      // Independent of `useDisposable`: counts real effect mounts so the tests
      // can assert the harness actually replayed the cycle (StrictMode) instead
      // of silently degrading to a single mount.
      React.useEffect(() => {
        effectMounts += 1;
      }, []);
      return null;
    }
    return {
      factory,
      getInstance: () => instance!,
      getEffectMounts: () => effectMounts,
      TestComponent,
    };
  }

  it('survives the StrictMode double mount and disposes once on the real unmount', () => {
    const { factory, getInstance, getEffectMounts, TestComponent } = setup();

    const { unmount } = render(<TestComponent />);

    // Guard the test itself: StrictMode must have replayed the mount cycle,
    // otherwise the assertions below wouldn't actually cover the double mount.
    expect(getEffectMounts()).to.equal(2);
    // A single instance survives the mount → unmount → mount cycle...
    expect(factory.callCount).to.equal(1);
    // ...and the simulated unmount does not dispose it.
    expect(getInstance().dispose.callCount).to.equal(0);

    unmount();

    // The real unmount disposes exactly once, even inside `<StrictMode>`.
    expect(getInstance().dispose.callCount).to.equal(1);
  });

  it('creates the instance once and disposes it on unmount (without StrictMode)', () => {
    const { factory, getInstance, getEffectMounts, TestComponent } = setup();

    const { unmount } = render(<TestComponent />, { strict: false });

    // No replay: a single mount, so the skip-the-simulated-unmount branch is
    // never taken.
    expect(getEffectMounts()).to.equal(1);
    expect(factory.callCount).to.equal(1);
    expect(getInstance().dispose.callCount).to.equal(0);

    unmount();

    expect(getInstance().dispose.callCount).to.equal(1);
  });
});
