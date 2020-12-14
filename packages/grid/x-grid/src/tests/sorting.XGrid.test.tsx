import { ApiRef, SortModel, useApiRef } from '@material-ui/data-grid';
import { XGrid } from '@material-ui/x-grid/XGrid';
import { expect } from 'chai';
import * as React from 'react';
import { getColumnValues, sleep } from 'test/utils/helperFn';
import { createClientRenderStrictMode } from 'test/utils';

describe('<XGrid /> - Sorting', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  let apiRef: ApiRef;

  const TestCase = (props: { rows?: any[]; model: SortModel }) => {
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

    const { model, rows } = props;
    apiRef = useApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid
          apiRef={apiRef}
          {...baselineProps}
          rows={rows || baselineProps.rows}
          sortModel={model}
        />
      </div>
    );
  };

  const renderBrandSortedAsc = () => {
    const model: SortModel = [{ field: 'brand', sort: 'asc' }];

    render(<TestCase model={model} />, { strict: false });
  };

  it('should apply the sortModel prop correctly', () => {
    renderBrandSortedAsc();
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Nike', 'Puma']);
  });

  it('should apply the sortModel prop correctly on ApiRef setRows', async () => {
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
    await sleep(100);
    expect(getColumnValues()).to.deep.equal(['Asics', 'Hugo', 'RedBull']);
  });

  it('should apply the sortModel prop correctly on ApiRef update row data', async () => {
    renderBrandSortedAsc();
    apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
    apiRef.current.updateRows([{ id: 0, brand: 'Patagonia' }]);
    await sleep(100);
    expect(getColumnValues()).to.deep.equal(['Fila', 'Patagonia', 'Puma']);
  });

  it('should allow apiRef to setSortModel', async () => {
    renderBrandSortedAsc();
    apiRef.current.setSortModel([{ field: 'brand', sort: 'desc' }]);
    expect(getColumnValues()).to.deep.equal(['Puma', 'Nike', 'Adidas']);
  });
  it('should allow multiple sort columns and', async () => {
    const model: SortModel = [
      { field: 'year', sort: 'desc' },
      { field: 'brand', sort: 'asc' },
    ];
    render(<TestCase model={model} />);

    expect(getColumnValues()).to.deep.equal(['Puma', 'Adidas', 'Nike']);
  });

  it('should allow to set multiple Sort items via apiRef', async () => {
    renderBrandSortedAsc();
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Nike', 'Puma']);
    const model: SortModel = [
      { field: 'year', sort: 'desc' },
      { field: 'brand', sort: 'asc' },
    ];

    apiRef.current.setSortModel(model);
    expect(getColumnValues()).to.deep.equal(['Puma', 'Adidas', 'Nike']);
  });
});
