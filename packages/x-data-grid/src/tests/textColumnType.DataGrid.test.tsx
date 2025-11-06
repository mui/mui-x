import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { getCell } from 'test/utils/helperFn';
import { isJSDOM } from 'test/utils/skipIf';

describe('<DataGrid /> - Text Column Type', () => {
  const { render } = createRenderer();

  const rows: GridRowsProp = [
    { id: 1, description: 'Short text' },
    { id: 2, description: 'This is a longer text\nthat has multiple lines\nand should be editable' },
  ];

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'description', headerName: 'Description', type: 'text', width: 300, editable: true },
  ];

  it('should render a column with type text', () => {
    render(
      <div style={{ width: 400, height: 300 }}>
        <DataGrid rows={rows} columns={columns} autoHeight={isJSDOM} />
      </div>,
    );

    expect(getCell(0, 1).textContent).to.equal('Short text');
    expect(getCell(1, 1).textContent).to.contain('This is a longer text');
  });

  it('should render text type column as editable when editable prop is true', () => {
    render(
      <div style={{ width: 400, height: 300 }}>
        <DataGrid rows={rows} columns={columns} autoHeight={isJSDOM} />
      </div>,
    );

    const cell = getCell(0, 1);
    expect(cell).not.to.equal(null);
  });
});
