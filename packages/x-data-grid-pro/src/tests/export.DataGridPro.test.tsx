import {
  GridColDef,
  useGridApiRef,
  DataGridPro,
  GridApi,
  DataGridProProps,
} from '@mui/x-data-grid-pro';
import { createRenderer, act } from '@mui/internal-test-utils';
import { expect } from 'chai';
import * as React from 'react';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Export', () => {
  const { render } = createRenderer();

  const baselineProps = {
    autoHeight: isJSDOM,
  };

  let apiRef: React.MutableRefObject<GridApi>;

  const columns: GridColDef[] = [{ field: 'id' }, { field: 'brand', headerName: 'Brand' }];

  describe('getDataAsCsv', () => {
    it('should work with basic strings', () => {
      function TestCaseCSVExport() {
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
      }

      render(<TestCaseCSVExport />);
      expect(apiRef.current.getDataAsCsv()).to.equal(
        ['id,Brand', '0,Nike', '1,Adidas', '2,Puma'].join('\r\n'),
      );
      act(() =>
        apiRef.current.updateRows([
          {
            id: 1,
            brand: 'Adidas,Reebok',
          },
        ]),
      );
      expect(apiRef.current.getDataAsCsv()).to.equal(
        ['id,Brand', '0,Nike', '1,"Adidas,Reebok"', '2,Puma'].join('\r\n'),
      );
    });

    it('should work with comma', () => {
      function TestCaseCSVExport() {
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
      }

      render(<TestCaseCSVExport />);
      expect(apiRef.current.getDataAsCsv()).to.equal(
        ['id,Brand', '0,Nike', '1,"Adidas,Puma"'].join('\r\n'),
      );
    });

    it('should apply valueFormatter correctly', () => {
      function TestCaseCSVExport() {
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
                  valueFormatter: (value) => (value === 'Nike' ? 'Jordan' : value),
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
      }

      render(<TestCaseCSVExport />);
      expect(apiRef.current.getDataAsCsv()).to.equal(
        ['id,Brand', '0,Jordan', '1,Adidas'].join('\r\n'),
      );
    });

    it('should work with double quotes', () => {
      function TestCaseCSVExport() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPro
              {...baselineProps}
              apiRef={apiRef}
              columns={columns}
              rows={[
                { id: 0, brand: 'Nike' },
                { id: 1, brand: 'Samsung 24" (inches)' },
              ]}
            />
          </div>
        );
      }

      render(<TestCaseCSVExport />);
      expect(apiRef.current.getDataAsCsv()).to.equal(
        ['id,Brand', '0,Nike', '1,"Samsung 24"" (inches)"'].join('\r\n'),
      );
    });

    it('should work with newline', () => {
      function TestCaseCSVExport() {
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
      }

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
      function TestCaseCSVExport() {
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
      }

      render(<TestCaseCSVExport />);
      expect(
        apiRef.current.getDataAsCsv({
          delimiter: ';',
        }),
      ).to.equal(['id;Brand', '0;Nike', '1;Adidas'].join('\r\n'));
    });

    it('should only export the selected rows if any', () => {
      function TestCaseCSVExport() {
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
              rowSelectionModel={[0]}
            />
          </div>
        );
      }

      render(<TestCaseCSVExport />);
      expect(apiRef.current.getDataAsCsv()).to.equal(['id,Brand', '0,Nike'].join('\r\n'));
    });

    it('should export the rows returned by params.getRowsToExport if defined', () => {
      function TestCaseCSVExport() {
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
      }

      render(<TestCaseCSVExport />);
      expect(apiRef.current.getDataAsCsv({ getRowsToExport: () => [0] })).to.equal(
        ['id,Brand', '0,Nike'].join('\r\n'),
      );
    });

    it('should not export hidden column', () => {
      function TestCaseCSVExport() {
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
      }

      render(<TestCaseCSVExport />);
      expect(apiRef.current.getDataAsCsv()).to.equal(['id', '0', '1'].join('\r\n'));
    });

    it('should export hidden column if params.allColumns = true', () => {
      function TestCaseCSVExport() {
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
      }

      render(<TestCaseCSVExport />);
      expect(
        apiRef.current.getDataAsCsv({
          allColumns: true,
        }),
      ).to.equal(['id,Brand', '0,Nike', '1,Adidas'].join('\r\n'));
    });

    it('should not export columns with column.disableExport = true', () => {
      function TestCaseCSVExport() {
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
      }

      render(<TestCaseCSVExport />);
      expect(
        apiRef.current.getDataAsCsv({
          fields: ['brand'],
        }),
      ).to.equal(['Brand', 'Nike', 'Adidas'].join('\r\n'));
    });

    it('should only export columns in params.fields if defined', () => {
      function TestCaseCSVExport() {
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
      }

      render(<TestCaseCSVExport />);
      expect(
        apiRef.current.getDataAsCsv({
          fields: ['brand'],
        }),
      ).to.equal(['Brand', 'Nike', 'Adidas'].join('\r\n'));
    });

    it('should export column defined in params.fields even if `columnVisibilityModel` does not include the field or column.disableExport=true', () => {
      function TestCaseCSVExport() {
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
      }

      render(<TestCaseCSVExport />);
      expect(
        apiRef.current.getDataAsCsv({
          fields: ['id', 'brand'],
        }),
      ).to.equal(['id,Brand', '0,Nike', '1,Adidas'].join('\r\n'));
    });

    it('should work with booleans', () => {
      function TestCaseCSVExport() {
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
      }
      render(<TestCaseCSVExport />);
      expect(apiRef.current.getDataAsCsv()).to.equal(['id,isAdmin', '0,Yes', '1,No'].join('\r\n'));
    });

    it('should warn when a value of a field is an object and no `valueFormatter` is provided', () => {
      const COUNTRY_ISO_OPTIONS = [
        { value: 'FR', label: 'France' },
        { value: 'BR', label: 'Brazil' },
      ];

      function TestCaseCSVExport() {
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
      }

      render(<TestCaseCSVExport />);
      expect(() => {
        apiRef.current.getDataAsCsv();
      }).toWarnDev(
        [
          'MUI X: When the value of a field is an object or a `renderCell` is provided, the CSV export might not display the value correctly.',
          'You can provide a `valueFormatter` with a string representation to be used.',
        ].join('\n'),
      );
    });

    describe('includeColumnGroupsHeaders', () => {
      const defaultProps: DataGridProProps = {
        rows: [{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 }],
        columns: [
          { field: 'id', headerName: 'ID', width: 90 },
          { field: 'firstName', headerName: 'First name' },
          { field: 'lastName', headerName: 'Last name' },
          { field: 'age', headerName: 'Age', type: 'number' },
        ],
        columnGroupingModel: [
          { groupId: 'Internal', children: [{ field: 'id' }] },
          {
            groupId: 'basic_info',
            headerName: 'Basic info',
            children: [
              { groupId: 'Full name', children: [{ field: 'lastName' }, { field: 'firstName' }] },
              { field: 'age' },
            ],
          },
        ],
      };

      function TestCaseCSVExport(props: Partial<DataGridProProps>) {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300 }}>
            <DataGridPro apiRef={apiRef} autoHeight {...defaultProps} {...props} />
          </div>
        );
      }

      it('should include column groups by default', () => {
        render(<TestCaseCSVExport />);
        expect(apiRef.current.getDataAsCsv()).to.equal(
          [
            'Internal,Basic info,Basic info,Basic info',
            ',Full name,Full name,',
            'ID,First name,Last name,Age',
            '1,Jon,Snow,35',
          ].join('\r\n'),
        );
      });

      it('should not include column groups if disabled', () => {
        render(<TestCaseCSVExport />);
        expect(apiRef.current.getDataAsCsv({ includeColumnGroupsHeaders: false })).to.equal(
          ['ID,First name,Last name,Age', '1,Jon,Snow,35'].join('\r\n'),
        );
      });
    });
  });
});
