import { GridColumns, useGridApiRef, DataGridPro, GridApi } from '@mui/x-data-grid-pro';
// @ts-ignore Remove once the test utils are typed
import { createRenderer } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import * as React from 'react';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Export', () => {
  const { render } = createRenderer();

  const baselineProps = {
    autoHeight: isJSDOM,
  };

  let apiRef: React.MutableRefObject<GridApi>;

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

    it('should work with newline', () => {
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
                  brand: `Nike \n Nike`,
                },
                {
                  id: 1,
                  brand: 'Adidas \n Adidas',
                },
                {
                  id: 2,
                  brand: 'Puma \r\n Puma',
                },
                {
                  id: 3,
                  brand: 'Reebok \n\r Reebok',
                },
              ]}
            />
          </div>
        );
      };

      render(<TestCaseCSVExport />);
      expect(apiRef.current.getDataAsCsv()).to.equal(
        [
          'id,Brand',
          '0,"Nike \n Nike"',
          '1,"Adidas \n Adidas"',
          '2,"Puma \r\n Puma"',
          '3,"Reebok \n\r Reebok"',
        ].join('\r\n'),
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

    it('should export the rows returned by params.getRowsToExport if defined', () => {
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
            />
          </div>
        );
      };

      render(<TestCaseCSVExport />);
      expect(apiRef.current.getDataAsCsv({ getRowsToExport: () => [0] })).to.equal(
        ['id,Brand', '0,Nike'].join('\r\n'),
      );
    });

    it('should not export hidden column (deprecated)', () => {
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

    it('should not export hidden column', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              columns={[{ field: 'id' }, { field: 'brand', headerName: 'Brand' }]}
              initialState={{ columns: { columnVisibilityModel: { brand: false } } }}
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

    it('should export hidden column if params.allColumns = true (deprecated)', () => {
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

    it('should export hidden column if params.allColumns = true', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              columns={[{ field: 'id' }, { field: 'brand', headerName: 'Brand' }]}
              initialState={{ columns: { columnVisibilityModel: { brand: false } } }}
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

    it('should only export columns in params.fields if defined (deprecated)', () => {
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

    it('should only export columns in params.fields if defined', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              columns={[{ field: 'id' }, { field: 'brand', headerName: 'Brand' }]}
              initialState={{ columns: { columnVisibilityModel: { brand: false } } }}
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

    it('should export column defined in params.fields even if column.hide=true or column.disableExport=true (deprecated)', () => {
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

    it('should export column defined in params.fields even if `columnVisibilityModel` does not include the field or column.disableExport=true', () => {
      const TestCaseCSVExport = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              columns={[
                { field: 'id', disableExport: true },
                { field: 'brand', headerName: 'Brand' },
              ]}
              initialState={{ columns: { columnVisibilityModel: { brand: false } } }}
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

    it('should warn when a value of a field is an object and no `valueFormatter` is provided', () => {
      const COUNTRY_ISO_OPTIONS = [
        { value: 'FR', label: 'France' },
        { value: 'BR', label: 'Brazil' },
      ];

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
                  field: 'country',
                  type: 'singleSelect',
                  valueOptions: COUNTRY_ISO_OPTIONS,
                },
              ]}
              rows={[
                { id: 0, country: COUNTRY_ISO_OPTIONS[0] },
                { id: 1, country: COUNTRY_ISO_OPTIONS[1] },
              ]}
            />
          </div>
        );
      };

      render(<TestCaseCSVExport />);
      expect(() => {
        apiRef.current.getDataAsCsv();
      }).toWarnDev(
        [
          'MUI: When the value of a field is an object or a `renderCell` is provided, the CSV export might not display the value correctly.',
          'You can provide a `valueFormatter` with a string representation to be used.',
        ].join('\n'),
      );
    });
  });
});
