import * as React from 'react';
import { spy } from 'sinon';
import { RefObject } from '@mui/x-internals/types';
import { act, createRenderer, screen } from '@mui/internal-test-utils';
import {
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  DataGridPremium,
  DataGridPremiumProps,
  useGridApiRef,
  useGridChartsIntegrationContext,
  GridChartsPanel,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  GridInitialState,
  GridApiPremium,
  GridValidRowModel,
  GridChartsIcon,
} from '@mui/x-data-grid-premium';
import { GridChartsIntegrationContextValue } from '../models/gridChartsIntegration';

const rows: GridValidRowModel[] = [
  { id: 0, category1: 'CatA', category2: 'Cat1', nonChartable: '-', amount: 100 },
  { id: 1, category1: 'CatA', category2: 'Cat2', nonChartable: '-', amount: 200 },
  { id: 2, category1: 'CatA', category2: 'Cat2', nonChartable: '-', amount: 300 },
  { id: 3, category1: 'CatB', category2: 'Cat2', nonChartable: '-', amount: 400 },
  { id: 4, category1: 'CatB', category2: 'Cat1', nonChartable: '-', amount: 500 },
];

const baselineProps: DataGridPremiumProps = {
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
    {
      field: 'nonChartable',
      chartable: false,
    },
    {
      field: 'amount',
      type: 'number',
    },
  ],
};

const baseInitialState: GridInitialState = {
  chartsIntegration: {
    charts: {
      test: {
        categories: ['category1'],
        series: ['amount'],
      },
    },
  },
};

const configurationOptions = {
  type1: {
    label: 'Type 1 ',
    icon: GridChartsIcon,
    customization: [
      {
        id: 'mainSection',
        label: 'Main Section',
        controls: {
          isTrue: { label: 'Is True', type: 'boolean', default: false },
          text: { label: 'Text', type: 'string', default: 'Hello' },
        },
      },
    ],
  },
  type2: {
    label: 'Type 2',
    icon: GridChartsIcon,
    customization: [
      {
        id: 'mainSection',
        label: 'Main Section',
        controls: {
          isTrue: { label: 'Is True', type: 'boolean', default: true },
          text: { label: 'Text', type: 'string', default: 'World' },
        },
      },
    ],
  },
};

