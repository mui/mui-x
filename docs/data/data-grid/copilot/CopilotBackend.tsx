import * as React from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  CopilotFeedbackProvider,
  DataGridPremium,
  GridChartsIntegrationContextProvider,
  GridChartsPanel,
  GridChartsRendererProxy,
  GridSidebarValue,
  buildCopilotColumnContext,
  createGridCopilotAbAdapter,
  createGridCopilotLocalStorageAdapter,
  type CopilotFeedbackPayload,
  type GridApi,
  type GridColDef,
  type GridCopilotAdapter,
  snapshotState,
  buildGuards,
} from '@mui/x-data-grid-premium';
import type { RefObject } from '@mui/x-internals/types';
import { createAiSdkAdapter, type ChatMessage } from '@mui/x-chat-headless';
import { useDemoData } from '@mui/x-data-grid-generator';
import {
  ChartsRenderer,
  configurationOptions,
} from '@mui/x-charts-premium/ChartsRenderer';
import { pdfReportPlugin } from '@mui/x-copilot/plugins/pdf';
// formulaPlugin temporarily disabled — the plugin factory now requires a host
// `buildEvalContext`; the demo's grid wiring for that is mid-refactor.

// Single plugin instance per module — stable reference avoids re-running the
// executor's plugin dispatcher across renders.
const COPILOT_PLUGINS = [pdfReportPlugin()];

// Pick the local backend whenever the demo is loaded from a localhost
// dev server, regardless of `DEPLOY_ENV`. The previous gate only flipped
// to localhost when `DEPLOY_ENV === 'development'`, which Next.js's
// `next dev` doesn't set — so local docs always hit the Render preview
// backend and missed any backend changes that hadn't shipped yet.
const IS_DEV_HOST =
  typeof window !== 'undefined' &&
  /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|$)/.test(window.location.host);
const IS_DEPLOY = !IS_DEV_HOST && process.env.DEPLOY_ENV !== 'development';
const BACKEND_URL = IS_DEPLOY
  ? 'https://mui-backend-pr-1691.onrender.com/api/v1/datagrid/copilot'
  : 'http://localhost:5055/api/v1/datagrid/copilot';
// Local-dev test key from apps/mui-backend/.env.local; deploy preview uses the PR-1691 key.
const API_KEY = IS_DEPLOY
  ? atob(
      'c2stbXVpLTNnRkpJREhDdGNRajJxV3BaaURpUUZFSjV0ZXF4QlF0RlFMVnk3dHpIcjY1Q1hkZFd0SXBvVzRLUm9a',
    )
  : atob(
      'c2stbXVpLVJrSlZUVVpNZU52UGk3cmZycGVzc2lSM3JVdW14ZEw2ZW00YmpjN0kxRlFZZ25oZDkzUkNxaFpUZnJs',
    );

type DataSet = 'Employee' | 'Commodity';

const VISIBLE_FIELDS: Record<DataSet, string[]> = {
  Employee: [
    'id',
    'name',
    'website',
    'rating',
    'email',
    'position',
    'company',
    'salary',
    'country',
    'city',
  ],
  Commodity: [
    'id',
    'desk',
    'commodity',
    'traderName',
    'traderEmail',
    'quantity',
    'filledQuantity',
    'status',
    'unitPrice',
    'unitPriceCurrency',
    'subTotal',
    'feeRate',
    'feeAmount',
    'incoTerm',
  ],
};

// Per-dataset column overrides so the column menu reliably shows "Group by …"
// and "Aggregation" for the columns that make sense. The demo generator's column
// defs use the default `groupable: true` from the string col-def spread, but we
// pin it explicitly so the demo doesn't rely on that implicit default and so
// numeric columns advertise the right aggregation functions.
const COLUMN_OVERRIDES: Record<DataSet, Record<string, Partial<GridColDef>>> = {
  Employee: {
    rating: {
      groupable: true,
      aggregable: true,
      availableAggregationFunctions: ['avg', 'min', 'max', 'size'],
    },
    email: { groupable: true },
    position: { groupable: true, aggregable: false },
    company: { groupable: true, aggregable: false },
    salary: {
      groupable: true,
      aggregable: true,
      availableAggregationFunctions: ['sum', 'avg', 'min', 'max', 'size'],
    },
    country: { groupable: true, aggregable: false },
    city: { groupable: true, aggregable: false },
  },
  Commodity: {
    desk: { groupable: true, aggregable: false },
    commodity: { groupable: true, aggregable: false },
    traderName: { groupable: true, aggregable: false },
    traderEmail: { groupable: true, aggregable: false },
    quantity: {
      groupable: true,
      aggregable: true,
      availableAggregationFunctions: ['sum', 'avg', 'min', 'max', 'size'],
    },
    filledQuantity: {
      groupable: true,
      aggregable: true,
      availableAggregationFunctions: ['sum', 'avg', 'min', 'max'],
    },
    status: { groupable: true, aggregable: false },
    unitPrice: {
      groupable: true,
      aggregable: true,
      availableAggregationFunctions: ['avg', 'min', 'max'],
    },
    unitPriceCurrency: { groupable: true, aggregable: false },
    subTotal: {
      groupable: true,
      aggregable: true,
      availableAggregationFunctions: ['sum', 'avg', 'min', 'max'],
    },
    feeRate: {
      groupable: true,
      aggregable: true,
      availableAggregationFunctions: ['avg', 'min', 'max'],
    },
    feeAmount: {
      groupable: true,
      aggregable: true,
      availableAggregationFunctions: ['sum', 'avg', 'min', 'max'],
    },
    incoTerm: { groupable: true, aggregable: false },
  },
};

