import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRenderer, act } from '@mui/internal-test-utils';
import type { ColumnDef, useDataGrid } from '../..';
import type { sortingPlugin } from '../sorting';
import type { paginationPlugin } from '.';
import { TestDataGrid } from '../../test/TestDataGrid';

type TestRow = { id: number; name: string; age: number };

const defaultColumns: ColumnDef<TestRow>[] = [
  { id: 'name', field: 'name' },
  { id: 'age', field: 'age' },
];

// 15 rows for pagination testing
const defaultRows: TestRow[] = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 },
  { id: 4, name: 'Diana', age: 28 },
  { id: 5, name: 'Eve', age: 22 },
  { id: 6, name: 'Frank', age: 40 },
  { id: 7, name: 'Grace', age: 33 },
  { id: 8, name: 'Henry', age: 27 },
  { id: 9, name: 'Ivy', age: 31 },
  { id: 10, name: 'Jack', age: 29 },
  { id: 11, name: 'Karen', age: 26 },
  { id: 12, name: 'Leo', age: 38 },
  { id: 13, name: 'Mona', age: 24 },
  { id: 14, name: 'Nate', age: 36 },
  { id: 15, name: 'Olivia', age: 32 },
];

type GridApi = ReturnType<
  typeof useDataGrid<[typeof sortingPlugin, typeof paginationPlugin], TestRow>
>;

