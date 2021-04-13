import * as React from 'react';
import { GridApiRef, GridSortModel, useGridApiRef } from '@material-ui/data-grid';
import { XGrid } from '@material-ui/x-grid';
import { expect } from 'chai';
import { useFakeTimers } from 'sinon';
import { getColumnValues } from 'test/utils/helperFn';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
  // @ts-expect-error need to migrate helpers to TypeScript
  waitFor,
} from 'test/utils';
import { useData } from 'packages/storybook/src/hooks/useData';

describe('<XGrid /> - Sorting', () => {
  let clock;

  beforeEach(() => {
    clock = useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  let apiRef: GridApiRef;

  const TestCase = (props: { rows?: any[]; sortModel: GridSortModel }) => {
    const baselineProps = {
      rows: [
        {
          id: 0,
          brand: 'Nike',
          year: '1940',
        },
        {
          id: 1,
          brand: 'Adidas',
          year: '1940',
        },
        {
          id: 2,
          brand: 'Puma',
          year: '1950',
        },
      ],
      columns: [{ field: 'brand' }, { field: 'year', type: 'number' }],
    };

    const { sortModel, rows } = props;
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid
          apiRef={apiRef}
          {...baselineProps}
          rows={rows || baselineProps.rows}
          sortModel={sortModel}
        />
      </div>
    );
  };

  const renderBrandSortedAsc = () => {
    const sortModel: GridSortModel = [{ field: 'brand', sort: 'asc' }];

    render(<TestCase sortModel={sortModel} />);
  };

  it('should apply the sortModel prop correctly', () => {
    renderBrandSortedAsc();
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Nike', 'Puma']);
  });

  it('should apply the sortModel prop correctly on GridApiRef setRows', () => {
    renderBrandSortedAsc();
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
    expect(getColumnValues()).to.deep.equal(['Asics', 'Hugo', 'RedBull']);
  });

  it('should apply the sortModel prop correctly on GridApiRef update row data', () => {
    renderBrandSortedAsc();
    apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
    apiRef.current.updateRows([{ id: 0, brand: 'Patagonia' }]);
    clock.tick(100);
    expect(getColumnValues()).to.deep.equal(['Fila', 'Patagonia', 'Puma']);
  });

  it('should allow apiRef to setSortModel', () => {
    renderBrandSortedAsc();
    apiRef.current.setSortModel([{ field: 'brand', sort: 'desc' }]);
    expect(getColumnValues()).to.deep.equal(['Puma', 'Nike', 'Adidas']);
  });

  it('should allow multiple sort columns and', () => {
    const sortModel: GridSortModel = [
      { field: 'year', sort: 'desc' },
      { field: 'brand', sort: 'asc' },
    ];
    render(<TestCase sortModel={sortModel} />);
    expect(getColumnValues()).to.deep.equal(['Puma', 'Adidas', 'Nike']);
  });

  it('should allow to set multiple Sort items via apiRef', () => {
    renderBrandSortedAsc();
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Nike', 'Puma']);
    const sortModel: GridSortModel = [
      { field: 'year', sort: 'desc' },
      { field: 'brand', sort: 'asc' },
    ];

    apiRef.current.setSortModel(sortModel);
    expect(getColumnValues()).to.deep.equal(['Puma', 'Adidas', 'Nike']);
  });

  describe('performance', () => {
    beforeEach(() => {
      clock.restore();
    });

    it('should sort 5,000 rows in less than 200 ms', async function test() {
      // It's simpler to only run the performance test in a single controlled environment.
      if (!/HeadlessChrome/.test(window.navigator.userAgent)) {
        this.skip();
        return;
      }

      const TestCasePerf = () => {
        const data = useData(5000, 10);

        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid columns={data.columns} rows={data.rows} />
          </div>
        );
      };

      render(<TestCasePerf />);
      const header = screen
        .getByRole('columnheader', { name: 'Currency Pair' })
        .querySelector('.MuiDataGrid-colCellTitleContainer');

      const t0 = performance.now();
      fireEvent.click(header);
      await waitFor(() => expect(document.querySelector('.MuiDataGrid-sortIcon')).to.not.be.null);
      const t1 = performance.now();
      const time = Math.round(t1 - t0);
      expect(time).to.be.lessThan(200);
    });
  });
});