const SUGGESTIONS: Record<DataSet, string[]> = {
  Employee: [
    'Sort by salary descending',
    'Filter to people with rating above 4',
    'Group employees by country and aggregate salary',
    'Pivot rows=country, columns=position, values=avg salary',
    'Chart average salary by country',
  ],
  Commodity: [
    'Sort by sub-total descending',
    'Filter to orders that are not yet filled',
    'Group by desk and sum quantity',
    'Pivot rows=commodity, columns=status, values=sum sub-total',
    'Chart total sub-total by commodity',
  ],
};

// All premium grid features are enabled so the Copilot can drive any of them.
// Aggregation, row grouping, and pivoting are on by default in DataGridPremium;
// charts integration and selection are opt-in, so we explicitly enable them
// (and keep the defaults visible in this list for clarity).
const COPILOT_PROPS = {
  copilot: true,
  chartsIntegration: true,
  cellSelection: true,
  rowSelection: true,
  checkboxSelection: true,
  disableAggregation: false,
  disableRowGrouping: false,
  disablePivoting: false,
  disableColumnFilter: false,
  disableColumnSelector: false,
};

function buildGridContext(apiRef: RefObject<GridApi>) {
  const state = snapshotState(apiRef as any);
  const guards = buildGuards({
    ...(COPILOT_PROPS as any),
  } as any);

  const lookup = (apiRef.current as any).state.columns?.lookup ?? {};
  const columns = Object.values(lookup as Record<string, GridColDef>).map((col) => {
    let pinned: 'left' | 'right' | null = null;
    if (state.columns.pinned.left?.includes(col.field)) {
      pinned = 'left';
    } else if (state.columns.pinned.right?.includes(col.field)) {
      pinned = 'right';
    }
    return {
      ...buildCopilotColumnContext(col),
      visible: state.columns.visibility[col.field] !== false,
      pinned,
      examples: [],
    };
  });

  return {
    version: 1 as const,
    capabilities: { guards, plan: 'premium' as const },
    columns,
    aggregationFunctions: ['sum', 'avg', 'min', 'max', 'size'],
    state,
    catalog: {
      version: 1 as const,
      statePaths: [],
      commands: [
        {
          type: 'history.undo',
          namespace: 'history',
          tier: 2,
          plan: 'premium',
          guard: null,
          description:
            'Revert every action applied by the previous assistant message (one history slice) in a single step.',
        },
        {
          type: 'state.reset',
          namespace: 'state',
          tier: 2,
          plan: 'premium',
          guard: null,
          description:
            'Clear all shaping in one step: sort, filter, grouping, aggregation, pivot, charts, column visibility/pinning/order, selection.',
        },
        {
          type: 'state.restore',
          namespace: 'state',
          tier: 2,
          plan: 'community',
          guard: null,
          description: 'Restore a previously saved grid state.',
        },
        {
          type: 'state.export',
          namespace: 'state',
          tier: 2,
          plan: 'community',
          guard: null,
          description: 'Export the current grid state.',
        },
        {
          type: 'view.scroll',
          namespace: 'view',
          tier: 2,
          plan: 'community',
          guard: null,
          description: 'Scroll the viewport to a rowIndex/colIndex.',
        },
        {
          type: 'view.focus',
          namespace: 'view',
          tier: 2,
          plan: 'community',
          guard: null,
          description: 'Focus a specific cell (id, field).',
        },
        {
          type: 'columns.autosize',
          namespace: 'columns',
          tier: 2,
          plan: 'community',
          guard: null,
          description: 'Autosize columns to content.',
        },
        {
          type: 'rows.expandAll',
          namespace: 'rows',
          tier: 2,
          plan: 'pro',
          guard: null,
          description: 'Expand every group row.',
        },
        {
          type: 'rows.collapseAll',
          namespace: 'rows',
          tier: 2,
          plan: 'pro',
          guard: null,
          description: 'Collapse every group row.',
        },
        {
          type: 'selection.selectVisibleTop',
          namespace: 'selection',
          tier: 1,
          plan: 'community',
          guard: 'rowSelection',
          description: 'Select the top N visible rows.',
        },
      ],
    },
  };
}