describe('<DataGridPremium /> - Charts Integration', () => {
  const { render } = createRenderer();
  const renderSpy = spy();

  let apiRef: RefObject<GridApiPremium | null>;
  let integrationContext: GridChartsIntegrationContextValue | null = null;

  function TestConsumer(props: any) {
    integrationContext = useGridChartsIntegrationContext();
    props.onRender(integrationContext as any);
    return null;
  }

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <GridChartsIntegrationContextProvider>
        <div style={{ width: 700, height: 500 }}>
          <DataGridPremium
            {...baselineProps}
            apiRef={apiRef}
            chartsIntegration
            showToolbar
            slots={{
              chartsPanel: GridChartsPanel,
            }}
            slotProps={{
              chartsPanel: {
                schema: configurationOptions,
              },
            }}
            {...props}
          />
        </div>
        <GridChartsRendererProxy id="test" onRender={renderSpy} renderer={TestConsumer} />
        <GridChartsRendererProxy id="test2" onRender={renderSpy} renderer={TestConsumer} />
      </GridChartsIntegrationContextProvider>
    );
  }

  beforeEach(() => {
    renderSpy.resetHistory();
  });

  describe('GridChartsIntegrationContextProvider', () => {
    it('should generate an empty context for the new consumer key', () => {
      expect(integrationContext?.chartStateLookup).to.equal(undefined);
      render(<Test />);
      expect(integrationContext!.chartStateLookup.test).to.not.equal(undefined);
    });

    it('should partially update the context', () => {
      render(<Test />);
      expect(integrationContext!.chartStateLookup.test.categories).to.deep.equal([]);
      expect(integrationContext!.chartStateLookup.test.label).to.equal(undefined);
      act(() => {
        integrationContext!.setChartState('test', { label: 'Test' });
      });
      expect(integrationContext!.chartStateLookup.test.categories).to.deep.equal([]);
      expect(integrationContext!.chartStateLookup.test.label).to.equal('Test');
    });
  });

  describe('Context updates via grid', () => {
    describe('initialState', () => {
      it('should set the context on init', () => {
        render(<Test initialState={baseInitialState} />);

        expect(integrationContext!.chartStateLookup.test.categories[0].id).to.equal('category1');
      });

      it('should not set the context on init if there are no series', () => {
        render(
          <Test
            initialState={{
              chartsIntegration: {
                charts: {
                  test: {
                    categories: ['category1'],
                  },
                },
              },
            }}
          />,
        );

        expect(integrationContext!.chartStateLookup.test.categories).to.deep.equal([]);
      });

      it('should not add to the context hidden items', () => {
        render(
          <Test
            initialState={{
              chartsIntegration: {
                charts: {
                  test: {
                    categories: ['category1' as any, { field: 'category2', hidden: true }],
                    series: ['amount'],
                  },
                },
              },
            }}
          />,
        );

        expect(integrationContext!.chartStateLookup.test.categories.length).to.equal(1);
        expect(integrationContext!.chartStateLookup.test.categories[0].id).to.equal('category1');
      });

      it('should not add to the context non chartable items', () => {
        render(
          <Test
            initialState={{
              chartsIntegration: {
                charts: {
                  test: {
                    categories: ['nonChartable'],
                    series: ['amount'],
                  },
                },
              },
            }}
          />,
        );

        expect(integrationContext!.chartStateLookup.test.categories.length).to.equal(0);
      });

      it('should pick the first available chart if there is no active chart', () => {
        render(<Test />);
        expect(apiRef!.current?.state.chartsIntegration.activeChartId).to.equal('test');
      });

      it('should keep allow setting the active chart id', () => {
        render(<Test initialState={{ chartsIntegration: { activeChartId: 'test2' } }} />);
        expect(apiRef!.current?.state.chartsIntegration.activeChartId).to.equal('test2');
      });
    });

    describe('syncing with grid model', () => {
      it('should update the context when filter model changes', () => {
        render(<Test initialState={baseInitialState} />);
        expect(integrationContext!.chartStateLookup.test.categories[0].data.length).to.equal(
          rows.length,
        );

        act(() => {
          apiRef!.current?.setFilterModel({
            items: [
              {
                field: 'amount',
                value: rows[0].amount,
                operator: '=',
              },
            ],
          });
        });

        expect(integrationContext!.chartStateLookup.test.categories[0].data.length).to.equal(1);
      });

      it('should update the context when sort model changes', () => {
        render(<Test initialState={baseInitialState} />);
        expect(integrationContext!.chartStateLookup.test.series[0].data[0]).to.equal(
          rows[0].amount,
        );

        act(() => {
          apiRef!.current?.sortColumn('amount', 'desc');
        });

        expect(integrationContext!.chartStateLookup.test.series[0].data[0]).to.equal(
          rows[rows.length - 1].amount,
        );
      });

      it('should switch to the grouped column if the active category becomes grouped', () => {
        render(<Test initialState={baseInitialState} />);
        expect(integrationContext!.chartStateLookup.test.categories[0].id).to.equal('category1');

        act(() => {
          apiRef!.current?.setRowGroupingModel(['category1']);
        });

        expect(integrationContext!.chartStateLookup.test.categories[0].id).to.equal(
          GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
        );
      });

      it('should remove series if they become pivoting values', () => {
        render(<Test initialState={baseInitialState} />);
        expect(integrationContext!.chartStateLookup.test.series[0].id).to.equal('amount');

        act(() => {
          apiRef!.current?.setPivotActive(true);
          apiRef!.current?.setPivotModel({
            rows: [{ field: 'category1' }],
            columns: [{ field: 'category2' }],
            values: [{ field: 'amount', aggFunc: 'sum' }],
          });
        });

        expect(integrationContext!.chartStateLookup.test.series.length).to.equal(0);
      });
    });

    describe('API', () => {
      it('should allow updating categories and series through the API', () => {
        render(<Test />);

        expect(integrationContext!.chartStateLookup.test.categories.length).to.equal(0);
        expect(integrationContext!.chartStateLookup.test.series.length).to.equal(0);

        act(() => {
          apiRef!.current?.updateCategories('test', [{ field: 'category1' }]);
        });

        // categories and series are still empty. without both present, category are not added to the context
        expect(integrationContext!.chartStateLookup.test.categories.length).to.equal(0);
        expect(integrationContext!.chartStateLookup.test.series.length).to.equal(0);

        act(() => {
          apiRef!.current?.updateSeries('test', [{ field: 'amount' }]);
        });

        expect(integrationContext!.chartStateLookup.test.categories[0].id).to.equal('category1');
        expect(integrationContext!.chartStateLookup.test.series[0].id).to.equal('amount');
      });
    });

    it('should not allow setting non chartable items as categories or series', () => {
      render(<Test />);

      expect(integrationContext!.chartStateLookup.test.categories.length).to.equal(0);
      expect(integrationContext!.chartStateLookup.test.series.length).to.equal(0);

      act(() => {
        apiRef!.current?.updateCategories('test', [{ field: 'nonChartable' }]);
      });

      expect(integrationContext!.chartStateLookup.test.categories.length).to.equal(0);

      act(() => {
        apiRef!.current?.updateSeries('test', [{ field: 'nonChartable' }]);
      });

      expect(integrationContext!.chartStateLookup.test.series.length).to.equal(0);
    });

    it('should allow setting string columns as series', () => {
      render(<Test />);

      expect(integrationContext!.chartStateLookup.test.categories.length).to.equal(0);
      expect(integrationContext!.chartStateLookup.test.series.length).to.equal(0);

      act(() => {
        apiRef!.current?.updateSeries('test', [{ field: 'category1' }]);
      });

      expect(integrationContext!.chartStateLookup.test.series.length).to.equal(0);
    });
  });

  describe('sync control', () => {
    it('should allow chart sync control', () => {
      // both charts are the same
      render(
        <Test
          initialState={{
            chartsIntegration: {
              charts: {
                test: {
                  categories: ['category1'],
                  series: ['amount'],
                },
                test2: {
                  categories: ['category1'],
                  series: ['amount'],
                },
              },
            },
          }}
        />,
      );

      // sync is true by default
      expect(integrationContext!.chartStateLookup.test.synced).to.equal(true);
      expect(integrationContext!.chartStateLookup.test2.synced).to.equal(true);

      // data is loaded for both charts
      expect(integrationContext!.chartStateLookup.test.categories[0].data.length).to.equal(
        rows.length,
      );
      expect(integrationContext!.chartStateLookup.test2.categories[0].data.length).to.equal(
        rows.length,
      );

      // remove sync for test2
      act(() => {
        apiRef!.current?.setChartSynchronizationState('test2', false);
      });

      // data is still the same
      expect(integrationContext!.chartStateLookup.test2.categories[0].data.length).to.equal(
        rows.length,
      );

      // remove all rows
      act(() => {
        apiRef!.current?.setRows([]);
      });

      // first chart is updated
      expect(integrationContext!.chartStateLookup.test.categories[0].data.length).to.equal(0);
      // second chart is not updated
      expect(integrationContext!.chartStateLookup.test2.categories[0].data.length).to.equal(
        rows.length,
      );

      // enable sync for test2
      act(() => {
        apiRef!.current?.setChartSynchronizationState('test2', true);
      });

      // data is updated
      expect(integrationContext!.chartStateLookup.test2.categories[0].data.length).to.equal(0);

      // update rows again
      act(() => {
        apiRef!.current?.setRows(rows);
      });

      // both charts are updated
      expect(integrationContext!.chartStateLookup.test.categories[0].data.length).to.equal(
        rows.length,
      );
      expect(integrationContext!.chartStateLookup.test2.categories[0].data.length).to.equal(
        rows.length,
      );
    });
  });

  describe('GridChartsRendererProxy', () => {
    it('should intercept rendering with custom renderer', () => {
      render(<Test initialState={baseInitialState} />);

      expect(renderSpy.called).to.equal(true);
      expect(renderSpy.lastCall.firstArg.chartStateLookup.test.categories[0].id).to.equal(
        'category1',
      );
    });

    it('should trigger another render when the context is updated', () => {
      render(<Test initialState={baseInitialState} />);

      renderSpy.resetHistory();
      expect(renderSpy.callCount).to.equal(0);

      act(() => {
        apiRef!.current?.sortColumn('amount', 'desc');
      });

      expect(renderSpy.callCount).to.be.greaterThan(0);
    });
  });

  describe('GridChartsPanel', () => {
    it('should render all available chart types', async () => {
      const { user } = render(<Test initialState={baseInitialState} />);

      const chartsToolbarButton = screen.getByTestId('ChartsIcon');
      await user.click(chartsToolbarButton);

      const chartTypeButtons = screen.getAllByRole('tabpanel')[0].querySelectorAll('button');
      expect(chartTypeButtons.length).to.equal(Object.keys(configurationOptions).length);
    });

    it('should allow chart type selection', async () => {
      const { user } = render(
        <Test
          initialState={{
            ...baseInitialState,
            chartsIntegration: {
              ...baseInitialState.chartsIntegration,
              configurationPanel: {
                open: true,
              },
            },
          }}
        />,
      );

      const chartTypeButtons = screen.getAllByRole('tabpanel')[0].querySelectorAll('button');
      await user.click(chartTypeButtons[1]);

      expect(integrationContext!.chartStateLookup.test.type).to.equal('type2');
    });

    it('should allow categories and series selection', async () => {
      const { user } = render(
        <Test
          initialState={{
            ...baseInitialState,
            chartsIntegration: {
              ...baseInitialState.chartsIntegration,
              configurationPanel: {
                open: true,
              },
              charts: {
                ...baseInitialState.chartsIntegration?.charts,
                test: {
                  ...baseInitialState.chartsIntegration?.charts?.test,
                  chartType: 'type1',
                },
              },
            },
          }}
        />,
      );

      const fieldsTab = screen.getAllByRole('tab')[1];
      await user.click(fieldsTab);

      const availableFields = screen
        .getAllByRole('tabpanel')[0]
        .querySelector('[data-drag-over="false"]')! // available fields section
        .querySelectorAll('[draggable="true"]'); // the fields

      // open the menu
      const field1Menu = availableFields[0].querySelector('[data-testid="AddIcon"]')!;
      const field2Menu = availableFields[1].querySelector('[data-testid="AddIcon"]')!;
      await user.click(field1Menu);

      expect(integrationContext!.chartStateLookup.test.series.length).to.equal(1);

      // click on the second menu item (Add to series)
      await user.click(screen.getAllByRole('menuitem')[1]);

      expect(integrationContext!.chartStateLookup.test.series.length).to.equal(2);

      // open the menu for the second field
      await user.click(field2Menu);

      expect(integrationContext!.chartStateLookup.test.categories.length).to.equal(1);

      // click on the first menu item (Add to categories)
      await user.click(screen.getAllByRole('menuitem')[0]);

      expect(integrationContext!.chartStateLookup.test.categories.length).to.equal(2);

      // remaining column is not chartable so there should not be any other field menus
      const remainingFields = screen
        .getAllByRole('tabpanel')[0]
        .querySelector('[data-drag-over="false"]')!
        .querySelectorAll('[draggable="true"]');

      expect(remainingFields.length).to.equal(0);

      // hide one of the series
      const draggableFields = screen
        .getAllByRole('tabpanel')[0]
        .querySelectorAll('[draggable="true"]');
      const lastField = draggableFields[draggableFields.length - 1];
      const hideCheckbox = lastField.querySelector('input[type="checkbox"]')!;

      await user.click(hideCheckbox);

      // series are back to 1
      expect(integrationContext!.chartStateLookup.test.series.length).to.equal(1);
    });

    it('should allow configuration change', async () => {
      const { user } = render(
        <Test
          initialState={{
            ...baseInitialState,
            chartsIntegration: {
              ...baseInitialState.chartsIntegration,
              configurationPanel: {
                open: true,
              },
              charts: {
                ...baseInitialState.chartsIntegration?.charts,
                test: {
                  ...baseInitialState.chartsIntegration?.charts?.test,
                  chartType: 'type1',
                },
              },
            },
          }}
        />,
      );

      const configurationTab = screen.getAllByRole('tab')[2];
      await user.click(configurationTab);

      const configurationInputs = screen.getAllByRole('tabpanel')[0].querySelectorAll('input');
      const isTrueInput = configurationInputs[0];
      const textInput = configurationInputs[1];

      await user.click(isTrueInput);
      await user.clear(textInput);
      await user.type(textInput, 'Updated');

      expect(integrationContext!.chartStateLookup.test.configuration.isTrue).to.equal(true);
      expect(integrationContext!.chartStateLookup.test.configuration.text).to.equal('Updated');
    });
  });
});
