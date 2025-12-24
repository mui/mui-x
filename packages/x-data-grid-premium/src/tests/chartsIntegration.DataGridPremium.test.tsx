import { vi } from 'vitest';
import { RefObject, GridChartsConfigurationOptions } from '@mui/x-internals/types';
import { act, createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import {
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  DataGridPremium,
  DataGridPremiumProps,
  useGridApiRef,
  useGridChartsIntegrationContext,
  GridChartsPanel,
  GridInitialState,
  GridApiPremium,
  GridValidRowModel,
  GridChartsIcon,
  GridSidebarValue,
} from '@mui/x-data-grid-premium';
import { COLUMN_GROUP_ID_SEPARATOR } from '../constants/columnGroups';
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
        dimensions: ['category1'],
        values: ['amount'],
      },
    },
  },
};

const configurationOptions: GridChartsConfigurationOptions = {
  type1: {
    label: 'Type 1 ',
    icon: GridChartsIcon,
    dimensionsLabel: 'Categories',
    valuesLabel: 'Series',
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
    dimensionsLabel: 'Categories',
    valuesLabel: 'Series',
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
  type3: {
    label: 'Type 3',
    icon: GridChartsIcon,
    dimensionsLabel: 'Categories',
    valuesLabel: 'Series',
    maxDimensions: 1,
    maxValues: 1,
    customization: [
      {
        id: 'mainSection',
        label: 'Main Section',
        controls: {
          isTrue: { label: 'Is True', type: 'boolean', default: true },
        },
      },
    ],
  },
};

describe('<DataGridPremium /> - Charts Integration', () => {
  const { render } = createRenderer();
  const renderSpy = vi.fn();

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
            experimentalFeatures={{
              charts: true,
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
    it('should generate an empty context for the new consumer key', async () => {
      expect(integrationContext?.chartStateLookup).to.equal(undefined);
      render(<Test />);
      await waitFor(() => {
        expect(integrationContext!.chartStateLookup.test).to.not.equal(undefined);
      });
    });

    it('should partially update the context', () => {
      render(<Test />);
      expect(integrationContext!.chartStateLookup.test.dimensions).to.deep.equal([]);
      expect(integrationContext!.chartStateLookup.test.label).to.equal(undefined);
      act(() => {
        integrationContext!.setChartState('test', { label: 'Test' });
      });
      expect(integrationContext!.chartStateLookup.test.dimensions).to.deep.equal([]);
      expect(integrationContext!.chartStateLookup.test.label).to.equal('Test');
    });
  });

  describe('Context updates via grid', () => {
    describe('initialState', () => {
      it('should set the context on init', async () => {
        render(<Test initialState={baseInitialState} />);
        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.dimensions[0].id).to.equal('category1');
        });
      });

      it('should not set the context on init if there are no value datasets', () => {
        render(
          <Test
            initialState={{
              chartsIntegration: {
                charts: {
                  test: {
                    dimensions: ['category1'],
                  },
                },
              },
            }}
          />,
        );

        expect(integrationContext!.chartStateLookup.test.dimensions).to.deep.equal([]);
      });

      it('should not add to the context hidden items', async () => {
        render(
          <Test
            initialState={{
              chartsIntegration: {
                charts: {
                  test: {
                    dimensions: ['category1' as any, { field: 'category2', hidden: true }],
                    values: ['amount'],
                  },
                },
              },
            }}
          />,
        );

        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.dimensions.length).to.equal(1);
        });
        expect(integrationContext!.chartStateLookup.test.dimensions[0].id).to.equal('category1');
      });

      it('should not add to the context non chartable items', () => {
        render(
          <Test
            initialState={{
              chartsIntegration: {
                charts: {
                  test: {
                    dimensions: ['nonChartable'],
                    values: ['amount'],
                  },
                },
              },
            }}
          />,
        );

        expect(integrationContext!.chartStateLookup.test.dimensions.length).to.equal(0);
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
      it('should update the context when filter model changes', async () => {
        render(<Test initialState={baseInitialState} />);
        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.dimensions[0].data.length).to.equal(
            rows.length,
          );
        });

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

        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.dimensions[0].data.length).to.equal(1);
        });
      });

      it('should update the context when sort model changes', async () => {
        render(<Test initialState={baseInitialState} />);
        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.values[0].data[0]).to.equal(
            rows[0].amount,
          );
        });

        act(() => {
          apiRef!.current?.sortColumn('amount', 'desc');
        });

        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.values[0].data[0]).to.equal(
            rows[rows.length - 1].amount,
          );
        });
      });

      it('should read to the grouped value if the active dimension becomes grouped', async () => {
        render(<Test initialState={baseInitialState} />);
        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.dimensions[0].id).to.equal('category1');
        });

        act(() => {
          apiRef!.current?.setRowGroupingModel(['category1']);
        });

        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.dimensions[0].data[0]).to.equal(
            rows[0].category1,
          );
        });
      });

      it('should remove values datasets if they become pivoting values', async () => {
        render(<Test initialState={baseInitialState} />);
        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.values[0].id).to.equal('amount');
        });

        act(() => {
          apiRef!.current?.setPivotActive(true);
          apiRef!.current?.setPivotModel({
            rows: [{ field: 'category1' }],
            columns: [{ field: 'category2' }],
            values: [{ field: 'amount', aggFunc: 'sum' }],
          });
        });

        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.values.length).to.equal(0);
        });
      });

      it('should remove values from chartable columns when pivoting has columns', async () => {
        const initialState = {
          pivoting: {
            enabled: true,
            model: {
              rows: [{ field: 'category1' }],
              columns: [{ field: 'category2' }],
              values: [{ field: 'amount', aggFunc: 'sum' }],
            },
          },
        };
        render(<Test initialState={initialState} />);

        act(() => {
          apiRef!.current?.updateChartDimensionsData('test', [{ field: 'category1' }]);
        });

        act(() => {
          apiRef!.current?.updateChartValuesData('test', [{ field: 'amount' }]);
        });

        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.values.length).to.equal(0);
        });

        // dynamically created values columns are chartable
        act(() => {
          apiRef!.current?.updateChartValuesData('test', [
            { field: `${rows[0].category2}${COLUMN_GROUP_ID_SEPARATOR}amount` },
          ]);
        });

        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.values.length).to.equal(1);
        });

        // remove column from pivoting
        // this will make the values reappear as regular column (not dynamically created)
        // and the charts hook will allow that column to be used as values
        act(() => {
          apiRef!.current?.setPivotModel({
            rows: [{ field: 'category1' }],
            columns: [],
            values: [{ field: 'amount', aggFunc: 'sum' }],
          });
        });

        // this clears values as well, because the column does not exist anymore
        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.values.length).to.equal(0);
        });

        act(() => {
          apiRef!.current?.updateChartValuesData('test', [{ field: 'amount' }]);
        });

        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.values.length).to.equal(1);
        });
      });
    });

    describe('API', () => {
      it('should allow updating dimensions and values through the API', async () => {
        render(<Test />);

        expect(integrationContext!.chartStateLookup.test.dimensions.length).to.equal(0);
        expect(integrationContext!.chartStateLookup.test.values.length).to.equal(0);

        act(() => {
          apiRef!.current?.updateChartDimensionsData('test', [{ field: 'category1' }]);
        });

        // dimensions and values are still empty. without both present, dimension are not added to the context
        expect(integrationContext!.chartStateLookup.test.dimensions.length).to.equal(0);
        expect(integrationContext!.chartStateLookup.test.values.length).to.equal(0);

        act(() => {
          apiRef!.current?.updateChartValuesData('test', [{ field: 'amount' }]);
        });

        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.dimensions[0].id).to.equal('category1');
        });
        expect(integrationContext!.chartStateLookup.test.values[0].id).to.equal('amount');
      });
    });

    it('should not allow setting non chartable items as dimensions or values', () => {
      render(<Test />);

      expect(integrationContext!.chartStateLookup.test.dimensions.length).to.equal(0);
      expect(integrationContext!.chartStateLookup.test.values.length).to.equal(0);

      act(() => {
        apiRef!.current?.updateChartDimensionsData('test', [{ field: 'nonChartable' }]);
      });

      expect(integrationContext!.chartStateLookup.test.dimensions.length).to.equal(0);

      act(() => {
        apiRef!.current?.updateChartValuesData('test', [{ field: 'nonChartable' }]);
      });

      expect(integrationContext!.chartStateLookup.test.values.length).to.equal(0);
    });

    it('should not allow setting string columns as values without row grouping', async () => {
      render(<Test />);

      expect(integrationContext!.chartStateLookup.test.dimensions.length).to.equal(0);
      expect(integrationContext!.chartStateLookup.test.values.length).to.equal(0);

      act(() => {
        apiRef!.current?.updateChartDimensionsData('test', [{ field: 'category1' }]);
        apiRef!.current?.updateChartValuesData('test', [
          { field: 'amount' },
          { field: 'category2' },
        ]);
      });

      await waitFor(() => {
        expect(integrationContext!.chartStateLookup.test.values.length).to.equal(1);
      });
    });

    it('should allow setting string columns as values with row grouping', async () => {
      render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} />);

      expect(integrationContext!.chartStateLookup.test.dimensions.length).to.equal(0);
      expect(integrationContext!.chartStateLookup.test.values.length).to.equal(0);

      act(() => {
        apiRef!.current?.updateChartDimensionsData('test', [{ field: 'category1' }]);
        apiRef!.current?.updateChartValuesData('test', [
          { field: 'amount' },
          { field: 'category2' },
        ]);
      });

      await waitFor(() => {
        expect(integrationContext!.chartStateLookup.test.values.length).to.equal(2);
      });
    });

    it('should not allow adding more dimensions or values than the max limit', async () => {
      render(
        <Test
          initialState={{
            chartsIntegration: {
              charts: {
                test: {
                  chartType: 'type3',
                },
              },
            },
          }}
        />,
      );

      expect(integrationContext!.chartStateLookup.test.dimensions.length).to.equal(0);
      expect(integrationContext!.chartStateLookup.test.values.length).to.equal(0);

      act(() => {
        apiRef!.current?.updateChartDimensionsData('test', [
          { field: 'category1' },
          { field: 'category2' },
        ]);
      });

      act(() => {
        apiRef!.current?.updateChartValuesData('test', [
          { field: 'amount' },
          { field: 'category2' },
        ]);
      });

      await waitFor(() => {
        expect(integrationContext!.chartStateLookup.test.dimensions.length).to.equal(1);
      });
      expect(integrationContext!.chartStateLookup.test.values.length).to.equal(1);
    });

    describe('Other model updates', () => {
      it('should update grouping model and column visibility model if grouped dimension is replaced with another field', async () => {
        const initialState = {
          ...baseInitialState,
          rowGrouping: {
            model: ['category1'],
          },
          columnVisibility: {
            category1: false,
          },
        };
        render(<Test initialState={initialState} />);

        act(() => {
          apiRef!.current?.updateChartDimensionsData('test', [{ field: 'category2' }]);
        });

        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.dimensions[0].id).to.equal('category2');
        });

        expect(apiRef!.current?.state.rowGrouping.model).to.deep.equal(['category2']);
        expect(apiRef!.current?.state.columns.columnVisibilityModel.category1).to.equal(true);
        expect(apiRef!.current?.state.columns.columnVisibilityModel.category2).to.equal(false);
      });

      it('should update pivoting rows if chart dimension is replaced with active pivoting', async () => {
        const initialState = {
          ...baseInitialState,
          pivoting: {
            enabled: true,
            model: {
              rows: [{ field: 'category1' }],
              columns: [],
              values: [{ field: 'amount', aggFunc: 'sum' }],
            },
          },
        };
        render(<Test initialState={initialState} />);

        act(() => {
          apiRef!.current?.updateChartDimensionsData('test', [{ field: 'category2' }]);
        });

        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.dimensions[0].id).to.equal('category2');
        });

        expect(apiRef!.current?.state.pivoting.model).to.deep.equal({
          rows: [{ field: 'category2', hidden: false }],
          columns: [],
          values: [{ field: 'amount', aggFunc: 'sum' }],
        });
      });

      it('should aggregate newly added values if row grouping is enabled', async () => {
        const initialState = {
          ...baseInitialState,
          rowGrouping: {
            model: ['category1'],
          },
          columnVisibility: {
            category1: false,
          },
        };
        render(<Test initialState={initialState} />);

        act(() => {
          apiRef!.current?.updateChartValuesData('test', (prev) => [
            ...prev,
            { field: 'category2' },
          ]);
        });

        await waitFor(() => {
          expect(integrationContext!.chartStateLookup.test.values[1].id).to.equal('category2');
        });

        expect(apiRef!.current?.state.aggregation.model.category2).to.equal('size');
      });
    });
  });

  describe('sync control', () => {
    it('should allow chart sync control', async () => {
      // both charts are the same
      render(
        <Test
          initialState={{
            chartsIntegration: {
              charts: {
                test: {
                  dimensions: ['category1'],
                  values: ['amount'],
                },
                test2: {
                  dimensions: ['category1'],
                  values: ['amount'],
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
      await waitFor(() => {
        expect(integrationContext!.chartStateLookup.test.dimensions[0].data.length).to.equal(
          rows.length,
        );
      });

      expect(integrationContext!.chartStateLookup.test2.dimensions[0].data.length).to.equal(
        rows.length,
      );

      // remove sync for test2
      act(() => {
        apiRef!.current?.setChartSynchronizationState('test2', false);
      });

      // data is still the same
      expect(integrationContext!.chartStateLookup.test2.dimensions[0].data.length).to.equal(
        rows.length,
      );

      // remove all rows
      act(() => {
        apiRef!.current?.setRows([]);
      });

      // first chart is updated
      await waitFor(() => {
        expect(integrationContext!.chartStateLookup.test.dimensions[0].data.length).to.equal(0);
      });
      // second chart is not updated
      expect(integrationContext!.chartStateLookup.test2.dimensions[0].data.length).to.equal(
        rows.length,
      );

      // enable sync for test2
      act(() => {
        apiRef!.current?.setChartSynchronizationState('test2', true);
      });

      // data is updated
      await waitFor(() => {
        expect(integrationContext!.chartStateLookup.test2.dimensions[0].data.length).to.equal(0);
      });

      // update rows again
      act(() => {
        apiRef!.current?.setRows(rows);
      });

      // both charts are updated
      await waitFor(() => {
        expect(integrationContext!.chartStateLookup.test.dimensions[0].data.length).to.equal(
          rows.length,
        );
      });
      expect(integrationContext!.chartStateLookup.test2.dimensions[0].data.length).to.equal(
        rows.length,
      );
    });
  });

  describe('GridChartsRendererProxy', () => {
    it('should intercept rendering with custom renderer', async () => {
      render(<Test initialState={baseInitialState} />);

      expect(renderSpy.mock.calls.length > 0).to.equal(true);
      await waitFor(() => {
        expect(renderSpy.mock.lastCall![0].chartStateLookup.test.dimensions[0].id).to.equal(
          'category1',
        );
      });
    });

    it('should trigger another render when the context is updated', async () => {
      render(<Test initialState={baseInitialState} />);

      renderSpy.resetHistory();
      expect(renderSpy.mock.calls.length).to.equal(0);

      act(() => {
        apiRef!.current?.sortColumn('amount', 'desc');
      });

      await waitFor(() => {
        expect(renderSpy.mock.calls.length).to.be.greaterThan(0);
      });
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
            sidebar: {
              open: true,
              value: GridSidebarValue.Charts,
            },
          }}
        />,
      );

      const chartTypeButtons = screen.getAllByRole('tabpanel')[0].querySelectorAll('button');
      await user.click(chartTypeButtons[1]);

      expect(integrationContext!.chartStateLookup.test.type).to.equal('type2');
    });

    it('should allow dimensions and values selection', async () => {
      const { user } = render(
        <Test
          initialState={{
            ...baseInitialState,
            sidebar: {
              open: true,
              value: GridSidebarValue.Charts,
            },
            chartsIntegration: {
              ...baseInitialState.chartsIntegration,
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

      const availableFieldsSection = screen
        .getAllByRole('tabpanel')[0]
        .querySelector('[data-drag-over="false"]')!; // available fields section

      // open the menu of the first field
      await user.click(
        availableFieldsSection
          .querySelectorAll('[draggable="true"]')[0]
          .querySelector('[data-testid="AddIcon"]')!,
      );

      expect(integrationContext!.chartStateLookup.test.values.length).to.equal(1);

      // click on the second menu item (Add to Series)
      await user.click(screen.getAllByRole('menuitem')[1]);

      await waitFor(() => {
        expect(integrationContext!.chartStateLookup.test.values.length).to.equal(2);
      });

      // open the menu for the remaining field
      await user.click(
        availableFieldsSection
          .querySelectorAll('[draggable="true"]')[0]
          .querySelector('[data-testid="AddIcon"]')!,
      );

      expect(integrationContext!.chartStateLookup.test.dimensions.length).to.equal(1);

      // click on the first menu item (Add to Categories)
      await user.click(screen.getAllByRole('menuitem')[0]);

      await waitFor(() => {
        expect(integrationContext!.chartStateLookup.test.dimensions.length).to.equal(2);
      });

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

      // values are back to 1
      await waitFor(() => {
        expect(integrationContext!.chartStateLookup.test.values.length).to.equal(1);
      });
    });

    it('should allow configuration change', async () => {
      const { user } = render(
        <Test
          initialState={{
            ...baseInitialState,
            sidebar: {
              open: true,
              value: GridSidebarValue.Charts,
            },
            chartsIntegration: {
              ...baseInitialState.chartsIntegration,
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
