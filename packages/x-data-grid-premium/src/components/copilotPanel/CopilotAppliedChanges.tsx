'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import { useMessage, type ChatMessage, type ChatMessagePart } from '@mui/x-chat-headless';
import {
  getDataGridUtilityClass,
  gridColumnLookupSelector,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type {
  AppliedEntry,
  GridCopilotExecutionResult,
} from '../../hooks/features/copilot/executor';
import {
  buildAggregationChanges,
  buildChartChange,
  buildFilterChanges,
  buildGroupingChanges,
  buildPivotingChanges,
  buildSortingChanges,
  type Change,
  type ChangeBuilderHelpers,
} from '../prompt/changeBuilders';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'>;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['copilotAppliedChanges'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const CopilotAppliedChangesRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CopilotAppliedChanges',
})({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.spacing(0.5),
  width: '100%',
  marginTop: vars.spacing(0.5),
});

const COMMAND_LABELS: Record<string, string> = {
  'history.undo': 'Undo all previous message actions',
  'state.reset': 'Reset grid state',
  'state.restore': 'Restored state',
  'state.export': 'Exported state',
  'selection.selectRows': 'Selected rows',
  'selection.selectVisibleTop': 'Selected top rows',
  'selection.clear': 'Cleared selection',
  'columns.autosize': 'Autosized columns',
  'rows.expandAll': 'Expanded all groups',
  'rows.collapseAll': 'Collapsed all groups',
  'export.csv': 'Exported CSV',
  'export.excel': 'Exported Excel',
  'export.print': 'Printed',
  'view.scroll': 'Scrolled',
  'view.focus': 'Focused cell',
};

type CopilotToolName = 'setGridState' | 'runCommands';

interface CopilotToolInput {
  patches?: unknown;
  commands?: unknown;
}

interface PersistedCopilotMetadata {
  gridCopilotExecutionResult?: unknown;
  copilotExecutionResult?: unknown;
}

function humanizeCommandType(type: string): string {
  return (
    COMMAND_LABELS[type] ??
    type
      .split('.')
      .pop()!
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (c) => c.toUpperCase())
      .trim()
  );
}

function safeParse(line: string): any {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function isCopilotToolName(toolName: string): toolName is CopilotToolName {
  return toolName === 'setGridState' || toolName === 'runCommands';
}

function getToolInputBody(toolName: CopilotToolName, input: unknown): string {
  if (!isObject(input)) {
    return '';
  }

  const field: keyof CopilotToolInput = toolName === 'setGridState' ? 'patches' : 'commands';
  const value = input[field];

  return typeof value === 'string' ? value : '';
}

function lineToAppliedEntry(toolName: CopilotToolName, line: string): AppliedEntry | null {
  const parsed = safeParse(line);

  if (!parsed) {
    return null;
  }

  if (toolName === 'setGridState') {
    if (typeof parsed.path !== 'string') {
      return null;
    }

    return {
      kind: 'patch',
      line,
      path: parsed.path,
    };
  }

  if (typeof parsed.type !== 'string') {
    return null;
  }

  return {
    kind: 'command',
    line,
    type: parsed.type,
  };
}

function isGridCopilotExecutionResult(value: unknown): value is GridCopilotExecutionResult {
  return isObject(value) && Array.isArray(value.applied);
}

function getPersistedExecutionResult(
  message: ChatMessage | null,
): GridCopilotExecutionResult | undefined {
  const metadata = message?.metadata as PersistedCopilotMetadata | undefined;
  const result = metadata?.gridCopilotExecutionResult ?? metadata?.copilotExecutionResult;

  return isGridCopilotExecutionResult(result) ? result : undefined;
}

function partToAppliedEntries(part: ChatMessagePart): AppliedEntry[] {
  if (part.type !== 'tool' && part.type !== 'dynamic-tool') {
    return [];
  }

  const toolName = part.toolInvocation.toolName;

  if (!isCopilotToolName(toolName)) {
    return [];
  }

  return copilotToolInputToAppliedEntries(toolName, part.toolInvocation.input);
}

function messageToAppliedEntries(message: ChatMessage | null): AppliedEntry[] {
  const result = getPersistedExecutionResult(message);

  if (result) {
    return result.applied;
  }

  return message?.parts.flatMap(partToAppliedEntries) ?? [];
}

function copilotToolInputToAppliedEntries(
  toolName: CopilotToolName,
  input: unknown,
): AppliedEntry[] {
  return getToolInputBody(toolName, input)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => lineToAppliedEntry(toolName, line))
    .filter((entry): entry is AppliedEntry => entry !== null);
}

