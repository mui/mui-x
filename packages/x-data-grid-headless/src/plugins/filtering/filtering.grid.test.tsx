import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRenderer, act } from '@mui/internal-test-utils';
import { useDataGrid, type ColumnDef } from '../..';
import rowsPlugin from '../internal/rows/rows';
import { paginationPlugin } from '../pagination';
import { sortingPlugin, type SortingColumnMeta } from '../sorting';
import {
  filteringPlugin,
  type FilteringColumnMeta,
  type FilterModel,
  getStringFilterOperators,
  getNumericFilterOperators,
  EMPTY_FILTER_MODEL,
} from '.';
import type { FilteringOptions } from './types';

type TestRow = { id: number; name: string; age: number };

const defaultRows: TestRow[] = [
  { id: 1, name: 'Charlie', age: 30 },
  { id: 2, name: 'Alice', age: 25 },
  { id: 3, name: 'Bob', age: 35 },
];

type ColumnMeta = SortingColumnMeta & FilteringColumnMeta;

const defaultColumns: ColumnDef<TestRow, ColumnMeta>[] = [
  { id: 'name', field: 'name', filterOperators: getStringFilterOperators() },
  { id: 'age', field: 'age', filterOperators: getNumericFilterOperators() },
];

type GridApi = ReturnType<
  typeof useDataGrid<
    [typeof sortingPlugin, typeof filteringPlugin, typeof paginationPlugin],
    TestRow
  >
>;

interface TestDataGridWithFilterProps<TRow extends Record<string, any>> {
  rows: TRow[];
  columns: ColumnDef<TRow, ColumnMeta>[];
  getRowId?: (row: TRow) => string;
  apiRef?: React.RefObject<GridApi | null>;
  sorting?: Parameters<typeof useDataGrid>[0]['sorting'];
  filtering?: FilteringOptions['filtering'];
  initialState?: Parameters<typeof useDataGrid>[0]['initialState'];
}

function TestDataGridWithFilter<TRow extends Record<string, any>>(
  props: TestDataGridWithFilterProps<TRow>,
) {
  const { rows, columns, getRowId, apiRef, sorting, filtering, initialState } = props;

  const grid = useDataGrid({
    rows,
    columns,
    getRowId,
    plugins: [sortingPlugin, filteringPlugin, paginationPlugin],
    sorting,
    filtering,
    initialState,
  });

  React.useEffect(() => {
    if (apiRef) {
      (apiRef as React.RefObject<GridApi | null>).current = grid as any;
    }
  }, [grid, apiRef]);

  const filteredRowIds = grid.use(filteringPlugin.selectors.filteredRowIds);
  const rowsData = grid.use(rowsPlugin.selectors.rowIdToModelLookup);

  return (
    <div data-testid="grid">
      {filteredRowIds.map((rowId) => {
        const row = rowsData[rowId] as TRow | undefined;
        if (!row) {
          return null;
        }
        return (
          <div
            key={rowId}
            data-testid="row"
            {...Object.fromEntries(
              Object.entries(row).map(([key, value]) => [
                `data-${key.toLowerCase()}`,
                String(value),
              ]),
            )}
          >
            {(row as any).name ?? ''}
          </div>
        );
      })}
    </div>
  );
}

