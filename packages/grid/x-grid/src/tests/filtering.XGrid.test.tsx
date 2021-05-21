import * as React from 'react';
import { expect } from 'chai';
import { useFakeTimers } from 'sinon';
import {
  GridApiRef,
  GridFilterModel,
  GridComponentProps,
  GridLinkOperator,
  GridPreferencePanelsValue,
  GridRowModel,
  GridFilterModelParams,
  GridRowId,
  useGridApiRef,
  XGrid,
  SUBMIT_FILTER_STROKE_TIME,
} from '@material-ui/x-grid';
import {
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  waitFor,
} from 'test/utils';
import { getColumnHeaderCell, getColumnValues } from 'test/utils/helperFn';
import { useData } from 'packages/storybook/src/hooks/useData';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<XGrid /> - Filter', () => {
  let clock;

  beforeEach(() => {
    clock = useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  let apiRef: GridApiRef;

  const TestCase = (props: Partial<GridComponentProps>) => {
    const baselineProps = {
      autoHeight: isJSDOM,
      rows: [
        {
          id: 0,
          brand: 'Nike',
        },
        {
          id: 1,
          brand: 'Adidas',
        },
        {
          id: 2,
          brand: 'Puma',
        },
      ],
      columns: [{ field: 'brand' }],
    };

    const { rows, ...other } = props;
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid
          apiRef={apiRef}
          {...baselineProps}
          rows={rows || baselineProps.rows}
          disableColumnFilter={false}
          {...other}
        />
      </div>
    );
  };

  const model = {
    items: [
      {
        columnField: 'brand',
        value: 'a',
        operatorValue: 'contains',
      },
    ],
  };

  it('should apply the filterModel prop correctly', () => {
    render(<TestCase filterModel={model} />);

    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
  });

  it('should apply the filterModel prop correctly on GridApiRef setRows', () => {
    render(<TestCase filterModel={model} />);

    const newRows = [
      {
        id: 3,
        brand: 'Asics',
      },
      {
        id: 4,
        brand: 'RedBull',
      },
      {
        id: 5,
        brand: 'Hugo',
      },
    ];
    apiRef.current.setRows(newRows);
    clock.tick(100);
    expect(getColumnValues()).to.deep.equal(['Asics']);
  });

  it('should apply the filterModel prop correctly on GridApiRef update row data', () => {
    render(<TestCase filterModel={model} />);
    apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
    apiRef.current.updateRows([{ id: 0, brand: 'Patagonia' }]);
    clock.tick(100);
    expect(getColumnValues()).to.deep.equal(['Patagonia', 'Fila', 'Puma']);
  });

  it('should allow apiRef to setFilterModel', () => {
    render(<TestCase filterModel={model} />);
    apiRef.current.setFilterModel({
      items: [
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'startsWith',
        },
      ],
    });
    expect(getColumnValues()).to.deep.equal(['Adidas']);
  });

  it('should allow multiple filter and default to AND', () => {
    const newModel = {
      items: [
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'contains',
        },
        {
          columnField: 'brand',
          value: 'm',
          operatorValue: 'contains',
        },
      ],
    };
    render(<TestCase filterModel={newModel} />);
    expect(getColumnValues()).to.deep.equal(['Puma']);
  });

  it('should allow multiple filter via apiRef', () => {
    render(<TestCase filterModel={model} />);
    const newModel = {
      items: [
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'startsWith',
        },
        {
          columnField: 'brand',
          value: 's',
          operatorValue: 'endsWith',
        },
      ],
    };
    apiRef.current.setFilterModel(newModel);
    expect(getColumnValues()).to.deep.equal(['Adidas']);
  });

  it('should allow multiple filter and changing the linkOperator', () => {
    const newModel: GridFilterModel = {
      items: [
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'startsWith',
        },
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'endsWith',
        },
      ],
      linkOperator: GridLinkOperator.Or,
    };
    render(<TestCase filterModel={newModel} />);
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
  });

  it('should only select visible rows', () => {
    const newModel: GridFilterModel = {
      items: [
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'startsWith',
        },
      ],
      linkOperator: GridLinkOperator.Or,
    };
    render(<TestCase checkboxSelection filterModel={newModel} />);
    const checkAllCell = getColumnHeaderCell(0).querySelector('input');
    fireEvent.click(checkAllCell);
    expect(apiRef.current.getState().selection).to.deep.equal({ 1: 1 });
  });

  it('should allow to clear filters by passing an empty filter model', () => {
    const newModel: GridFilterModel = {
      items: [
        {
          columnField: 'brand',
          value: 'a',
          operatorValue: 'startsWith',
        },
      ],
    };
    const { setProps } = render(<TestCase filterModel={newModel} />);
    expect(getColumnValues()).to.deep.equal(['Adidas']);
    setProps({ filterModel: { items: [] } });
    expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
  });

  it('should show the latest visibleRows onFilterChange', () => {
    let visibleRows: Map<GridRowId, GridRowModel> = new Map();
    const onFilterChange = (params: GridFilterModelParams) => {
      visibleRows = params.visibleRows;
    };

    render(
      <TestCase
        filterModel={model}
        onFilterModelChange={onFilterChange}
        state={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />,
    );

    expect(getColumnValues()).to.deep.equal(['Adidas', 'Puma']);
    const input = screen.getByPlaceholderText('Filter value');
    fireEvent.change(input, { target: { value: 'ad' } });
    clock.tick(SUBMIT_FILTER_STROKE_TIME);
    expect(visibleRows.size).to.equal(1);
    expect(visibleRows.get(1)).to.deep.equal({ id: 1, brand: 'Adidas' });
    expect(apiRef.current.getVisibleRowModels().size).to.equal(1);
    expect(apiRef.current.getVisibleRowModels().get(1)).to.deep.equal({ id: 1, brand: 'Adidas' });
  });

  describe('performance', () => {
    beforeEach(() => {
      clock.restore();
    });

    it('should filter 5,000 rows in less than 100 ms', async function test() {
      // It's simpler to only run the performance test in a single controlled environment.
      if (!/HeadlessChrome/.test(window.navigator.userAgent)) {
        this.skip();
        return;
      }

      const TestCasePerf = () => {
        const data = useData(5000, 10);
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid apiRef={apiRef} columns={data.columns} rows={data.rows} />
          </div>
        );
      };

      render(<TestCasePerf />);
      const newModel = {
        items: [
          {
            columnField: 'currencyPair',
            value: 'usd',
            operatorValue: 'startsWith',
          },
        ],
      };
      const t0 = performance.now();
      apiRef.current.setFilterModel(newModel);

      await waitFor(() =>
        expect(document.querySelector('.MuiDataGrid-filterIcon')).to.not.equal(null),
      );
      const t1 = performance.now();
      const time = Math.round(t1 - t0);
      expect(time).to.be.lessThan(100);
    });
  });

  describe('Server', () => {
    it('should refresh the filter panel when adding filters', () => {
      function loadServerRows(commodityFilterValue) {
        const serverRows = [
          { id: '1', commodity: 'rice' },
          { id: '2', commodity: 'soybeans' },
          { id: '3', commodity: 'milk' },
          { id: '4', commodity: 'wheat' },
          { id: '5', commodity: 'oats' },
        ];

        return new Promise<GridRowModel[]>((resolve) => {
          if (!commodityFilterValue) {
            resolve(serverRows);
            return;
          }
          resolve(
            serverRows.filter(
              (row) => row.commodity.toLowerCase().indexOf(commodityFilterValue) > -1,
            ),
          );
        });
      }

      const columns = [{ field: 'commodity', width: 150 }];

      function AddServerFilterGrid() {
        const [rows, setRows] = React.useState<GridRowModel[]>([]);
        const [filterValue, setFilterValue] = React.useState();

        const onFilterChange = React.useCallback((params) => {
          setFilterValue(params.filterModel.items[0].value);
        }, []);

        React.useEffect(() => {
          let active = true;

          (async () => {
            const newRows = await loadServerRows(filterValue);

            if (!active) {
              return;
            }

            setRows(newRows);
          })();

          return () => {
            active = false;
          };
        }, [filterValue]);

        return (
          <div style={{ height: 400, width: 400 }}>
            <XGrid
              rows={rows}
              columns={columns}
              filterMode="server"
              onFilterModelChange={onFilterChange}
              state={{
                preferencePanel: {
                  open: true,
                  openedPanelValue: GridPreferencePanelsValue.filters,
                },
              }}
            />
          </div>
        );
      }

      render(<AddServerFilterGrid />);
      const addButton = screen.getByRole('button', { name: /Add Filter/i });
      clock.tick(100);
      fireEvent.click(addButton);
      const filterForms = document.querySelectorAll(`.MuiDataGridFilterForm-root`);
      expect(filterForms).to.have.length(2);
    });
  });
});