// Pull out any approved `queryGridData` tool outputs from the conversation
// history so the backend can resume the model loop with the user-approved
// data. Each approved tool result becomes a `{toolCallId, toolName, output}`
// entry in the request body; the backend wraps them as a synthesized
// user-role message before calling streamText.
function extractApprovedToolResults(messages: readonly ChatMessage[]): Array<{
  toolCallId: string;
  toolName: string;
  output: unknown;
}> {
  const results: Array<{ toolCallId: string; toolName: string; output: unknown }> =
    [];
  for (const message of messages) {
    if (message.role !== 'assistant') {
      continue;
    }
    for (const part of message.parts) {
      if (part.type !== 'tool') {
        continue;
      }
      const invocation = part.toolInvocation;
      if (
        invocation?.state === 'output-available' &&
        invocation.approval?.approved === true &&
        invocation.toolName === 'queryGridData'
      ) {
        results.push({
          toolCallId: invocation.toolCallId,
          toolName: invocation.toolName,
          output: invocation.output,
        });
      }
    }
  }
  return results;
}

type ApprovedToolResult = { toolCallId: string; toolName: string; output: unknown };

// The base origin to resolve A/B twin URLs (which the backend hands out as
// relative paths) against the same host that served the original request.
function deriveBackendOrigin(): string {
  try {
    return new URL(BACKEND_URL).origin;
  } catch {
    return '';
  }
}

const BACKEND_ORIGIN = deriveBackendOrigin();

interface BackendAdapterOptions {
  // When `true`, the demo forces every request into A/B-test mode via the
  // `x-ab-test-force: on` header. When `false`, requests run in single-stream
  // mode regardless of the backend's `COPILOT_AB_TEST_RATE`. `null` lets the
  // backend's environment decide.
  forceAbMode: 'on' | 'off' | null;
}

function createBackendAdapter(
  apiRef: RefObject<GridApi>,
  optionsRef: React.MutableRefObject<BackendAdapterOptions>,
): GridCopilotAdapter {
  return createAiSdkAdapter({
    stream: async ({ conversationId, message, messages, metadata, signal }) => {
      const userText = message.parts
        .map((part) => (part.type === 'text' ? part.text : null))
        .filter(Boolean)
        .join('\n');

      // Prefer tool results carried in `metadata.toolResults` (set by the
      // Copilot adapter wrapper on the follow-up `sendMessage`). Fall back to
      // scanning the message history for any approved queryGridData outputs
      // — kept only for back-compat with older Copilot wrappers.
      const metaResults = (
        metadata as { toolResults?: ApprovedToolResult[] } | undefined
      )?.toolResults;
      const toolResults =
        Array.isArray(metaResults) && metaResults.length > 0
          ? metaResults
          : extractApprovedToolResults(messages);

      // The Copilot wrapper injects `metadata.copilotPlugins = [...pluginIds]`
      // on every `sendMessage` so the backend can conditionally register
      // matching server-side tool definitions with the model.
      const copilotPlugins = (metadata as { copilotPlugins?: string[] } | undefined)
        ?.copilotPlugins;

      // The A/B adapter sets `metadata.abTwin` on the second call so we
      // know to fetch the twin URL (variant B) instead of the primary
      // endpoint. The body is identical to the primary request so the
      // server can replay the conversation against the alternate cell.
      const abTwin = (
        metadata as
          | { abTwin?: { twinUrl: string; pairId: string; variant: 'B' } }
          | undefined
      )?.abTwin;
      const targetUrl = abTwin
        ? `${BACKEND_ORIGIN}${abTwin.twinUrl}`
        : BACKEND_URL;

      const headers: Record<string, string> = {
        'content-type': 'application/json',
        'x-api-key': API_KEY,
      };
      // Honour the demo's AB toggle on the primary fetch only — the twin
      // fetch goes through the route's `pairId` branch which already
      // knows it's AB mode.
      if (!abTwin && optionsRef.current.forceAbMode) {
        headers['x-ab-test-force'] = optionsRef.current.forceAbMode;
      }

      const body = {
        query: userText,
        gridContext: buildGridContext(apiRef),
        toolResults: toolResults.length > 0 ? toolResults : undefined,
        copilotPlugins: Array.isArray(copilotPlugins) ? copilotPlugins : undefined,
        conversationId,
      };

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(
          `Backend returned ${response.status}: ${errorText || response.statusText}`,
        );
      }
      if (!response.body) {
        throw new Error('Backend response has no body');
      }
      return response.body;
    },
  });
}

