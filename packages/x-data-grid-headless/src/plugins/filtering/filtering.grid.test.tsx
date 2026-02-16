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
      it('should re-filter when model changes', async () => {
        const apiRef = React.createRef<TestGridApi | null>();
        const { container } = render(
          <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
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
      it('should NOT re-filter automatically when model changes', async () => {
        const apiRef = React.createRef<TestGridApi | null>();
        const { container } = render(
          <TestDataGrid
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

  describe('sorting interaction', () => {
    it('should preserve sort order in filtered results', () => {
      const { container } = render(
        <TestDataGrid
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
      const apiRef = React.createRef<TestGridApi | null>();
      const { container } = render(
        <TestDataGrid
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
      const apiRef = React.createRef<TestGridApi | null>();
      const { container } = render(
        <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
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
        <TestDataGrid
          rows={defaultRows}
          columns={defaultColumns}
          filtering={{ model, disableEval: false }}
        />,
      );

      const { container: container2 } = render(
        <TestDataGrid
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
      const apiRef = React.createRef<TestGridApi | null>();
      const columns: ColumnDef<TestRow, FilteringColumnMeta>[] = [
        {
          id: 'name',
          field: 'name',
          filterable: false,
          filterOperators: getStringFilterOperators(),
        },
        { id: 'age', field: 'age', filterOperators: getNumericFilterOperators() },
      ];

      const { container } = render(
        <TestDataGrid rows={defaultRows} columns={columns} apiRef={apiRef} />,
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

      // Update Alice's age to 40
      await act(async () => {
        apiRef.current?.api.rows.updateRows([{ id: 2, name: 'Alice', age: 40 }]);
      });

      // Alice should now be included
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice', 'Bob']);
    });

    it('should maintain filter when adding new rows', async () => {
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

  describe('getRowId with active filter', () => {
    it('should work with custom getRowId', () => {
      type BrandRow = { brand: string; age: number };
      const brandColumns: ColumnDef<BrandRow, FilteringColumnMeta>[] = [
        { id: 'brand', field: 'brand', filterOperators: getStringFilterOperators() },
        { id: 'age', field: 'age', filterOperators: getNumericFilterOperators() },
      ];

      const { container } = render(
        <TestDataGrid
          rows={[
            { brand: 'Nike', age: 10 },
            { brand: 'Adidas', age: 20 },
            { brand: 'Puma', age: 30 },
          ]}
          columns={brandColumns}
          getRowId={(row: BrandRow) => row.brand}
          filtering={{
            model: {
              logicOperator: 'and',
              conditions: [{ field: 'brand', operator: 'contains', value: 'a' }],
            },
          }}
        />,
      );

      expect(getRowAttr(container, 'data-brand')).toEqual(['Adidas', 'Puma']);
    });
  });

  describe('ignoreDiacritics', () => {
    it('should not ignore diacritics by default', () => {
      const { container } = render(
        <TestDataGrid
          rows={[
            { id: 1, name: 'Apă', age: 25 },
            { id: 2, name: 'Bob', age: 30 },
          ]}
          columns={defaultColumns}
          filtering={{
            model: {
              logicOperator: 'and',
              conditions: [{ field: 'name', operator: 'contains', value: 'apa' }],
            },
          }}
        />,
      );

      expect(getRowNames(container)).toEqual([]);
    });

    it('should match when ignoreDiacritics is enabled', () => {
      const { container } = render(
        <TestDataGrid
          rows={[
            { id: 1, name: 'Apă', age: 25 },
            { id: 2, name: 'Bob', age: 30 },
          ]}
          columns={defaultColumns}
          filtering={{
            model: {
              logicOperator: 'and',
              conditions: [{ field: 'name', operator: 'contains', value: 'apa' }],
            },
            ignoreDiacritics: true,
          }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Apă']);
    });

    it('should match diacritics in both filter and cell values', () => {
      const { container } = render(
        <TestDataGrid
          rows={[
            { id: 1, name: 'Apă', age: 25 },
            { id: 2, name: 'Bob', age: 30 },
          ]}
          columns={defaultColumns}
          filtering={{
            model: {
              logicOperator: 'and',
              conditions: [{ field: 'name', operator: 'contains', value: 'apă' }],
            },
            ignoreDiacritics: true,
          }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Apă']);
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
    it('should filter across visible columns with setQuickFilterValues', async () => {
      const apiRef = React.createRef<TestGridApi | null>();
      const { container } = render(
        <TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />,
      );

      await act(async () => {
        apiRef.current?.api.filtering.setQuickFilterValues(['li']);
      });

      // Alice and Charlie contain 'li'
      expect(getRowNames(container)).toEqual(['Charlie', 'Alice']);
    });

    it('should combine quick filter with regular filter (both must pass)', async () => {
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
                conditions: [{ field: 'age', operator: '>', value: 25 }],
              },
            },
          }}
        />,
      );

      expect(getRowNames(container)).toEqual(['Charlie', 'Bob']);

      await act(async () => {
        apiRef.current?.api.filtering.setQuickFilterValues(['li']);
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
        apiRef.current?.api.filtering.setQuickFilterValues(['Alice']);
      });

      expect(getRowNames(container)).toEqual(['Alice']);

      await act(async () => {
        apiRef.current?.api.filtering.setQuickFilterValues([]);
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

    describe('setLogicOperator', () => {
      it('should change root logic operator', async () => {
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
                    { field: 'name', operator: 'equals', value: 'Alice' },
                    { field: 'name', operator: 'equals', value: 'Bob' },
                  ],
                },
              },
            }}
          />,
        );

        // AND: name=Alice AND name=Bob => impossible, no results
        expect(getRowNames(container)).toEqual([]);

        await act(async () => {
          apiRef.current?.api.filtering.setLogicOperator('or');
        });

        // OR: name=Alice OR name=Bob => both
        expect(getRowNames(container)).toEqual(['Alice', 'Bob']);
      });
    });

    describe('setQuickFilterValues', () => {
      it('should set quick filter values on the model', async () => {
        const apiRef = React.createRef<TestGridApi | null>();
        render(<TestDataGrid rows={defaultRows} columns={defaultColumns} apiRef={apiRef} />);

        await act(async () => {
          apiRef.current?.api.filtering.setQuickFilterValues(['test']);
        });

        const model = apiRef.current?.api.filtering.getModel()!;
        expect(model.quickFilter?.values).toEqual(['test']);
      });
    });
  });

  describe('valueParser integration', () => {
    it('should transform filter values before applying', () => {
      const columns: ColumnDef<TestRow, FilteringColumnMeta>[] = [
        { id: 'name', field: 'name', filterOperators: getStringFilterOperators() },
        {
          id: 'age',
          field: 'age',
          filterOperators: getNumericFilterOperators(),
          valueParser: (value: any) => Number(value) * 2,
        },
      ];

      const { container } = render(
        <TestDataGrid
          rows={defaultRows}
          columns={columns}
          filtering={{
            model: {
              logicOperator: 'and',
              conditions: [{ field: 'age', operator: '=', value: 15 }],
            },
          }}
        />,
      );

      // valueParser(15) = 30, so it matches Charlie (age 30)
      expect(getRowNames(container)).toEqual(['Charlie']);
    });
  });
});