interface JsonPatchOp {
  op: 'add' | 'remove' | 'replace' | string;
  path: string;
  value?: any;
}

function stripTrailingIndex(path: string): string {
  // `/sort/-`, `/sort/0` → `/sort`
  return path.replace(/\/(?:-|\d+)$/, '');
}

function patchToChanges(parsed: JsonPatchOp, helpers: ChangeBuilderHelpers): Change[] {
  const { op, path, value } = parsed;
  const slots = helpers.slots;
  const base = stripTrailingIndex(path);
  const isAppend = path.endsWith('/-');
  const indexMatch = path.match(/\/(\d+)$/);
  const indexedAt = indexMatch ? parseInt(indexMatch[1], 10) : null;

  const fallbackChip = (label: string, description?: string): Change[] => [
    {
      label,
      description: description ?? `${op} ${path}`,
      icon: slots.promptIcon,
    },
  ];

  // ── /sort ────────────────────────────────────────────────────────────────
  if (base === '/sort' || path === '/sort') {
    if (op === 'remove' && path === '/sort') {
      return fallbackChip('Cleared sort', 'Removed all sort criteria');
    }
    if (path === '/sort' && Array.isArray(value)) {
      if (value.length === 0) {
        return fallbackChip('Cleared sort', 'Set sort to empty');
      }
      return buildSortingChanges(
        value.map((s) => ({ column: s.field, direction: s.sort === 'desc' ? 'desc' : 'asc' })),
        helpers,
      );
    }
    if (isAppend && value && value.field) {
      return buildSortingChanges(
        [{ column: value.field, direction: value.sort === 'desc' ? 'desc' : 'asc' }],
        helpers,
      );
    }
    if (indexedAt !== null && op === 'remove') {
      return fallbackChip(`Removed sort #${indexedAt + 1}`);
    }
    if (indexedAt !== null && value && value.field) {
      return buildSortingChanges(
        [{ column: value.field, direction: value.sort === 'desc' ? 'desc' : 'asc' }],
        helpers,
      );
    }
  }

  // ── /filter ──────────────────────────────────────────────────────────────
  if (path === '/filter') {
    if (op === 'remove') {
      return fallbackChip('Cleared filter', 'Removed all filter items');
    }
    const items = Array.isArray(value?.items) ? value.items : [];
    if (items.length === 0) {
      return fallbackChip('Cleared filter');
    }
    return buildFilterChanges(
      items.map((item: any) => ({
        column: item.field,
        operator: item.operator ?? 'is',
        value: item.value,
      })),
      helpers,
    );
  }
  if (path.startsWith('/filter/items')) {
    if (isAppend && value) {
      return buildFilterChanges(
        [{ column: value.field, operator: value.operator ?? 'is', value: value.value }],
        helpers,
      );
    }
    if (op === 'remove') {
      return fallbackChip('Removed filter');
    }
  }

  // ── /grouping ────────────────────────────────────────────────────────────
  if (path === '/grouping') {
    if (op === 'remove' || (Array.isArray(value) && value.length === 0)) {
      return fallbackChip('Cleared grouping');
    }
    if (Array.isArray(value)) {
      return buildGroupingChanges(
        value.map((field: string) => ({ column: field })),
        helpers,
      );
    }
  }
  if (base === '/grouping' && isAppend && typeof value === 'string') {
    return buildGroupingChanges([{ column: value }], helpers);
  }

  // ── /aggregation ─────────────────────────────────────────────────────────
  if (path === '/aggregation') {
    if (op === 'remove' || !value || Object.keys(value).length === 0) {
      return fallbackChip('Cleared aggregation');
    }
    return buildAggregationChanges(value as Record<string, string>, helpers);
  }
  if (path.startsWith('/aggregation/')) {
    const field = path.slice('/aggregation/'.length);
    if (op === 'remove') {
      return fallbackChip(`Removed aggregation: ${field}`);
    }
    if (typeof value === 'string') {
      return buildAggregationChanges({ [field]: value }, helpers);
    }
  }

  // ── /pivot, /pivot/active, /pivot/model ──────────────────────────────────
  if (path === '/pivot/active') {
    const active = value === true;
    return [
      {
        label: active ? 'Pivot enabled' : 'Pivot disabled',
        description: active ? 'Enable pivot' : 'Disable pivot',
        icon: slots.promptPivotIcon,
      },
    ];
  }
  if (path === '/pivot/model' && value) {
    return buildPivotingChanges(toPivotingShape(value), helpers);
  }
  if (path === '/pivot') {
    if (op === 'remove') {
      return fallbackChip('Pivot disabled', 'Removed pivot configuration');
    }
    if (value?.model) {
      return buildPivotingChanges(toPivotingShape(value.model), helpers);
    }
  }

  // ── /charts/<id> and sub-paths ───────────────────────────────────────────
  if (path.startsWith('/charts/')) {
    const tokens = path.split('/'); // ['', 'charts', '<id>', ...]
    const chartId = tokens[2];
    const sub = tokens.slice(3).join('/');
    if (!sub) {
      if (op === 'remove') {
        return fallbackChip(`Removed chart "${chartId}"`);
      }
      const dims = value?.dimensions ?? [];
      const vals = value?.values ?? [];
      return [buildChartChange({ dimensions: dims, values: vals }, helpers)];
    }
    if (sub === 'dimensions' || sub === 'values') {
      const count = Array.isArray(value) ? value.length : 0;
      return fallbackChip(`Chart "${chartId}": ${sub} (${count})`, `${op} chart ${chartId} ${sub}`);
    }
    if (sub === 'type' && typeof value === 'string') {
      return fallbackChip(`Chart "${chartId}": ${value}`);
    }
    return fallbackChip(`Chart "${chartId}" (${sub})`);
  }

  // ── /columns/* ───────────────────────────────────────────────────────────
  if (path === '/columns/visibility') {
    return fallbackChip('Column visibility', `Updated column visibility model`);
  }
  if (path.startsWith('/columns/visibility/')) {
    const field = path.slice('/columns/visibility/'.length);
    const visible = value !== false && op !== 'remove';
    return fallbackChip(`${visible ? 'Show' : 'Hide'} ${getColumnName(helpers, field)}`);
  }
  if (path === '/columns/pinned' || path.startsWith('/columns/pinned/')) {
    return fallbackChip('Pinned columns', 'Updated pinned columns');
  }
  if (path === '/columns/order' || path.startsWith('/columns/order')) {
    return fallbackChip('Reordered columns');
  }
  if (path.startsWith('/columns/widths/')) {
    const field = path.slice('/columns/widths/'.length);
    return fallbackChip(`Resized ${getColumnName(helpers, field)}`);
  }

  // ── /view/* ──────────────────────────────────────────────────────────────
  if (path === '/view/sidebar') {
    if (value == null) {
      return fallbackChip('Closed sidebar');
    }
    return fallbackChip(`Opened sidebar: ${String(value)}`);
  }
  if (path === '/view/density' && typeof value === 'string') {
    return fallbackChip(`Density: ${value}`);
  }
  if (path === '/view/pagination' || path.startsWith('/view/pagination')) {
    return fallbackChip('Updated pagination');
  }
  if (path === '/view/chartsPanelOpen') {
    return fallbackChip(value ? 'Opened charts panel' : 'Closed charts panel');
  }
  if (path === '/view/preferences') {
    if (value == null) {
      return fallbackChip('Closed preferences');
    }
    return fallbackChip(`Preferences: ${String(value)}`);
  }
  if (path === '/view/activeChartId' && typeof value === 'string') {
    return fallbackChip(`Active chart: ${value}`);
  }

  // ── /selection/* ─────────────────────────────────────────────────────────
  if (path === '/selection/rows') {
    if (op === 'remove' || !value || (Array.isArray(value.ids) && value.ids.length === 0)) {
      return fallbackChip('Cleared row selection');
    }
    const count = Array.isArray(value.ids) ? value.ids.length : 0;
    return fallbackChip(`Selected ${count} row${count === 1 ? '' : 's'}`);
  }
  if (path === '/selection/cells') {
    return fallbackChip('Cell selection');
  }

  // Fallback for unknown paths — keep the action visible.
  const tail = path.split('/').filter(Boolean).pop() ?? path;
  return fallbackChip(tail, `${op} ${path}`);
}

