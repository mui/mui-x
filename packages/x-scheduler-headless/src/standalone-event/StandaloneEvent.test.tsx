import * as React from 'react';
import { StandaloneEvent } from '@mui/x-scheduler-headless/standalone-event';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<StandaloneEvent />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(
    <StandaloneEvent data={{ id: '1', title: 'External event' }} renderDragPreview={() => null} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render,
    }),
  );
});
