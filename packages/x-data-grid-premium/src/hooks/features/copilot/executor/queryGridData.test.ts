import { describe, expect, it } from 'vitest';
import {
  executeGridDataQuery,
  previewGridDataQuery,
  type GridDataQueryInput,
} from './queryGridData';

// Minimal fake apiRef shape that satisfies the tiny apiRef surface used by
// queryGridData. The real `apiRef.current` has dozens of methods we don't
// need here.
type Row = Record<string, unknown>;

function buildApiRef(options: {
  rows: Row[];
  selectedIds?: ReadonlyArray<string | number>;
  visibility?: Record<string, boolean>;
  orderedFields?: string[];
  lookup?: Record<string, { field: string; headerName?: string }>;
}) {
  const rows = options.rows;
  const byId = new Map<unknown, Row>(rows.map((row) => [row.id, row]));
  const selectedMap = new Map<unknown, Row>();
  (options.selectedIds ?? []).forEach((id) => {
    const row = byId.get(id);
    if (row) {
      selectedMap.set(id, row);
    }
  });
  return {
    current: {
      getAllRowIds: () => Array.from(byId.keys()),
      getRowId: (row: Row) => row.id,
      getRow: (id: unknown) => byId.get(id),
      getSelectedRows: () => selectedMap,
      state: {
        rows: { dataRowIdToModelLookup: Object.fromEntries(byId) },
        columns: {
          lookup: options.lookup ?? buildLookup(rows),
          orderedFields:
            options.orderedFields ?? Object.keys(rows[0] ?? {}).filter((k) => k !== 'id'),
          columnVisibilityModel: options.visibility ?? {},
        },
      },
    },
  } as any;
}

function buildLookup(rows: Row[]): Record<string, { field: string; headerName?: string }> {
  const fields = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((field) => fields.add(field)));
  const lookup: Record<string, { field: string; headerName?: string }> = {};
  fields.forEach((field) => {
    lookup[field] = { field, headerName: field };
  });
  return lookup;
}

// `getVisibleRows` returns whatever `apiRef.current.state.rows` produces in
// the real grid. We patch the module under test via the imported helper.
// Easier: smoke-test against `rowFilter: 'all'` and `rowFilter: 'selected'`,
// which don't depend on `getVisibleRows`. The visible path is exercised by
// the broader integration tests.
const sampleRows: Row[] = [
  { id: 1, name: 'Ada', salary: 100, country: 'UK' },
  { id: 2, name: 'Babbage', salary: 200, country: 'UK' },
  { id: 3, name: 'Curie', salary: 150, country: 'FR' },
];

