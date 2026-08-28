import * as React from 'react';
import { createRenderer, CreateRendererOptions, RenderOptions } from '@mui/internal-test-utils';
import { absorbObserverFrames } from './absorb-observer-frames';

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

  return {
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