function getColumnName(helpers: ChangeBuilderHelpers, field: string): string {
  return helpers.columns[field]?.headerName ?? field;
}

function toPivotingShape(model: any) {
  const columns = Array.isArray(model?.columns) ? model.columns : [];
  const rows = Array.isArray(model?.rows) ? model.rows : [];
  const values = Array.isArray(model?.values) ? model.values : [];
  return {
    columns: columns.map((c: any) => ({ column: c.field, direction: c.sort })),
    rows: rows.map((r: any) => (typeof r === 'string' ? r : r?.field)).filter(Boolean),
    values: values
      .map((v: any) => (v?.field ? { [v.field]: v.aggFunc ?? 'sum' } : null))
      .filter(Boolean) as Array<Record<string, string>>,
  };
}

function commandEntryToChange(
  parsed: { type: string; params?: any },
  helpers: ChangeBuilderHelpers,
  rawType: string,
): Change {
  const label = humanizeCommandType(parsed?.type ?? rawType);
  return {
    label,
    description: parsed?.type ?? rawType,
    icon: helpers.slots.promptIcon,
  };
}

function entryToChanges(entry: AppliedEntry, helpers: ChangeBuilderHelpers): Change[] {
  // Synthetic auto-activate entry pushed by the executor — `line` isn't JSON.
  if (entry.kind === 'patch' && entry.line === '<auto>') {
    if (entry.path === '/pivot/active') {
      return [
        {
          label: 'Pivot enabled',
          description: entry.description ?? 'auto-activated because /pivot/model was configured',
          icon: helpers.slots.promptPivotIcon,
        },
      ];
    }
    if (entry.path === '/columns/pinned') {
      const description = entry.description ?? 'auto-pinned grouping columns to the left';
      const label = description.startsWith('auto-unpinned')
        ? 'Unpinned grouping columns'
        : 'Pinned grouping columns';
      return [
        {
          label,
          description,
          icon: helpers.slots.promptGroupIcon,
        },
      ];
    }
    if (entry.path === '/columns/order') {
      const description = entry.description ?? 'auto-reordered columns';
      const label = description.startsWith('auto-restored')
        ? 'Restored column order'
        : 'Moved aggregated columns';
      return [
        {
          label,
          description,
          icon: helpers.slots.promptAggregationIcon,
        },
      ];
    }
  }

  const parsed = safeParse(entry.line);
  if (!parsed) {
    return [];
  }

  if (entry.kind === 'patch') {
    return patchToChanges(parsed as JsonPatchOp, helpers);
  }
  return [commandEntryToChange(parsed, helpers, entry.type)];
}