describe('queryGridData', () => {
  describe('executeGridDataQuery', () => {
    it('returns selected rows with requested columns', () => {
      const apiRef = buildApiRef({ rows: sampleRows, selectedIds: [1, 3] });
      const input: GridDataQueryInput = {
        mode: 'rows',
        rowFilter: 'selected',
        columns: ['name', 'salary'],
      };
      const result = executeGridDataQuery(input, apiRef);
      expect(result.meta.mode).toBe('rows');
      expect(result.meta.rowCount).toBe(2);
      expect(result.rows).toEqual([
        { name: 'Ada', salary: 100 },
        { name: 'Curie', salary: 150 },
      ]);
    });

    it('returns all rows in "all" mode', () => {
      const apiRef = buildApiRef({ rows: sampleRows });
      const result = executeGridDataQuery(
        { mode: 'rows', rowFilter: 'all', columns: ['name'] },
        apiRef,
      );
      expect(result.meta.rowCount).toBe(3);
      expect(result.rows).toHaveLength(3);
    });

    it('truncates rows past the configured limit', () => {
      const rows: Row[] = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        name: `r${i}`,
        salary: i * 10,
      }));
      const apiRef = buildApiRef({ rows });
      const result = executeGridDataQuery(
        { mode: 'rows', rowFilter: 'all', columns: ['name'], limit: 3 },
        apiRef,
      );
      expect(result.rows).toHaveLength(3);
      expect(result.meta.truncatedBy).toBe(7);
    });

    it('computes aggregations over the selected rows', () => {
      const apiRef = buildApiRef({ rows: sampleRows });
      const result = executeGridDataQuery(
        {
          mode: 'aggregate',
          rowFilter: 'all',
          aggregations: [
            { field: 'salary', fn: 'sum' },
            { field: 'salary', fn: 'avg' },
            { field: 'salary', fn: 'min' },
            { field: 'salary', fn: 'max' },
            { field: 'salary', fn: 'count' },
          ],
        },
        apiRef,
      );
      expect(result.aggregations).toEqual([
        { field: 'salary', fn: 'sum', value: 450 },
        { field: 'salary', fn: 'avg', value: 150 },
        { field: 'salary', fn: 'min', value: 100 },
        { field: 'salary', fn: 'max', value: 200 },
        { field: 'salary', fn: 'count', value: 3 },
      ]);
    });

    it('returns null for aggregations with no numeric values', () => {
      const apiRef = buildApiRef({ rows: sampleRows });
      const result = executeGridDataQuery(
        {
          mode: 'aggregate',
          rowFilter: 'all',
          aggregations: [{ field: 'country', fn: 'sum' }],
        },
        apiRef,
      );
      expect(result.aggregations).toEqual([{ field: 'country', fn: 'sum', value: null }]);
    });
  });

  describe('previewGridDataQuery', () => {
    it('reports row count without computing aggregations', () => {
      const apiRef = buildApiRef({ rows: sampleRows });
      const preview = previewGridDataQuery(
        { mode: 'aggregate', rowFilter: 'all', aggregations: [{ field: 'salary', fn: 'sum' }] },
        apiRef,
      );
      expect(preview.mode).toBe('aggregate');
      expect(preview.rowCount).toBe(3);
      expect(preview.aggregations).toEqual([{ field: 'salary', fn: 'sum' }]);
      expect(preview.willTruncate).toBe(false);
    });

    it('builds a sample.rows preview for "rows" mode', () => {
      const apiRef = buildApiRef({ rows: sampleRows });
      const preview = previewGridDataQuery(
        { mode: 'rows', rowFilter: 'all', columns: ['name', 'country', 'salary'] },
        apiRef,
      );
      expect(preview.sample.rows).toEqual([
        { name: 'Ada', country: 'UK', salary: '100' },
        { name: 'Babbage', country: 'UK', salary: '200' },
        { name: 'Curie', country: 'FR', salary: '150' },
      ]);
      expect(preview.sample.columns?.map((c) => c.field)).toEqual(['name', 'country', 'salary']);
    });

    it('builds sample.aggregations for "aggregate" mode', () => {
      const apiRef = buildApiRef({ rows: sampleRows });
      const preview = previewGridDataQuery(
        {
          mode: 'aggregate',
          rowFilter: 'all',
          aggregations: [
            { field: 'salary', fn: 'sum' },
            { field: 'salary', fn: 'avg' },
          ],
        },
        apiRef,
      );
      expect(preview.sample.aggregations).toEqual([
        { field: 'salary', fn: 'sum', value: 450 },
        { field: 'salary', fn: 'avg', value: 150 },
      ]);
      expect(preview.sample.rows).toBeUndefined();
    });

    it('flags truncation when limit is below available row count', () => {
      const rows: Row[] = Array.from({ length: 10 }, (_, i) => ({ id: i, name: `r${i}` }));
      const apiRef = buildApiRef({ rows });
      const preview = previewGridDataQuery({ mode: 'rows', rowFilter: 'all', limit: 5 }, apiRef);
      expect(preview.willTruncate).toBe(true);
    });

    it('falls back to ordered visible fields when no columns are requested', () => {
      const apiRef = buildApiRef({
        rows: sampleRows,
        orderedFields: ['name', 'country', 'salary'],
        visibility: { country: false },
      });
      const preview = previewGridDataQuery({ mode: 'rows', rowFilter: 'all' }, apiRef);
      expect(preview.columns.map((c) => c.field)).toEqual(['name', 'salary']);
    });
  });
});
