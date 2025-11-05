import { RefObject } from '@mui/x-internals/types';
import { gridPaginationRowRangeSelector } from '../gridPaginationSelector';
import { GridApiCommunity } from '../../../../models/api/gridApiCommunity';
import { GridStateCommunity } from '../../../../models/gridStateCommunity';

describe('gridPaginationRowRangeSelector', () => {
  it('does not throw and returns null when visibleSortedRowEntries is empty', () => {
    // Create a minimal state that will result in empty visible rows
    const state: GridStateCommunity = {
      pagination: {
        enabled: true,
        paginationMode: 'client',
        paginationModel: { page: 0, pageSize: 10 },
        rowCount: 0,
        meta: {},
      },
      rows: {
        tree: {},
        treeDepths: {},
        dataRowIds: [],
        dataRowIdToModelLookup: {},
        totalRowCount: 0,
        totalTopLevelRowCount: 0,
        groupingName: '',
      },
      filter: {
        filterModel: { items: [] },
        filteredRowsLookup: {},
        filteredDescendantCountLookup: {},
      },
      sorting: {
        sortModel: [],
        sortedRows: [],
      },
    } as any;

    const apiRef = {
      current: { state, instanceId: { id: 0 } },
    } as RefObject<GridApiCommunity>;

    // The selector should not throw when called
    let result;
    expect(() => {
      result = gridPaginationRowRangeSelector(apiRef);
    }).not.toThrow();

    // And it should return null for empty visible rows
    expect(result).toBeNull();
  });

  it('does not throw and returns null when visibleSortedTopLevelRowEntries is empty but tree depth >= 2', () => {
    // Create a state where we have tree depth >= 2 but no top-level entries
    const state: GridStateCommunity = {
      pagination: {
        enabled: true,
        paginationMode: 'client',
        paginationModel: { page: 0, pageSize: 10 },
        rowCount: 0,
        meta: {},
      },
      rows: {
        tree: {},
        treeDepths: { 0: 1, 1: 1 }, // Simulate depth >= 2
        dataRowIds: [],
        dataRowIdToModelLookup: {},
        totalRowCount: 0,
        totalTopLevelRowCount: 0,
        groupingName: '',
      },
      filter: {
        filterModel: { items: [] },
        filteredRowsLookup: {},
        filteredDescendantCountLookup: {},
      },
      sorting: {
        sortModel: [],
        sortedRows: [],
      },
    } as any;

    const apiRef = {
      current: { state, instanceId: { id: 0 } },
    } as RefObject<GridApiCommunity>;

    // The selector should not throw when called
    let result;
    expect(() => {
      result = gridPaginationRowRangeSelector(apiRef);
    }).not.toThrow();

    // And it should return null
    expect(result).toBeNull();
  });

  it('returns valid range for non-empty flat rows', () => {
    // Create a state with valid rows (flat tree, depth < 2)
    const state: GridStateCommunity = {
      pagination: {
        enabled: true,
        paginationMode: 'client',
        paginationModel: { page: 0, pageSize: 10 },
        rowCount: 20,
        meta: {},
      },
      rows: {
        tree: {
          1: { id: '1', depth: 0, parent: null },
          2: { id: '2', depth: 0, parent: null },
        },
        treeDepths: { 0: 2 },
        dataRowIds: ['1', '2'],
        dataRowIdToModelLookup: {
          1: { id: '1', name: 'Row 1' },
          2: { id: '2', name: 'Row 2' },
        },
        totalRowCount: 2,
        totalTopLevelRowCount: 2,
        groupingName: '',
      },
      filter: {
        filterModel: { items: [] },
        filteredRowsLookup: { 1: true, 2: true },
        filteredDescendantCountLookup: {},
      },
      sorting: {
        sortModel: [],
        sortedRows: ['1', '2'],
      },
    } as any;

    const apiRef = {
      current: { state, instanceId: { id: 0 } },
    } as RefObject<GridApiCommunity>;

    // The selector should not throw
    let result;
    expect(() => {
      result = gridPaginationRowRangeSelector(apiRef);
    }).not.toThrow();

    // For flat trees with valid rows, we should get a valid range
    expect(result).not.toBeNull();
    if (result) {
      expect(result).toHaveProperty('firstRowIndex');
      expect(result).toHaveProperty('lastRowIndex');
      expect(result.firstRowIndex).toBeGreaterThanOrEqual(0);
      expect(result.lastRowIndex).toBeGreaterThanOrEqual(result.firstRowIndex);
    }
  });
});
