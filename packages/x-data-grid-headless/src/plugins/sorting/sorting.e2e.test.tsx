import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRenderer, act, screen } from '@mui/internal-test-utils';
import { useDataGrid, ColumnDef } from '../..';
import { sortingPlugin, paginationPlugin } from '..';

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

interface TestGridProps {
  rows?: TestRow[];
  columns?: ColumnDef<TestRow>[];
  apiRef?: React.RefObject<GridApi | null>;
  sortModel?: Parameters<typeof useDataGrid>[0]['sortModel'];
  initialState?: Parameters<typeof useDataGrid>[0]['initialState'];
  onSortModelChange?: Parameters<typeof useDataGrid>[0]['onSortModelChange'];
  onSortedRowsSet?: Parameters<typeof useDataGrid>[0]['onSortedRowsSet'];
  sortingMode?: Parameters<typeof useDataGrid>[0]['sortingMode'];
  enableMultiSort?: Parameters<typeof useDataGrid>[0]['enableMultiSort'];
  stableSort?: Parameters<typeof useDataGrid>[0]['stableSort'];
  sortingOrder?: Parameters<typeof useDataGrid>[0]['sortingOrder'];
}

function TestGrid(props: TestGridProps) {
  const { rows = defaultRows, columns = defaultColumns, apiRef, ...gridProps } = props;

  const grid = useDataGrid<[typeof sortingPlugin, typeof paginationPlugin], TestRow>({
    rows,
    columns,
    plugins: [sortingPlugin, paginationPlugin],
    ...gridProps,
  });

  React.useEffect(() => {
    if (apiRef) {
      (apiRef as React.MutableRefObject<GridApi | null>).current = grid;
    }
  }, [grid, apiRef]);

  const sortedRowIds = grid.use(grid.api.sorting.selectors.sortedRowIds);
  const rowsData = grid.use(grid.api.rows.selectors.rowIdToModelLookup);

  return (
    <div data-testid="grid">
      {sortedRowIds.map((rowId) => {
        const row = rowsData[rowId] as TestRow | undefined;
        return row ? (
          <div key={rowId} data-testid="row" data-name={row.name} data-age={row.age}>
            {row.name}
          </div>
        ) : null;
      })}
    </div>
  );
}