/**
 * POSTs a thumbs-up/down or A/B-pick payload to the backend's feedback
 * endpoint. Maps the panel's payload shape onto the discriminated body the
 * backend expects (`kind: 'thumbs' | 'ab-pick'`).
 */
async function submitCopilotFeedback(payload: CopilotFeedbackPayload): Promise<void> {
  const body =
    payload.kind === 'thumbs'
      ? {
          kind: 'thumbs' as const,
          requestId: payload.responseId,
          feedback: payload.feedback,
          comment: payload.comment,
        }
      : {
          kind: 'ab-pick' as const,
          abPairId: payload.abPairId,
          chosenRequestId: payload.chosenResponseId,
          otherRequestId: payload.otherResponseId,
          comment: payload.comment,
        };
  const response = await fetch(`${BACKEND_ORIGIN}/api/v1/datagrid/copilot/feedback`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Feedback failed: ${response.status} ${text}`);
  }
}

export default function CopilotBackend() {
  const apiRef = React.useRef<GridApi>(null);
  const [dataSet, setDataSet] = React.useState<DataSet>('Employee');
  // Demo-only A/B toggle, OFF by default so the demo shows a normal
  // single-response Copilot experience. When ON, every request adds the
  // `x-ab-test-force: on` header so the backend always serves a paired
  // response (variant A on the open stream + variant B on the twin
  // fetch) regardless of the server's `COPILOT_AB_TEST_RATE` env.
  // Toggling OFF passes `x-ab-test-force: off` so the demo's mode stays
  // deterministic.
  const [abMode, setAbMode] = React.useState<boolean>(false);
  const abOptionsRef = React.useRef<BackendAdapterOptions>({
    forceAbMode: abMode ? 'on' : 'off',
  });
  React.useEffect(() => {
    abOptionsRef.current = { forceAbMode: abMode ? 'on' : 'off' };
  }, [abMode]);
  const { data } = useDemoData({
    dataSet,
    visibleFields: VISIBLE_FIELDS[dataSet],
    rowLength: 100,
  });

  const adapter = React.useMemo(
    () =>
      createGridCopilotLocalStorageAdapter(
        createGridCopilotAbAdapter(
          createBackendAdapter(apiRef as unknown as RefObject<GridApi>, abOptionsRef),
        ),
        {
          key: `copilot-demo-${dataSet}`,
        },
      ),
    [dataSet],
  );

  const columns = React.useMemo(() => {
    const overrides = COLUMN_OVERRIDES[dataSet];
    return data.columns.map((col) => ({
      ...col,
      ...(overrides[col.field] ?? {}),
    }));
  }, [data.columns, dataSet]);

  return (
    <CopilotFeedbackProvider submit={submitCopilotFeedback}>
      <GridChartsIntegrationContextProvider>
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Tabs value={dataSet} onChange={(_, value) => setDataSet(value as DataSet)}>
              <Tab label="Employees" value="Employee" />
              <Tab label="Commodities" value="Commodity" />
            </Tabs>
            <FormControlLabel
              control={
                <Switch
                  checked={abMode}
                  onChange={(_, checked) => setAbMode(checked)}
                  size="small"
                />
              }
              label="A/B test mode"
              title={
                abMode
                  ? 'Every request will return two candidate answers (variant A and B). Pick one to record the winner.'
                  : 'Single response per request.'
              }
              sx={{ mr: 1 }}
            />
          </Box>
          <Box
            sx={{
              height: { xs: 560, md: 'calc(100vh - 320px)' },
              minHeight: 560,
              width: '100%',
            }}
          >
            <DataGridPremium
              key={dataSet}
              apiRef={apiRef}
              {...data}
              columns={columns}
              {...COPILOT_PROPS}
              copilotAdapter={adapter}
              copilotPlugins={COPILOT_PLUGINS}
              copilotSuggestions={SUGGESTIONS[dataSet]}
              slots={{ chartsPanel: GridChartsPanel }}
              slotProps={{ chartsPanel: { schema: configurationOptions } }}
              initialState={{
                sidebar: { open: true, value: GridSidebarValue.Copilot },
              }}
              showToolbar
            />
          </Box>
          <Box sx={{ height: 320, width: '100%', mt: 2 }}>
            <GridChartsRendererProxy id="main" renderer={ChartsRenderer} />
          </Box>
        </Box>
      </GridChartsIntegrationContextProvider>
    </CopilotFeedbackProvider>
  );
}
