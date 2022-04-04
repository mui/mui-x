import * as React from 'react';
// @ts-ignore Remove once the test utils are typed
import { createRenderer } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { getColumnValues } from 'test/utils/helperFn';
import { spy } from 'sinon';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridApi,
  GridRowsProp,
  useGridApiRef,
} from '@mui/x-data-grid-premium';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rows: GridRowsProp = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];

const baselineProps: DataGridPremiumProps = {
  autoHeight: isJSDOM,
  disableVirtualization: true,
  rows,
  columns: [
    {
      field: 'id',
      type: 'number',
    },
    {
      field: 'category1',
    },
    {
      field: 'category2',
    },
  ],
};

describe.only('<DataGridPremium /> - Aggregation', () => {
  const { render } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;

  const Test = (props: Partial<DataGridPremiumProps>) => {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  };

  describe('Setting aggregation model', () => {
    describe('initialState: aggregation.model', () => {
      it('should allow to initialize the aggregation', () => {
        render(<Test initialState={{ aggregation: { model: { id: 'max' } } }} />);
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', /* Agg */ '3']);
      });

      it('should not react to initial state updates', () => {
        const { setProps } = render(
          <Test initialState={{ aggregation: { model: { id: 'max' } } }} />,
        );
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', /* Agg */ '3']);

        setProps({ initialState: { aggregation: { model: { id: 'min' } } } });
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', /* Agg */ '3']);
      });
    });

    describe('prop: aggregationModel', () => {
      it('should not call onAggregationModelChange on initialisation or on aggregationModel prop change', () => {
        const onAggregationModelChange = spy();

        const { setProps } = render(
          <Test
            aggregationModel={{ id: 'max' }}
            onAggregationModelChange={onAggregationModelChange}
          />,
        );

        expect(onAggregationModelChange.callCount).to.equal(0);
        setProps({ id: 'min' });

        expect(onAggregationModelChange.callCount).to.equal(0);
      });

      it('should allow to update the aggregation model from the outside', () => {
        const { setProps } = render(<Test aggregationModel={{ id: 'max' }} />);
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', /* Agg */ '3']);
        setProps({ aggregationModel: { id: 'min' } });
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', /* Agg */ '0']);
        setProps({ aggregationModel: {} });
        // expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3']);
      });
    });
  });
});