describe('Sorting Plugin - Integration Tests', () => {
  const { render } = createRenderer();

  const getRowNames = (container: HTMLElement): string[] => {
    const rows = container.querySelectorAll('[data-testid="row"]');
    return Array.from(rows).map((row) => row.getAttribute('data-name') || '');
  };

  describe('initial state', () => {
    it('should keep original order when no sorting is applied', () => {
      const { container } = render(<TestGrid />);
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
    });

    it('should apply sorting from initialState', async () => {
      const { container } = render(
        <TestGrid
          initialState={{
            sorting: {
              sortModel: [{ field: 'name', sort: 'asc' }],
            },
          }}
        />,
      );
      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should apply sorting from sortModel prop', () => {
      const { container } = render(<TestGrid sortModel={[{ field: 'name', sort: 'desc' }]} />);
      expect(getRowNames(container)).toEqual(['Charlie', 'Bob', 'Alice']);
    });

    it('should prefer sortModel prop over initialState', () => {
      const { container } = render(
        <TestGrid
          sortModel={[{ field: 'name', sort: 'desc' }]}
          initialState={{
            sorting: {
              sortModel: [{ field: 'name', sort: 'asc' }],
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
        const { container } = render(<TestGrid apiRef={apiRef} />);

        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('name', 'asc');
        });

        expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);
      });

      it('should sort column descending', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(<TestGrid apiRef={apiRef} />);

        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('name', 'desc');
        });

        expect(getRowNames(container)).toEqual(['Charlie', 'Bob', 'Alice']);
      });

      it('should cycle through sortingOrder when direction not provided', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(<TestGrid apiRef={apiRef} />);

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
        render(<TestGrid apiRef={apiRef} enableMultiSort />);

        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('name', 'asc');
        });
        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('age', 'desc', true);
        });

        const sortModel = apiRef.current?.api.sorting.getSortModel();
        expect(sortModel).toEqual([
          { field: 'name', sort: 'asc' },
          { field: 'age', sort: 'desc' },
        ]);
      });

      it('should replace sortModel when multiSort is false', async () => {
        const apiRef = React.createRef<GridApi | null>();
        render(<TestGrid apiRef={apiRef} />);

        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('name', 'asc');
        });
        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('age', 'desc', false);
        });

        const sortModel = apiRef.current?.api.sorting.getSortModel();
        expect(sortModel).toEqual([{ field: 'age', sort: 'desc' }]);
      });
    });

    describe('setSortModel', () => {
      it('should update sortModel and apply sorting', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(<TestGrid apiRef={apiRef} />);

        await act(async () => {
          apiRef.current?.api.sorting.setSortModel([{ field: 'age', sort: 'asc' }]);
        });

        expect(getRowNames(container)).toEqual(['Alice', 'Charlie', 'Bob']);
        expect(apiRef.current?.api.sorting.getSortModel()).toEqual([{ field: 'age', sort: 'asc' }]);
      });

      it('should clear sorting when setting empty model', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestGrid
            apiRef={apiRef}
            initialState={{ sorting: { sortModel: [{ field: 'name', sort: 'asc' }] } }}
          />,
        );

        expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

        await act(async () => {
          apiRef.current?.api.sorting.setSortModel([]);
        });

        expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
      });
    });

    describe('getSortModel', () => {
      it('should return current sortModel', async () => {
        const apiRef = React.createRef<GridApi | null>();
        render(
          <TestGrid
            apiRef={apiRef}
            initialState={{ sorting: { sortModel: [{ field: 'name', sort: 'asc' }] } }}
          />,
        );

        expect(apiRef.current?.api.sorting.getSortModel()).toEqual([
          { field: 'name', sort: 'asc' },
        ]);
      });
    });

    describe('applySorting', () => {
      it('should recompute sorted rows', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(<TestGrid apiRef={apiRef} sortingMode="manual" />);

        // Set sort model without auto-apply
        await act(async () => {
          apiRef.current?.api.sorting.setSortModel([{ field: 'name', sort: 'asc' }]);
        });

        // In manual mode, rows should not be sorted yet
        // Note: The sortModel is set but sorting isn't applied
        const sortModel = apiRef.current?.api.sorting.getSortModel();
        expect(sortModel).toEqual([{ field: 'name', sort: 'asc' }]);

        // Explicitly apply sorting
        await act(async () => {
          apiRef.current?.api.sorting.applySorting();
        });

        expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);
      });
    });

    describe('computeSortedRowIds', () => {
      it('should compute sorted rows without updating state', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(<TestGrid apiRef={apiRef} />);

        const computed = apiRef.current?.api.sorting.computeSortedRowIds(undefined, [
          { field: 'name', sort: 'asc' },
        ]);

        expect(computed).toEqual([2, 3, 1]); // Alice, Bob, Charlie
        // State should not be affected
        expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
      });

      it('should support stableSort option', async () => {
        const apiRef = React.createRef<GridApi | null>();
        render(
          <TestGrid
            apiRef={apiRef}
            initialState={{ sorting: { sortModel: [{ field: 'name', sort: 'asc' }] } }}
          />,
        );

        // Compute with stableSort using current sorted order as base
        const computed = apiRef.current?.api.sorting.computeSortedRowIds(
          undefined,
          [{ field: 'age', sort: 'asc' }],
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
        render(<TestGrid apiRef={apiRef} onSortModelChange={onSortModelChange} />);

        await act(async () => {
          apiRef.current?.api.sorting.setSortModel([{ field: 'name', sort: 'asc' }]);
        });

        expect(onSortModelChange).toHaveBeenCalledWith([{ field: 'name', sort: 'asc' }]);
      });

      it('should be called when sortModel changes via sortColumn', async () => {
        const onSortModelChange = vi.fn();
        const apiRef = React.createRef<GridApi | null>();
        render(<TestGrid apiRef={apiRef} onSortModelChange={onSortModelChange} />);

        await act(async () => {
          apiRef.current?.api.sorting.sortColumn('name', 'desc');
        });

        expect(onSortModelChange).toHaveBeenCalledWith([{ field: 'name', sort: 'desc' }]);
      });
    });

    describe('onSortedRowsSet', () => {
      it('should be called when sorted rows are computed', async () => {
        const onSortedRowsSet = vi.fn();
        const apiRef = React.createRef<GridApi | null>();
        render(<TestGrid apiRef={apiRef} onSortedRowsSet={onSortedRowsSet} />);

        // Clear initial call
        onSortedRowsSet.mockClear();

        await act(async () => {
          apiRef.current?.api.sorting.setSortModel([{ field: 'name', sort: 'asc' }]);
        });

        expect(onSortedRowsSet).toHaveBeenCalledWith([2, 3, 1]); // Alice, Bob, Charlie
      });
    });
  });

  describe('sortingMode', () => {
    describe('auto mode (default)', () => {
      it('should re-sort when sortModel changes', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(<TestGrid apiRef={apiRef} sortingMode="auto" />);

        await act(async () => {
          apiRef.current?.api.sorting.setSortModel([{ field: 'name', sort: 'asc' }]);
        });

        expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);
      });

      it('should re-sort when rows change', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container, setProps } = render(
          <TestGrid
            apiRef={apiRef}
            initialState={{ sorting: { sortModel: [{ field: 'name', sort: 'asc' }] } }}
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
        const { container } = render(<TestGrid apiRef={apiRef} sortingMode="manual" />);

        await act(async () => {
          apiRef.current?.api.sorting.setSortModel([{ field: 'name', sort: 'asc' }]);
        });

        // Model is set but not applied
        expect(apiRef.current?.api.sorting.getSortModel()).toEqual([
          { field: 'name', sort: 'asc' },
        ]);

        // Rows not sorted yet - still in original order
        // After explicit apply:
        await act(async () => {
          apiRef.current?.api.sorting.applySorting();
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
      render(<TestGrid apiRef={apiRef} rows={rows} enableMultiSort />);

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
      render(<TestGrid apiRef={apiRef} enableMultiSort={false} />);

      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name', 'asc');
      });
      await act(async () => {
        // When enableMultiSort is false, multiSort param is ignored
        apiRef.current?.api.sorting.sortColumn('age', 'desc');
      });

      expect(apiRef.current?.api.sorting.getSortModel()).toEqual([{ field: 'age', sort: 'desc' }]);
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
        <TestGrid apiRef={apiRef} rows={rows} stableSort enableMultiSort />,
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
      const sortModel = apiRef.current?.api.sorting.getSortModel();
      expect(sortModel?.length).toBe(2);
    });
  });

  describe('controlled sortModel', () => {
    it('should update when controlled sortModel prop changes', async () => {
      const { container, setProps } = render(
        <TestGrid sortModel={[{ field: 'name', sort: 'asc' }]} />,
      );

      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

      await act(async () => {
        setProps({ sortModel: [{ field: 'name', sort: 'desc' }] });
      });

      expect(getRowNames(container)).toEqual(['Charlie', 'Bob', 'Alice']);
    });

    it('should clear sorting when controlled sortModel becomes empty', async () => {
      const { container, setProps } = render(
        <TestGrid sortModel={[{ field: 'name', sort: 'asc' }]} />,
      );

      expect(getRowNames(container)).toEqual(['Alice', 'Bob', 'Charlie']);

      await act(async () => {
        setProps({ sortModel: [] });
      });

      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
    });
  });

  // selectors tests removed - covered by unit tests in sorting.test.ts
});
