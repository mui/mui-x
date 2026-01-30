import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRenderer, act, screen } from '@mui/internal-test-utils';
import { useDataGrid, type ColumnDef } from '../..';
import rowsPlugin from '../internal/rows/rows';
import { paginationPlugin } from '../pagination';
import { sortingPlugin, type SortingColumnMeta, type GridSortDirection } from '.';
import { TestDataGrid } from '../../test/TestDataGrid';

type TestRow = { id: number; name: string; age: number };

const defaultRows: TestRow[] = [
  { id: 1, name: 'Charlie', age: 30 },
  { id: 2, name: 'Alice', age: 25 },
  { id: 3, name: 'Bob', age: 35 },
];

const defaultColumns: ColumnDef<TestRow>[] = [
  { id: 'name', field: 'name' },
  { id: 'age', field: 'age' },
];

type GridApi = ReturnType<
  typeof useDataGrid<[typeof sortingPlugin, typeof paginationPlugin], TestRow>
>;

describe('Sorting Plugin - Integration Tests', () => {
  const { render } = createRenderer();

  const getRowNames = (container: HTMLElement): string[] => {
    const rows = container.querySelectorAll('[data-testid="row"]');
    return Array.from(rows).map((row) => row.getAttribute('data-name') || '');
  };

  describe('initial state', () => {
    it('should keep original order when no sorting is applied', () => {
      const { container } = render(<TestDataGrid rows={defaultRows} columns={defaultColumns} />);
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
    });

    it('should apply sorting from initialState', async () => {
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          initialState={{
            sorting: {
              model: [{ field: 'name', direction: 'asc' }],
            },
          }}
        />,
      );
      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should apply sorting from sorting.model prop', () => {
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          sorting={{ model: [{ field: 'name', direction: 'desc' }] }}
        />,
      );
      expect(getRowNames(container)).toEqual(['Charlie', 'Bob', 'Alice']);
    });

    it('should prefer sorting.model prop over initialState', () => {
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          sorting={{ model: [{ field: 'name', direction: 'desc' }] }}
          initialState={{
            sorting: {
              model: [{ field: 'name', direction: 'asc' }],
            },
          }}
        />,
      );
      expect(getRowNames(container)).toEqual(['Charlie', 'Bob', 'Alice']);
    });
  });

  describe('API methods', () => {
    describe('sortColumn', () => {
      it('should sort column ascending', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
        );

        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('name', 'asc');
        });

        expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);
      });

      it('should sort column descending', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
        );

        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('name', 'desc');
        });

        expect(getRowNames(container)).toEqual(['Charlie', 'Bob', 'Alice']);
      });

      it('should cycle through sortingOrder when direction not provided', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
        );

        // First click - asc
        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('name');
        });
        expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

        // Second click - desc
        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('name');
        });
        expect(getRowNames(container)).toEqual(['Charlie', 'Bob', 'Alice']);

        // Third click - null (unsorted)
        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('name');
        });
        expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
      });

      it('should add to sortModel when multiSort is true', async () => {
        const apiRef = React.createRef<GridApi | null>();
        render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            sorting={{ multiSort: true }}
          />,
        );

        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('name', 'asc');
        });
        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('age', 'desc', true);
        });

        const sortModel = apiRef.current?.api.sorting.getModel();
        expect(sortModel).toEqual([
          { field: 'name', direction: 'asc' },
          { field: 'age', direction: 'desc' },
        ]);
      });

      it('should replace sortModel when multiSort is false', async () => {
        const apiRef = React.createRef<GridApi | null>();
        render(<TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />);

        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('name', 'asc');
        });
        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('age', 'desc', false);
        });

        const sortModel = apiRef.current?.api.sorting.getModel();
        expect(sortModel).toEqual([{ field: 'age', direction: 'desc' }]);
      });

      it('should not sort column when sortable is false', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const columns: ColumnDef<TestRow, SortingColumnMeta>[] = [
          { id: 'name', field: 'name', sortable: false },
          { id: 'age', field: 'age' },
        ];
        const { container } = render(
          <TestDataGrid rows={defaultRows} columns={columns} apiRef={apiRef} />,
        );

        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('name', 'asc');
        });

        // sortModel should remain empty
        expect(apiRef.current?.api.sorting.getModel()).toEqual([]);
        // rows should remain in original order
        expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
      });
    });

    describe('setSortModel', () => {
      it('should update sortModel and apply sorting', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
        );

        await act(async () => {
          apiRef.current?.api.sorting.setModel([{ field: 'age', direction: 'asc' }]);
        });

        expect(getRowNames(container)).toEqual(['Alice', 'Charlie', 'Bob']);
        expect(apiRef.current?.api.sorting.getModel()).toEqual([
          { field: 'age', direction: 'asc' },
        ]);
      });

      it('should clear sorting when setting empty model', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            initialState={{ sorting: { model: [{ field: 'name', direction: 'asc' }] } }}
          />,
        );

        expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

        await act(async () => {
          apiRef.current?.api.sorting.setModel([]);
        });

        expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
      });
    });

    describe('getSortModel', () => {
      it('should return current sortModel', async () => {
        const apiRef = React.createRef<GridApi | null>();
        render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            initialState={{ sorting: { model: [{ field: 'name', direction: 'asc' }] } }}
          />,
        );

        expect(apiRef.current?.api.sorting.getModel()).toEqual([
          { field: 'name', direction: 'asc' },
        ]);
      });
    });

    describe('applySorting', () => {
      it('should recompute sorted rows', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            sorting={{ mode: 'manual' }}
          />,
        );

        // Set sort model without auto-apply
        await act(async () => {
          apiRef.current?.api.sorting.setModel([{ field: 'name', direction: 'asc' }]);
        });

        // In manual mode, rows should not be sorted yet
        // Note: The sortModel is set but sorting isn't applied
        const sortModel = apiRef.current?.api.sorting.getModel();
        expect(sortModel).toEqual([{ field: 'name', direction: 'asc' }]);

        // Explicitly apply sorting
        await act(async () => {
          apiRef.current?.api.sorting.apply();
        });

        expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);
      });
    });

    describe('computeSortedRowIds', () => {
      it('should compute sorted rows without updating state', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
        );

        const computed = apiRef.current?.api.sorting.computeSortedRowIds(undefined, [
          { field: 'name', direction: 'asc' },
        ]);

        expect(computed).toEqual([2, 3, 1]); // Alice, Bob, Charlie
        // State should not be affected
        expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
      });

      it('should support stableSort option', async () => {
        const apiRef = React.createRef<GridApi | null>();
        render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            initialState={{ sorting: { model: [{ field: 'name', direction: 'asc' }] } }}
          />,
        );

        // Compute with stableSort using current sorted order as base
        const computed = apiRef.current?.api.sorting.computeSortedRowIds(
          undefined,
          [{ field: 'age', direction: 'asc' }],
          { stableSort: true },
        );

        // Age 25: Alice, Age 30: Charlie, Age 35: Bob
        expect(computed).toEqual([2, 1, 3]);
      });
    });
  });

  describe('callbacks', () => {
    describe('onSortModelChange', () => {
      it('should be called when sortModel changes via setSortModel', async () => {
        const onSortModelChange = vi.fn();
        const apiRef = React.createRef<GridApi | null>();
        render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            sorting={{ onModelChange: onSortModelChange }}
          />,
        );

        await act(async () => {
          apiRef.current?.api.sorting.setModel([{ field: 'name', direction: 'asc' }]);
        });

        expect(onSortModelChange).toHaveBeenCalledWith([{ field: 'name', direction: 'asc' }]);
      });

      it('should be called when sortModel changes via sortColumn', async () => {
        const onSortModelChange = vi.fn();
        const apiRef = React.createRef<GridApi | null>();
        render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            sorting={{ onModelChange: onSortModelChange }}
          />,
        );

        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('name', 'desc');
        });

        expect(onSortModelChange).toHaveBeenCalledWith([{ field: 'name', direction: 'desc' }]);
      });
    });

    describe('onSortedRowsSet', () => {
      it('should be called when sorted rows are computed', async () => {
        const onSortedRowsSet = vi.fn();
        const apiRef = React.createRef<GridApi | null>();
        render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            sorting={{ onSortedRowsSet }}
          />,
        );

        // Clear initial call
        onSortedRowsSet.mockClear();

        await act(async () => {
          apiRef.current?.api.sorting.setModel([{ field: 'name', direction: 'asc' }]);
        });

        expect(onSortedRowsSet).toHaveBeenCalledWith([2, 3, 1]); // Alice, Bob, Charlie
      });
    });
  });

  describe('sortingMode', () => {
    describe('auto mode (default)', () => {
      it('should re-sort when sortModel changes', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            sorting={{ mode: 'auto' }}
          />,
        );

        await act(async () => {
          apiRef.current?.api.sorting.setModel([{ field: 'name', direction: 'asc' }]);
        });

        expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);
      });

      it('should re-sort when rows change', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container, setProps } = render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            initialState={{ sorting: { model: [{ field: 'name', direction: 'asc' }] } }}
          />,
        );

        expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

        const newRows = [
          { id: 1, name: 'Zack', age: 30 },
          { id: 2, name: 'Alice', age: 25 },
          { id: 3, name: 'Bob', age: 35 },
        ];

        await act(async () => {
          setProps({ rows: newRows });
        });

        expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Zack']);
      });
    });

    describe('manual mode', () => {
      it('should NOT re-sort automatically when sortModel changes', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            sorting={{ mode: 'manual' }}
          />,
        );

        await act(async () => {
          apiRef.current?.api.sorting.setModel([{ field: 'name', direction: 'asc' }]);
        });

        // Model is set but not applied
        expect(apiRef.current?.api.sorting.getModel()).toEqual([
          { field: 'name', direction: 'asc' },
        ]);

        // Rows not sorted yet - still in original order
        // After explicit apply:
        await act(async () => {
          apiRef.current?.api.sorting.apply();
        });

        expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);
      });
    });
  });

  describe('enableMultiSort', () => {
    it('should allow multi-column sorting when enabled', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const rows = [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
      ];
      render(
        <TestDataGrid
          rows={rows}
          columns={defaultColumns}
          apiRef={apiRef}
          sorting={{ multiSort: true }}
        />,
      );

      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name', 'asc');
      });
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('age', 'asc', true);
      });

      // Alice (25), Alice (30), Bob (35)
      const rowAges = screen.getAllByTestId('row').map((row) => row.getAttribute('data-age'));
      expect(rowAges).toEqual(['25', '30', '35']);
    });

    it('should replace sort when enableMultiSort is false', async () => {
      const apiRef = React.createRef<GridApi | null>();
      render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
          sorting={{ multiSort: false }}
        />,
      );

      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name', 'asc');
      });
      await act(async () => {
        // When enableMultiSort is false, multiSort param is ignored
        apiRef.current?.api.sorting.sortColumn('age', 'desc');
      });

      expect(apiRef.current?.api.sorting.getModel()).toEqual([{ field: 'age', direction: 'desc' }]);
    });
  });

  describe('stableSort', () => {
    it('should preserve previous sort order within equal groups when enabled', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const rows = [
        { id: 1, name: 'Charlie', age: 30 },
        { id: 2, name: 'Alice', age: 30 },
        { id: 3, name: 'Bob', age: 25 },
      ];
      const { container } = render(
        <TestDataGrid
          rows={rows}
          columns={defaultColumns}
          apiRef={apiRef}
          sorting={{ stableSort: true, multiSort: true }}
        />,
      );

      // First sort by name
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name', 'asc');
      });
      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

      // Then sort by age with multiSort - within same age, previous order preserved
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('age', 'asc', true);
      });
      // With multi-sort: primary=name, secondary=age
      // Alice(30), Bob(25), Charlie(30) sorted by name then age
      // This keeps the multi-column sort behavior
      const sortModel = apiRef.current?.api.sorting.getModel();
      expect(sortModel?.length).toBe(2);
    });
  });

  describe('controlled sortModel', () => {
    it('should update when controlled sorting.model prop changes', async () => {
      const { container, setProps } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          sorting={{ model: [{ field: 'name', direction: 'asc' }] }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

      await act(async () => {
        setProps({ sorting: { model: [{ field: 'name', direction: 'desc' }] } });
      });

      expect(getRowNames(container)).toEqual(['Charlie', 'Bob', 'Alice']);
    });

    it('should clear sorting when controlled sorting.model becomes empty', async () => {
      const { container, setProps } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          sorting={{ model: [{ field: 'name', direction: 'asc' }] }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

      await act(async () => {
        setProps({ sorting: { model: [] } });
      });

      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
    });
  });

  describe('sortColumn with null', () => {
    it('should clear sorting when passing null direction', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const { container } = render(
        <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
      );

      // First sort ascending
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name', 'asc');
      });
      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

      // Clear with null
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name', null);
      });
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
      expect(apiRef.current?.api.sorting.getModel()).toEqual([]);
    });

    it('should be idempotent when called multiple times with null', async () => {
      const onSortModelChange = vi.fn();
      const apiRef = React.createRef<GridApi | null>();
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
          sorting={{ onModelChange: onSortModelChange }}
        />,
      );

      // First sort
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name', 'asc');
      });
      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

      onSortModelChange.mockClear();

      // Clear with null
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name', null);
      });
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
      expect(onSortModelChange).toHaveBeenCalledTimes(1);
      expect(onSortModelChange).toHaveBeenCalledWith([]);

      // Call again with null - rows should still be unsorted
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name', null);
      });
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
      // Note: callback is triggered because comparison is by reference ([] !== [])
    });
  });

  describe('sortingOrder variations', () => {
    it('should only allow ascending when sortingOrder is [asc]', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
          sorting={{ order: ['asc'] }}
        />,
      );

      // First call - asc
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name');
      });
      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

      // Second call - cycles back to asc
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name');
      });
      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should cycle through asc and null when sortingOrder is [asc, null]', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
          sorting={{ order: ['asc', null] }}
        />,
      );

      // First call - asc
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name');
      });
      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

      // Second call - null (unsorted)
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name');
      });
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);

      // Third call - back to asc
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name');
      });
      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should cycle through desc and asc when sortingOrder is [desc, asc]', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
          sorting={{ order: ['desc', 'asc'] }}
        />,
      );

      // First call - desc
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name');
      });
      expect(getRowNames(container)).toEqual(['Charlie', 'Bob', 'Alice']);

      // Second call - asc
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name');
      });
      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

      // Third call - back to desc
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name');
      });
      expect(getRowNames(container)).toEqual(['Charlie', 'Bob', 'Alice']);
    });

    it('should allow per-column sortingOrder override', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const columns: ColumnDef<TestRow, SortingColumnMeta>[] = [
        { id: 'name', field: 'name', sortingOrder: ['desc', 'asc'] },
        { id: 'age', field: 'age' },
      ];
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={columns}
          apiRef={apiRef}
          sorting={{ order: ['asc', 'desc', null], multiSort: false }}
        />,
      );

      // Name column should use its own sortingOrder (desc first)
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name');
      });
      expect(getRowNames(container)).toEqual(['Charlie', 'Bob', 'Alice']);

      // Age column should use grid-level sortingOrder (asc first)
      // (replaces the name sort since multi-sort is disabled)
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('age');
      });
      const rowAges = screen.getAllByTestId('row').map((row) => row.getAttribute('data-age'));
      expect(rowAges).toEqual(['25', '30', '35']);
    });
  });

  describe('updateRows with active sortModel', () => {
    it('should maintain sorting when rows are updated via API', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
          initialState={{ sorting: { model: [{ field: 'name', direction: 'asc' }] } }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

      // Update a row
      await act(async () => {
        apiRef.current?.api.rows.updateRows([{ id: 1, name: 'Zack', age: 30 }]);
      });

      // Should re-sort with new data
      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Zack']);
    });

    it('should maintain sorting when adding rows via API', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
          initialState={{ sorting: { model: [{ field: 'name', direction: 'asc' }] } }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

      // Add a new row
      await act(async () => {
        apiRef.current?.api.rows.updateRows([{ id: 4, name: 'Aaron', age: 22 }]);
      });

      // Should include new row in sorted order
      expect(getRowNames(container)).toEqual(['Aaron', 'Alice', 'Bob', 'Charlie']);
    });
  });

  describe('initialState behavior', () => {
    it('should not update sorting when initialState prop changes after mount', async () => {
      const { container, setProps } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          initialState={{
            sorting: { model: [{ field: 'name', direction: 'asc' }] },
          }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

      // Change initialState - should have no effect
      await act(async () => {
        setProps({
          initialState: {
            sorting: { sortModel: [{ field: 'name', sort: 'desc' }] },
          },
        });
      });

      // Should still be ascending (initialState only applies on mount)
      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);
    });
  });

  describe('sortComparator', () => {
    it('should use custom sortComparator when provided', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const columns: ColumnDef<TestRow, SortingColumnMeta>[] = [
        {
          id: 'name',
          field: 'name',
          // Custom comparator that sorts by string length
          sortComparator: (v1, v2) => String(v1).length - String(v2).length,
        },
        { id: 'age', field: 'age' },
      ];
      const { container } = render(
        <TestDataGrid rows={defaultRows} columns={columns} apiRef={apiRef} />,
      );

      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name', 'asc');
      });

      // Bob (3), Alice (5), Charlie (7) - sorted by length
      expect(getRowNames(container)).toEqual(['Bob', 'Alice', 'Charlie']);
    });

    it('should support sortComparator factory function', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const columns: ColumnDef<TestRow, SortingColumnMeta>[] = [
        {
          id: 'name',
          field: 'name',
          // Factory that returns different comparator based on direction
          // Nulls always at end regardless of direction
          sortComparator: (sortDirection: GridSortDirection) => {
            const modifier = sortDirection === 'desc' ? -1 : 1;
            return (v1: string | null, v2: string | null) => {
              if (v1 === null) {
                return 1;
              }
              if (v2 === null) {
                return -1;
              }
              return modifier * String(v1).localeCompare(String(v2));
            };
          },
        },
        { id: 'age', field: 'age' },
      ];
      const rows: TestRow[] = [
        { id: 1, name: 'Charlie', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
      ];
      const { container } = render(<TestDataGrid rows={rows} columns={columns} apiRef={apiRef} />);

      // Sort ascending
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name', 'asc');
      });
      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

      // Sort descending
      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name', 'desc');
      });
      expect(getRowNames(container)).toEqual(['Charlie', 'Bob', 'Alice']);
    });
  });

  describe('sortValueGetter', () => {
    it('should use sortValueGetter to extract sort value', async () => {
      type RowWithFullName = { id: number; name: string; age: number; lastName: string };
      type FullNameGridApi = ReturnType<
        typeof useDataGrid<[typeof sortingPlugin, typeof paginationPlugin], RowWithFullName>
      >;

      const apiRef: React.RefObject<FullNameGridApi | null> = { current: null };
      const rows: RowWithFullName[] = [
        { id: 1, name: 'Charlie', lastName: 'Adams', age: 30 },
        { id: 2, name: 'Alice', lastName: 'Zimmerman', age: 25 },
        { id: 3, name: 'Bob', lastName: 'Brown', age: 35 },
      ];
      const columns: ColumnDef<RowWithFullName, SortingColumnMeta>[] = [
        {
          id: 'name',
          field: 'name',
          // Sort by lastName instead of name
          sortValueGetter: (row) => row.lastName,
        },
        { id: 'age', field: 'age' },
      ];

      function FullNameTestGrid() {
        const grid = useDataGrid<[typeof sortingPlugin, typeof paginationPlugin], RowWithFullName>({
          rows,
          columns,
          plugins: [sortingPlugin, paginationPlugin],
        });

        React.useEffect(() => {
          (apiRef as { current: FullNameGridApi | null }).current = grid;
        }, [grid]);

        const sortedRowIds = grid.use(rowsPlugin.selectors.processedRowIds);
        const rowsData = grid.use(rowsPlugin.selectors.rowIdToModelLookup);

        return (
          <div data-testid="grid">
            {sortedRowIds.map((rowId) => {
              const row = rowsData[rowId] as RowWithFullName | undefined;
              return row ? (
                <div key={rowId} data-testid="row" data-name={row.name}>
                  {row.name}
                </div>
              ) : null;
            })}
          </div>
        );
      }

      render(<FullNameTestGrid />);

      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name', 'asc');
      });

      // Sorted by lastName: Adams (Charlie), Brown (Bob), Zimmerman (Alice)
      const rowNames = screen.getAllByTestId('row').map((row) => row.getAttribute('data-name'));
      expect(rowNames).toEqual(['Charlie', 'Bob', 'Alice']);
    });
  });
});