function CopilotAppliedChanges({ messageId }: { messageId: string }) {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const columns = useGridSelector(apiRef, gridColumnLookupSelector);
  const message = useMessage(messageId);

  const subscribe = React.useCallback(
    (listener: () => void) => apiRef.current.copilot.subscribeResults(listener),
    [apiRef],
  );
  const getSnapshot = React.useCallback(
    () => apiRef.current.copilot.getResultsForMessage(messageId),
    [apiRef, messageId],
  );
  const result = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const appliedEntries = React.useMemo(
    () => result?.applied ?? messageToAppliedEntries(message),
    [message, result],
  );

  const changes = React.useMemo<Change[]>(() => {
    if (appliedEntries.length === 0) {
      return [];
    }
    const helpers: ChangeBuilderHelpers = { apiRef, slots: rootProps.slots, columns };
    const out: Change[] = [];
    appliedEntries.forEach((entry) => {
      out.push(...entryToChanges(entry, helpers));
    });
    return out;
  }, [appliedEntries, apiRef, rootProps.slots, columns]);

  if (changes.length === 0) {
    return null;
  }

  return (
    <CopilotAppliedChangesRoot className={classes.root}>
      {changes.map((c, index) => (
        <rootProps.slots.baseTooltip key={`${c.label}-${index}`} title={c.description}>
          <rootProps.slots.baseChip label={c.label} icon={<c.icon />} size="small" />
        </rootProps.slots.baseTooltip>
      ))}
    </CopilotAppliedChangesRoot>
  );
}

export { CopilotAppliedChanges, copilotToolInputToAppliedEntries, entryToChanges };
