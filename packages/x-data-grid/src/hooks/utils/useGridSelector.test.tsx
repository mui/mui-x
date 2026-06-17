import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { act, createRenderer, screen } from '@mui/internal-test-utils';
import { Store } from '@mui/x-internals/store';
import { useGridSelector } from './useGridSelector';

type TestState = {
  selectorTestState: {
    value?: number;
    a?: number;
    b?: number;
  };
};

type TestApiRef = {
  current: {
    state: TestState;
    store: Store<TestState>;
  };
};

const createApiRef = (initialState: TestState): TestApiRef => {
  const store = Store.create(initialState);

  return {
    current: {
      state: store.state,
      store,
    },
  };
};

const setApiRefState = (apiRef: TestApiRef, newState: TestState) => {
  apiRef.current.state = newState;
  apiRef.current.store.update(newState);
};

const selectorValue = (apiRef: any) =>
  (apiRef.current.state as TestState).selectorTestState.value ?? 0;

const selectorValueA = (apiRef: any) =>
  (apiRef.current.state as TestState).selectorTestState.a ?? 0;

const selectorValueB = (apiRef: any) =>
  (apiRef.current.state as TestState).selectorTestState.b ?? 0;

// Run in both StrictMode on and off
describe.each([true, false])('useGridSelector (strict: %s)', (strict) => {
  const { render } = createRenderer({ strict });

  it('should catch store updates fired before the selector subscription is attached', () => {
    const apiRef = createApiRef({ selectorTestState: { value: 0 } });
    let didUpdate = false;

    function SelectorProbe() {
      const value = useGridSelector(apiRef as any, selectorValue);

      const handleRef = React.useCallback((node: HTMLDivElement | null) => {
        if (node && !didUpdate) {
          didUpdate = true;
          setApiRefState(apiRef, {
            ...apiRef.current.state,
            selectorTestState: { value: 1 },
          });
        }
      }, []);

      return (
        <div ref={handleRef} data-testid="selector-probe">
          {value}
        </div>
      );
    }

    render(<SelectorProbe />);

    expect(screen.getByTestId('selector-probe').textContent).to.equal('1');
  });

  it('should batch updates of multiple selectors from the same store change into a single commit', async () => {
    const apiRef = createApiRef({
      selectorTestState: { a: 0, b: 0 },
    });

    let commits: string[] = [];

    const SelectorProbe = React.memo(function SelectorProbe() {
      const valueA = useGridSelector(apiRef as any, selectorValueA);
      const valueB = useGridSelector(apiRef as any, selectorValueB);

      React.useEffect(() => {
        commits.push(`${valueA}:${valueB}`);
      });

      return <div data-testid="selector-probe">{`${valueA}:${valueB}`}</div>;
    });

    render(<SelectorProbe />);

    // reset before the update
    commits = [];

    await act(async () => {
      setApiRefState(apiRef, {
        ...apiRef.current.state,
        selectorTestState: { a: 1, b: 1 },
      });
    });

    expect(screen.getByTestId('selector-probe').textContent).to.equal('1:1');
    expect(commits).to.deep.equal(['1:1']);
  });
});
