import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { act, reactMajor } from '@mui/internal-test-utils';
import { DataGrid, useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import { isJSDOM } from 'test/utils/skipIf';

const COLUMNS = [{ field: 'id' }, { field: 'name', width: 200 }];

const ROWS = [
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' },
  { id: 3, name: 'Gamma' },
];

const rowsStateSelector = (apiRef: ReturnType<typeof useGridApiContext>) =>
  apiRef.current.state.rows;

const hasHydrationError = (errors: string[]) =>
  errors.some((error) => /hydration|did not match/i.test(error));

describe('<DataGrid /> - SSR', () => {
  // `react-dom/client` only exists in React 18+, so it is imported dynamically inside the test
  // to avoid breaking module resolution on the React 17 lane.
  it.skipIf(reactMajor < 18)('should not report hydration errors', async () => {
    async function hydrateWithoutConsoleErrors(tree: React.ReactElement) {
      const ReactDOMClient = await import('react-dom/client');
    
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.innerHTML = ReactDOMServer.renderToString(tree);
    
      const errors: string[] = [];
      const originalConsoleError = console.error;
      const interceptor = (...args: any[]) => {
        errors.push(args.map(String).join(' '));
      };
      // Direct assignment shadows the property; the test runner's
      // vitest-fail-on-console wrapper assigned in beforeEach is bypassed.
      console.error = interceptor;
    
      let root: ReturnType<typeof ReactDOMClient.hydrateRoot> | undefined;
      try {
        await act(async () => {
          root = ReactDOMClient.hydrateRoot(container, tree);
        });
        await act(async () => {
          root?.unmount();
        });
      } finally {
        console.error = originalConsoleError;
        document.body.removeChild(container);
      }
    
      return errors;
    }
    
    const tree = (
      <div style={{ height: 300, width: 400 }}>
        <DataGrid rows={ROWS} columns={COLUMNS} />
      </div>
    );

    const errors = await hydrateWithoutConsoleErrors(tree);

    expect(hasHydrationError(errors)).to.equal(false);
  });

  // Reproduces https://github.com/mui/mui-x/issues/17077 in a minimal way.
  // In the Next.js reproduction, the grid synchronously updates its store during hydration
  // while selector subscribers registered during render are not committed yet. The suspended
  // footer below mimics that timing: it subscribes with `useGridSelector`, suspends before
  // mount, and then triggers a grid state update while React still considers the fiber unmounted.
  // `react-dom/client` only exists in React 18+, so it is imported dynamically inside the test
  // to avoid breaking module resolution on the React 17 lane.
  it.skipIf(isJSDOM || reactMajor < 18)(
    'should not notify grid selector subscribers before they have mounted',
    async () => {
      const ReactDOMClient = await import('react-dom/client');
      let shouldSuspend = false;
      let didSuspend = false;
      let promise: Promise<void> | null = null;

      function SuspendedSelectorFooter() {
        const apiRef = useGridApiContext();
        useGridSelector(apiRef, rowsStateSelector);

        if (shouldSuspend && !didSuspend) {
          promise ??= Promise.resolve().then(() => {
            didSuspend = true;
            apiRef.current.setState((state) => ({
              ...state,
              rows: {
                ...state.rows,
              },
            }));
          });

          throw promise;
        }

        return null;
      }

      const tree = (
        <React.StrictMode>
          <React.Suspense fallback={null}>
            <div style={{ height: 300, width: 400 }}>
              <DataGrid rows={ROWS} columns={COLUMNS} slots={{ footer: SuspendedSelectorFooter }} />
            </div>
          </React.Suspense>
        </React.StrictMode>
      );

      const container = document.createElement('div');
      document.body.appendChild(container);
      container.innerHTML = ReactDOMServer.renderToString(tree);
      shouldSuspend = true;

      const errors: string[] = [];
      const originalConsoleError = console.error;
      const interceptor = (...args: any[]) => {
        errors.push(args.map(String).join(' '));
      };
      // Direct assignment shadows the property; the test runner's
      // vitest-fail-on-console wrapper assigned in beforeEach is bypassed.
      console.error = interceptor;

      let root: ReturnType<typeof ReactDOMClient.hydrateRoot> | undefined;
      try {
        await act(async () => {
          root = ReactDOMClient.hydrateRoot(container, tree);
        });
        await act(async () => {
          root?.unmount();
        });
      } finally {
        console.error = originalConsoleError;
        document.body.removeChild(container);
      }

      const hasStateUpdateWarning = errors.some((error) =>
        /Can't perform a React state update on a component that hasn't mounted yet/.test(error),
      );

      expect(hasStateUpdateWarning).to.equal(false);
    },
  );
});
