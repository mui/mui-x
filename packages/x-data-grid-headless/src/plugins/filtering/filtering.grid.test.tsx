import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRenderer, act } from '@mui/internal-test-utils';
import type { ColumnDef } from '../..';
import { TestDataGrid, type TestGridApi } from '../../test/TestDataGrid';
import {
  type FilteringColumnMeta,
  type FilterModel,
  getStringFilterOperators,
  getNumericFilterOperators,
} from '.';

type TestRow = { id: number; name: string; age: number };

const defaultRows: TestRow[] = [
  { id: 1, name: 'Charlie', age: 30 },
  { id: 2, name: 'Alice', age: 25 },
  { id: 3, name: 'Bob', age: 35 },
];

const defaultColumns: ColumnDef<TestRow, FilteringColumnMeta>[] = [
  { id: 'name', field: 'name', filterOperators: getStringFilterOperators() },
  { id: 'age', field: 'age', filterOperators: getNumericFilterOperators() },
];

describe('Filtering Plugin - Integration Tests', () => {
  const { render } = createRenderer();

  const getRowAttr = (container: HTMLElement, attr: string): string[] => {
    const rows = container.querySelectorAll('[data-testid="row"]');
    return Array.from(rows).map((row) => row.getAttribute(attr) || '');
  };

  const getRowNames = (container: HTMLElement): string[] => getRowAttr(container, 'data-name');

  describe('initial state', () => {
    it('should show all rows when no filter is applied', () => {
      const { container } = render(<TestDataGrid rows={defaultRows} columns={defaultColumns} />);
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
    });

    it('should apply filter from initialState', () => {
      const { container } = render(
        <TestDataGrid
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
        <TestDataGrid
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
        <TestDataGrid
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
        const apiRef = React.createRef<TestGridApi | null>();
        const { container } = render(
          <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
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
        const apiRef = React.createRef<TestGridApi | null>();
        const model: FilterModel = {
          logicOperator: 'and',
          conditions: [{ field: 'name', operator: 'contains', value: 'li' }],
        };
        render(
          <TestDataGrid
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
        const apiRef = React.createRef<TestGridApi | null>();
        const { container } = render(
          <TestDataGrid
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
        const apiRef = React.createRef<TestGridApi | null>();
        const { container } = render(
          <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
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
        const apiRef = React.createRef<TestGridApi | null>();
        render(
          <TestDataGrid
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
      it('should re-filter when rows change', async () => {
        const apiRef = React.createRef<TestGridApi | null>();
        const { container } = render(
          <TestDataGrid
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
      it('should NOT re-filter automatically when rows change', async () => {
        const apiRef = React.createRef<TestGridApi | null>();
        const { container } = render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            filtering={{ mode: 'manual' }}
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

        // Manual mode: initial filter model is NOT applied automatically
        expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);

        // Explicitly apply
        await act(async () => {
          apiRef.current?.api.filtering.apply();
        });

        expect(getRowNames(container)).toEqual(['Charlie', 'Bob']);

        // Update a row to make it pass the filter
        await act(async () => {
          apiRef.current?.api.rows.updateRows([{ id: 2, name: 'Alice', age: 40 }]);
        });

        // Without explicit apply, the rows should remain the same
        expect(getRowNames(container)).toEqual(['Charlie', 'Bob']);
      });

      it('should show added rows immediately without calling apply()', async () => {
        const apiRef = React.createRef<TestGridApi | null>();
        const { container } = render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            filtering={{ mode: 'manual' }}
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

        // Apply the filter
        await act(async () => {
          apiRef.current?.api.filtering.apply();
        });

        expect(getRowNames(container)).toEqual(['Charlie', 'Bob']);

        // Add a new row (age 20 does NOT satisfy the filter, but should appear anyway)
        await act(async () => {
          apiRef.current?.api.rows.updateRows([{ id: 4, name: 'Diana', age: 20 }]);
        });

        // New row appears immediately without apply()
        expect(getRowNames(container)).toEqual(['Charlie', 'Bob', 'Diana']);
      });

      it('should remove deleted rows immediately without calling apply()', async () => {
        const apiRef = React.createRef<TestGridApi | null>();
        const { container } = render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            filtering={{ mode: 'manual' }}
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

        // Apply the filter
        await act(async () => {
          apiRef.current?.api.filtering.apply();
        });

        expect(getRowNames(container)).toEqual(['Charlie', 'Bob']);

        // Delete Bob
        await act(async () => {
          apiRef.current?.api.rows.updateRows([{ id: 3, _action: 'delete' }]);
        });

        // Bob disappears immediately without apply()
        expect(getRowNames(container)).toEqual(['Charlie']);
      });
    });
  });

  describe('controlled model', () => {
    it('should update when controlled filtering.model prop changes', async () => {
      const { container, setProps } = render(
        <TestDataGrid
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
        <TestDataGrid
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
            model: { logicOperator: 'and', conditions: [] },
          },
        });
      });

      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
    });
  });

  describe('row prop changes with active filter', () => {
    it('should re-apply filter when rows prop changes completely', async () => {
      const { container, setProps } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          filtering={{
            model: {
              logicOperator: 'and',
              conditions: [{ field: 'name', operator: 'contains', value: 'a' }],
            },
          }}
        />,
      );

      // Charlie and Alice contain 'a'
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice']);

      // Replace all rows
      await act(async () => {
        setProps({
          rows: [
            { id: 10, name: 'Asics', age: 20 },
            { id: 11, name: 'RedBull', age: 30 },
            { id: 12, name: 'Hugo', age: 40 },
          ],
        });
      });

      // Only Asics contains 'a'
      expect(getRowNames(container)).toEqual(['Asics']);
    });
  });

  describe('column removal filter model cleanup', () => {
    it('should clean up filter model when filtered column is removed', async () => {
      const onModelChange = vi.fn();

      const { container, setProps } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          filtering={{
            model: {
              logicOperator: 'and',
              conditions: [{ field: 'name', operator: 'equals', value: 'Alice' }],
            },
            onModelChange,
          }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Alice']);

      // Remove 'name' column, keep only 'age'
      await act(async () => {
        setProps({
          columns: [
            { id: 'age', field: 'age', filterOperators: getNumericFilterOperators() },
          ] as ColumnDef<TestRow, FilteringColumnMeta>[],
        });
      });

      // Filter condition for 'name' should be removed
      expect(onModelChange).toHaveBeenCalled();
      const cleanedModel = onModelChange.mock.calls[onModelChange.mock.calls.length - 1][0];
      expect(cleanedModel.conditions).toHaveLength(0);

      // All rows should be visible now
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
    });
  });

  describe('quick filter integration', () => {
    it('should filter across visible columns with quick filter', async () => {
      const apiRef = React.createRef<TestGridApi | null>();
      const { container } = render(
        <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
      );

      await act(async () => {
        apiRef.current?.api.filtering.setModel({
          logicOperator: 'and',
          conditions: [],
          quickFilter: { values: ['li'] },
        });
      });

      // Alice and Charlie contain 'li'
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice']);
    });

    it('should combine quick filter with regular filter (both must pass)', async () => {
      const apiRef = React.createRef<TestGridApi | null>();
      const initialModel: FilterModel = {
        logicOperator: 'and',
        conditions: [{ field: 'age', operator: '>', value: 25 }],
      };
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          apiRef={apiRef}
          initialState={{
            filtering: {
              model: initialModel,
            },
          }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Charlie', 'Bob']);

      await act(async () => {
        apiRef.current?.api.filtering.setModel({
          ...initialModel,
          quickFilter: { values: ['li'] },
        });
      });

      // Quick filter 'li' matches Alice, Charlie. Regular filter age > 25 keeps Charlie, Bob.
      // Combined: only Charlie passes both.
      expect(getRowNames(container)).toEqual(['Charlie']);
    });

    it('should work with controlled model with quickFilter.values', () => {
      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          filtering={{
            model: {
              logicOperator: 'and',
              conditions: [],
              quickFilter: { values: ['Bob'] },
            },
          }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Bob']);
    });

    it('should clear quick filter and restore all rows', async () => {
      const apiRef = React.createRef<TestGridApi | null>();
      const { container } = render(
        <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
      );

      await act(async () => {
        apiRef.current?.api.filtering.setModel({
          logicOperator: 'and',
          conditions: [],
          quickFilter: { values: ['Alice'] },
        });
      });

      expect(getRowNames(container)).toEqual(['Alice']);

      await act(async () => {
        apiRef.current?.api.filtering.setModel({
          logicOperator: 'and',
          conditions: [],
        });
      });

      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
    });
  });

  describe('new API methods', () => {
    describe('upsertCondition', () => {
      it('should add new condition', async () => {
        const apiRef = React.createRef<TestGridApi | null>();
        const { container } = render(
          <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
        );

        await act(async () => {
          apiRef.current?.api.filtering.upsertCondition({
            field: 'name',
            operator: 'equals',
            value: 'Alice',
          });
        });

        expect(getRowNames(container)).toEqual(['Alice']);
      });

      it('should update existing condition with same field and operator', async () => {
        const apiRef = React.createRef<TestGridApi | null>();
        const { container } = render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
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

        expect(getRowNames(container)).toEqual(['Alice']);

        await act(async () => {
          apiRef.current?.api.filtering.upsertCondition({
            field: 'name',
            operator: 'equals',
            value: 'Bob',
          });
        });

        expect(getRowNames(container)).toEqual(['Bob']);
        // Should still have only one condition (updated, not appended)
        expect(apiRef.current?.api.filtering.getModel().conditions).toHaveLength(1);
      });
    });

    describe('deleteCondition', () => {
      it('should remove a condition', async () => {
        const apiRef = React.createRef<TestGridApi | null>();
        const { container } = render(
          <TestDataGrid
            rows={defaultRows}
            columns={defaultColumns}
            apiRef={apiRef}
            initialState={{
              filtering: {
                model: {
                  logicOperator: 'and',
                  conditions: [
                    { field: 'name', operator: 'contains', value: 'li' },
                    { field: 'age', operator: '>=', value: 30 },
                  ],
                },
              },
            }}
          />,
        );

        // Both conditions active: contains 'li' AND age >= 30 = Charlie(30, contains 'li')
        expect(getRowNames(container)).toEqual(['Charlie']);

        await act(async () => {
          apiRef.current?.api.filtering.deleteCondition({
            field: 'age',
            operator: '>=',
            value: 30,
          });
        });

        // Only 'contains li' remains: Charlie, Alice
        expect(getRowNames(container)).toEqual(['Charlie', 'Alice']);
      });
    });

});
});
