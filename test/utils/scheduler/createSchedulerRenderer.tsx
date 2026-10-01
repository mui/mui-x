import * as React from 'react';
import { afterEach } from 'vitest';
import { createRenderer, CreateRendererOptions, RenderOptions } from '@mui/internal-test-utils';
import { absorbObserverFrames } from './absorb-observer-frames';
import { cancelDrag } from './dnd';

interface CreateSchedulerRendererOptions extends Omit<
  CreateRendererOptions,
  'clock' | 'clockOptions'
> {}

export function createSchedulerRenderer({
  clockConfig,
  ...createRendererOptions
}: CreateSchedulerRendererOptions = {}) {
  const { render: clientRender } = createRenderer({
    clockConfig,
    ...createRendererOptions,
  });

  // The drag engine is shared by the whole page and the test files run in one context: a drag left
  // active, for example by a failed assertion mid-gesture, would refuse every later drag.
  afterEach(cancelDrag);

  return {
    /**
     * Renders synchronously, leaving the post-render ResizeObserver deliveries
     * un-acted. Use it only where the render can't be awaited (conformance,
     * `toErrorDev`) or where nothing observed mounts. Anything mounting a scheduler
     * surface must use `renderSettled`, or it races those deliveries in browser mode.
     */
    render(node: React.ReactElement<any>, options?: RenderOptions) {
      return clientRender(node, options);
    },
    /**
     * Renders and absorbs the post-render ResizeObserver deliveries (see
     * `absorbObserverFrames`), so browser-mode tests start from an acted, settled
     * layout. Use it for anything mounting a scheduler surface.
     */
    async renderSettled(node: React.ReactElement<any>, options?: RenderOptions) {
      const view = clientRender(node, options);
      await absorbObserverFrames();
      return view;
    },
  };
}
