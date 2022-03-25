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
  });
});
