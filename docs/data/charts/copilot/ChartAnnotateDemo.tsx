import * as React from 'react';
import Box from '@mui/material/Box';
import { ChartCopilot, type ChartCopilotState } from '@mui/x-charts-premium/copilot';
import {
  BEVERAGE_DATASET,
  TWO_SERIES_STATE,
  type DemoContextRef,
  createChartCopilotDemoAdapter,
} from './chartCopilotDemoData';

const ANNOTATE_SUGGESTIONS = [
  'Add a 3-month moving average of coffee',
  'Mark the peak of coffee',
  'Add a target line at 250',
  'Add a trend line for coffee',
];

export default function ChartAnnotateDemo() {
  const [state, setState] = React.useState<ChartCopilotState>(TWO_SERIES_STATE);

  const ctxRef = React.useRef<DemoContextRef>({ state, dataset: BEVERAGE_DATASET });
  ctxRef.current = { state, dataset: BEVERAGE_DATASET };

  const adapter = React.useMemo(
    () => createChartCopilotDemoAdapter(ctxRef, 'chart-copilot-annotate'),
    [],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <ChartCopilot
        dataset={BEVERAGE_DATASET}
        state={state}
        onStateChange={setState}
        chatAdapter={adapter}
        suggestions={ANNOTATE_SUGGESTIONS}
        height={320}
      />
    </Box>
  );
}
