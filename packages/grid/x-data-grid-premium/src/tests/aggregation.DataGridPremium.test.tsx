import * as React from 'react';
// @ts-ignore Remove once the test utils are typed
import { createRenderer } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { getColumnValues } from 'test/utils/helperFn';
import { spy } from 'sinon';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GRID_AGGREGATION_FUNCTIONS,
  GridAggregationFunction,
  GridApi,
  GridRowsProp,
  GridRowTreeNodeConfig,
  useGridApiRef,
} from '@mui/x-data-grid-premium';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const rows: GridRowsProp = [
  { id: 0, category1: 'Cat A', category2: 'Cat 1' },
  { id: 1, category1: 'Cat A', category2: 'Cat 2' },
  { id: 2, category1: 'Cat A', category2: 'Cat 2' },
  { id: 3, category1: 'Cat A', category2: 'Cat 2' },
  { id: 4, category1: 'Cat A', category2: 'Cat 1' },
  { id: 5, category1: 'Cat B', category2: 'Cat 1' },
];

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

describe('<DataGridPremium /> - Aggregation', () => {
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
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
      });

      it('should not react to initial state updates', () => {
        const { setProps } = render(
          <Test initialState={{ aggregation: { model: { id: 'max' } } }} />,
        );
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);

        setProps({ initialState: { aggregation: { model: { id: 'min' } } } });
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
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
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
        setProps({ aggregationModel: { id: 'min' } });
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '0' /* Agg */]);
        setProps({ aggregationModel: {} });
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
      });

      it('should ignore aggregation rule that do not match any column', () => {
        render(<Test initialState={{ aggregation: { model: { id: 'max', idBis: 'max' } } }} />);
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
      });

      it('should ignore aggregation rule with colDef.aggregable = false', () => {
        render(
          <Test
            columns={[
              {
                field: 'id',
                type: 'number',
              },
              {
                field: 'idBis',
                type: 'number',
                valueGetter: (params) => params.row.id,
                aggregable: false,
              },
            ]}
            initialState={{ aggregation: { model: { id: 'max', idBis: 'max' } } }}
          />,
        );
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
        expect(getColumnValues(1)).to.deep.equal(['0', '1', '2', '3', '4', '5', '' /* Agg */]);
      });

      it('should ignore aggregation rules with invalid aggregation functions', () => {
        render(<Test initialState={{ aggregation: { model: { id: 'mux' } } }} />);
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
      });
    });
  });

  describe('Row Grouping', () => {
    it('should create one footer row per group and one global footer', () => {
      render(
        <Test
          initialState={{
            rowGrouping: { model: ['category1'] },
            aggregation: { model: { id: 'max' } },
          }}
          defaultGroupingExpansionDepth={-1}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal([
        '',
        '0',
        '1',
        '2',
        '3',
        '4',
        '4' /* Agg "Cat A" */,
        '',
        '5',
        '5' /* Agg "Cat B" */,
        '5' /* Agg root */,
      ]);
    });

    describe('props: aggregationPosition', () => {
      it('should not create footer rows and add aggregated values on group row when props.aggregationPosition = "inline"', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              aggregation: { model: { id: 'max' } },
            }}
            aggregationPosition="inline"
            defaultGroupingExpansionDepth={-1}
          />,
        );
        expect(getColumnValues(1)).to.deep.equal([
          '4' /* Agg "Cat A" */,
          '0',
          '1',
          '2',
          '3',
          '4',
          '5' /* Agg "Cat B" */,
          '5',
        ]);
      });

      it('should react to props.aggregationPosition update', () => {
        const { setProps } = render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              aggregation: { model: { id: 'max' } },
            }}
            defaultGroupingExpansionDepth={-1}
            aggregationPosition="footer"
          />,
        );
        expect(getColumnValues(1)).to.deep.equal([
          '',
          '0',
          '1',
          '2',
          '3',
          '4',
          '4' /* Agg "Cat A" */,
          '',
          '5',
          '5' /* Agg "Cat B" */,
          '5' /* Agg root */,
        ]);

        setProps({ aggregationPosition: 'inline' });
        expect(getColumnValues(1)).to.deep.equal([
          '4' /* Agg "Cat A" */,
          '0',
          '1',
          '2',
          '3',
          '4',
          '5' /* Agg "Cat B" */,
          '5',
        ]);

        setProps({ aggregationPosition: 'footer' });
        expect(getColumnValues(1)).to.deep.equal([
          '',
          '0',
          '1',
          '2',
          '3',
          '4',
          '4' /* Agg "Cat A" */,
          '',
          '5',
          '5' /* Agg "Cat B" */,
          '5' /* Agg root */,
        ]);
      });
    });

    describe('props: isGroupAggregated', () => {
      it('should not aggregate groups if props.isGroupAggregated returns false', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              aggregation: { model: { id: 'max' } },
            }}
            defaultGroupingExpansionDepth={-1}
            isGroupAggregated={(group) => group?.groupingKey === 'Cat A'}
          />,
        );
        expect(getColumnValues(1)).to.deep.equal([
          '',
          '0',
          '1',
          '2',
          '3',
          '4',
          '4' /* Agg "Cat A" */,
          '',
          '5',
        ]);
      });

      it('should react to props.isGroupAggregated update', () => {
        const { setProps } = render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              aggregation: { model: { id: 'max' } },
            }}
            defaultGroupingExpansionDepth={-1}
            // Only group "Cat A" aggregated
            isGroupAggregated={(group) => group?.groupingKey === 'Cat A'}
          />,
        );
        expect(getColumnValues(1)).to.deep.equal([
          '',
          '0',
          '1',
          '2',
          '3',
          '4',
          '4' /* Agg "Cat A" */,
          '',
          '5',
        ]);

        // All groups aggregated except the root
        setProps({ isGroupAggregated: (group: GridRowTreeNodeConfig | null) => group != null });
        expect(getColumnValues(1)).to.deep.equal([
          '',
          '0',
          '1',
          '2',
          '3',
          '4',
          '4' /* Agg "Cat A" */,
          '',
          '5',
          '5' /* Agg "Cat B" */,
        ]);

        // All groups aggregated
        setProps({ isGroupAggregated: undefined });
        expect(getColumnValues(1)).to.deep.equal([
          '',
          '0',
          '1',
          '2',
          '3',
          '4',
          '4' /* Agg "Cat A" */,
          '',
          '5',
          '5' /* Agg "Cat B" */,
          '5' /* Agg root */,
        ]);

        // 0 group aggregated
        setProps({ isGroupAggregated: () => false });
        expect(getColumnValues(1)).to.deep.equal(['', '0', '1', '2', '3', '4', '', '5']);
      });
    });
  });

  describe('props: aggregatedRows', () => {
    it('should aggregate based on the filtered rows if props.aggregatedRows is not defined', () => {
      render(
        <Test
          initialState={{
            filter: {
              filterModel: { items: [{ columnField: 'id', operatorValue: '<', value: 4 }] },
            },
            aggregation: { model: { id: 'max' } },
          }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '3' /* Agg */]);
    });

    it('should aggregate based on the filtered rows if props.aggregatedRows = "filtered"', () => {
      render(
        <Test
          initialState={{
            filter: {
              filterModel: { items: [{ columnField: 'id', operatorValue: '<', value: 4 }] },
            },
            aggregation: { model: { id: 'max' } },
          }}
          aggregatedRows="filtered"
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '3' /* Agg */]);
    });

    it('should aggregate based on all the rows if props.aggregatedRows = "all"', () => {
      render(
        <Test
          initialState={{
            filter: {
              filterModel: { items: [{ columnField: 'id', operatorValue: '<', value: 4 }] },
            },
            aggregation: { model: { id: 'max' } },
          }}
          aggregatedRows="all"
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '5' /* Agg */]);
    });
  });

  describe('props: aggregationFunctions', () => {
    it('should ignore aggregation rules not present in props.aggregationFunctions', () => {
      render(
        <Test
          initialState={{ aggregation: { model: { id: 'max' } } }}
          aggregationFunctions={{
            min: GRID_AGGREGATION_FUNCTIONS.min,
          }}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
    });

    it('should react to props.aggregationFunctions update', () => {
      const { setProps } = render(
        <Test
          initialState={{ aggregation: { model: { id: 'max' } } }}
          aggregationFunctions={{
            min: GRID_AGGREGATION_FUNCTIONS.min,
          }}
        />,
      );

      // 'max' is not in props.aggregationFunctions
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);

      setProps({
        aggregationFunctions: {
          min: GRID_AGGREGATION_FUNCTIONS.min,
          max: GRID_AGGREGATION_FUNCTIONS.max,
        },
      });
      // 'max' is in props.aggregationFunctions
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5']);

      const customMax: GridAggregationFunction = {
        ...GRID_AGGREGATION_FUNCTIONS.max,
        apply: (params) => (GRID_AGGREGATION_FUNCTIONS.max.apply(params) as number) + 1,
      };
      setProps({ aggregationFunctions: { min: GRID_AGGREGATION_FUNCTIONS.min, max: customMax } });
      // 'max' is in props.aggregationFunctions but has changed
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '6']);
    });
  });
});