describe('Filtering Plugin - Integration Tests', () => {
  const { render } = createRenderer();

  const getRowNames = (container: HTMLElement): string[] => {
    const rows = container.querySelectorAll('[data-testid="row"]');
    return Array.from(rows).map((row) => row.getAttribute('data-name') || '');
  };

  describe('initial state', () => {
    it('should show all rows when no filter is applied', () => {
      const { container } = render(
        <TestDataGridWithFilter rows={defaultRows} columns={defaultColumns} />,
      );
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
    });

    it('should apply filter from initialState', () => {
      const { container } = render(
        <TestDataGridWithFilter
          rows={defaultRows}
          columns={defaultColumns}
          initialState={{
            filtering: {
              model: {
                logicOperator: 'and',
                conditions: [{ field: 'name', operator: 'contains', value: 'li' }],
              },
            },
          }}
        />,
      );
      // Alice and Charlie both contain 'li'
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice']);
    });

    it('should apply filter from filtering.model prop', () => {
      const { container } = render(
        <TestDataGridWithFilter
          rows={defaultRows}
          columns={defaultColumns}
          filtering={{
            model: {
              logicOperator: 'and',
              conditions: [{ field: 'name', operator: 'equals', value: 'Alice' }],
            },
          }}
        />,
      );
      expect(getRowNames(container)).toEqual(['Alice']);
    });

    it('should prefer filtering.model prop over initialState', () => {
      const { container } = render(
        <TestDataGridWithFilter
          rows={defaultRows}
          columns={defaultColumns}
          filtering={{
            model: {
              logicOperator: 'and',
              conditions: [{ field: 'name', operator: 'equals', value: 'Bob' }],
            },
          }}
          initialState={{
            filtering: {
              model: {
                logicOperator: 'and',
                conditions: [{ field: 'name', operator: 'equals', value: 'Alice' }],
              },
            },
          }}
        />,
      );
      expect(getRowNames(container)).toEqual(['Bob']);
    });
  });

  describe('API methods', () => {
    describe('setModel', () => {
      it('should update model and apply filtering', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGridWithFilter
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
          />,
        );

        await act(async () => {
          apiRef.current?.api.filtering.setModel({
            logicOperator: 'and',
            conditions: [{ field: 'age', operator: '>', value: 25 }],
          });
        });

        expect(getRowNames(container)).toEqual(['Charlie', 'Bob']);
      });
    });

    describe('getModel', () => {
      it('should return current model', () => {
        const apiRef = React.createRef<GridApi | null>();
        const model: FilterModel = {
          logicOperator: 'and',
          conditions: [{ field: 'name', operator: 'contains', value: 'li' }],
        };
        render(
          <TestDataGridWithFilter
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            filtering={{ model }}
          />,
        );

        expect(apiRef.current?.api.filtering.getModel()).toBe(model);
      });
    });

    describe('apply', () => {
      it('should recompute filtered rows in manual mode', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGridWithFilter
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            filtering={{ mode: 'manual' }}
          />,
        );

        // Set model without auto-apply
        await act(async () => {
          apiRef.current?.api.filtering.setModel({
            logicOperator: 'and',
            conditions: [{ field: 'name', operator: 'equals', value: 'Alice' }],
          });
        });

        // Model is set but not applied - all rows still visible
        expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);

        // Explicitly apply
        await act(async () => {
          apiRef.current?.api.filtering.apply();
        });

        expect(getRowNames(container)).toEqual(['Alice']);
      });
    });

    describe('computeFilteredRowIds', () => {
      it('should compute filtered rows without updating state', () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGridWithFilter
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
          />,
        );

        const computed = apiRef.current?.api.filtering.computeFilteredRowIds(undefined, {
          logicOperator: 'and',
          conditions: [{ field: 'name', operator: 'equals', value: 'Alice' }],
        });

        expect(computed).toEqual([2]); // Alice
        // State should not be affected
        expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
      });
    });
  });

  describe('callbacks', () => {
    describe('onModelChange', () => {
      it('should be called when model changes via setModel', async () => {
        const onModelChange = vi.fn();
        const apiRef = React.createRef<GridApi | null>();
        render(
          <TestDataGridWithFilter
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            filtering={{ onModelChange }}
          />,
        );

        const newModel: FilterModel = {
          logicOperator: 'and',
          conditions: [{ field: 'name', operator: 'equals', value: 'Alice' }],
        };

        await act(async () => {
          apiRef.current?.api.filtering.setModel(newModel);
        });

        expect(onModelChange).toHaveBeenCalledWith(newModel);
      });
    });
  });

  describe('filtering modes', () => {
    describe('auto mode (default)', () => {
      it('should re-filter when model changes', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGridWithFilter
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
          />,
        );

        await act(async () => {
          apiRef.current?.api.filtering.setModel({
            logicOperator: 'and',
            conditions: [{ field: 'age', operator: '>=', value: 30 }],
          });
        });

        expect(getRowNames(container)).toEqual(['Charlie', 'Bob']);
      });

      it('should re-filter when rows change', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGridWithFilter
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            initialState={{
              filtering: {
                model: {
                  logicOperator: 'and',
                  conditions: [{ field: 'age', operator: '>', value: 28 }],
                },
              },
            }}
          />,
        );

        expect(getRowNames(container)).toEqual(['Charlie', 'Bob']);

        // Update a row to make it pass the filter
        await act(async () => {
          apiRef.current?.api.rows.updateRows([{ id: 2, name: 'Alice', age: 40 }]);
        });

        expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
      });
    });

    describe('manual mode', () => {
      it('should NOT re-filter automatically when model changes', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGridWithFilter
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            filtering={{ mode: 'manual' }}
          />,
        );

        await act(async () => {
          apiRef.current?.api.filtering.setModel({
            logicOperator: 'and',
            conditions: [{ field: 'name', operator: 'equals', value: 'Alice' }],
          });
        });

        // Model is set but not applied
        expect(apiRef.current?.api.filtering.getModel()).toEqual({
          logicOperator: 'and',
          conditions: [{ field: 'name', operator: 'equals', value: 'Alice' }],
        });

        // All rows still visible
        expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);

        // After explicit apply
        await act(async () => {
          apiRef.current?.api.filtering.apply();
        });

        expect(getRowNames(container)).toEqual(['Alice']);
      });
    });
  });

  describe('controlled model', () => {
    it('should update when controlled filtering.model prop changes', async () => {
      const { container, setProps } = render(
        <TestDataGridWithFilter
          rows={defaultRows}
          columns={defaultColumns}
          filtering={{
            model: {
              logicOperator: 'and',
              conditions: [{ field: 'name', operator: 'equals', value: 'Alice' }],
            },
          }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Alice']);

      await act(async () => {
        setProps({
          filtering: {
            model: {
              logicOperator: 'and',
              conditions: [{ field: 'name', operator: 'equals', value: 'Bob' }],
            },
          },
        });
      });

      expect(getRowNames(container)).toEqual(['Bob']);
    });

    it('should clear filtering when model becomes empty', async () => {
      const { container, setProps } = render(
        <TestDataGridWithFilter
          rows={defaultRows}
          columns={defaultColumns}
          filtering={{
            model: {
              logicOperator: 'and',
              conditions: [{ field: 'name', operator: 'equals', value: 'Alice' }],
            },
          }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Alice']);

      await act(async () => {
        setProps({
          filtering: {
            model: EMPTY_FILTER_MODEL,
          },
        });
      });

      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
    });
  });

  describe('sorting interaction', () => {
    it('should preserve sort order in filtered results', () => {
      const { container } = render(
        <TestDataGridWithFilter
          rows={defaultRows}
          columns={defaultColumns}
          initialState={{
            sorting: { model: [{ field: 'name', direction: 'asc' }] },
            filtering: {
              model: {
                logicOperator: 'and',
                conditions: [{ field: 'age', operator: '>=', value: 30 }],
              },
            },
          }}
        />,
      );

      // Sorted alphabetically, then filtered to age >= 30
      // Alice(25) filtered out, Bob(35) and Charlie(30) remain in alphabetical order
      expect(getRowNames(container)).toEqual(['Bob', 'Charlie']);
    });

    it('should re-filter when sort order changes', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const { container } = render(
        <TestDataGridWithFilter
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
          initialState={{
            sorting: { model: [{ field: 'name', direction: 'asc' }] },
            filtering: {
              model: {
                logicOperator: 'and',
                conditions: [{ field: 'age', operator: '>=', value: 30 }],
              },
            },
          }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Bob', 'Charlie']);

      // Change sort order
      await act(async () => {
        apiRef.current?.api.sorting.setModel([{ field: 'name', direction: 'desc' }]);
      });

      // Same filtered rows, reversed order
      expect(getRowNames(container)).toEqual(['Charlie', 'Bob']);
    });
  });

  describe('nested filter groups', () => {
    it('should support nested AND/OR groups', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const { container } = render(
        <TestDataGridWithFilter
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
        />,
      );

      // (name contains 'li') AND (age = 25 OR age = 35)
      await act(async () => {
        apiRef.current?.api.filtering.setModel({
          logicOperator: 'and',
          conditions: [
            { field: 'name', operator: 'contains', value: 'li' },
            {
              logicOperator: 'or',
              conditions: [
                { field: 'age', operator: '=', value: 25 },
                { field: 'age', operator: '=', value: 35 },
              ],
            },
          ],
        });
      });

      // Alice (contains 'li', age=25), Charlie (contains 'li' — has no 'li', wait)
      // Actually: 'Charlie' contains 'li' => true, age=30 (not 25 or 35) => false
      // 'Alice' contains 'li' => true, age=25 => true
      // So only Alice
      expect(getRowNames(container)).toEqual(['Alice']);
    });
  });

  describe('disableEval parity', () => {
    it('should produce same results with and without eval', async () => {
      const model: FilterModel = {
        logicOperator: 'and',
        conditions: [
          { field: 'name', operator: 'contains', value: 'li' },
          { field: 'age', operator: '>', value: 25 },
        ],
      };

      const { container: container1 } = render(
        <TestDataGridWithFilter
          rows={defaultRows}
          columns={defaultColumns}
          filtering={{ model, disableEval: false }}
        />,
      );

      const { container: container2 } = render(
        <TestDataGridWithFilter
          rows={defaultRows}
          columns={defaultColumns}
          filtering={{ model, disableEval: true }}
        />,
      );

      expect(getRowNames(container1)).toEqual(getRowNames(container2));
    });
  });

  describe('non-filterable columns', () => {
    it('should skip conditions on non-filterable columns', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const columns: ColumnDef<TestRow, ColumnMeta>[] = [
        {
          id: 'name',
          field: 'name',
          filterable: false,
          filterOperators: getStringFilterOperators(),
        },
        { id: 'age', field: 'age', filterOperators: getNumericFilterOperators() },
      ];

      const { container } = render(
        <TestDataGridWithFilter rows={defaultRows} columns={columns} apiRef={apiRef} />,
      );

      await act(async () => {
        apiRef.current?.api.filtering.setModel({
          logicOperator: 'and',
          conditions: [
            { field: 'name', operator: 'equals', value: 'Alice' },
            { field: 'age', operator: '>', value: 20 },
          ],
        });
      });

      // name condition is skipped, only age > 20 applies - all rows pass
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
    });
  });

  describe('row updates with active filter', () => {
    it('should maintain filter when rows are updated via API', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const { container } = render(
        <TestDataGridWithFilter
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
          initialState={{
            filtering: {
              model: {
                logicOperator: 'and',
                conditions: [{ field: 'age', operator: '>', value: 28 }],
              },
            },
          }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Charlie', 'Bob']);

      // Update Alice's age to 40
      await act(async () => {
        apiRef.current?.api.rows.updateRows([{ id: 2, name: 'Alice', age: 40 }]);
      });

      // Alice should now be included
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
    });

    it('should maintain filter when adding new rows', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const { container } = render(
        <TestDataGridWithFilter
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
          initialState={{
            filtering: {
              model: {
                logicOperator: 'and',
                conditions: [{ field: 'name', operator: 'contains', value: 'ob' }],
              },
            },
          }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Bob']);

      // Add Robin
      await act(async () => {
        apiRef.current?.api.rows.updateRows([{ id: 4, name: 'Robin', age: 22 }]);
      });

      expect(getRowNames(container)).toEqual(['Bob', 'Robin']);
    });
  });
});
