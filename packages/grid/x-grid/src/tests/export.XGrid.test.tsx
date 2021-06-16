import { GridApiRef, useGridApiRef, XGrid } from '@material-ui/x-grid';
import { expect } from 'chai';
import * as React from 'react';
import { createClientRenderStrictMode } from 'test/utils';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<XGrid /> - Export', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    autoHeight: isJSDOM,
  };

  let apiRef: GridApiRef;

  const columns = [{ field: 'id' }, { field: 'brand', headerName: 'Brand' }];

  it('getDataAsCsv should work with basic strings', () => {
    const TestCaseCSVExport = () => {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            {...baselineProps}
            apiRef={apiRef}
            columns={columns}
            rows={[
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
            ]}
          />
        </div>
      );
    };

    render(<TestCaseCSVExport />);
    expect(apiRef.current.getDataAsCsv()).to.equal(
      ['id,Brand', '0,Nike', '1,Adidas', '2,Puma'].join('\r\n'),
    );
    apiRef.current.updateRows([
      {
        id: 1,
        brand: 'Adidas,Reebok',
      },
    ]);
    expect(apiRef.current.getDataAsCsv()).to.equal(
      ['id,Brand', '0,Nike', '1,"Adidas,Reebok"', '2,Puma'].join('\r\n'),
    );
  });

  it('getDataAsCsv should work with comma', () => {
    const TestCaseCSVExport = () => {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            {...baselineProps}
            apiRef={apiRef}
            columns={columns}
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
              {
                id: 1,
                brand: 'Adidas,Puma',
              },
            ]}
          />
        </div>
      );
    };

    render(<TestCaseCSVExport />);
    expect(apiRef.current.getDataAsCsv()).to.equal(
      ['id,Brand', '0,Nike', '1,"Adidas,Puma"'].join('\r\n'),
    );
  });

  it('getDataAsCsv should work with double quotes', () => {
    const TestCaseCSVExport = () => {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            {...baselineProps}
            apiRef={apiRef}
            columns={columns}
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
              {
                id: 1,
                brand: 'Samsung 24" (inches)',
              },
            ]}
          />
        </div>
      );
    };

    render(<TestCaseCSVExport />);
    expect(apiRef.current.getDataAsCsv()).to.equal(
      ['id,Brand', '0,Nike', '1,Samsung 24"" (inches)'].join('\r\n'),
    );
  });

  it('getDataAsCsv should allow to change the delimiter', () => {
    const TestCaseCSVExport = () => {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            {...baselineProps}
            apiRef={apiRef}
            columns={columns}
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
              {
                id: 1,
                brand: 'Adidas',
              },
            ]}
          />
        </div>
      );
    };

    render(<TestCaseCSVExport />);
    expect(
      apiRef.current.getDataAsCsv({
        delimiter: ';',
      }),
    ).to.equal(['id;Brand', '0;Nike', '1;Adidas'].join('\r\n'));
  });
});
