import { StandaloneEvent } from '@mui/x-scheduler-internals/standalone-event';
import { createSchedulerRenderer, describeConformance, EventBuilder } from 'test/utils/scheduler';
import { describe } from 'vitest';

describe('<StandaloneEvent />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(
    <StandaloneEvent data={EventBuilder.new().build()} renderDragPreview={() => null} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render,
    }),
  );
});
