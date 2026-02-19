import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { createRenderer, act } from '@mui/internal-test-utils';
import type { ColumnDef } from '../../..';
import { TestDataGrid, type TestGridApi } from '../../../test/TestDataGrid';

type TestRow = { id: number; name: string; age: number; email: string };

const defaultRows: TestRow[] = [
  { id: 1, name: 'Alice', age: 25, email: 'alice@test.com' },
  { id: 2, name: 'Bob', age: 30, email: 'bob@test.com' },
];

const defaultColumns: ColumnDef<TestRow>[] = [
  { id: 'name', field: 'name' },
  { id: 'age', field: 'age' },
  { id: 'email', field: 'email' },
];

describe('Column Visibility - Integration Tests', () => {
  const { render } = createRenderer();

  const getRenderedColumnCount = (container: HTMLElement): number => {
    const firstRow = container.querySelector('[data-testid="row"]');
    if (!firstRow) {
      return 0;
    }
    return firstRow.querySelectorAll('[role="gridcell"]').length;
  };

  describe('initial state', () => {
    it('should render all columns when no visibility model is provided', () => {
      const { container } = render(<TestDataGrid rows={defaultRows} columns={defaultColumns} />);
      expect(getRenderedColumnCount(container)).toBe(3);
    });

    it('should not render hidden columns', () => {
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          columnVisibilityModel={{ age: 'hidden' }}
        />,
      );
      expect(getRenderedColumnCount(container)).toBe(2);
    });

    it('should render collapsed columns', () => {
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          columnVisibilityModel={{ age: 'collapsed' }}
        />,
      );
      expect(getRenderedColumnCount(container)).toBe(3);
    });

    it('should handle mixed visibility states', () => {
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          columnVisibilityModel={{ age: 'collapsed', email: 'hidden' }}
        />,
      );
      // name (visible) + age (collapsed, still rendered) = 2
      expect(getRenderedColumnCount(container)).toBe(2);
    });

    it('should apply visibility model from initialState', () => {
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          initialState={{
            columns: {
              columnVisibilityModel: { age: 'hidden' },
            },
          }}
        />,
      );
      expect(getRenderedColumnCount(container)).toBe(2);
    });
  });

  describe('API: setVisibility', () => {
    it('should hide a column via API', async () => {
      const apiRef = React.createRef<TestGridApi | null>();
      const { container } = render(
        <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
      );
      expect(getRenderedColumnCount(container)).toBe(3);

      await act(async () => {
        apiRef.current?.api.columns.setVisibility('age', 'hidden');
      });
      expect(getRenderedColumnCount(container)).toBe(2);
    });

    it('should collapse a column via API', async () => {
      const apiRef = React.createRef<TestGridApi | null>();
      const { container } = render(
        <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
      );

      await act(async () => {
        apiRef.current?.api.columns.setVisibility('age', 'collapsed');
      });
      // Collapsed columns are still rendered
      expect(getRenderedColumnCount(container)).toBe(3);
    });

    it('should restore a hidden column to visible', async () => {
      const apiRef = React.createRef<TestGridApi | null>();
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          columnVisibilityModel={{ age: 'hidden' }}
          apiRef={apiRef}
        />,
      );
      expect(getRenderedColumnCount(container)).toBe(2);

      await act(async () => {
        apiRef.current?.api.columns.setVisibility('age', 'visible');
      });
      expect(getRenderedColumnCount(container)).toBe(3);
    });

    it('should transition from hidden to collapsed', async () => {
      const apiRef = React.createRef<TestGridApi | null>();
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          columnVisibilityModel={{ age: 'hidden' }}
          apiRef={apiRef}
        />,
      );
      expect(getRenderedColumnCount(container)).toBe(2);

      await act(async () => {
        apiRef.current?.api.columns.setVisibility('age', 'collapsed');
      });
      // Collapsed columns are rendered
      expect(getRenderedColumnCount(container)).toBe(3);
    });
  });

  describe('API: setVisibilityModel', () => {
    it('should replace the entire visibility model', async () => {
      const apiRef = React.createRef<TestGridApi | null>();
      const { container } = render(
        <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
      );

      await act(async () => {
        apiRef.current?.api.columns.setVisibilityModel({
          name: 'hidden',
          age: 'collapsed',
        });
      });
      // name hidden, age collapsed (rendered), email visible = 2 rendered
      expect(getRenderedColumnCount(container)).toBe(2);
    });
  });

  describe('controlled columnVisibilityModel', () => {
    it('should update when prop changes', async () => {
      const { container, setProps } = render(
        <TestDataGrid rows={defaultRows} columns={defaultColumns} />,
      );
      expect(getRenderedColumnCount(container)).toBe(3);

      setProps({ columnVisibilityModel: { age: 'hidden' } });
      expect(getRenderedColumnCount(container)).toBe(2);
    });

    it('should update from hidden to collapsed via prop', () => {
      const { container, setProps } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          columnVisibilityModel={{ age: 'hidden' }}
        />,
      );
      expect(getRenderedColumnCount(container)).toBe(2);

      setProps({ columnVisibilityModel: { age: 'collapsed' } });
      expect(getRenderedColumnCount(container)).toBe(3);
    });
  });
});
