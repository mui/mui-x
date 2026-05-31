import * as React from 'react';
import Box from '@mui/material/Box';
import { ChartCopilot } from '@mui/x-charts-premium/copilot';
import {
  BEVERAGE_DATASET,
  TWO_SERIES_STATE,
  createChartCopilotDemoAdapter,
} from './chartCopilotDemoData';

const RESHAPE_SUGGESTIONS = [
  'Make it a bar chart',
  'Show as a pie chart',
  'Show coffee as an area chart',
];

export default function ChartReshapeDemo() {
  const [state, setState] = React.useState(TWO_SERIES_STATE);

  const ctxRef = React.useRef({ state, dataset: BEVERAGE_DATASET });
  ctxRef.current = { state, dataset: BEVERAGE_DATASET };

  const adapter = React.useMemo(
    () => createChartCopilotDemoAdapter(ctxRef, 'chart-copilot-reshape'),
    [],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <ChartCopilot
        dataset={BEVERAGE_DATASET}
        state={state}
        onStateChange={setState}
        chatAdapter={adapter}
        suggestions={RESHAPE_SUGGESTIONS}
        height={320}
      />
    </Box>
  );
}
