import type { RefObject } from '@mui/x-internals/types';
import { useGridApiRef, DataGridPremium, GridActionsCellItem } from '@mui/x-data-grid-premium';
import type { GridColDef, GridApi, DataGridPremiumProps } from '@mui/x-data-grid-premium';
import { createRenderer, screen, act } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import type { SinonSpy } from 'sinon';
import Excel from '@mui/x-internal-exceljs-fork';
import { spyApi } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPremium /> - Export Excel', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  const columns: GridColDef[] = [{ field: 'id' }, { field: 'brand', headerName: 'Brand' }];
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

  function TestCaseExcelExport(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  describe('export interface', () => {
    it('should generate a file', async () => {
      render(<TestCaseExcelExport />);
      expect(await act(() => apiRef.current?.getDataAsExcel())).not.to.equal(null);
    });

    it('should display export option', async () => {
      const { user } = render(<TestCaseExcelExport showToolbar />);

      await user.click(screen.getByRole('button', { name: 'Export' }));
      expect(screen.queryByRole('menu')).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Download as Excel' })).not.to.equal(null);
    });
  });

  describe('generated file', () => {
    it(`should export column with correct type`, async () => {
      function Test() {
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
      }
      render(<Test />);

      const workbook = await apiRef.current?.getDataAsExcel();
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
      function Test() {
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
      }
      render(<Test />);

      const workbook = await apiRef.current?.getDataAsExcel();
      const worksheet = workbook!.worksheets[0];

      expect(worksheet.getCell('A1').value).to.equal('option');
      expect(worksheet.getCell('A2').value).to.equal('Yes');
      expect(worksheet.getCell('A2').dataValidation.formulae).to.deep.equal(['Options!$A$2:$A$3']);
    });

    it(`should escape singleSelect formula values when escapeFormulas is enabled`, async () => {
      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              columns={[
                {
                  field: 'option',
                  type: 'singleSelect',
                  valueOptions: [{ value: 'a', label: '=HYPERLINK("http://evil","x")' }],
                },
              ]}
              rows={[{ id: 1, option: 'a' }]}
              apiRef={apiRef}
            />
          </div>
        );
      }
      render(<Test />);

      const workbook = await apiRef.current?.getDataAsExcel();
      const worksheet = workbook!.worksheets[0];

      expect(worksheet.getCell('A2').value).to.equal(`'=HYPERLINK("http://evil","x")`);
    });

    it(`should not escape singleSelect formula values when escapeFormulas is disabled`, async () => {
      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              columns={[
                {
                  field: 'option',
                  type: 'singleSelect',
                  valueOptions: [{ value: 'a', label: '=HYPERLINK("http://evil","x")' }],
                },
              ]}
              rows={[{ id: 1, option: 'a' }]}
              apiRef={apiRef}
            />
          </div>
        );
      }
      render(<Test />);

      const workbook = await apiRef.current?.getDataAsExcel({ escapeFormulas: false });
      const worksheet = workbook!.worksheets[0];

      expect(worksheet.getCell('A2').value).to.equal('=HYPERLINK("http://evil","x")');
    });

    it(`should not export actions columns`, async () => {
      function Icon() {
        return <span>i</span>;
      }
      function Test() {
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
                    <GridActionsCellItem
                      key={1}
                      icon={<Icon />}
                      onClick={undefined}
                      label="Delete"
                    />,
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
      }
      render(<Test />);

      const workbook = await apiRef.current?.getDataAsExcel();
      const worksheet = workbook!.worksheets[0];

      expect(worksheet.getCell('A1').value).to.equal('str');
      expect(worksheet.getCell('A2').value).to.equal('test');
      expect(worksheet.getCell('B1').value).to.equal(null);
      expect(worksheet.getCell('B2').value).to.equal(null);
    });

    it('should merge cells with `colSpan`', async () => {
      function Test() {
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
      }
      render(<Test />);

      let workbook: Excel.Workbook | null | undefined = null;
      await act(async () => {
        workbook = await apiRef.current?.getDataAsExcel();
      });
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

    it('should export hidden columns when `allColumns=true`', async () => {
      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 200 }}>
            <DataGridPremium
              columns={[{ field: 'id' }, { field: 'col1' }, { field: 'col2' }, { field: 'col3' }]}
              rows={[
                { id: 1, col1: '1-1', col2: '1-2', col3: '1-3' },
                { id: 2, col1: '2-1', col2: '2-2', col3: '2-3' },
                { id: 3, col1: '3-1', col2: '3-2', col3: '3-3' },
                { id: 4, col1: '4-1', col2: '4-2', col3: '4-3' },
                { id: 5, col1: '5-1', col2: '5-2', col3: '5-3' },
                { id: 6, col1: '6-1', col2: '6-2', col3: '6-3' },
              ]}
              apiRef={apiRef}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    col2: false,
                    col3: false,
                  },
                },
              }}
            />
          </div>
        );
      }
      render(<Test />);

      const workbook = await apiRef.current?.getDataAsExcel({
        allColumns: true,
      });
      const worksheet = workbook!.worksheets[0];

      const headerRow = worksheet.getRow(1);
      expect(headerRow.getCell(1).value).to.equal('id');
      expect(headerRow.getCell(2).value).to.equal('col1');
      expect(headerRow.getCell(3).value).to.equal('col2');
      expect(headerRow.getCell(4).value).to.equal('col3');
    });

    it(`should export column grouping`, async () => {
      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              columns={[{ field: 'col1' }, { field: 'col2' }, { field: 'col3' }]}
              rows={[
                {
                  id: 1,
                  col1: 1,
                  col2: 2,
                  col3: 3,
                },
              ]}
              columnGroupingModel={[
                { groupId: 'group1', children: [{ field: 'col1' }] },
                {
                  groupId: 'group23',
                  children: [
                    { field: 'col2' },
                    {
                      groupId: 'group3',
                      headerName: 'special col3',
                      children: [{ field: 'col3' }],
                    },
                  ],
                },
              ]}
              apiRef={apiRef}
            />
          </div>
        );
      }
      render(<Test />);

      const workbook = await apiRef.current?.getDataAsExcel();
      const worksheet = workbook!.worksheets[0];

      // line 1: | group1 | group23 |
      expect(worksheet.getCell('A1').value).to.equal('group1');
      expect(worksheet.getCell('B1').value).to.equal('group23');

      expect(worksheet.getCell('A1').type).to.equal(Excel.ValueType.String);
      expect(worksheet.getCell('B1').type).to.equal(Excel.ValueType.String);
      expect(worksheet.getCell('C1').type).to.equal(Excel.ValueType.Merge);

      // line 2: |  |  | special col3 |

      expect(worksheet.getCell('A2').value).to.equal(null);
      expect(worksheet.getCell('B2').value).to.equal(null);
      expect(worksheet.getCell('C2').value).to.equal('special col3');

      expect(worksheet.getCell('A2').type).to.equal(Excel.ValueType.Null);
      expect(worksheet.getCell('B2').type).to.equal(Excel.ValueType.Null);
      expect(worksheet.getCell('C2').type).to.equal(Excel.ValueType.String);
      // line 3: | col1 | col2 | col3 |

      expect(worksheet.getCell('A3').value).to.equal('col1');
      expect(worksheet.getCell('B3').value).to.equal('col2');
      expect(worksheet.getCell('C3').value).to.equal('col3');

      expect(worksheet.getCell('A3').type).to.equal(Excel.ValueType.String);
      expect(worksheet.getCell('B3').type).to.equal(Excel.ValueType.String);
      expect(worksheet.getCell('C3').type).to.equal(Excel.ValueType.String);
    });

    it('should escape formulas in the cells', async () => {
      function Test() {
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              apiRef={apiRef}
              columns={[{ field: 'name' }]}
              rows={[
                { id: 0, name: '=1+1' },
                { id: 1, name: '+1+1' },
                { id: 2, name: '-1+1' },
                { id: 3, name: '@1+1' },
                { id: 4, name: '\t1+1' },
                { id: 5, name: '\r1+1' },
                { id: 6, name: ',=1+1' },
                { id: 7, name: 'value,=1+1' },
              ]}
            />
          </div>
        );
      }

      render(<Test />);

      const workbook = await apiRef.current?.getDataAsExcel();
      const worksheet = workbook!.worksheets[0];

      expect(worksheet.getCell('A1').value).to.equal('name');
      expect(worksheet.getCell('A2').value).to.equal("'=1+1");
      expect(worksheet.getCell('A3').value).to.equal("'+1+1");
      expect(worksheet.getCell('A4').value).to.equal("'-1+1");
      expect(worksheet.getCell('A5').value).to.equal("'@1+1");
      expect(worksheet.getCell('A6').value).to.equal("'\t1+1");
      expect(worksheet.getCell('A7').value).to.equal("'\r1+1");
      expect(worksheet.getCell('A8').value).to.equal(',=1+1');
      expect(worksheet.getCell('A9').value).to.equal('value,=1+1');
    });
  });

  describe('formula export', () => {
    function FormulaTest(props: Partial<DataGridPremiumProps>) {
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPremium
            apiRef={apiRef}
            columns={[
              { field: 'price', type: 'number' },
              { field: 'qty', type: 'number' },
              { field: 'total', type: 'number', allowFormulas: true },
            ]}
            rows={[
              { id: 0, price: 10, qty: 2, total: '=price*qty' },
              { id: 1, price: 20, qty: 3, total: '=price*qty' },
              { id: 2, price: 30, qty: 4, total: '=price*qty' },
            ]}
            autoHeight={isJSDOM}
            {...props}
          />
        </div>
      );
    }

    it('exports live formulas as real Excel formulas when escapeFormulas is false', async () => {
      render(<FormulaTest />);
      const workbook = await apiRef.current?.getDataAsExcel({ escapeFormulas: false });
      const worksheet = workbook!.worksheets[0];

      expect(worksheet.getCell('C2').type).to.equal(Excel.ValueType.Formula);
      expect((worksheet.getCell('C2').value as any).formula).to.equal('A2*B2');
      expect((worksheet.getCell('C2').value as any).result).to.equal(20);
      expect((worksheet.getCell('C3').value as any).formula).to.equal('A3*B3');
      expect((worksheet.getCell('C4').value as any).formula).to.equal('A4*B4');
      expect((worksheet.getCell('C4').value as any).result).to.equal(120);
    });

    it('exports evaluated values (no formulas) by default', async () => {
      render(<FormulaTest />);
      const workbook = await apiRef.current?.getDataAsExcel();
      const worksheet = workbook!.worksheets[0];

      expect(worksheet.getCell('C2').type).to.equal(Excel.ValueType.Number);
      expect(worksheet.getCell('C2').value).to.equal(20);
      expect(worksheet.getCell('C4').value).to.equal(120);
    });

    it('honors the export row order (sorting) for references', async () => {
      render(
        <FormulaTest
          initialState={{ sorting: { sortModel: [{ field: 'price', sort: 'desc' }] } }}
        />,
      );
      const workbook = await apiRef.current?.getDataAsExcel({ escapeFormulas: false });
      const worksheet = workbook!.worksheets[0];

      // Sorted desc: id 2 (price 30) is the first exported row → Excel row 2.
      expect((worksheet.getCell('C2').value as any).formula).to.equal('A2*B2');
      expect((worksheet.getCell('C2').value as any).result).to.equal(120);
    });

    it('preserves absolute refs and re-anchors stable cross-row refs', async () => {
      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              apiRef={apiRef}
              columns={[
                { field: 'a', type: 'number' },
                { field: 'b', type: 'number', allowFormulas: true },
              ]}
              rows={[
                { id: 0, a: 10, b: '=REF(COLUMN_POSITION(1), ROW_POSITION(1))' },
                { id: 1, a: 20, b: '=REF(COLUMN("a"), ROW(0))' },
              ]}
              autoHeight={isJSDOM}
            />
          </div>
        );
      }
      render(<Test />);
      const workbook = await apiRef.current?.getDataAsExcel({ escapeFormulas: false });
      const worksheet = workbook!.worksheets[0];

      // Positional ref → absolute A1; stable ref to row id 0 → relative A1 at row 2.
      expect((worksheet.getCell('B2').value as any).formula).to.equal('$A$2');
      expect((worksheet.getCell('B2').value as any).result).to.equal(10);
      expect((worksheet.getCell('B3').value as any).formula).to.equal('A2');
      expect((worksheet.getCell('B3').value as any).result).to.equal(10);
    });

    it('shifts references for column-group header rows', async () => {
      render(
        <FormulaTest
          columnGroupingModel={[
            {
              groupId: 'group',
              children: [{ field: 'price' }, { field: 'qty' }, { field: 'total' }],
            },
          ]}
        />,
      );
      const workbook = await apiRef.current?.getDataAsExcel({ escapeFormulas: false });
      const worksheet = workbook!.worksheets[0];

      // 1 group-header row + 1 column-header row → first data row is Excel row 3.
      expect((worksheet.getCell('C3').value as any).formula).to.equal('A3*B3');
      expect((worksheet.getCell('C3').value as any).result).to.equal(20);
    });

    it('bakes #REF! for references to columns outside the export', async () => {
      render(<FormulaTest />);
      // Export only the formula column: price/qty are not in the sheet.
      const workbook = await apiRef.current?.getDataAsExcel({
        escapeFormulas: false,
        fields: ['total'],
      });
      const worksheet = workbook!.worksheets[0];

      expect(worksheet.getCell('A2').type).to.equal(Excel.ValueType.Formula);
      expect((worksheet.getCell('A2').value as any).formula).to.contain('#REF!');
      expect((worksheet.getCell('A2').value as any).result).to.deep.equal({ error: '#REF!' });
    });

    it('exports an evaluation error as a formula with an error result', async () => {
      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              apiRef={apiRef}
              columns={[
                { field: 'price', type: 'number' },
                { field: 'ratio', type: 'number', allowFormulas: true },
              ]}
              rows={[{ id: 0, price: 10, ratio: '=price / 0' }]}
              autoHeight={isJSDOM}
            />
          </div>
        );
      }
      render(<Test />);
      const workbook = await apiRef.current?.getDataAsExcel({ escapeFormulas: false });
      const worksheet = workbook!.worksheets[0];

      expect(worksheet.getCell('B2').type).to.equal(Excel.ValueType.Formula);
      expect((worksheet.getCell('B2').value as any).formula).to.equal('A2/0');
      expect((worksheet.getCell('B2').value as any).result).to.deep.equal({ error: '#DIV/0!' });
    });

    it('does not promote a literal = string in a non-formula column to a formula', async () => {
      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              apiRef={apiRef}
              columns={[{ field: 'note' }, { field: 'total', type: 'number', allowFormulas: true }]}
              rows={[{ id: 0, note: '=1+1', total: 5 }]}
              autoHeight={isJSDOM}
            />
          </div>
        );
      }
      render(<Test />);
      const workbook = await apiRef.current?.getDataAsExcel({ escapeFormulas: false });
      const worksheet = workbook!.worksheets[0];

      // `note` is not an allowFormulas column, so its `=1+1` is never written as a formula.
      expect(worksheet.getCell('A2').type).not.to.equal(Excel.ValueType.Formula);
      expect(worksheet.getCell('A2').value).to.equal('=1+1');
    });

    it('exports a date-valued formula consistently with a plain date column', async () => {
      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              apiRef={apiRef}
              columns={[
                { field: 'start', type: 'date' },
                { field: 'copy', type: 'date', allowFormulas: true },
              ]}
              rows={[{ id: 0, start: new Date(2022, 0, 15), copy: '=start' }]}
              autoHeight={isJSDOM}
            />
          </div>
        );
      }
      render(<Test />);
      const workbook = await apiRef.current?.getDataAsExcel({ escapeFormulas: false });
      const worksheet = workbook!.worksheets[0];

      // The formula's cached date result gets the same UTC reconstruction as the
      // plain date column, so both cells hold the same serial.
      const start = worksheet.getCell('A2').value as Date;
      const copy = (worksheet.getCell('B2').value as any).result as Date;
      expect(worksheet.getCell('B2').type).to.equal(Excel.ValueType.Formula);
      expect(copy).to.be.instanceOf(Date);
      expect(copy.getTime()).to.equal(start.getTime());
    });
  });

  describe('web worker', () => {
    let workerMock: { postMessage: SinonSpy };

    beforeEach(() => {
      workerMock = {
        postMessage: spy(),
      };
    });

    it('should not call getDataAsExcel', async () => {
      render(<TestCaseExcelExport />);
      const getDataAsExcelSpy = spyApi(apiRef.current!, 'getDataAsExcel');
      await act(() => apiRef.current?.exportDataAsExcel({ worker: () => workerMock as any }));
      expect(getDataAsExcelSpy.calledOnce).to.equal(false);
    });

    it('should post a message to the web worker with the serialized columns', async () => {
      render(<TestCaseExcelExport />);
      await act(() => apiRef.current?.exportDataAsExcel({ worker: () => workerMock as any }));
      expect(workerMock.postMessage.lastCall.args[0].serializedColumns).to.deep.equal([
        { key: 'id', headerText: 'id', style: {}, width: 100 / 7.5 },
        { key: 'brand', headerText: 'Brand', style: {}, width: 100 / 7.5 },
      ]);
    });

    it('should post a message to the web worker with the serialized rows', async () => {
      render(<TestCaseExcelExport />);
      await act(() => apiRef.current?.exportDataAsExcel({ worker: () => workerMock as any }));
      expect(workerMock.postMessage.lastCall.args[0].serializedRows).to.deep.equal([
        {
          dataValidation: {},
          mergedCells: [],
          outlineLevel: 0,
          row: baselineProps.rows[0],
        },
        {
          dataValidation: {},
          mergedCells: [],
          outlineLevel: 0,
          row: baselineProps.rows[1],
        },
        {
          dataValidation: {},
          mergedCells: [],
          outlineLevel: 0,
          row: baselineProps.rows[2],
        },
      ]);
    });

    it('includes formula descriptors in the serialized rows when escapeFormulas is false', async () => {
      function Test() {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              apiRef={apiRef}
              columns={[
                { field: 'price', type: 'number' },
                { field: 'qty', type: 'number' },
                { field: 'total', type: 'number', allowFormulas: true },
              ]}
              rows={[{ id: 0, price: 10, qty: 2, total: '=price*qty' }]}
              autoHeight={isJSDOM}
            />
          </div>
        );
      }
      render(<Test />);
      await act(() =>
        apiRef.current?.exportDataAsExcel({
          worker: () => workerMock as any,
          escapeFormulas: false,
        }),
      );
      const { serializedRows } = workerMock.postMessage.lastCall.args[0];
      expect(serializedRows[0].formulas).to.deep.equal({
        total: { formula: 'A2*B2', result: 20 },
      });
    });
  });
});
