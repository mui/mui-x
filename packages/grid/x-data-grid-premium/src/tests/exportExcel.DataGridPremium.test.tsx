import * as React from 'react';
import {
  GridColumns,
  useGridApiRef,
  DataGridPremium,
  GridApi,
  GridToolbar,
  DataGridPremiumProps,
  GridActionsCellItem,
} from '@mui/x-data-grid-premium';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, screen, fireEvent } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import Excel from 'exceljs';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPremium /> - Export Excel', () => {
  const { render } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;

  const columns: GridColumns = [{ field: 'id' }, { field: 'brand', headerName: 'Brand' }];
  const rows = [
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
  ];
  const baselineProps = {
    columns,
    rows,
    autoHeight: isJSDOM,
  };

  const TestCaseExcelExport = (props: Partial<DataGridPremiumProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  };

  describe('export interface', () => {
    it('should generate a file', () => {
      render(<TestCaseExcelExport />);
      expect(apiRef.current.getDataAsExcel()).not.to.equal(null);
    });

    it('should display export option', () => {
      render(<TestCaseExcelExport components={{ Toolbar: GridToolbar }} />);

      fireEvent.click(screen.queryByRole('button', { name: 'Export' }));
      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Download as Excel' })).not.to.equal(null);
    });
  });

  describe('generated file', () => {
    it(`should export column with correct type`, async () => {
      const Test = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              columns={[
                { field: 'str' },
                { field: 'nb', type: 'number' },
                { field: 'day', type: 'date' },
                { field: 'hour', type: 'dateTime' },
                { field: 'bool', type: 'boolean' },
                { field: 'option', type: 'singleSelect', valueOptions: ['Yes', 'No'] },
              ]}
              rows={[
                {
                  id: 1,
                  str: 'test',
                  nb: 5,
                  day: new Date('01-01-2022'),
                  hour: new Date('01-01-2022'),
                  bool: false,
                  option: 'Yes',
                },
              ]}
              apiRef={apiRef}
            />
          </div>
        );
      };
      render(<Test />);

      const workbook = await apiRef.current.getDataAsExcel();
      const worksheet = workbook!.worksheets[0];

      expect(worksheet.getCell('A1').value).to.equal('str');
      expect(typeof worksheet.getCell('A2').value).to.equal('string');

      expect(worksheet.getCell('B1').value).to.equal('nb');
      expect(typeof worksheet.getCell('B2').value).to.equal('number');

      expect(worksheet.getCell('C1').value).to.equal('day');
      expect(typeof worksheet.getCell('C2').value).to.equal('object');
      expect(worksheet.getCell('C2').value instanceof Date).to.equal(true);

      expect(worksheet.getCell('D1').value).to.equal('hour');
      expect(typeof worksheet.getCell('D2').value).to.equal('object');
      expect(worksheet.getCell('D2').value instanceof Date).to.equal(true);

      expect(worksheet.getCell('E1').value).to.equal('bool');
      expect(typeof worksheet.getCell('E2').value).to.equal('boolean');

      expect(worksheet.getCell('F1').value).to.equal('option');
      expect(typeof worksheet.getCell('F2').value).to.equal('string');
    });

    it(`should export singleSelect options`, async () => {
      const Test = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              columns={[{ field: 'option', type: 'singleSelect', valueOptions: ['Yes', 'No'] }]}
              rows={[
                {
                  id: 1,
                  option: 'Yes',
                },
              ]}
              apiRef={apiRef}
            />
          </div>
        );
      };
      render(<Test />);

      const workbook = await apiRef.current.getDataAsExcel();
      const worksheet = workbook!.worksheets[0];

      expect(worksheet.getCell('A1').value).to.equal('option');
      expect(worksheet.getCell('A2').value).to.equal('Yes');
      expect(worksheet.getCell('A2').dataValidation.formulae).to.deep.equal(['Options!$A$2:$A$3']);
    });

    it(`should not export actions columns`, async () => {
      const Icon = () => <span>i</span>;
      const Test = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              columns={[
                { field: 'str' },
                {
                  field: 'actions',
                  type: 'actions',
                  getActions: () => [
                    <GridActionsCellItem icon={<Icon />} onClick={undefined} label="Delete" />,
                  ],
                },
              ]}
              rows={[
                {
                  id: 1,
                  str: 'test',
                },
              ]}
              apiRef={apiRef}
            />
          </div>
        );
      };
      render(<Test />);

      const workbook = await apiRef.current.getDataAsExcel();
      const worksheet = workbook!.worksheets[0];

      expect(worksheet.getCell('A1').value).to.equal('str');
      expect(worksheet.getCell('A2').value).to.equal('test');
      expect(worksheet.getCell('B1').value).to.equal(null);
      expect(worksheet.getCell('B2').value).to.equal(null);
    });

    it('should merge cells with `colSpan`', async () => {
      const Test = () => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 200 }}>
            <DataGridPremium
              columns={[
                { field: 'id' },
                { field: 'col1', colSpan: 2 },
                { field: 'col2' },
                { field: 'col3', colSpan: 3 },
                { field: 'col4' },
                { field: 'col5' },
              ]}
              rows={[
                { id: 1, col1: '1-1', col2: '1-2', col3: '1-3', col4: '1-4', col5: '1-5' },
                { id: 2, col1: '2-1', col2: '2-2', col3: '2-3', col4: '2-4', col5: '2-5' },
                { id: 3, col1: '3-1', col2: '3-2', col3: '3-3', col4: '3-4', col5: '3-5' },
                { id: 4, col1: '4-1', col2: '4-2', col3: '4-3', col4: '4-4', col5: '4-5' },
                { id: 5, col1: '5-1', col2: '5-2', col3: '5-3', col4: '5-4', col5: '5-5' },
                { id: 6, col1: '6-1', col2: '6-2', col3: '6-3', col4: '6-4', col5: '6-5' },
              ]}
              apiRef={apiRef}
            />
          </div>
        );
      };
      render(<Test />);

      const workbook = await apiRef.current.getDataAsExcel();
      const worksheet = workbook!.worksheets[0];

      // 1-based index + 1 for column header row
      const firstRow = worksheet.getRow(2);
      expect(firstRow.getCell(2).value).to.equal('1-1');
      expect(firstRow.getCell(2).type).to.equal(Excel.ValueType.String);
      expect(firstRow.getCell(3).type).to.equal(Excel.ValueType.Merge);
      expect(firstRow.getCell(4).value).to.equal('1-3');
      expect(firstRow.getCell(4).type).to.equal(Excel.ValueType.String);
      expect(firstRow.getCell(5).type).to.equal(Excel.ValueType.Merge);
      expect(firstRow.getCell(6).type).to.equal(Excel.ValueType.Merge);

      const lastRow = worksheet.getRow(worksheet.rowCount);
      expect(lastRow.getCell(2).value).to.equal('6-1');
      expect(lastRow.getCell(2).type).to.equal(Excel.ValueType.String);
      expect(lastRow.getCell(3).type).to.equal(Excel.ValueType.Merge);
      expect(lastRow.getCell(4).value).to.equal('6-3');
      expect(lastRow.getCell(4).type).to.equal(Excel.ValueType.String);
      expect(lastRow.getCell(5).type).to.equal(Excel.ValueType.Merge);
      expect(lastRow.getCell(6).type).to.equal(Excel.ValueType.Merge);
    });
  });
});
