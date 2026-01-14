import * as React from 'react';
import { createRenderer, CreateRendererOptions, RenderOptions } from '@mui/internal-test-utils';

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
  };
}
