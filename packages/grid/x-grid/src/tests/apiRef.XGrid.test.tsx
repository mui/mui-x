import { ApiRef, useApiRef } from '@material-ui/data-grid';
import { XGrid } from '@material-ui/x-grid/XGrid';
import { expect } from 'chai';
import * as React from 'react';
import { getColumnValues, sleep } from 'test/utils/helperFn';
import { render } from '@testing-library/react';

describe('<XGrid /> - ApiRef', () => {
  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  const baselineProps = {
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

  let apiRef: ApiRef;

  const TestCase = () => {
    apiRef = useApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid apiRef={apiRef} columns={baselineProps.columns} rows={baselineProps.rows} />
      </div>
    );
  };

  it('should allow to reset rows with setRows and render after 100ms', async () => {
    render(<TestCase />);
    const newRows = [
      {
        id: 3,
        brand: 'Asics',
      },
    ];
    apiRef.current.setRows(newRows);
    await sleep(50);
    expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    await sleep(50);
    expect(getColumnValues()).to.deep.equal(['Asics']);
  });

  it('should allow to update row data', async () => {
    render(<TestCase />);
    apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
    apiRef.current.updateRows([{ id: 0, brand: 'Pata' }]);
    apiRef.current.updateRows([{ id: 2, brand: 'Pum' }]);
    await sleep(100);
    expect(getColumnValues()).to.deep.equal(['Pata', 'Fila', 'Pum']);
  });
  it('update row data can also add rows', async () => {
    render(<TestCase />);
    apiRef.current.updateRows([{ id: 1, brand: 'Fila' }]);
    apiRef.current.updateRows([{ id: 0, brand: 'Pata' }]);
    apiRef.current.updateRows([{ id: 2, brand: 'Pum' }]);
    apiRef.current.updateRows([{ id: 3, brand: 'Jordan' }]);
    await sleep(100);
    expect(getColumnValues()).to.deep.equal(['Pata', 'Fila', 'Pum', 'Jordan']);
  });
});
