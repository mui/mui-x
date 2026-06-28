import * as React from 'react';
import { type ChatAdapter, createAiSdkAdapter } from '@mui/x-chat-headless';
import {
  type ChartCopilotDataset,
  type ChartCopilotState,
  buildChartContext,
  createChartsCopilotLocalStorageAdapter,
} from '@mui/x-charts-premium/copilot';

// ──────────────────────────────────────────────────────────────────────────
// Shared sample data + backend wiring for the per-feature Copilot demos.
// ──────────────────────────────────────────────────────────────────────────

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const COFFEE = [120, 132, 101, 134, 190, 230, 210, 182, 191, 234, 290, 330];
const TEA = [90, 92, 101, 98, 110, 120, 130, 128, 140, 138, 150, 160];

export const BEVERAGE_ROWS = MONTHS.map((month, index) => ({
  id: index,
  month,
  coffee: COFFEE[index],
  tea: TEA[index],
}));

export const BEVERAGE_DATASET: ChartCopilotDataset = {
  id: 'beverage-sales',
  columns: [
    { field: 'month', headerName: 'Month', type: 'string' },
    { field: 'coffee', headerName: 'Coffee', type: 'number' },
    { field: 'tea', headerName: 'Tea', type: 'number' },
  ],
  rows: BEVERAGE_ROWS,
};

/** A populated two-series chart, used as the starting point for editing demos. */
export const TWO_SERIES_STATE: ChartCopilotState = {
  type: 'line',
  dimensions: [{ field: 'month' }],
  values: [{ field: 'coffee' }, { field: 'tea' }],
  configuration: {},
  label: 'Monthly beverage revenue',
};

// ──────────────────────────────────────────────────────────────────────────
// Backend wiring (mirrors docs/data/data-studio/copilot/StudioCopilot.tsx).
// The chat talks to the `charts` Copilot client at /api/v1/charts/copilot.
// Run the backend locally on :5055 in development.
// ──────────────────────────────────────────────────────────────────────────

const IS_DEV_HOST =
  typeof window !== 'undefined' &&
  /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|$)/.test(window.location.host);
const IS_DEPLOY = !IS_DEV_HOST && process.env.DEPLOY_ENV !== 'development';

export const BACKEND_URL = IS_DEPLOY
  ? 'https://mui-backend-pr-1691.onrender.com/api/v1/charts/copilot'
  : 'http://localhost:5055/api/v1/charts/copilot';

const API_KEY = IS_DEPLOY
  ? atob(
      'c2stbXVpLTNnRkpJREhDdGNRajJxV3BaaURpUUZFSjV0ZXF4QlF0RlFMVnk3dHpIcjY1Q1hkZFd0SXBvVzRLUm9a',
    )
  : atob(
      'c2stbXVpLVJrSlZUVVpNZU52UGk3cmZycGVzc2lSM3JVdW14ZEw2ZW00YmpjN0kxRlFZZ25oZDkzUkNxaFpUZnJs',
    );

export interface DemoContextRef {
  state: ChartCopilotState;
  dataset: ChartCopilotDataset;
}

/**
 * Builds a Copilot chat adapter wired to the `charts` backend client, wrapped in
 * the local-storage adapter so each demo keeps its own conversation history
 * under `storageKey`. The latest chart state + dataset are read from `ctxRef` on
 * every turn so the model always sees the current chart.
 */
export function createChartCopilotDemoAdapter(
  ctxRef: React.MutableRefObject<DemoContextRef>,
  storageKey: string,
): ChatAdapter {
  const backendAdapter = createAiSdkAdapter({
    stream: async ({ conversationId, message, signal }) => {
      const userText = message.parts
        .map((part) => (part.type === 'text' ? part.text : null))
        .filter(Boolean)
        .join('\n');

      const chartContext = buildChartContext(ctxRef.current.state, ctxRef.current.dataset);

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify({ query: userText, chartContext, conversationId }),
        signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Backend returned ${response.status}: ${errorText || response.statusText}`);
      }
      if (!response.body) {
        throw new Error('Backend response has no body');
      }
      return response.body;
    },
  });

  return createChartsCopilotLocalStorageAdapter(backendAdapter, { key: storageKey });
}
