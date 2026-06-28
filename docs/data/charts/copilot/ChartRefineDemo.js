import * as React from 'react';
import Box from '@mui/material/Box';
import { ChartCopilot } from '@mui/x-charts-premium/copilot';
import {
  BEVERAGE_DATASET,
  createChartCopilotDemoAdapter,
} from './chartCopilotDemoData';

// Refine starts from a populated bar chart and edits it conversationally.
const BAR_STATE = {
  type: 'bar',
  dimensions: [{ field: 'month' }],
  values: [{ field: 'coffee' }, { field: 'tea' }],
  configuration: {},
  label: 'Monthly beverage revenue',
};

const REFINE_SUGGESTIONS = [
  'Stack the series',
  'Show only coffee',
  'Use a vivid color palette',
  'Add a legend at the bottom',
];

export default function ChartRefineDemo() {
  const [state, setState] = React.useState(BAR_STATE);

  const ctxRef = React.useRef({ state, dataset: BEVERAGE_DATASET });
  ctxRef.current = { state, dataset: BEVERAGE_DATASET };

  const adapter = React.useMemo(
    () => createChartCopilotDemoAdapter(ctxRef, 'chart-copilot-refine'),
    [],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <ChartCopilot
        dataset={BEVERAGE_DATASET}
        state={state}
        onStateChange={setState}
        chatAdapter={adapter}
        suggestions={REFINE_SUGGESTIONS}
        height={320}
      />
    </Box>
  );
}
