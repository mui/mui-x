import { createAiSdkAdapter } from '@mui/x-chat-headless';
import {
  createStudioCopilotLocalStorageAdapter,
  studioFormulaPlugin,
  studioPdfReportPlugin,
  ALL_STUDIO_COMMAND_HANDLERS,
  ALL_STUDIO_PATCH_HANDLERS,
} from '@mui/x-data-studio';

// ──────────────────────────────────────────────────────────────────────────
// Live backend wiring (shared by the Data Studio overview demos)
//
// Mirrors `docs/data/data-studio/copilot/StudioCopilot.tsx`, but live-only:
// no mock adapter, no toggle. Both overview demos import
// `createStudioCopilotAdapter` to get a ready-to-use Copilot chat adapter.
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
 * Live view of the Studio surface, refreshed from the demo's
 * `onSheetsChange` / `onActiveDataSourceChange` / `onActiveSheetChange`
 * callbacks. Used to build the `studioContext` payload below.
 */

/**
 * Build a Studio context payload the backend can feed into the system prompt.
 * Exposes Studio's imperative surface — dataSources, views, and the `studio.*`
 * command/patch catalog — so a host-aware backend can branch on it.
 */
export function buildStudioContext(view) {
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
          // The unified backend reads `studioContext` for the Data Studio
          // route. Each host owns its own context field name (gridContext
          // for the Data Grid, studioContext here).
          query: userText,
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

/** Copilot plugins shared by the overview demos: cell formulas + PDF reports. */
export const STUDIO_COPILOT_PLUGINS = [
  studioFormulaPlugin(),
  studioPdfReportPlugin(),
];

/**
 * Build a ready-to-use Copilot chat adapter for a Data Studio demo: the live
 * backend adapter wrapped in a localStorage adapter for conversation
 * persistence. Pass a unique `storageKey` per demo so conversations don't
 * collide.
 */
export function createStudioCopilotAdapter({ ctxRef, storageKey }) {
  return createStudioCopilotLocalStorageAdapter(createBackendAdapter(ctxRef), {
    key: storageKey,
  });
}
