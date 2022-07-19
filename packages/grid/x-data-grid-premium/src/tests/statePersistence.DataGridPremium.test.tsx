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
// @ts-ignore Remove once the test utils are typed
import { createRenderer } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { getColumnValues } from '../../../../../test/utils/helperFn';

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
  private_aggregation: {
    model: {
      id: 'size',
    },
  },
};

describe('<DataGridPremium /> - State Persistence', () => {
  const { render } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;

  const TestCase = (props: Omit<DataGridPremiumProps, 'rows' | 'columns' | 'apiRef'>) => {
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
          experimentalFeatures={{
            private_aggregation: true,
          }}
        />
      </div>
    );
  };

  describe('apiRef: exportState', () => {
    // We always export the `orderedFields`,
    // If it's something problematic we could introduce an `hasBeenReordered` property and only export if at least one column has been reordered.
    it('should not return the default values of the models', () => {
      render(<TestCase />);
      expect(apiRef.current.exportState()).to.deep.equal({
        columns: {
          orderedFields: ['id', 'category'],
        },
      });
    });

    it('should export the initial values of the models', () => {
      render(<TestCase initialState={FULL_INITIAL_STATE} />);
      expect(apiRef.current.exportState()).to.deep.equal(FULL_INITIAL_STATE);
    });

    it('should export the current version of the exportable state', () => {
      render(<TestCase />);
      apiRef.current.setRowGroupingModel(['category']);
      apiRef.current.private_setAggregationModel({ id: 'size' });
      expect(apiRef.current.exportState()).to.deep.equal(FULL_INITIAL_STATE);
    });
  });

  describe('apiRef: restoreState', () => {
    it('should restore the whole exportable state', () => {
      render(<TestCase />);

      apiRef.current.restoreState(FULL_INITIAL_STATE);
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
