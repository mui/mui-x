import type * as React from 'react';
import { describe, it, expect } from 'vitest';
import {
  computeFlexColumnsWidth,
  createColumnsState,
  hydrateColumnsWidth,
} from './gridColumnsUtils';
import type { GridColDef } from '../../../models/colDef/gridColDef';
import type { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import type { GridColumnsRawState, GridColumnsState } from './gridColumnsInterfaces';

describe('gridColumnsUtils', () => {
  describe('createColumnsState', () => {
    it('should sync columns state when column props are removed', () => {
      const fn = () => null;

      const columns: GridColDef[] = [
        { field: 'default' },
        { field: 'number', type: 'number' },
        { field: 'string', type: 'string' },
      ];

      const columnsWithMoreProps: GridColDef[] = [
        { field: 'default', renderHeader: fn, renderCell: fn },
        { field: 'number', type: 'number', renderHeader: fn, renderCell: fn },
        { field: 'string', type: 'string', renderHeader: fn, renderCell: fn },
      ];

      // Add a mock state to simulate that the columns state is already initialized
      const mockState: { columns: GridColumnsState } = {
        columns: {
          orderedFields: [],
          lookup: {},
          columnVisibilityModel: {},
          initialColumnVisibilityModel: {},
        },
      };
      const mockApiRef = {
        current: {
          state: mockState,
          unstable_applyPipeProcessors: (_name: string, state: any) => state,
        },
      } as React.RefObject<GridApiCommunity>;

      // Add columns with more props to the state
      const stateWithMoreProps = createColumnsState({
        apiRef: mockApiRef,
        columnsToUpsert: columnsWithMoreProps,
        initialState: undefined,
        keepOnlyColumnsToUpsert: true,
      });

      // Verify the props are in the state
      expect(stateWithMoreProps.lookup.default.renderHeader).toBe(fn);
      expect(stateWithMoreProps.lookup.number.renderHeader).toBe(fn);
      expect(stateWithMoreProps.lookup.string.renderHeader).toBe(fn);
      expect(stateWithMoreProps.lookup.default.renderCell).toBe(fn);
      expect(stateWithMoreProps.lookup.number.renderCell).toBe(fn);
      expect(stateWithMoreProps.lookup.string.renderCell).toBe(fn);

      // Update mock state
      mockState.columns = stateWithMoreProps;

      // Update columns by removing the extra props
      const stateWithRenderHeader = createColumnsState({
        apiRef: mockApiRef,
        columnsToUpsert: columns,
        initialState: undefined,
        keepOnlyColumnsToUpsert: true,
      });

      // Verify the props are removed
      expect(stateWithRenderHeader.lookup.default.renderHeader).toBeUndefined();
      expect(stateWithRenderHeader.lookup.number.renderHeader).toBeUndefined();
      expect(stateWithRenderHeader.lookup.string.renderHeader).toBeUndefined();
      expect(stateWithRenderHeader.lookup.default.renderCell).toBeUndefined();
      expect(stateWithRenderHeader.lookup.number.renderCell).toBeUndefined();
      expect(stateWithRenderHeader.lookup.string.renderCell).toBeUndefined();
    });
  });

  describe('hydrateColumnsWidth', () => {
    const getComputedWidth = (column: Omit<GridColDef, 'field'>) => {
      const rawState: GridColumnsRawState = {
        orderedFields: ['column'],
        lookup: { column: { field: 'column', ...column } },
        columnVisibilityModel: {},
        initialColumnVisibilityModel: {},
      };

      return hydrateColumnsWidth(rawState, undefined).lookup.column.computedWidth;
    };

    it('should respect a `minWidth` of 0', () => {
      expect(getComputedWidth({ width: 30, minWidth: 0 })).to.equal(30);
    });

    it('should respect a `width` of 0', () => {
      expect(getComputedWidth({ width: 0, minWidth: 0 })).to.equal(0);
      expect(getComputedWidth({ width: 0, minWidth: 20 })).to.equal(20);
    });

    it('should respect a `maxWidth` of 0', () => {
      expect(getComputedWidth({ width: 30, minWidth: 0, maxWidth: 0 })).to.equal(0);
    });

    it('should use the default dimensions when the values are missing or invalid', () => {
      expect(getComputedWidth({})).to.equal(100);
      expect(getComputedWidth({ width: 30 })).to.equal(50);
      expect(getComputedWidth({ width: Number.NaN })).to.equal(100);
      expect(getComputedWidth({ width: 30, minWidth: Number.NaN })).to.equal(50);
      expect(getComputedWidth({ width: 200, maxWidth: Number.NaN })).to.equal(200);
    });
  });

  describe('computeFlexColumnsWidth', () => {
    function getTotalFlexUnits(flexColumns: { flex: number }[]) {
      return flexColumns.reduce((acc, column) => acc + column.flex, 0);
    }

    // https://github.com/mui/mui-x/issues/3982
    it('should set the first column to be twice as wide as the second and third', () => {
      const flexColumns = [
        { field: 'id', minWidth: 50, flex: 2 },
        { field: 'username', minWidth: 50, flex: 1 },
        { field: 'age', minWidth: 50, flex: 1 },
      ];
      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 480,
        totalFlexUnits: getTotalFlexUnits(flexColumns),
      });

      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(
        computedColumns[flexColumns[2].field].computedWidth,
      );
      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(
        2 * computedColumns[flexColumns[1].field].computedWidth,
      );
    });

    it('should use `minWidth` if calculated flex size is smaller', () => {
      const flexColumns = [
        { field: 'id', minWidth: 50, flex: 2 },
        { field: 'username', minWidth: 50, flex: 1 },
        { field: 'age', minWidth: 50, flex: 1 },
      ];

      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 100,
        totalFlexUnits: getTotalFlexUnits(flexColumns),
      });

      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(50);
      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(50);
      expect(computedColumns[flexColumns[2].field].computedWidth).to.equal(50);
    });

    it('should distribute remaining space between flex items', () => {
      const flexColumns = [
        { field: 'id', minWidth: 50, flex: 1000 },
        { field: 'username', minWidth: 50, flex: 1000 },
        { field: 'age', minWidth: 50, flex: 1 },
      ];

      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 200,
        totalFlexUnits: getTotalFlexUnits(flexColumns),
      });

      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(75);
      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(75);
      expect(computedColumns[flexColumns[2].field].computedWidth).to.equal(50);
    });

    // https://github.com/mui/mui-x/issues/3091
    it('should work with `flex` values < 1', () => {
      const flexColumns = [
        { field: 'id', minWidth: 50, flex: 1 },
        { field: 'username', minWidth: 50, flex: 1 },
        { field: 'age', minWidth: 50, flex: 0.001 },
      ];

      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 200,
        totalFlexUnits: getTotalFlexUnits(flexColumns),
      });

      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(75);
      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(75);
      expect(computedColumns[flexColumns[2].field].computedWidth).to.equal(50);
    });

    it('should use `minWidth` on flex columns if there is no more space to distribute', () => {
      const flexColumns = [
        { field: 'id', flex: 1, minWidth: 50 },
        { field: 'age', flex: 3, minWidth: 50 },
      ];

      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 0,
        totalFlexUnits: getTotalFlexUnits(flexColumns),
      });

      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(50);
      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(50);
    });

    it('should use `maxWidth` if calculated width exceeds it', () => {
      const flexColumns = [
        { field: 'id', flex: 1, minWidth: 50, maxWidth: 100 },
        { field: 'age', flex: 3, minWidth: 50 },
      ];

      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 1000,
        totalFlexUnits: getTotalFlexUnits(flexColumns),
      });

      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(100);
      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(900);
    });

    it('should not use `maxWidth` if calculated width is smaller', () => {
      const flexColumns = [
        { field: 'age', flex: 1, maxWidth: 800 },
        { field: 'id', flex: 1, maxWidth: 400 },
      ];

      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 1000,
        totalFlexUnits: getTotalFlexUnits(flexColumns),
      });

      expect(computedColumns[flexColumns[0].field].computedWidth).to.equal(600);
      expect(computedColumns[flexColumns[1].field].computedWidth).to.equal(400);
    });

    it('should split the columns equally if they are all flex', () => {
      const flexColumns = [
        { field: 'id', flex: 1, minWidth: 50 },
        { field: 'name', flex: 1 },
        { field: 'age', flex: 1 },
      ];

      const containerWidth = 408;

      const computedColumns = computeFlexColumnsWidth({
        flexColumns,
        initialFreeSpace: 408,
        totalFlexUnits: getTotalFlexUnits(flexColumns),
      });

      const expectedWidth = containerWidth / 3;
      expect(computedColumns[flexColumns[0].field].computedWidth).to.be.equal(expectedWidth);
      expect(computedColumns[flexColumns[1].field].computedWidth).to.be.equal(expectedWidth);
      expect(computedColumns[flexColumns[2].field].computedWidth).to.be.equal(expectedWidth);
    });
  });
});
