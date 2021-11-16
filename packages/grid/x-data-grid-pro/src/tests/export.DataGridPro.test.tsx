import { GridApiRef, GridColumns, useGridApiRef, DataGridPro } from '@mui/x-data-grid-pro';
import { createRenderer } from '@material-ui/monorepo/test/utils';
import { expect } from 'chai';
import * as React from 'react';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Export', () => {
  const { render } = createRenderer();

  const baselineProps = {
    autoHeight: isJSDOM,
  };

  let apiRef: GridApiRef;

  const columns: GridColumns = [{ field: 'id' }, { field: 'brand', headerName: 'Brand' }];

  describe('getDataAsCsv', () => {
    it('should work with basic strings', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
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

    it('should work with comma', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
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

    it('should apply valueFormatter correctly', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              columns={[
                { field: 'id' },
                {
                  field: 'brand',
                  headerName: 'Brand',
                  valueFormatter: (params) => (params.value === 'Nike' ? 'Jordan' : params.value),
                },
              ]}
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
      expect(apiRef.current.getDataAsCsv()).to.equal(
        ['id,Brand', '0,Jordan', '1,Adidas'].join('\r\n'),
      );
    });

    it('should work with double quotes', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
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

    it('should allow to change the delimiter', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
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

    it('should only export the selected rows if any', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              columns={[{ field: 'id' }, { field: 'brand', headerName: 'Brand' }]}
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
              selectionModel={[0]}
            />
          </div>
        );
      };

      render(<TestCaseCSVExport />);
      expect(apiRef.current.getDataAsCsv()).to.equal(['id,Brand', '0,Nike'].join('\r\n'));
    });

    it('should not export hidden column', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              columns={[{ field: 'id' }, { field: 'brand', headerName: 'Brand', hide: true }]}
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
      expect(apiRef.current.getDataAsCsv()).to.equal(['id', '0', '1'].join('\r\n'));
    });

    it('should export hidden column if params.allColumns = true', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              columns={[{ field: 'id' }, { field: 'brand', headerName: 'Brand', hide: true }]}
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
          allColumns: true,
        }),
      ).to.equal(['id,Brand', '0,Nike', '1,Adidas'].join('\r\n'));
    });

    it('should not export columns with column.disableExport = true', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              columns={[
                { field: 'id' },
                { field: 'brand', headerName: 'Brand', disableExport: true },
              ]}
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
          fields: ['brand'],
        }),
      ).to.equal(['Brand', 'Nike', 'Adidas'].join('\r\n'));
    });

    it('should only export columns in params.fields if defined', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              columns={[{ field: 'id' }, { field: 'brand', headerName: 'Brand', hide: true }]}
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
          fields: ['brand'],
        }),
      ).to.equal(['Brand', 'Nike', 'Adidas'].join('\r\n'));
    });

    it('should export column defined in params.fields even if column.hide=true or column.disableExport=true', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              columns={[
                { field: 'id', disableExport: true },
                { field: 'brand', headerName: 'Brand', hide: true },
              ]}
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
          fields: ['id', 'brand'],
        }),
      ).to.equal(['id,Brand', '0,Nike', '1,Adidas'].join('\r\n'));
    });

    it('should work with booleans', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              localeText={{ booleanCellTrueLabel: 'Yes', booleanCellFalseLabel: 'No' }}
              columns={[{ field: 'id' }, { field: 'isAdmin', type: 'boolean' }]}
              rows={[
                { id: 0, isAdmin: true },
                { id: 1, isAdmin: false },
              ]}
            />
          </div>
        );
      };
      render(<TestCaseCSVExport />);
      expect(apiRef.current.getDataAsCsv()).to.equal(['id,isAdmin', '0,Yes', '1,No'].join('\r\n'));
    });
  });
});
