import * as React from 'react';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, screen, userEvent, within } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { getColumnValues } from 'test/utils/helperFn';
import { SinonSpy, spy } from 'sinon';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GRID_AGGREGATION_FUNCTIONS,
  GridAggregationFunction,
  GridApi,
  GridRenderCellParams,
  GridRowTreeNodeConfig,
  useGridApiRef,
} from '@mui/x-data-grid-premium';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const baselineProps: DataGridPremiumProps = {
  autoHeight: isJSDOM,
  disableVirtualization: true,
  rows: [
    { id: 0, category1: 'Cat A', category2: 'Cat 1' },
    { id: 1, category1: 'Cat A', category2: 'Cat 2' },
    { id: 2, category1: 'Cat A', category2: 'Cat 2' },
    { id: 3, category1: 'Cat A', category2: 'Cat 2' },
    { id: 4, category1: 'Cat A', category2: 'Cat 1' },
    { id: 5, category1: 'Cat B', category2: 'Cat 1' },
  ],
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
  const { render, clock } = createRenderer({ clock: 'fake' });

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
        render(<Test initialState={{ aggregation: { model: { id: { footer: 'max' } } } }} />);
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
      });

      it('should not react to initial state updates', () => {
        const { setProps } = render(
          <Test initialState={{ aggregation: { model: { id: { footer: 'max' } } } }} />,
        );
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);

        setProps({ initialState: { aggregation: { model: { id: { footer: 'min' } } } } });
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
      });
    });

    describe('prop: aggregationModel', () => {
      it('should not call onAggregationModelChange on initialisation or on aggregationModel prop change', () => {
        const onAggregationModelChange = spy();

        const { setProps } = render(
          <Test
            aggregationModel={{ id: { footer: 'max' } }}
            onAggregationModelChange={onAggregationModelChange}
          />,
        );

        expect(onAggregationModelChange.callCount).to.equal(0);
        setProps({ id: { footer: 'min' } });

        expect(onAggregationModelChange.callCount).to.equal(0);
      });

      it('should allow to update the aggregation model from the outside', () => {
        const { setProps } = render(<Test aggregationModel={{ id: { footer: 'max' } }} />);
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
        setProps({ aggregationModel: { id: { footer: 'min' } } });
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '0' /* Agg */]);
        setProps({ aggregationModel: {} });
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
      });

      it('should ignore aggregation rule that do not match any column', () => {
        render(
          <Test
            initialState={{
              aggregation: { model: { id: { footer: 'max' }, idBis: { footer: 'max' } } },
            }}
          />,
        );
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
            initialState={{
              aggregation: { model: { id: { footer: 'max' }, idBis: { footer: 'max' } } },
            }}
          />,
        );
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
        expect(getColumnValues(1)).to.deep.equal(['0', '1', '2', '3', '4', '5', '' /* Agg */]);
      });

      it('should ignore aggregation rules with invalid aggregation functions', () => {
        render(<Test initialState={{ aggregation: { model: { id: { footer: 'mux' } } } }} />);
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
            aggregation: { model: { id: { footer: 'max' } } },
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

    it('should not create footer rows and add aggregated values on group row when no footer aggregation item', () => {
      render(
        <Test
          initialState={{
            rowGrouping: { model: ['category1'] },
            aggregation: { model: { id: { inline: 'max' } } },
          }}
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

    describe('prop: isGroupAggregated', () => {
      it('should not aggregate groups if props.isGroupAggregated returns false', () => {
        render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              aggregation: { model: { id: { footer: 'max' } } },
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

      it('should react to props.isGroupAggregated update for footer aggregation', () => {
        const { setProps } = render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              aggregation: { model: { id: { footer: 'max' } } },
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

      it('should react to props.isGroupAggregated update for inline aggregation', () => {
        const { setProps } = render(
          <Test
            initialState={{
              rowGrouping: { model: ['category1'] },
              aggregation: { model: { id: { inline: 'max' } } },
            }}
            defaultGroupingExpansionDepth={-1}
            // Only group "Cat A" aggregated
            isGroupAggregated={(group) => group?.groupingKey === 'Cat A'}
          />,
        );
        expect(getColumnValues(1)).to.deep.equal([
          '4' /* Agg "Cat A" */,
          '0',
          '1',
          '2',
          '3',
          '4',
          '',
          '5',
        ]);

        // All groups aggregated
        setProps({ isGroupAggregated: undefined });
        expect(getColumnValues(1)).to.deep.equal([
          '4' /* Agg "Cat A" */,
          '0',
          '1',
          '2',
          '3',
          '4',
          '5' /* Agg "Cat B" */,
          '5' /* Agg root */,
        ]);

        // 0 group aggregated
        setProps({ isGroupAggregated: () => false });
        expect(getColumnValues(1)).to.deep.equal(['', '0', '1', '2', '3', '4', '', '5']);
      });
    });
  });

  describe('Column Menu', () => {
    it('should render footer select on aggregable column', () => {
      render(<Test />);

      apiRef.current.showColumnMenu('id');
      clock.runToLast();

      expect(screen.queryByLabelText('Aggregation')).not.to.equal(null);
      expect(screen.queryByLabelText('Footer')).to.equal(null);
      expect(screen.queryByLabelText('Inline')).to.equal(null);
    });

    it('should render footer and inline select on aggregable column with row grouping', () => {
      render(
        <Test
          initialState={{
            rowGrouping: { model: ['category1'] },
          }}
        />,
      );

      apiRef.current.showColumnMenu('id');
      clock.runToLast();

      expect(screen.queryByLabelText('Aggregation')).to.equal(null);
      expect(screen.queryByLabelText('Footer')).not.to.equal(null);
      expect(screen.queryByLabelText('Inline')).not.to.equal(null);
    });

    it('should update footer aggregation when changing "Aggregation" select value', () => {
      render(<Test />);

      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);

      apiRef.current.showColumnMenu('id');
      clock.runToLast();
      userEvent.mousePress(screen.queryByLabelText('Aggregation'));
      userEvent.mousePress(
        within(
          screen.getByRole('listbox', {
            name: 'Aggregation',
          }),
        ).getByText('max'),
      );

      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
    });

    it('should update aggregation when changing "Footer" and "Inline" select value', () => {
      render(
        <Test
          defaultGroupingExpansionDepth={-1}
          initialState={{
            rowGrouping: { model: ['category1'] },
          }}
        />,
      );

      expect(getColumnValues(1)).to.deep.equal(['', '0', '1', '2', '3', '4', '', '5']);

      apiRef.current.showColumnMenu('id');
      clock.runToLast();
      userEvent.mousePress(screen.queryByLabelText('Footer'));
      userEvent.mousePress(
        within(
          screen.getByRole('listbox', {
            name: 'Footer',
          }),
        ).getByText('max'),
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

      apiRef.current.showColumnMenu('id');
      clock.runToLast();
      userEvent.mousePress(screen.queryByLabelText('Inline'));
      userEvent.mousePress(
        within(
          screen.getByRole('listbox', {
            name: 'Inline',
          }),
        ).getByText('min'),
      );

      expect(getColumnValues(1)).to.deep.equal([
        '0' /* Agg "Cat A" */,
        '0',
        '1',
        '2',
        '3',
        '4',
        '4' /* Agg "Cat A" */,
        '5' /* Agg "Cat B" */,
        '5',
        '5' /* Agg "Cat B" */,
        '5' /* Agg root */,
      ]);
    });
  });

  describe('prop: aggregatedRows', () => {
    it('should aggregate based on the filtered rows if props.aggregatedRows is not defined', () => {
      render(
        <Test
          initialState={{
            filter: {
              filterModel: { items: [{ columnField: 'id', operatorValue: '<', value: 4 }] },
            },
            aggregation: { model: { id: { footer: 'max' } } },
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
            aggregation: { model: { id: { footer: 'max' } } },
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
            aggregation: { model: { id: { footer: 'max' } } },
          }}
          aggregatedRows="all"
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '5' /* Agg */]);
    });
  });

  describe('prop: aggregationFunctions', () => {
    it('should ignore aggregation rules not present in props.aggregationFunctions', () => {
      render(
        <Test
          initialState={{ aggregation: { model: { id: { footer: 'max' } } } }}
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
          initialState={{ aggregation: { model: { id: { footer: 'max' } } } }}
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
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);

      const customMax: GridAggregationFunction = {
        ...GRID_AGGREGATION_FUNCTIONS.max,
        apply: (params) => `Agg: ${GRID_AGGREGATION_FUNCTIONS.max.apply(params) as number}`,
      };
      setProps({ aggregationFunctions: { min: GRID_AGGREGATION_FUNCTIONS.min, max: customMax } });
      // 'max' is in props.aggregationFunctions but has changed
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', 'Agg: 5' /* Agg */]);
    });
  });

  describe('colDef: aggregable', () => {
    it('should not aggregate if colDef.aggregable = false', () => {
      render(
        <Test
          initialState={{ aggregation: { model: { id: { footer: 'max' } } } }}
          columns={[
            {
              field: 'id',
              type: 'number',
              aggregable: false,
            },
          ]}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
    });

    it('should not render column menu select if colDef.aggregable = false', () => {
      render(
        <Test
          initialState={{ aggregation: { model: { id: { footer: 'max' } } } }}
          columns={[
            {
              field: 'id',
              type: 'number',
              aggregable: false,
            },
          ]}
        />,
      );

      apiRef.current.showColumnMenu('id');
      clock.runToLast();

      expect(screen.queryAllByLabelText('Aggregation')).to.have.length(0);
    });
  });

  describe('colDef: availableAggregationFunctions', () => {
    it('should ignore aggregation rules not present in props.aggregationFunctions', () => {
      render(
        <Test
          initialState={{ aggregation: { model: { id: { footer: 'max' } } } }}
          columns={[
            {
              field: 'id',
              type: 'number',
              availableAggregationFunctions: ['min'],
            },
          ]}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
    });

    it('should react to colDef.availableAggregationFunctions update', () => {
      render(
        <Test
          initialState={{ aggregation: { model: { id: { footer: 'max' } } } }}
          columns={[
            {
              field: 'id',
              type: 'number',
              availableAggregationFunctions: ['min'],
            },
          ]}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);

      apiRef.current.updateColumns([
        { field: 'id', availableAggregationFunctions: ['min', 'max'] },
      ]);
      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
    });
  });

  describe('colDef: valueFormatter', () => {
    it('should use the column valueFormatter for aggregation function without custom valueFormatter', () => {
      const customAggregationFunction: GridAggregationFunction = {
        apply: () => 'Agg value',
      };

      render(
        <Test
          initialState={{ aggregation: { model: { id: { footer: 'custom' } } } }}
          aggregationFunctions={{ custom: customAggregationFunction }}
          columns={[
            {
              field: 'id',
              type: 'number',
              valueFormatter: (params) => `- ${params.value}`,
            },
          ]}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal([
        '- 0',
        '- 1',
        '- 2',
        '- 3',
        '- 4',
        '- 5',
        '- Agg value' /* Agg */,
      ]);
    });

    it('should use the aggregation function valueFormatter if defined', () => {
      const customAggregationFunction: GridAggregationFunction = {
        apply: () => 'Agg value',
        valueFormatter: (params) => `+ ${params.value}`,
      };

      render(
        <Test
          initialState={{ aggregation: { model: { id: { footer: 'custom' } } } }}
          aggregationFunctions={{ custom: customAggregationFunction }}
          columns={[
            {
              field: 'id',
              type: 'number',
              valueFormatter: (params) => `- ${params.value}`,
            },
          ]}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal([
        '- 0',
        '- 1',
        '- 2',
        '- 3',
        '- 4',
        '- 5',
        '+ Agg value' /* Agg */,
      ]);
    });
  });

  describe('colDef: renderCell', () => {
    it('should use the column renderCell', () => {
      const customAggregationFunction: GridAggregationFunction = {
        apply: () => 'Agg value',
      };

      render(
        <Test
          initialState={{ aggregation: { model: { id: { footer: 'custom' } } } }}
          aggregationFunctions={{ custom: customAggregationFunction }}
          columns={[
            {
              field: 'id',
              type: 'number',
              renderCell: (params) => `- ${params.value}`,
            },
          ]}
        />,
      );
      expect(getColumnValues(0)).to.deep.equal([
        '- 0',
        '- 1',
        '- 2',
        '- 3',
        '- 4',
        '- 5',
        '- Agg value' /* Agg */,
      ]);
    });

    it('should pass aggregation meta with `hasCellUnit: true` if the aggregation function have no hasCellUnit property ', () => {
      const renderCell: SinonSpy<[GridRenderCellParams]> = spy((params) => `- ${params.value}`);

      const customAggregationFunction: GridAggregationFunction = {
        apply: () => 'Agg value',
      };

      render(
        <Test
          initialState={{ aggregation: { model: { id: { footer: 'custom' } } } }}
          aggregationFunctions={{ custom: customAggregationFunction }}
          columns={[
            {
              field: 'id',
              type: 'number',
              renderCell,
            },
          ]}
        />,
      );

      const callForAggCell = renderCell
        .getCalls()
        .find((call) => call.firstArg.rowNode.position === 'footer');
      expect(callForAggCell!.firstArg.aggregation.hasCellUnit).to.equal(true);
    });

    it('should pass aggregation meta with `hasCellUnit: false` if the aggregation function have `hasCellUnit: false` ', () => {
      const renderCell: SinonSpy<[GridRenderCellParams]> = spy((params) => `- ${params.value}`);

      const customAggregationFunction: GridAggregationFunction = {
        apply: () => 'Agg value',
        hasCellUnit: false,
      };

      render(
        <Test
          initialState={{ aggregation: { model: { id: { footer: 'custom' } } } }}
          aggregationFunctions={{ custom: customAggregationFunction }}
          columns={[
            {
              field: 'id',
              type: 'number',
              renderCell,
            },
          ]}
        />,
      );

      const callForAggCell = renderCell
        .getCalls()
        .find((call) => call.firstArg.rowNode.position === 'footer');
      expect(callForAggCell!.firstArg.aggregation.hasCellUnit).to.equal(false);
    });
  });

  describe('filter', () => {
    it('should not filter-out the aggregated cells', () => {
      render(
        <Test
          initialState={{
            aggregation: { model: { id: { footer: 'sum' } } },
            filter: {
              filterModel: {
                items: [{ columnField: 'id', operatorValue: '!=', value: 15 }],
              },
            },
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '15' /* Agg */]);
    });
  });

  describe('sorting', () => {
    it('should always render top level footer below the other rows', () => {
      render(
        <Test
          initialState={{
            aggregation: { model: { id: { footer: 'sum' } } },
            sorting: {
              sortModel: [{ field: 'id', sort: 'desc' }],
            },
          }}
        />,
      );

      expect(getColumnValues(0)).to.deep.equal(['5', '4', '3', '2', '1', '0', '15' /* Agg */]);
    });

    it('should always render group footers below the other rows', () => {
      render(
        <Test
          initialState={{
            rowGrouping: { model: ['category1'] },
            aggregation: { model: { id: { footer: 'max' } } },
            sorting: {
              sortModel: [{ field: 'id', sort: 'desc' }],
            },
          }}
          defaultGroupingExpansionDepth={-1}
          isGroupAggregated={(group) => group != null}
        />,
      );
      expect(getColumnValues(1)).to.deep.equal([
        '',
        '4',
        '3',
        '2',
        '1',
        '0',
        '4' /* Agg "Cat A" */,
        '',
        '5',
        '5' /* Agg "Cat B" */,
      ]);
    });
  });
});
