import * as React from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import {
  type ChatAdapter,
  type ChatMessageChunk,
  type ChatSendMessageInput,
  type ChatStreamEnvelope,
  createAiSdkAdapter,
} from '@mui/x-chat-headless';
import {
  DataStudio,
  type DataStudioDataSource,
  type DataStudioSheet,
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

const DATASETS: DataStudioDataSource<any>[] = [
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
function buildStudioContext(view: ContextRef): Record<string, unknown> {
  // Mirrors the package's `snapshotState` shape (sheets keyed by id), which is
  // what the backend `StudioStateDocumentSchema` (v2) validates against.
  const sheetsById: Record<string, unknown> = {};
  const sheetOrder: string[] = [];
  view.views.forEach((sheet) => {
    sheetsById[sheet.id] = {
      id: sheet.id,
      label:
        typeof sheet.label === 'string' ? sheet.label : String(sheet.label ?? ''),
      dataSourceId: sheet.dataSourceId,
      type: sheet.type ?? 'grid',
      initialState: sheet.initialState ?? {},
      params: sheet.params ?? {},
    };
    sheetOrder.push(sheet.id);
  });
  return {
    version: 2 as const,
    host: 'data-studio' as const,
    state: {
      active: { dataSourceId: view.activeDataSourceId, sheetId: view.activeSheetId },
      dataSources: view.dataSources.map((d) => ({
        id: d.id,
        label: typeof d.label === 'string' ? d.label : String(d.label ?? ''),
        columns: (d.columns ?? []).map((c) => ({
          field: c.field,
          ...(c.type ? { type: c.type } : {}),
          ...(c.headerName ? { headerName: c.headerName } : {}),
        })),
        ...(d.supportsServerGrouping
          ? { supportsServerGrouping: d.supportsServerGrouping }
          : {}),
        ...(d.joinGroup ? { joinGroup: d.joinGroup } : {}),
      })),
      sheets: sheetsById,
      sheetOrder,
      // This standalone demo does not track joint sources; a real <DataStudio>
      // serializes its joint configs here.
      jointSources: [],
    },
    catalog: {
      version: 2 as const,
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

interface ContextRef {
  views: ReadonlyArray<DataStudioSheet>;
  activeDataSourceId: string | null;
  activeSheetId: string | null;
  dataSources: ReadonlyArray<DataStudioDataSource<any>>;
}

function createBackendAdapter(
  ctxRef: React.MutableRefObject<ContextRef>,
): ChatAdapter {
  return createAiSdkAdapter({
    stream: async ({ conversationId, message, signal, metadata }) => {
      const userText = message.parts
        .map((part) => (part.type === 'text' ? part.text : null))
        .filter(Boolean)
        .join('\n');

      const studioContext = buildStudioContext(ctxRef.current);
      const copilotPlugins = (metadata as { copilotPlugins?: string[] } | undefined)
        ?.copilotPlugins;

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

interface EnvelopeRecipe {
  reply: string;
  patches?: Array<{
    op: 'add' | 'remove' | 'replace';
    path: string;
    value?: unknown;
  }>;
  commands?: Array<{ type: string; params?: unknown }>;
}

function pickRecipe(userText: string, viewIds: string[]): EnvelopeRecipe {
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
  if (/rename .* (to|as) ([\w -]+)/.test(text) && viewIds.length > 0) {
    const match = text.match(/rename .* (?:to|as) ([\w -]+)/);
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

let idCounter = 0;
function randomId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter.toString(36).padStart(8, '0')}`;
}

function mockStream(
  recipe: EnvelopeRecipe,
): ReadableStream<ChatMessageChunk | ChatStreamEnvelope> {
  const messageId = randomId('msg');
  const chunks: ChatMessageChunk[] = [];
  chunks.push({ type: 'start', messageId } as ChatMessageChunk);
  const textId = randomId('text');
  chunks.push({ type: 'text-start', id: textId } as unknown as ChatMessageChunk);
  recipe.reply.split(' ').forEach((word, i) => {
    chunks.push({
      type: 'text-delta',
      id: textId,
      delta: i === 0 ? word : ` ${word}`,
    } as unknown as ChatMessageChunk);
  });
  chunks.push({ type: 'text-end', id: textId } as unknown as ChatMessageChunk);

  if (recipe.patches && recipe.patches.length > 0) {
    const toolCallId = randomId('tool');
    chunks.push({
      type: 'tool-input-start',
      toolCallId,
      toolName: 'setGridState',
    } as unknown as ChatMessageChunk);
    chunks.push({
      type: 'tool-input-available',
      toolCallId,
      toolName: 'setGridState',
      input: { patches: recipe.patches.map((p) => JSON.stringify(p)).join('\n') },
    } as unknown as ChatMessageChunk);
  }

  if (recipe.commands && recipe.commands.length > 0) {
    const toolCallId = randomId('tool');
    chunks.push({
      type: 'tool-input-start',
      toolCallId,
      toolName: 'runCommands',
    } as unknown as ChatMessageChunk);
    chunks.push({
      type: 'tool-input-available',
      toolCallId,
      toolName: 'runCommands',
      input: { commands: recipe.commands.map((c) => JSON.stringify(c)).join('\n') },
    } as unknown as ChatMessageChunk);
  }

  chunks.push({
    type: 'finish',
    messageId,
    finishReason: 'stop',
  } as unknown as ChatMessageChunk);

  return new ReadableStream<ChatMessageChunk | ChatStreamEnvelope>({
    async start(controller) {
      for (const chunk of chunks) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
          setTimeout(resolve, 30);
        });
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });
}

function createMockAdapter(getViewIds: () => string[]): ChatAdapter {
  return {
    async sendMessage(input: ChatSendMessageInput) {
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
  const [views, setViews] = React.useState<DataStudioSheet[]>([]);
  const [activeDataSourceId, setActiveDatasetId] = React.useState<string | null>(
    DATASETS[0]?.id ?? null,
  );
  const [activeSheetId, setActiveViewId] = React.useState<string | null>(null);
  const viewIdsRef = React.useRef<string[]>([]);
  viewIdsRef.current = views.map((v) => v.id);

  const [useBackend, setUseBackend] = React.useState(false);
  const ctxRef = React.useRef<ContextRef>({
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

  const adapter = React.useMemo<ChatAdapter>(() => {
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
