import type { PromptResponse } from '../../aiAssistant/gridAiAssistantInterfaces';
import type { GridCopilotEnvelope } from './types';

interface PatchOp {
  op: 'replace' | 'add' | 'remove';
  path: string;
  value?: unknown;
}

function lines(ops: PatchOp[]): string {
  return ops.map((o) => JSON.stringify(o)).join('\n');
}

/**
 * Convert a legacy `PromptResponse` into the equivalent `setGridState` +
 * `runCommands` JSONL streams. Same effective behaviour as today's
 * `applyPromptResult`, but expressed as the new envelope so the executor can
 * be the single dispatch path.
 */
export function promptResponseToPatches(r: PromptResponse): GridCopilotEnvelope {
  const patches: PatchOp[] = [];
  const commands: Array<{ type: string; params?: unknown }> = [];

  if (r.filters?.length || r.filterOperator) {
    patches.push({
      op: 'replace',
      path: '/filter',
      value: {
        items: r.filters.map((f, id) => ({
          id,
          field: f.column,
          operator: f.operator,
          value: f.value,
        })),
        logicOperator: r.filterOperator ?? 'and',
        quickFilterValues: [],
      },
    });
  }

  const hasPivoting = r.pivoting && 'columns' in r.pivoting;
  if (hasPivoting) {
    const pivoting = r.pivoting as {
      columns: { column: string; direction: 'asc' | 'desc' }[];
      rows: string[];
      values: Record<string, string>[];
    };
    patches.push({
      op: 'replace',
      path: '/pivot',
      value: {
        active: true,
        model: {
          columns: pivoting.columns.map((c) => ({ field: c.column, sort: c.direction })),
          rows: pivoting.rows.map((field) => ({ field })),
          values: pivoting.values.map((v) => {
            const [field] = Object.keys(v);
            return { field, aggFunc: v[field] };
          }),
        },
      },
    });
  } else {
    patches.push({ op: 'replace', path: '/pivot/active', value: false });
    if (r.grouping?.length) {
      patches.push({
        op: 'replace',
        path: '/grouping',
        value: r.grouping.map((g) => g.column),
      });
    }
    if (r.aggregation && Object.keys(r.aggregation).length > 0) {
      patches.push({ op: 'replace', path: '/aggregation', value: r.aggregation });
    }
  }

  if (r.sorting?.length) {
    patches.push({
      op: 'replace',
      path: '/sort',
      value: r.sorting.map((s) => ({ field: s.column, sort: s.direction })),
    });
  }

  if (r.chart) {
    patches.push({
      op: 'replace',
      path: '/charts/main',
      value: {
        type: 'column',
        dimensions: r.chart.dimensions.map((field) => ({ field })),
        values: r.chart.values.map((field) => ({ field })),
        synced: true,
      },
    });
  }

  if (typeof r.select === 'number' && r.select > 0) {
    commands.push({
      type: 'selection.selectVisibleTop',
      params: { count: r.select },
    });
  }

  return {
    setGridState: patches.length > 0 ? lines(patches) : undefined,
    runCommands:
      commands.length > 0 ? commands.map((c) => JSON.stringify(c)).join('\n') : undefined,
  };
}