describe('Pagination Plugin - Integration Tests', () => {
  const { render } = createRenderer();

  const getRowNames = (container: HTMLElement): string[] => {
    const rows = container.querySelectorAll('[data-testid="row"]');
    return Array.from(rows).map((row) => row.getAttribute('data-name') || '');
  };

  describe('initial state', () => {
    it('should show first 10 rows by default', () => {
      const { container } = render(<TestDataGrid rows={defaultRows} columns={defaultColumns} />);
      const names = getRowNames(container);
      expect(names).toHaveLength(10);
      expect(names[0]).toBe('Alice');
      expect(names[9]).toBe('Jack');
    });

    it('should apply model from initialState', () => {
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          initialState={{
            pagination: {
              model: { page: 1, pageSize: 5 },
            },
          }}
        />,
      );
      const names = getRowNames(container);
      expect(names).toHaveLength(5);
      expect(names[0]).toBe('Frank');
      expect(names[4]).toBe('Jack');
    });

    it('should apply model from controlled pagination.model prop', () => {
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          pagination={{ model: { page: 2, pageSize: 5 } }}
        />,
      );
      const names = getRowNames(container);
      expect(names).toHaveLength(5);
      expect(names[0]).toBe('Karen');
      expect(names[4]).toBe('Olivia');
    });

    it('should prefer controlled over initialState', () => {
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          pagination={{ model: { page: 0, pageSize: 3 } }}
          initialState={{
            pagination: {
              model: { page: 1, pageSize: 5 },
            },
          }}
        />,
      );
      const names = getRowNames(container);
      expect(names).toHaveLength(3);
      expect(names[0]).toBe('Alice');
    });

    it('should not be affected by initialState changes after mount', async () => {
      const { container, setProps } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          initialState={{
            pagination: {
              model: { page: 0, pageSize: 5 },
            },
          }}
        />,
      );

      expect(getRowNames(container)).toHaveLength(5);
      expect(getRowNames(container)[0]).toBe('Alice');

      await act(async () => {
        setProps({
          initialState: {
            pagination: {
              model: { page: 2, pageSize: 5 },
            },
          },
        });
      });

      // Should still show first page
      expect(getRowNames(container)[0]).toBe('Alice');
    });
  });

  describe('API methods', () => {
    describe('setPage', () => {
      it('should navigate to a specific page', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            initialState={{ pagination: { model: { page: 0, pageSize: 5 } } }}
          />,
        );

        expect(getRowNames(container)[0]).toBe('Alice');

        await act(async () => {
          apiRef.current?.api.pagination.setPage(1);
        });

        expect(getRowNames(container)[0]).toBe('Frank');
        expect(getRowNames(container)).toHaveLength(5);
      });
    });

    describe('setPageSize', () => {
      it('should update page size and reset to page 0', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            initialState={{ pagination: { model: { page: 1, pageSize: 5 } } }}
          />,
        );

        // On page 1 with pageSize 5
        expect(getRowNames(container)[0]).toBe('Frank');

        await act(async () => {
          apiRef.current?.api.pagination.setPageSize(3);
        });

        // Should reset to page 0 with pageSize 3
        expect(getRowNames(container)).toHaveLength(3);
        expect(getRowNames(container)[0]).toBe('Alice');
      });
    });

    describe('setModel', () => {
      it('should update both page and pageSize atomically', async () => {
        const apiRef = React.createRef<GridApi | null>();
        const { container } = render(
          <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
        );

        await act(async () => {
          apiRef.current?.api.pagination.setModel({ page: 1, pageSize: 3 });
        });

        const names = getRowNames(container);
        expect(names).toHaveLength(3);
        expect(names[0]).toBe('Diana');
        expect(names[2]).toBe('Frank'); // page 1 with size 3 = rows at indices 3,4,5
      });
    });

    describe('getModel', () => {
      it('should return the current model', () => {
        const apiRef = React.createRef<GridApi | null>();
        render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            initialState={{ pagination: { model: { page: 2, pageSize: 5 } } }}
          />,
        );

        expect(apiRef.current?.api.pagination.getModel()).toEqual({ page: 2, pageSize: 5 });
      });
    });
  });

  describe('callbacks', () => {
    describe('onModelChange', () => {
      it('should be called on setPage', async () => {
        const onModelChange = vi.fn();
        const apiRef = React.createRef<GridApi | null>();
        render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            pagination={{ onModelChange }}
            initialState={{ pagination: { model: { page: 0, pageSize: 5 } } }}
          />,
        );

        await act(async () => {
          apiRef.current?.api.pagination.setPage(2);
        });

        expect(onModelChange).toHaveBeenCalledWith({ page: 2, pageSize: 5 });
      });

      it('should be called on setPageSize', async () => {
        const onModelChange = vi.fn();
        const apiRef = React.createRef<GridApi | null>();
        render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            pagination={{ onModelChange }}
          />,
        );

        await act(async () => {
          apiRef.current?.api.pagination.setPageSize(25);
        });

        expect(onModelChange).toHaveBeenCalledWith({ page: 0, pageSize: 25 });
      });

      it('should be called on setModel', async () => {
        const onModelChange = vi.fn();
        const apiRef = React.createRef<GridApi | null>();
        render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            pagination={{ onModelChange }}
          />,
        );

        await act(async () => {
          apiRef.current?.api.pagination.setModel({ page: 1, pageSize: 7 });
        });

        expect(onModelChange).toHaveBeenCalledWith({ page: 1, pageSize: 7 });
      });

      it('should NOT be called on initialization', () => {
        const onModelChange = vi.fn();
        render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            pagination={{ onModelChange }}
            initialState={{ pagination: { model: { page: 1, pageSize: 5 } } }}
          />,
        );

        expect(onModelChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('controlled mode', () => {
    it('should update when controlled prop changes', async () => {
      const { container, setProps } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          pagination={{ model: { page: 0, pageSize: 5 } }}
        />,
      );

      expect(getRowNames(container)[0]).toBe('Alice');
      expect(getRowNames(container)).toHaveLength(5);

      await act(async () => {
        setProps({ pagination: { model: { page: 1, pageSize: 5 } } });
      });

      expect(getRowNames(container)[0]).toBe('Frank');
    });
  });

  describe('page validation', () => {
    it('should go to last valid page when row count decreases', async () => {
      const { container, setProps } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          initialState={{ pagination: { model: { page: 2, pageSize: 5 } } }}
        />,
      );

      // Page 2 with 15 rows, pageSize 5 => rows 11-15
      expect(getRowNames(container)[0]).toBe('Karen');

      // Reduce rows to only 8
      const fewerRows = defaultRows.slice(0, 8);
      await act(async () => {
        setProps({ rows: fewerRows });
      });

      // With 8 rows and pageSize 5, only 2 pages (0, 1). Page 2 should clamp to page 1.
      expect(getRowNames(container)).toHaveLength(3);
      expect(getRowNames(container)[0]).toBe('Frank');
    });

    it('should adjust page when pageSize increases', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
          initialState={{ pagination: { model: { page: 4, pageSize: 3 } } }}
        />,
      );

      // Page 4 with pageSize 3 => rows 13-15
      expect(getRowNames(container)[0]).toBe('Mona');

      await act(async () => {
        // Set pageSize to 10 => only 2 pages (0, 1). setPageSize resets to page 0.
        apiRef.current?.api.pagination.setPageSize(10);
      });

      expect(getRowNames(container)[0]).toBe('Alice');
      expect(getRowNames(container)).toHaveLength(10);
    });
  });

  describe('integration with sorting', () => {
    it('should paginate sorted rows', () => {
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          sorting={{ model: [{ field: 'name', direction: 'asc' }] }}
          initialState={{ pagination: { model: { page: 0, pageSize: 5 } } }}
        />,
      );

      const names = getRowNames(container);
      expect(names).toHaveLength(5);
      // Alphabetically first 5: Alice, Bob, Charlie, Diana, Eve
      expect(names[0]).toBe('Alice');
      expect(names[4]).toBe('Eve');
    });

    it('should recompute pagination when sort changes', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
          initialState={{ pagination: { model: { page: 0, pageSize: 5 } } }}
        />,
      );

      // Unsorted: Alice, Bob, Charlie, Diana, Eve
      expect(getRowNames(container)[0]).toBe('Alice');

      await act(async () => {
        apiRef.current?.api.sorting.sortColumn('name', 'desc');
      });

      // Sorted desc, first 5: Olivia, Nate, Mona, Leo, Karen
      const names = getRowNames(container);
      expect(names).toHaveLength(5);
      expect(names[0]).toBe('Olivia');
    });

    it('should show correct rows on page 2 after sorting', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
          sorting={{ model: [{ field: 'name', direction: 'asc' }] }}
          initialState={{ pagination: { model: { page: 1, pageSize: 5 } } }}
        />,
      );

      // Sorted by name asc, page 1 (pageSize 5):
      // All sorted: Alice, Bob, Charlie, Diana, Eve, Frank, Grace, Henry, Ivy, Jack, Karen, Leo, Mona, Nate, Olivia
      // Page 1: Frank, Grace, Henry, Ivy, Jack
      const names = getRowNames(container);
      expect(names).toHaveLength(5);
      expect(names[0]).toBe('Frank');
      expect(names[4]).toBe('Jack');
    });
  });

  describe('external mode', () => {
    it('should not slice rows when external is true', () => {
      // In external mode, the provided rows are already the current page
      const pageRows = defaultRows.slice(0, 5);
      const { container } = render(
        <TestDataGrid
          rows={pageRows}
          columns={defaultColumns}
          pagination={{ model: { page: 0, pageSize: 5 }, rowCount: 15 }}
          initialState={{ pagination: { model: { page: 0, pageSize: 5 } } }}
        />,
      );

      const names = getRowNames(container);
      // Should show all provided rows (5) without slicing
      expect(names).toHaveLength(5);
    });

    it('should compute pageCount from actual row count', () => {
      const apiRef = React.createRef<GridApi | null>();
      const pageRows = defaultRows.slice(0, 5);
      render(
        <TestDataGrid
          rows={pageRows}
          columns={defaultColumns}
          apiRef={apiRef}
          initialState={{ pagination: { model: { page: 0, pageSize: 2 } } }}
        />,
      );

      const state = apiRef.current?.getState();
      expect(state?.pagination.pageCount).toBe(3); // 5 rows / 2 per page = 3 pages
      expect(state?.pagination.rowCount).toBe(5);
    });
  });

  describe('edge cases', () => {
    it('should handle empty rows', () => {
      const apiRef = React.createRef<GridApi | null>();
      render(<TestDataGrid rows={[] as TestRow[]} columns={defaultColumns} apiRef={apiRef} />);

      const state = apiRef.current?.getState();
      expect(state?.pagination.paginatedRowIds).toEqual([]);
      expect(state?.pagination.rowCount).toBe(0);
      expect(state?.pagination.pageCount).toBe(0);
    });

    it('should handle single row with pageSize > 1', () => {
      const { container } = render(
        <TestDataGrid
          rows={[{ id: 1, name: 'Alice', age: 25 }]}
          columns={defaultColumns}
          initialState={{ pagination: { model: { page: 0, pageSize: 10 } } }}
        />,
      );

      const names = getRowNames(container);
      expect(names).toHaveLength(1);
      expect(names[0]).toBe('Alice');
    });

    it('should recompute when new rows are added via props', async () => {
      const apiRef = React.createRef<GridApi | null>();
      const { container, setProps } = render(
        <TestDataGrid
          rows={defaultRows.slice(0, 3)}
          columns={defaultColumns}
          apiRef={apiRef}
          initialState={{ pagination: { model: { page: 0, pageSize: 5 } } }}
        />,
      );

      expect(getRowNames(container)).toHaveLength(3);

      await act(async () => {
        setProps({ rows: defaultRows.slice(0, 8) });
      });

      expect(getRowNames(container)).toHaveLength(5);
      expect(apiRef.current?.getState()?.pagination.rowCount).toBe(8);
    });
  });
});
