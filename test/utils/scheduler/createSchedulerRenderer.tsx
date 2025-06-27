import * as React from 'react';
import { createRenderer, CreateRendererOptions, RenderOptions } from '@mui/internal-test-utils';
import { vi } from 'vitest';

interface CreateSchedulerRendererOptions
  extends Omit<CreateRendererOptions, 'clock' | 'clockOptions'> {}

function BodyClassWrapper({ children }: { children?: React.ReactNode }) {
  React.useEffect(() => {
    document.body.classList.add('mode-light');
    return () => {
      document.body.classList.remove('mode-light');
    };
  }, []);
  return <React.Fragment>{children}</React.Fragment>;
}

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
      return clientRender(<BodyClassWrapper>{node}</BodyClassWrapper>, options);
    },
  };
}
