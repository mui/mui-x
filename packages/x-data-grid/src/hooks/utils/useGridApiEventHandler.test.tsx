import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { createRenderer } from '@mui/internal-test-utils';
import { sleep } from 'test/utils/helperFn';
import { createUseGridApiEventHandler } from './useGridApiEventHandler';
import { FinalizationRegistryBasedCleanupTracking } from '../../utils/cleanupTracking/FinalizationRegistryBasedCleanupTracking';
import { TimerBasedCleanupTracking } from '../../utils/cleanupTracking/TimerBasedCleanupTracking';

const noop = spy();

describe('useGridApiEventHandler', () => {
  const { render } = createRenderer();

  describe('FinalizationRegistry-based implementation', () => {
    it('should unsubscribe event listeners registered by uncommitted components', async function test() {
      if (
        !/jsdom/.test(window.navigator.userAgent) ||
        typeof FinalizationRegistry === 'undefined' ||
        typeof global.gc === 'undefined'
      ) {
        // Needs ability to trigger the garbage collector and support for FinalizationRegistry (added in node 14)
        this.skip();
      }

      const useGridApiEventHandler = createUseGridApiEventHandler({
        registry: new FinalizationRegistryBasedCleanupTracking(),
      });
      const unsubscribe = spy();
      const apiRef = {
        current: { subscribeEvent: spy(() => unsubscribe) },
      };

      function Test() {
        useGridApiEventHandler(apiRef as any, 'cellClick', noop);
        return null;
      }

      const { unmount } = render(<Test />);

      // StrictMode calls the component twice. However, on the second time it trashes all refs,
      // which makes 2 event listeners to be registered. Since the second render is never
      // committed (to simulate a trashed render in React 18), the effects also don't run, so we're
      // unable to unsubscribe the last listener using the cleanup function.
      expect(apiRef.current.subscribeEvent.callCount).to.equal(3);

      unmount();
      global.gc(); // Triggers garbage collector
      await sleep(50);

      // Ensure that both event listeners were unsubscribed
      expect(unsubscribe.callCount).to.equal(3);
    });
  });

  describe('Timer-based implementation', () => {
    it('should unsubscribe event listeners registered by uncommitted components', async () => {
      const useGridApiEventHandler = createUseGridApiEventHandler({
        registry: new TimerBasedCleanupTracking(50),
      });
      const unsubscribe = spy();
      const apiRef = {
        current: { subscribeEvent: spy(() => unsubscribe) },
      };

      function Test() {
        useGridApiEventHandler(apiRef as any, 'cellClick', noop);
        return null;
      }

      const { unmount } = render(<Test />);

      // StrictMode calls the component twice. However, on the second time it trashes all refs,
      // which makes 2 event listeners to be registered. Since the second render is never
      // committed (to simulate a trashed render in React 18), the effects also don't run, so we're
      // unable to unsubscribe the last listener using the cleanup function.
      expect(apiRef.current.subscribeEvent.callCount).to.equal(3);

      unmount();
      await sleep(60);

      // Ensure that both event listeners were unsubscribed
      expect(unsubscribe.callCount).to.equal(3);
    });
  });
});
