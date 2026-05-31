import * as React from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { createAiSdkAdapter } from '@mui/x-chat-headless';
import {
  DataStudio,
  createStudioCopilotLocalStorageAdapter,
  studioFormulaPlugin,
  studioPdfReportPlugin,
  ALL_STUDIO_COMMAND_HANDLERS,
  ALL_STUDIO_PATCH_HANDLERS,
} from '@mui/x-data-studio';

// ──────────────────────────────────────────────────────────────────────────
// Sample data
// ──────────────────────────────────────────────────────────────────────────

const SALES_ROWS = Array.from({ length: 40 }, (_, i) => {
  const regions = ['North', 'South', 'East', 'West'];
  return {
    id: i + 1,
    region: regions[i % regions.length],
    product: ['Coffee', 'Tea', 'Cocoa', 'Sugar'][i % 4],
    units: 5 + ((i * 37) % 90),
    revenue: Math.round(((i * 73 + 11) % 900) * 1.5 + 200),
  };
});

const CUSTOMERS_ROWS = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Customer ${i + 1}`,
  tier: ['gold', 'silver', 'bronze'][i % 3],
  ltv: Math.round(((i * 113) % 5000) + 200),
}));

const DATASETS = [
  {
    id: 'sales',
    label: 'Sales',
    rows: SALES_ROWS,
    columns: [
      { field: 'id', headerName: 'ID', width: 60 },
      { field: 'region', headerName: 'Region', width: 110 },
      { field: 'product', headerName: 'Product', width: 110 },
      { field: 'units', headerName: 'Units', width: 90, type: 'number' },
      { field: 'revenue', headerName: 'Revenue', width: 120, type: 'number' },
    ],
  },
  {
    id: 'customers',
    label: 'Customers',
    rows: CUSTOMERS_ROWS,
    columns: [
      { field: 'id', headerName: 'ID', width: 60 },
      { field: 'name', headerName: 'Name', width: 160 },
      { field: 'tier', headerName: 'Tier', width: 100 },
      { field: 'ltv', headerName: 'LTV', width: 100, type: 'number' },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────
// Backend wiring (matches docs/data/data-grid/copilot/CopilotBackend.tsx)
// ──────────────────────────────────────────────────────────────────────────

const IS_DEV_HOST =
  typeof window !== 'undefined' &&
  /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|$)/.test(window.location.host);
const IS_DEPLOY = !IS_DEV_HOST && process.env.DEPLOY_ENV !== 'development';
const BACKEND_URL = IS_DEPLOY
  ? 'https://mui-backend-pr-1691.onrender.com/api/v1/datastudio/copilot'
  : 'http://localhost:5055/api/v1/datastudio/copilot';
const API_KEY = IS_DEPLOY
  ? atob(
      'c2stbXVpLTNnRkpJREhDdGNRajJxV3BaaURpUUZFSjV0ZXF4QlF0RlFMVnk3dHpIcjY1Q1hkZFd0SXBvVzRLUm9a',
    )
  : atob(
      'c2stbXVpLVJrSlZUVVpNZU52UGk3cmZycGVzc2lSM3JVdW14ZEw2ZW00YmpjN0kxRlFZZ25oZDkzUkNxaFpUZnJs',
    );

/**
 * Build a Studio context payload the backend can feed into the system prompt.
 * Mirrors `buildGridContext` from `CopilotBackend.tsx` but exposes Studio's
 * imperative surface — dataSources, views, and the `studio.*` command catalog.
 *
 * Built from `onSheetsChange` / `onActiveDataSourceChange` callbacks since the
 * Studio component doesn't expose its state API ref externally yet — that
 * keeps the demo close to what an integrator can do today.
 */
function buildStudioContext(view) {
  const viewsById = {};
  const viewOrder = [];
  view.views.forEach((v) => {
    viewsById[v.id] = {
      id: v.id,
      label: typeof v.label === 'string' ? v.label : String(v.label ?? ''),
      dataSourceId: v.dataSourceId,
      initialState: v.initialState ?? {},
    };
    viewOrder.push(v.id);
  });
  return {
    version: 1,
    host: 'data-studio',
    state: {
      active: { dataSourceId: view.activeDataSourceId, viewId: view.activeSheetId },
      dataSources: view.dataSources.map((d) => ({
        id: d.id,
        label: typeof d.label === 'string' ? d.label : String(d.label ?? ''),
      })),
      views: viewsById,
      viewOrder,
    },
    catalog: {
      version: 1,
      commands: ALL_STUDIO_COMMAND_HANDLERS.map((handler) => ({
        type: handler.type,
        namespace: handler.namespace,
        tier: handler.tier,
        plan: handler.plan,
        guard: handler.guard,
      })),
      statePaths: ALL_STUDIO_PATCH_HANDLERS.map((handler) => ({
        path: handler.path,
        allowedOps: handler.allowedOps,
        guard: handler.guard,
      })),
    },
  };
}

function createBackendAdapter(ctxRef) {
  return createAiSdkAdapter({
    stream: async ({ conversationId, message, signal, metadata }) => {
      const userText = message.parts
        .map((part) => (part.type === 'text' ? part.text : null))
        .filter(Boolean)
        .join('\n');

      const studioContext = buildStudioContext(ctxRef.current);
      const copilotPlugins = metadata?.copilotPlugins;

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({
          query: userText,
          // The unified backend reads `studioContext` for the Data Studio
          // route. Each host owns its own context field name (gridContext
          // for the Data Grid, studioContext here).
          studioContext,
          copilotPlugins: Array.isArray(copilotPlugins) ? copilotPlugins : undefined,
          conversationId,
        }),
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

// ──────────────────────────────────────────────────────────────────────────
// Mock adapter (offline / no-backend fallback)
// ──────────────────────────────────────────────────────────────────────────

function pickRecipe(userText, viewIds) {
  const text = userText.toLowerCase().trim();

  if (/add (a )?(new )?view/.test(text) || /create (a )?(new )?view/.test(text)) {
    const isChart = /chart/.test(text);
    const isCustomers = /customer/.test(text);
    return {
      reply: isChart ? 'Adding a new chart view.' : 'Adding a new grid view.',
      commands: [
        {
          type: 'studio.addView',
          params: {
            dataSourceId: isCustomers ? 'customers' : 'sales',
            kind: isChart ? 'chart' : 'grid',
            label: isChart ? 'Revenue chart' : 'Custom view',
          },
        },
      ],
    };
  }
  if (/switch to customers|select customers|show customers/.test(text)) {
    return {
      reply: 'Switching to the Customers dataSource.',
      commands: [
        { type: 'studio.selectDataSource', params: { dataSourceId: 'customers' } },
      ],
    };
  }
  if (/switch to sales|select sales|show sales/.test(text)) {
    return {
      reply: 'Switching to the Sales dataSource.',
      commands: [
        { type: 'studio.selectDataSource', params: { dataSourceId: 'sales' } },
      ],
    };
  }
  if (/rename .* (to|as) ([\w \-]+)/.test(text) && viewIds.length > 0) {
    const match = text.match(/rename .* (?:to|as) ([\w \-]+)/);
    const newLabel = match?.[1]?.trim() ?? 'Renamed';
    return {
      reply: `Renaming the active view to "${newLabel}".`,
      commands: [
        {
          type: 'studio.renameView',
          params: { viewId: viewIds[viewIds.length - 1], label: newLabel },
        },
      ],
    };
  }
  if (/sort .* by revenue|sort by revenue/.test(text) && viewIds.length > 0) {
    return {
      reply: 'Saving sort-by-revenue on the active view.',
      patches: [
        {
          op: 'replace',
          path: `/views/${viewIds[viewIds.length - 1]}/initialState`,
          value: { sorting: { sortModel: [{ field: 'revenue', sort: 'desc' }] } },
        },
      ],
    };
  }
  if (/filter .* west|west region/.test(text) && viewIds.length > 0) {
    return {
      reply: 'Saving West-region filter on the active view.',
      patches: [
        {
          op: 'replace',
          path: `/views/${viewIds[viewIds.length - 1]}/initialState`,
          value: {
            filter: {
              filterModel: {
                items: [{ field: 'region', operator: 'equals', value: 'West' }],
              },
            },
          },
        },
      ],
    };
  }
  if (/delete .* view|remove .* view/.test(text) && viewIds.length > 0) {
    return {
      reply: 'Deleting the active view.',
      commands: [
        {
          type: 'studio.deleteView',
          params: { viewId: viewIds[viewIds.length - 1] },
        },
      ],
    };
  }
  return {
    reply:
      "Try: 'add a new view', 'switch to customers', 'rename the view to Top Sales', " +
      "'sort by revenue desc', 'filter to West region', or 'delete the view'.",
  };
}

function randomId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function mockStream(recipe) {
  const messageId = randomId('msg');
  const chunks = [];
  chunks.push({ type: 'start', messageId });
  const textId = randomId('text');
  chunks.push({ type: 'text-start', id: textId });
  recipe.reply.split(' ').forEach((word, i) => {
    chunks.push({
      type: 'text-delta',
      id: textId,
      delta: i === 0 ? word : ` ${word}`,
    });
  });
  chunks.push({ type: 'text-end', id: textId });

  if (recipe.patches && recipe.patches.length > 0) {
    const toolCallId = randomId('tool');
    chunks.push({
      type: 'tool-input-start',
      toolCallId,
      toolName: 'setGridState',
    });
    chunks.push({
      type: 'tool-input-available',
      toolCallId,
      toolName: 'setGridState',
      input: { patches: recipe.patches.map((p) => JSON.stringify(p)).join('\n') },
    });
  }

  if (recipe.commands && recipe.commands.length > 0) {
    const toolCallId = randomId('tool');
    chunks.push({
      type: 'tool-input-start',
      toolCallId,
      toolName: 'runCommands',
    });
    chunks.push({
      type: 'tool-input-available',
      toolCallId,
      toolName: 'runCommands',
      input: { commands: recipe.commands.map((c) => JSON.stringify(c)).join('\n') },
    });
  }

  chunks.push({
    type: 'finish',
    messageId,
    finishReason: 'stop',
  });

  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 30));
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });
}

function createMockAdapter(getViewIds) {
  return {
    async sendMessage(input) {
      const userText = input.message.parts
        .map((part) => (part.type === 'text' ? part.text : null))
        .filter(Boolean)
        .join('\n');
      const recipe = pickRecipe(userText, getViewIds());
      return mockStream(recipe);
    },
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Plugins
// ──────────────────────────────────────────────────────────────────────────

const COPILOT_PLUGINS = [studioFormulaPlugin(), studioPdfReportPlugin()];

// ──────────────────────────────────────────────────────────────────────────
// Demo entry
// ──────────────────────────────────────────────────────────────────────────

export default function StudioCopilot() {
  const [views, setViews] = React.useState([]);
  const [activeDataSourceId, setActiveDatasetId] = React.useState(
    DATASETS[0]?.id ?? null,
  );
  const [activeSheetId, setActiveViewId] = React.useState(null);
  const viewIdsRef = React.useRef([]);
  viewIdsRef.current = views.map((v) => v.id);

  const [useBackend, setUseBackend] = React.useState(false);
  const ctxRef = React.useRef({
    views: [],
    activeDataSourceId,
    activeSheetId,
    dataSources: DATASETS,
  });
  ctxRef.current = {
    views,
    activeDataSourceId,
    activeSheetId,
    dataSources: DATASETS,
  };

  const adapter = React.useMemo(() => {
    const inner = useBackend
      ? createBackendAdapter(ctxRef)
      : createMockAdapter(() => viewIdsRef.current);
    return createStudioCopilotLocalStorageAdapter(inner, {
      key: useBackend ? 'studio-copilot-demo-backend' : 'studio-copilot-demo-mock',
    });
  }, [useBackend]);

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1, px: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={useBackend}
              onChange={(_, value) => setUseBackend(value)}
              size="small"
            />
          }
          label={useBackend ? 'Live backend' : 'Mock adapter'}
        />
        <Box component="span" sx={{ color: 'text.secondary', fontSize: 12 }}>
          {useBackend
            ? `POSTs to ${BACKEND_URL.replace(/^https?:\/\//, '')}`
            : 'Self-contained — works offline, recognises a fixed set of prompts.'}
        </Box>
      </Stack>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataStudio
          dataSources={DATASETS}
          plan="premium"
          layout="tabs"
          copilotChatAdapter={adapter}
          copilotPlugins={COPILOT_PLUGINS}
          defaultSheets={[]}
          onSheetsChange={setViews}
          onActiveDataSourceChange={(id) => setActiveDatasetId(id)}
          onActiveSheetChange={(id) => setActiveViewId(id)}
        />
      </Box>
    </Box>
  );
}
