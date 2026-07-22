import * as React from 'react';
import { expect } from 'vitest';
import { createRenderer, act } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import { Store } from './Store';
import { useStoreEffect } from './useStoreEffect';

describe('useStoreEffect', () => {
  const { render } = createRenderer();

  it('runs the effect when the selected value changes', () => {
    const store = Store.create({ value: 0, other: 0 });
    const effect = spy();

    function Test() {
      useStoreEffect(store, (state) => state.value, effect);
      return null;
    }
    render(<Test />);

    act(() => store.update({ value: 1, other: 0 }));
    expect(effect.callCount).to.equal(1);
    expect(effect.lastCall.args).to.deep.equal([0, 1]);

    // Update to an unselected part of the state should not run the effect
    act(() => store.update({ value: 1, other: 1 }));
    expect(effect.callCount).to.equal(1);
  });

  it('uses the latest selector when the store updates', () => {
    const store = Store.create({ a: 0, b: 100 });
    const effect = spy();

    function Test(props: { field: 'a' | 'b' }) {
      useStoreEffect(store, (state) => state[props.field], effect);
      return null;
    }
    const { setProps } = render(<Test field="a" />);

    act(() => store.update({ a: 1, b: 100 }));
    expect(effect.lastCall.args).to.deep.equal([0, 1]);

    // The selector closes over new props: it should select `b` from now on.
    // The switch itself must not run the effect.
    const callCount = effect.callCount;
    setProps({ field: 'b' });
    expect(effect.callCount).to.equal(callCount);

    // Updates to the previously selected field should not run the effect
    act(() => store.update({ a: 2, b: 100 }));
    expect(effect.callCount).to.equal(callCount);

    // Updates to the newly selected field run the effect with previous and
    // next values produced by the same selector
    act(() => store.update({ a: 2, b: 200 }));
    expect(effect.lastCall.args).to.deep.equal([100, 200]);

    const callCountAfterB = effect.callCount;
    act(() => store.update({ a: 3, b: 200 }));
    expect(effect.callCount).to.equal(callCountAfterB);
  });
});
