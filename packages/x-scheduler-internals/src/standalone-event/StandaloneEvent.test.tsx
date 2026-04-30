import { StandaloneEvent } from '@mui/x-scheduler-internals/standalone-event';
import { createSchedulerRenderer, describeConformance, EventBuilder } from 'test/utils/scheduler';

describe('<StandaloneEvent />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(
    <StandaloneEvent data={EventBuilder.new().toProcessed()} renderDragPreview={() => null} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render,
    }),
  );
});
