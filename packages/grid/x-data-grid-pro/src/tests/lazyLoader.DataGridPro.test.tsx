// @ts-ignore Remove once the test utils are typed
import { createRenderer, fireEvent } from '@mui/monorepo/test/utils';
import { getColumnHeaderCell, getRow } from 'test/utils/helperFn';
import * as React from 'react';
import { expect } from 'chai';
import {
  DataGridPro,
  DataGridProProps,
  GridApi,
  GridColumns,
  GridRowModel,
  GridRowsProp,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { spy } from 'sinon';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Lazy Loader', () => {
  const { render } = createRenderer();

  const baselineProps: { rows: GridRowsProp; columns: GridColumns } = {
    rows: [
      {
        id: 1,
        first: 'Mike',
      },
      {
        id: 2,
        first: 'Jack',
      },
      {
        id: 3,
        first: 'Jim',
      },
    ],
    columns: [{ field: 'id' }, { field: 'first' }],
  };

  let apiRef: React.MutableRefObject<GridApi>;

  const TestLazyLoader = (props: Partial<DataGridProProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          experimentalFeatures={{
            lazyLoading: true,
          }}
          apiRef={apiRef}
          {...baselineProps}
          {...props}
          sortingMode="server"
          filterMode="server"
          rowsLoadingMode="server"
        />
      </div>
    );
  };

  it('should call onFetchRows when sorting is applied', function test() {
    if (isJSDOM) {
      this.skip(); // Needs layout
    }
    const handleFetchRows = spy();
    render(<TestLazyLoader onFetchRows={handleFetchRows} rowCount={50} />);

    fireEvent.click(getColumnHeaderCell(0));
    // Should be 1. When tested in the browser it's called onlt 1 time
    expect(handleFetchRows.callCount).to.equal(2);
  });

  it('should render skeleton cell if rowCount is bigger than the number of rows', () => {
    const handleFetchRows = spy();
    render(<TestLazyLoader onFetchRows={handleFetchRows} rowCount={10} />);

    // The 4th row should be a skeleton one
    expect(getRow(3).dataset.id).to.equal('auto-generated-skeleton-row-root-0');
  });

  it('should update allRows accordingly when apiRef.current.insertRows is called', () => {
    render(<TestLazyLoader rowCount={6} />);

    const newRows: GridRowModel[] = [
      { id: 4, name: 'John' },
      { id: 5, name: 'Mac' },
    ];

    const initialAllRows = apiRef.current.state.rows.ids;
    expect(initialAllRows.slice(3, 6)).to.deep.equal([
      'auto-generated-skeleton-row-root-0',
      'auto-generated-skeleton-row-root-1',
      'auto-generated-skeleton-row-root-2',
    ]);
    apiRef.current.unstable_replaceRows(4, 6, newRows);

    const updatedAllRows = apiRef.current.state.rows.ids;
    expect(updatedAllRows.slice(4, 6)).to.deep.equal([4, 5]);
  });
});
