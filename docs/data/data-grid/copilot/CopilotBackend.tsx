import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  DataGridPremium,
  GridChartsIntegrationContextProvider,
  GridChartsPanel,
  GridChartsRendererProxy,
  GridSidebarValue,
  createGridCopilotLocalStorageAdapter,
  type GridApi,
  type GridColDef,
  type GridCopilotAdapter,
  snapshotState,
  buildGuards,
} from '@mui/x-data-grid-premium';
import type { RefObject } from '@mui/x-internals/types';
import { createAiSdkAdapter } from '@mui/x-chat-headless';
import { useDemoData } from '@mui/x-data-grid-generator';
import {
  ChartsRenderer,
  configurationOptions,
} from '@mui/x-charts-premium/ChartsRenderer';

const IS_DEPLOY = process.env.DEPLOY_ENV !== 'development';
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
  const columns = Object.values(lookup as Record<string, any>).map((col) => {
    let pinned: 'left' | 'right' | null = null;
    if (state.columns.pinned.left?.includes(col.field)) {
      pinned = 'left';
    } else if (state.columns.pinned.right?.includes(col.field)) {
      pinned = 'right';
    }
    return {
      field: col.field,
      headerName: col.headerName,
      description: col.description ?? null,
      type: col.type ?? 'string',
      allowedOperators: (col.filterOperators ?? []).map((op: any) => op.value),
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
            "Revert every action applied by the previous assistant message (one history slice) in a single step.",
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

function createBackendAdapter(apiRef: RefObject<GridApi>): GridCopilotAdapter {
  return createAiSdkAdapter({
    stream: async ({ message, signal }) => {
      const userText = message.parts
        .map((part) => (part.type === 'text' ? part.text : null))
        .filter(Boolean)
        .join('\n');

      const body = {
        query: userText,
        gridContext: buildGridContext(apiRef),
      };

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': API_KEY,
        },
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

export default function CopilotBackend() {
  const apiRef = React.useRef<GridApi>(null);
  const [dataSet, setDataSet] = React.useState<DataSet>('Employee');
  const { data } = useDemoData({
    dataSet,
    visibleFields: VISIBLE_FIELDS[dataSet],
    rowLength: 100,
  });

  const adapter = React.useMemo(
    () =>
      createGridCopilotLocalStorageAdapter(
        createBackendAdapter(apiRef as unknown as RefObject<GridApi>),
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
    <GridChartsIntegrationContextProvider>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
          <Tabs
            value={dataSet}
            onChange={(_, value) => setDataSet(value as DataSet)}
          >
            <Tab label="Employees" value="Employee" />
            <Tab label="Commodities" value="Commodity" />
          </Tabs>
        </Box>
        <Box sx={{ height: 560, width: '100%' }}>
          <DataGridPremium
            key={dataSet}
            apiRef={apiRef}
            {...data}
            columns={columns}
            {...COPILOT_PROPS}
            copilotAdapter={adapter}
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
  );
}
