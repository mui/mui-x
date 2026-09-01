import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { act, reactMajor } from '@mui/internal-test-utils';
import { DataGridPro, useGridApiContext } from '@mui/x-data-grid-pro';
import { isJSDOM } from 'test/utils/skipIf';

const COLUMNS = [{ field: 'id' }, { field: 'name', width: 200 }];

const ROWS = [
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' },
  { id: 3, name: 'Gamma' },
];

describe('<DataGridPro /> - SSR', () => {
  // Reproduces https://github.com/mui/mui-x/issues/23469 in a minimal way.
  // In the Next.js reproduction, a render pass of the grid never commits.
  // Event handlers subscribed during that render pass stay registered.
  // A later `rowDragStart` event reached those handlers, and their `setState`
  // calls targeted fibers that React never mounted.
  // The suspended footer below mimics that timing: it suspends before mount and
  // then publishes `rowDragStart` while React still considers the tree unmounted.
  // `react-dom/client` only exists in React 18+, so it is imported dynamically
  // inside the test to avoid breaking module resolution on the React 17 lane.
  it.skipIf(isJSDOM || reactMajor < 18)(
    'should not update scroll area state before it has mounted',
    async () => {
      const ReactDOMClient = await import('react-dom/client');
      let shouldSuspend = false;
      let didSuspend = false;
      let promise: Promise<void> | null = null;

      function SuspendedFooter() {
        const apiRef = useGridApiContext();

        if (shouldSuspend && !didSuspend) {
          promise ??= Promise.resolve().then(() => {
            didSuspend = true;
            apiRef.current.publishEvent(
              'rowDragStart',
              { id: ROWS[0].id } as any,
              { dataTransfer: {} } as any,
            );
          });

          throw promise;
        }

        return null;
      }

      const tree = (
        <React.StrictMode>
          <React.Suspense fallback={null}>
            <div style={{ height: 300, width: 400 }}>
              <DataGridPro rows={ROWS} columns={COLUMNS} slots={{ footer: SuspendedFooter }} />
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
