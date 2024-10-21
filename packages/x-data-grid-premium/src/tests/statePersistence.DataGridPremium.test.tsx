import * as React from 'react';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridApi,
  GridColDef,
  GridInitialState,
  GridRowsProp,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { createRenderer, act } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { getColumnValues } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rows: GridRowsProp = [
  { id: 0, category: 'Cat A' },
  { id: 1, category: 'Cat A' },
  { id: 2, category: 'Cat A' },
  { id: 3, category: 'Cat B' },
  { id: 4, category: 'Cat B' },
  { id: 5, category: 'Cat B' },
];

const columns: GridColDef[] = [
  {
    field: 'id',
    type: 'number',
  },
  {
    field: 'category',
  },
];

const FULL_INITIAL_STATE: GridInitialState = {
  columns: {
    orderedFields: ['__row_group_by_columns_group__', 'id', 'category'],
  },
  rowGrouping: {
    model: ['category'],
  },
  aggregation: {
    model: {
      id: 'size',
    },
  },
};

describe('<DataGridPremium /> - State persistence', () => {
  const { render } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;

  function TestCase(props: Omit<DataGridPremiumProps, 'rows' | 'columns' | 'apiRef'>) {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium
          rows={rows}
          columns={columns}
          pagination
          autoHeight={isJSDOM}
          apiRef={apiRef}
          disableVirtualization
          {...props}
          defaultGroupingExpansionDepth={-1}
          groupingColDef={{ headerName: 'Group' }}
        />
      </div>
    );
  }

  describe('apiRef: exportState', () => {
    it('should export the initial values of the models', () => {
      render(<TestCase initialState={FULL_INITIAL_STATE} />);

      const exportedState = apiRef.current.exportState();
      expect(exportedState.rowGrouping).to.deep.equal(FULL_INITIAL_STATE.rowGrouping);
      expect(exportedState.aggregation).to.deep.equal(FULL_INITIAL_STATE.aggregation);
    });

    it('should not export the default values of the models when using exportOnlyDirtyModels', () => {
      render(<TestCase />);
      expect(apiRef.current.exportState({ exportOnlyDirtyModels: true })).to.deep.equal({
        columns: {
          orderedFields: ['id', 'category'],
        },
      });
    });

    it('should export the current version of the exportable state', () => {
      render(<TestCase />);
      act(() => apiRef.current.setRowGroupingModel(['category']));
      act(() =>
        apiRef.current.setAggregationModel({
          id: 'size',
        }),
      );

      const exportedState = apiRef.current.exportState();
      expect(exportedState.rowGrouping).to.deep.equal(FULL_INITIAL_STATE.rowGrouping);
      expect(exportedState.aggregation).to.deep.equal(FULL_INITIAL_STATE.aggregation);
    });

    it('should export the current version of the exportable state when using exportOnlyDirtyModels', () => {
      render(<TestCase />);
      act(() => apiRef.current.setRowGroupingModel(['category']));
      act(() =>
        apiRef.current.setAggregationModel({
          id: 'size',
        }),
      );

      const exportedState = apiRef.current.exportState({ exportOnlyDirtyModels: true });
      expect(exportedState.rowGrouping).to.deep.equal(FULL_INITIAL_STATE.rowGrouping);
      expect(exportedState.aggregation).to.deep.equal(FULL_INITIAL_STATE.aggregation);
    });

    it('should export the controlled values of the models', () => {
      render(
        <TestCase
          rowGroupingModel={FULL_INITIAL_STATE.rowGrouping?.model}
          aggregationModel={FULL_INITIAL_STATE.aggregation?.model}
        />,
      );
      expect(apiRef.current.exportState().rowGrouping).to.deep.equal(
        FULL_INITIAL_STATE.rowGrouping,
      );
      expect(apiRef.current.exportState().aggregation).to.deep.equal(
        FULL_INITIAL_STATE.aggregation,
      );
    });

    it('should export the controlled values of the models when using exportOnlyDirtyModels', () => {
      render(
        <TestCase
          rowGroupingModel={FULL_INITIAL_STATE.rowGrouping?.model}
          aggregationModel={FULL_INITIAL_STATE.aggregation?.model}
        />,
      );
      expect(apiRef.current.exportState().rowGrouping).to.deep.equal(
        FULL_INITIAL_STATE.rowGrouping,
      );
      expect(apiRef.current.exportState().aggregation).to.deep.equal(
        FULL_INITIAL_STATE.aggregation,
      );
    });
  });

  describe('apiRef: restoreState', () => {
    it('should restore the whole exportable state', () => {
      render(<TestCase />);

      act(() => apiRef.current.restoreState(FULL_INITIAL_STATE));
      expect(getColumnValues(0)).to.deep.equal([
        'Cat A (3)',
        '',
        '',
        '',
        'Cat B (3)',
        '',
        '',
        '',
        '',
      ]);
      expect(getColumnValues(1)).to.deep.equal([
        '3' /* Agg */,
        '0',
        '1',
        '2',
        '3',
        '3' /* Agg */,
        '4',
        '5',
        '6' /* Agg */,
      ]);
    });
  });
});
