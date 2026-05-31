import * as React from 'react';
import Box from '@mui/material/Box';
import { ChartCopilot, type ChartCopilotState } from '@mui/x-charts-premium/copilot';
import {
  BEVERAGE_DATASET,
  type DemoContextRef,
  createChartCopilotDemoAdapter,
} from './chartCopilotDemoData';

// Ask starts from a blank canvas — the chart is created from the question.
const EMPTY_STATE: ChartCopilotState = {
  type: 'line',
  dimensions: [],
  values: [],
  configuration: {},
};

const ASK_SUGGESTIONS = [
  'Chart coffee over the months',
  'Show coffee and tea by month',
  'Plot the monthly tea trend',
];

export default function ChartAskDemo() {
  const [state, setState] = React.useState<ChartCopilotState>(EMPTY_STATE);

  const ctxRef = React.useRef<DemoContextRef>({ state, dataset: BEVERAGE_DATASET });
  ctxRef.current = { state, dataset: BEVERAGE_DATASET };

  const adapter = React.useMemo(
    () => createChartCopilotDemoAdapter(ctxRef, 'chart-copilot-ask'),
    [],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <ChartCopilot
        dataset={BEVERAGE_DATASET}
        state={state}
        onStateChange={setState}
        chatAdapter={adapter}
        suggestions={ASK_SUGGESTIONS}
        height={320}
      />
    </Box>
  );
}
