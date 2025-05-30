import * as React from 'react';
import { createRenderer, CreateRendererOptions, RenderOptions } from '@mui/internal-test-utils';
import { vi } from 'vitest';

interface CreateSchedulerRendererOptions
  extends Omit<CreateRendererOptions, 'clock' | 'clockOptions'> {}

export function createSchedulerRenderer({
  clockConfig,
  ...createRendererOptions
}: CreateSchedulerRendererOptions = {}) {
  const { render: clientRender } = createRenderer(createRendererOptions);
  beforeEach(() => {
    if (clockConfig) {
      vi.setSystemTime(clockConfig);
    }
  });
  afterEach(() => {
    if (clockConfig) {
      vi.useRealTimers();
    }
  });

  return {
    render(node: React.ReactElement<any>, options?: RenderOptions) {
      return clientRender(node, options);
    },
  };
}
