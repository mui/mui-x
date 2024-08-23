import * as React from 'react';
import {
  GridApi,
  useGridApiRef,
  DataGridPremium,
  DataGridPremiumProps,
  GridColDef,
} from '@mui/x-data-grid-premium';
import { createRenderer, fireEvent, waitFor } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { SinonSpy, spy, stub, SinonStub } from 'sinon';
import { getCell, getColumnValues, sleep } from 'test/utils/helperFn';
import { fireUserEvent } from 'test/utils/fireUserEvent';
import { getBasicGridData } from '@mui/x-data-grid-generator';

describe('<DataGridPremium /> - Clipboard', () => {
  const { render } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;

  function Test({
    rowLength = 4,
    colLength = 3,
    ...other
  }: Omit<DataGridPremiumProps, 'rows' | 'columns' | 'apiRef'> &
    Partial<Pick<DataGridPremiumProps, 'rows' | 'columns'>> & {
      rowLength?: number;
      colLength?: number;
    }) {
    apiRef = useGridApiRef();

    const data = React.useMemo(() => {
      const basicData = getBasicGridData(rowLength, colLength);
      return {
        ...basicData,
        columns: basicData.columns.map(
          (column) =>
            ({
              ...column,
              type: 'string',
              editable: true,
            }) as GridColDef,
        ),
      };
    }, [rowLength, colLength]);

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium
          {...data}
          {...other}
          apiRef={apiRef}
          disableRowSelectionOnClick
          cellSelection
          disableVirtualization
        />
      </div>
    );
  }

  describe('copy', () => {
    let writeText: SinonSpy | undefined;

    afterEach(function afterEachHook() {
      writeText?.restore();
    });

    ['ctrlKey', 'metaKey'].forEach((key) => {
      it(`should copy the selected cells to the clipboard when ${key} + C is pressed`, () => {
        render(<Test />);

        writeText = spy(navigator.clipboard, 'writeText');

        const cell = getCell(0, 0);
        cell.focus();
        fireUserEvent.mousePress(cell);

        fireEvent.keyDown(cell, { key: 'Shift' });
        fireEvent.click(getCell(2, 2), { shiftKey: true });

        fireEvent.keyDown(cell, { key: 'c', keyCode: 67, [key]: true });
        expect(writeText.firstCall.args[0]).to.equal(
          [
            ['0', 'USDGBP', '1'].join('\t'),
            ['1', 'USDEUR', '11'].join('\t'),
            ['2', 'GBPEUR', '21'].join('\t'),
          ].join('\r\n'),
        );
      });
    });

    it(`should copy cells range selected in one row`, () => {
      render(<Test />);

      writeText = spy(navigator.clipboard, 'writeText');

      const cell = getCell(0, 0);
      cell.focus();
      fireUserEvent.mousePress(cell);

      fireEvent.keyDown(cell, { key: 'Shift' });
      fireEvent.click(getCell(0, 2), { shiftKey: true });

      fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
      expect(writeText.firstCall.args[0]).to.equal([['0', 'USDGBP', '1'].join('\t')].join('\r\n'));
    });

    it(`should copy cells range selected based on their sorted order`, () => {
      const columns = [{ field: 'brand' }];
      const rows = [
        { id: 0, brand: 'Nike' },
        { id: 1, brand: 'Adidas' },
        { id: 2, brand: 'Puma' },
      ];
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPremium
            columns={columns}
            rows={rows}
            cellSelection
            sortModel={[{ field: 'brand', sort: 'asc' }]}
          />
        </div>,
      );

      writeText = spy(navigator.clipboard, 'writeText');

      const cell = getCell(0, 0);
      cell.focus();
      fireUserEvent.mousePress(cell);

      fireEvent.keyDown(cell, { key: 'Ctrl' });
      fireEvent.click(getCell(1, 0), { ctrlKey: true });

      fireEvent.keyDown(cell, { key: 'Ctrl' });
      fireEvent.click(getCell(2, 0), { ctrlKey: true });

      fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
      expect(writeText.lastCall.firstArg).to.equal(['Adidas', 'Nike', 'Puma'].join('\r\n'));
    });

    it('should not escape double quotes when copying multiple cells to clipboard', () => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPremium
            columns={[{ field: 'value' }]}
            rows={[
              { id: 0, value: '1 " 1' },
              { id: 1, value: '2' },
            ]}
            cellSelection
            disableRowSelectionOnClick
          />
        </div>,
      );

      writeText = spy(navigator.clipboard, 'writeText');

      const cell = getCell(0, 0);
      cell.focus();
      fireUserEvent.mousePress(cell);

      fireEvent.keyDown(cell, { key: 'Ctrl' });
      fireEvent.click(getCell(1, 0), { ctrlKey: true });

      fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
      expect(writeText.lastCall.firstArg).to.equal(['1 " 1', '2'].join('\r\n'));
    });
  });

  describe('paste', () => {
    before(function beforeHook() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        // These test are flaky in JSDOM
        this.skip();
      }
    });

    function paste(cell: HTMLElement, pasteText: string) {
      const pasteEvent = new Event('paste');

      // @ts-ignore
      pasteEvent.clipboardData = {
        getData: () => pasteText,
      };

      fireEvent.keyDown(cell, { key: 'v', code: 'KeyV', keyCode: 86, ctrlKey: true }); // Ctrl+V
      document.activeElement!.dispatchEvent(pasteEvent);
    }

    ['ctrlKey', 'metaKey'].forEach((key) => {
      it(`should not enter cell edit mode when ${key} + V is pressed`, () => {
        render(<Test />);

        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'v', code: 'KeyV', keyCode: 86, [key]: true }); // Ctrl+V
        expect(listener.callCount).to.equal(0);
      });
    });

    ['ctrlKey', 'metaKey'].forEach((key) => {
      it(`should not enter row edit mode when ${key} + V is pressed`, () => {
        render(<Test editMode="row" />);

        const listener = spy();
        apiRef.current.subscribeEvent('rowEditStart', listener);
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'v', code: 'KeyV', keyCode: 86, [key]: true }); // Ctrl+V
        expect(listener.callCount).to.equal(0);
      });
    });

    describe('cell selection', () => {
      it('should paste into each cell of the range when single value is pasted', async () => {
        render(<Test />);

        const cell = getCell(0, 1);
        cell.focus();
        fireUserEvent.mousePress(cell);

        fireEvent.keyDown(cell, { key: 'Shift' });
        fireEvent.click(getCell(2, 2), { shiftKey: true });

        const clipboardData = '12';
        paste(cell, clipboardData);

        await waitFor(() => {
          expect(getCell(0, 1)).to.have.text(clipboardData);
        });
        expect(getCell(0, 2)).to.have.text(clipboardData);
        expect(getCell(1, 1)).to.have.text(clipboardData);
        expect(getCell(1, 2)).to.have.text(clipboardData);
        expect(getCell(2, 1)).to.have.text(clipboardData);
        expect(getCell(2, 2)).to.have.text(clipboardData);
      });

      // Context: https://github.com/mui/mui-x/issues/14233
      it('should paste into cells on the current page when `paginationMode="server"`', async () => {
        const rowLength = 4;

        const { setProps } = render(
          <Test
            rowLength={rowLength}
            pagination
            paginationModel={{ pageSize: 2, page: 0 }}
            paginationMode="server"
            pageSizeOptions={[2]}
            rowCount={rowLength}
            editMode="cell"
          />,
        );

        const clipboardData = '12';
        const cell = getCell(3, 1); // cell in the first row on the next page

        expect(cell).not.to.have.text(clipboardData);

        cell.focus();
        fireUserEvent.mousePress(cell);
        paste(cell, clipboardData);

        // no update
        await waitFor(() => {
          expect(getCell(3, 1)).not.to.have.text(clipboardData);
        });

        // go to the next page
        setProps({ paginationModel: { pageSize: 2, page: 1 } });

        cell.focus();
        fireUserEvent.mousePress(cell);
        paste(cell, clipboardData);

        // updated
        await waitFor(() => {
          expect(getCell(3, 1)).to.have.text(clipboardData);
        });
      });

      it('should not paste values outside of the selected cells range', async () => {
        render(<Test rowLength={5} colLength={5} />);

        const cell = getCell(0, 1);
        cell.focus();
        fireUserEvent.mousePress(cell);

        fireEvent.keyDown(cell, { key: 'Shift' });
        fireEvent.click(getCell(2, 2), { shiftKey: true });

        const clipboardData = [
          ['01', '02', '03'],
          ['11', '12', '13'],
          ['21', '22', '23'],
          ['31', '32', '33'],
          ['41', '42', '43'],
          ['51', '52', '53'],
        ]
          .map((row) => row.join('\t'))
          .join('\n');
        paste(cell, clipboardData);

        // selected cells should be updated
        await waitFor(() => {
          expect(getCell(0, 1)).to.have.text('01');
        });
        expect(getCell(0, 2)).to.have.text('02');
        expect(getCell(1, 1)).to.have.text('11');
        expect(getCell(1, 2)).to.have.text('12');
        expect(getCell(2, 1)).to.have.text('21');
        expect(getCell(2, 2)).to.have.text('22');

        // cells out of selection range should not be updated
        expect(getCell(0, 3)).not.to.have.text('03');
        expect(getCell(3, 1)).not.to.have.text('31');
      });

      it('should not paste empty values into cells within selected range when there are no corresponding values in the clipboard', async () => {
        render(<Test rowLength={5} colLength={5} />);

        const cell = getCell(0, 1);
        cell.focus();
        fireUserEvent.mousePress(cell);

        fireEvent.keyDown(cell, { key: 'Shift' });
        fireEvent.click(getCell(2, 2), { shiftKey: true });

        const clipboardData = [
          ['01'], // first row
          ['11'], // second row
          ['21'], // third row
        ]
          .map((row) => row.join('\t'))
          .join('\n');
        paste(cell, clipboardData);

        const secondColumnValuesBeforePaste = [
          getCell(0, 2).textContent!,
          getCell(1, 2).textContent!,
          getCell(2, 2).textContent!,
        ];

        // selected cells should be updated if there's data in the clipboard
        await waitFor(() => {
          expect(getCell(0, 1)).to.have.text('01');
        });
        expect(getCell(1, 1)).to.have.text('11');
        expect(getCell(2, 1)).to.have.text('21');

        // selected cells should be updated if there's no data for them in the clipboard
        expect(getCell(0, 2)).to.have.text(secondColumnValuesBeforePaste[0]);
        expect(getCell(1, 2)).to.have.text(secondColumnValuesBeforePaste[1]);
        expect(getCell(2, 2)).to.have.text(secondColumnValuesBeforePaste[2]);
      });

      // https://github.com/mui/mui-x/issues/9732
      it('should ignore the `pageSize` when pagination is disabled', async () => {
        render(
          <Test
            rowLength={8}
            colLength={4}
            paginationModel={{ page: 0, pageSize: 5 }}
            pagination={false}
          />,
        );

        const cell = getCell(1, 1);
        cell.focus();
        fireUserEvent.mousePress(cell);

        const clipboardData = [
          ['p11', 'p12', 'p13'],
          ['p21', 'p22', 'p23'],
          ['p31', 'p32', 'p33'],
          ['p41', 'p42', 'p43'],
          ['p51', 'p52', 'p53'],
          ['p61', 'p62', 'p63'],
          ['p71', 'p72', 'p73'],
        ]
          .map((row) => row.join('\t'))
          .join('\n');

        paste(cell, clipboardData);

        await waitFor(() => {
          expect(getCell(3, 3).textContent).to.equal('p33');
        });
        expect(getCell(6, 2).textContent).to.equal('p62');
        expect(getCell(7, 1).textContent).to.equal('p71');
        expect(getCell(7, 3).textContent).to.equal('p73');
      });
    });

    describe('row selection', () => {
      it('should paste into each selected row if single row of data is pasted', async () => {
        render(<Test rowSelectionModel={[0, 1, 2]} />);

        const cell = getCell(2, 1);
        cell.focus();
        fireUserEvent.mousePress(cell);

        const clipboardData = ['p01', 'p02', 'p03'].join('\t');
        paste(cell, clipboardData);

        await waitFor(() => {
          // the last row is not selected and should not be updated
          expect(getColumnValues(1)).to.deep.equal(['p02', 'p02', 'p02', 'JPYUSD']);
        });
        expect(getColumnValues(2)).to.deep.equal(['p03', 'p03', 'p03', '31']);
      });

      it('should paste into selected rows if multiple rows of data are pasted', async () => {
        render(<Test rowSelectionModel={[0, 1, 2]} />);

        const cell = getCell(2, 1);
        cell.focus();
        fireUserEvent.mousePress(cell);

        const clipboardData = [
          ['p01', 'p02', 'p03'].join('\t'),
          ['p11', 'p12', 'p13'].join('\t'),
          ['p21', 'p22', 'p23'].join('\t'),
          ['p31', 'p32', 'p33'].join('\t'),
        ].join('\n');
        paste(cell, clipboardData);

        await waitFor(() => {
          // the last row is not selected and should not be updated
          expect(getColumnValues(1)).to.deep.equal(['p02', 'p12', 'p22', 'JPYUSD']);
        });
        expect(getColumnValues(2)).to.deep.equal(['p03', 'p13', 'p23', '31']);
      });

      it('should ignore row selection when single cell value is pasted', async () => {
        render(<Test rowSelectionModel={[0, 1, 2]} />);

        const cell = getCell(2, 1);
        cell.focus();
        fireUserEvent.mousePress(cell);

        paste(cell, 'pasted');

        await waitFor(() => {
          // should ignore selected rows and paste into selected cell
          expect(getColumnValues(1)).to.deep.equal(['USDGBP', 'USDEUR', 'pasted', 'JPYUSD']);
        });
        expect(getColumnValues(2)).to.deep.equal(['1', '11', '21', '31']);
      });

      it('should paste into selected rows when checkbox selection cell is focused', async () => {
        render(<Test checkboxSelection />);

        const checkboxInput = getCell(0, 0).querySelector('input')!;
        fireUserEvent.mousePress(checkboxInput!);

        const clipboardData = ['p01', 'p02', 'p03'].join('\t');
        paste(checkboxInput, clipboardData);

        await waitFor(() => {
          // the first column (id) is not editable and won't be updated
          expect(getCell(0, 2).textContent).to.equal('p02');
        });
        expect(getCell(0, 3).textContent).to.equal('p03');
      });
    });

    it('should work well with `getRowId` prop', async () => {
      const columns = [{ field: 'brand', editable: true }];
      const rows = [
        { customIdField: 0, brand: 'Nike' },
        { customIdField: 1, brand: 'Adidas' },
        { customIdField: 2, brand: 'Puma' },
      ];
      function Component() {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              columns={columns}
              rows={rows}
              getRowId={(row) => row.customIdField}
              rowSelection={false}
              cellSelection
            />
          </div>
        );
      }

      render(<Component />);

      expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);

      const cell = getCell(1, 0);
      cell.focus();
      fireUserEvent.mousePress(cell);

      paste(cell, 'Nike');

      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal(['Nike', 'Nike', 'Puma']);
      });
    });

    [
      { key: '\\n', value: '\n' },
      { key: '\\r\\n', value: '\r\n' },
    ].forEach((newLine) => {
      it(`should support ${newLine.key} new line character`, async () => {
        render(<Test />);

        const cell = getCell(0, 1);
        cell.focus();
        fireUserEvent.mousePress(cell);

        fireEvent.keyDown(cell, { key: 'Shift' });
        fireEvent.click(getCell(1, 2), { shiftKey: true });

        const clipboardData = [['p01', 'p02'].join('\t'), ['p11', 'p12'].join('\t')].join(
          newLine.value,
        );
        paste(cell, clipboardData);

        // selected cells should be updated
        await waitFor(() => {
          expect(getCell(0, 1)).to.have.text('p01');
        });
        expect(getCell(0, 2)).to.have.text('p02');
        expect(getCell(1, 1)).to.have.text('p11');
        expect(getCell(1, 2)).to.have.text('p12');
      });
    });

    it('should not change row id value', async () => {
      const columns = [{ field: 'customIdField' }, { field: 'brand' }];
      const rows = [
        { customIdField: 0, brand: 'Nike' },
        { customIdField: 1, brand: 'Adidas' },
        { customIdField: 2, brand: 'Puma' },
      ];
      function Component() {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              columns={columns}
              rows={rows}
              getRowId={(row) => row.customIdField}
              rowSelection={false}
              cellSelection
            />
          </div>
        );
      }

      render(<Component />);

      const cell = getCell(1, 0);
      cell.focus();
      fireUserEvent.mousePress(cell);

      paste(cell, '0');

      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal(['0', '1', '2']);
      });
      expect(getColumnValues(1)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    });

    it('should use valueSetter if the column has one', async () => {
      const processRowUpdateSpy = spy((newRow) => newRow);

      const columns: GridColDef<(typeof rows)[number]>[] = [
        { field: 'firstName' },
        { field: 'lastName' },
        {
          field: 'fullName',
          valueGetter: (value, row) => {
            return `${row.firstName} ${row.lastName}`;
          },
          valueSetter: (value, row) => {
            const [firstName, lastName] = value!.toString().split(' ');
            return { ...row, firstName, lastName };
          },
          editable: true,
        },
      ];
      const rows = [
        { id: 0, firstName: 'Jon', lastName: 'Snow' },
        { id: 1, firstName: 'Cersei', lastName: 'Lannister' },
      ];
      function Component() {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              columns={columns}
              rows={rows}
              rowSelection={false}
              processRowUpdate={processRowUpdateSpy}
            />
          </div>
        );
      }

      render(<Component />);

      const cell = getCell(1, 2);
      cell.focus();
      fireUserEvent.mousePress(cell);

      paste(cell, 'John Doe');

      await waitFor(() => expect(getColumnValues(0)).to.deep.equal(['Jon', 'John']));
      expect(processRowUpdateSpy.callCount).to.equal(1);
      expect(processRowUpdateSpy.args[0]).to.deep.equal([
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 1, firstName: 'Cersei', lastName: 'Lannister' },
      ]);
    });

    it('should use valueParser if the column has one', async () => {
      const columns: GridColDef[] = [
        {
          field: 'name',
          editable: true,
          valueParser: (value) => {
            return String(value)
              .split(' ')
              .map((str) => (str.length > 0 ? str[0].toUpperCase() + str.slice(1) : ''))
              .join(' ');
          },
        },
      ];
      const rows = [
        { id: 0, name: 'Jon Snow' },
        { id: 1, name: 'Cersei Lannister' },
      ];
      function Component() {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium columns={columns} rows={rows} rowSelection={false} />
          </div>
        );
      }

      render(<Component />);

      const cell = getCell(1, 0);
      cell.focus();
      fireUserEvent.mousePress(cell);

      paste(cell, 'john doe');

      await waitFor(() => expect(getColumnValues(0)).to.deep.equal(['Jon Snow', 'John Doe']));
    });

    it('should only paste if the cell is editable', async () => {
      const rows = [
        { id: 0, brand: 'Nike', category: 'Shoes', price: '$120', rating: '4.0' },
        { id: 1, brand: 'Adidas', category: 'Sneakers', price: '$100', rating: '4.2' },
        { id: 2, brand: 'Puma', category: 'Shoes', price: '$90', rating: '4.9' },
      ];
      const columns: GridColDef[] = [
        { field: 'id' },
        { field: 'brand', editable: true },
        { field: 'category', editable: true },
        { field: 'price', editable: false },
        { field: 'rating', editable: true },
      ];

      function Component() {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              columns={columns}
              rows={rows}
              rowSelection={false}
              cellSelection
              disableVirtualization
            />
          </div>
        );
      }

      render(<Component />);

      const cell = getCell(1, 0);
      cell.focus();
      fireUserEvent.mousePress(cell);

      fireEvent.keyDown(cell, { key: 'Shift' });
      fireEvent.click(getCell(1, 4), { shiftKey: true });

      paste(cell, ['0', 'Nike', 'Shoes', '$120', '4.0'].join('\t'));

      await waitFor(() => {
        expect(getColumnValues(1)).to.deep.equal(['Nike', 'Nike', 'Puma']);
      });
      expect(getColumnValues(2)).to.deep.equal(['Shoes', 'Shoes', 'Shoes']);
      expect(getColumnValues(3)).to.deep.equal(['$120', '$100', '$90']);
      expect(getColumnValues(4)).to.deep.equal(['4.0', '4.0', '4.9']);
    });

    it('should call `processRowUpdate` with each row impacted by the paste', async () => {
      const processRowUpdateSpy = spy((newRow) => {
        return newRow;
      });
      render(<Test processRowUpdate={processRowUpdateSpy} />);

      const cell = getCell(0, 1);
      cell.focus();
      fireUserEvent.mousePress(cell);

      fireEvent.keyDown(cell, { key: 'Shift' });
      fireEvent.click(getCell(2, 2), { shiftKey: true });

      paste(cell, '12');

      await waitFor(() => {
        expect(getCell(2, 2).textContent).to.equal('12');
      });

      expect(processRowUpdateSpy.callCount).to.equal(3);
      expect(processRowUpdateSpy.args).to.deep.equal([
        [
          { id: 0, currencyPair: '12', price1M: '12' }, // new row
          { id: 0, currencyPair: 'USDGBP', price1M: 1 }, // old row
        ],
        [
          { id: 1, currencyPair: '12', price1M: '12' }, // new row
          { id: 1, currencyPair: 'USDEUR', price1M: 11 }, // old row
        ],
        [
          { id: 2, currencyPair: '12', price1M: '12' }, // new row
          { id: 2, currencyPair: 'GBPEUR', price1M: 21 }, // old row
        ],
      ]);
    });

    it('should use the returned value from `processRowUpdate`', async () => {
      render(
        <Test
          processRowUpdate={(newRow) => {
            return { ...newRow, currencyPair: '123' };
          }}
        />,
      );

      await waitFor(() => {
        expect(getColumnValues(1)).to.deep.equal(['USDGBP', 'USDEUR', 'GBPEUR', 'JPYUSD']);
      });

      const cell = getCell(0, 1);
      cell.focus();
      fireUserEvent.mousePress(cell);

      paste(cell, '12');

      await waitFor(() => {
        expect(getColumnValues(1)).to.deep.equal(['123', 'USDEUR', 'GBPEUR', 'JPYUSD']);
      });
    });

    it('should not update the row if `processRowUpdate` throws an error', async () => {
      render(
        <Test
          processRowUpdate={() => {
            throw new Error();
          }}
          onProcessRowUpdateError={() => {}} // suppress error
        />,
      );

      await waitFor(() => {
        expect(getColumnValues(1)).to.deep.equal(['USDGBP', 'USDEUR', 'GBPEUR', 'JPYUSD']);
      });

      const cell = getCell(0, 1);
      cell.focus();
      fireUserEvent.mousePress(cell);

      paste(cell, '12');

      // wait to make sure that the row is not updated
      await sleep(200);
      await waitFor(() => {
        expect(getColumnValues(1)).to.deep.equal(['USDGBP', 'USDEUR', 'GBPEUR', 'JPYUSD']);
      });
    });

    it('should not update the row if `processRowUpdate` returns a rejected promise', async () => {
      render(
        <Test
          processRowUpdate={() => {
            return Promise.reject();
          }}
          onProcessRowUpdateError={() => {}} // suppress error
        />,
      );

      await waitFor(() => {
        expect(getColumnValues(1)).to.deep.equal(['USDGBP', 'USDEUR', 'GBPEUR', 'JPYUSD']);
      });

      const cell = getCell(0, 1);
      cell.focus();
      fireUserEvent.mousePress(cell);

      paste(cell, '12');

      // wait to make sure that the row is not updated
      await sleep(200);
      await waitFor(() => {
        expect(getColumnValues(1)).to.deep.equal(['USDGBP', 'USDEUR', 'GBPEUR', 'JPYUSD']);
      });
    });

    it('should call `onProcessRowUpdateError` if `processRowUpdate` fails', async () => {
      const onProcessRowUpdateError = spy();
      const error = new Error('Something went wrong');
      render(
        <Test
          processRowUpdate={() => {
            throw error;
          }}
          onProcessRowUpdateError={onProcessRowUpdateError}
        />,
      );

      await waitFor(() => {
        expect(getColumnValues(1)).to.deep.equal(['USDGBP', 'USDEUR', 'GBPEUR', 'JPYUSD']);
      });

      const cell = getCell(0, 1);
      cell.focus();
      fireUserEvent.mousePress(cell);

      paste(cell, '12');

      await waitFor(() => {
        expect(onProcessRowUpdateError.callCount).to.equal(1);
      });
      expect(onProcessRowUpdateError.args[0][0]).to.equal(error);
    });

    it('should emit clipboard paste events', async () => {
      const calls: string[] = [];
      const onClipboardPasteStartSpy = spy(() => {
        calls.push('onClipboardPasteStart');
      });
      const onClipboardPasteEndSpy = spy(() => {
        calls.push('onClipboardPasteEnd');
      });
      const processRowUpdateSpy = spy((newRow) => {
        calls.push('processRowUpdate');
        return newRow;
      });
      render(
        <Test
          onClipboardPasteStart={onClipboardPasteStartSpy}
          onClipboardPasteEnd={onClipboardPasteEndSpy}
          processRowUpdate={processRowUpdateSpy}
        />,
      );

      const cell = getCell(0, 1);
      cell.focus();
      fireUserEvent.mousePress(cell);

      fireEvent.keyDown(cell, { key: 'Shift' });
      fireEvent.click(getCell(0, 2), { shiftKey: true });

      const clipboardData = '12';
      paste(cell, clipboardData);

      await waitFor(() => {
        expect(getCell(0, 2).textContent).to.equal('12');
      });
      expect(calls).to.deep.equal([
        'onClipboardPasteStart',
        'processRowUpdate',
        'onClipboardPasteEnd',
      ]);
    });

    describe('should copy and paste cell value', () => {
      let clipboardData = '';
      const writeText = (data: string) => {
        clipboardData = data;
        return Promise.resolve();
      };
      let writeTextStub: SinonStub;

      const stubClipboard = () => {
        writeTextStub = stub(navigator.clipboard, 'writeText').callsFake(writeText);
      };

      afterEach(function afterEachHook() {
        writeTextStub.restore();
        clipboardData = '';
      });

      function CopyPasteTest(props: DataGridPremiumProps) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium rowSelection={false} ignoreValueFormatterDuringExport {...props} />
          </div>
        );
      }

      function copyCell(cell: HTMLElement) {
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
      }

      function pasteIntoCell(cell: HTMLElement) {
        cell.focus();
        fireUserEvent.mousePress(cell);
        paste(cell, clipboardData);
      }

      it('column type: string', async () => {
        const rows = [
          { id: 0, brand: 'Nike' },
          { id: 1, brand: 'Adidas' },
        ];
        const columns: GridColDef[] = [
          { field: 'id' },
          { field: 'brand', type: 'string', editable: true },
        ];

        render(<CopyPasteTest columns={columns} rows={rows} />);
        // Call after render to override the `@testing-library/user-event` stub
        stubClipboard();

        const sourceCell = getCell(0, 1);
        const targetCell = getCell(1, 1);
        await waitFor(() => expect(targetCell.textContent).not.to.equal(sourceCell.textContent));

        copyCell(sourceCell);
        pasteIntoCell(targetCell);

        await waitFor(() => expect(targetCell.textContent).to.equal(sourceCell.textContent));
      });

      it('column type: number', async () => {
        const rows = [
          { id: 0, price: 100000 },
          { id: 1, price: 120000 },
        ];
        const columns: GridColDef[] = [
          { field: 'id' },
          { field: 'price', type: 'number', editable: true },
        ];

        render(<CopyPasteTest columns={columns} rows={rows} />);
        // Call after render to override the `@testing-library/user-event` stub
        stubClipboard();

        const sourceCell = getCell(0, 1);
        const targetCell = getCell(1, 1);
        await waitFor(() => expect(targetCell.textContent).not.to.equal(sourceCell.textContent));

        copyCell(sourceCell);
        pasteIntoCell(targetCell);

        await waitFor(() => expect(targetCell.textContent).to.equal(sourceCell.textContent));
      });

      it('column type: boolean', async () => {
        const rows = [
          { id: 0, isAdmin: false },
          { id: 1, isAdmin: true },
        ];
        const columns: GridColDef[] = [
          { field: 'id' },
          { field: 'isAdmin', type: 'boolean', editable: true },
        ];

        render(<CopyPasteTest columns={columns} rows={rows} />);
        // Call after render to override the `@testing-library/user-event` stub
        stubClipboard();

        const sourceCell = getCell(0, 1);
        const targetCell = getCell(1, 1);

        await waitFor(() => {
          expect(targetCell.querySelector('svg')!.getAttribute('data-value')).not.to.equal(
            sourceCell.querySelector('svg')!.getAttribute('data-value'),
          );
        });

        copyCell(sourceCell);
        pasteIntoCell(targetCell);

        await waitFor(() => {
          expect(targetCell.querySelector('svg')!.getAttribute('data-value')).to.equal(
            sourceCell.querySelector('svg')!.getAttribute('data-value'),
          );
        });
      });

      it('column type: date', async () => {
        const rows = [
          { id: 0, date: new Date(2023, 3, 17) },
          { id: 1, date: new Date(2022, 2, 26) },
        ];
        const columns: GridColDef[] = [
          { field: 'id' },
          { field: 'date', type: 'date', editable: true },
        ];

        render(<CopyPasteTest columns={columns} rows={rows} />);
        // Call after render to override the `@testing-library/user-event` stub
        stubClipboard();

        const sourceCell = getCell(0, 1);
        const targetCell = getCell(1, 1);
        await waitFor(() => expect(targetCell.textContent).not.to.equal(sourceCell.textContent));

        copyCell(sourceCell);
        pasteIntoCell(targetCell);

        await waitFor(() => expect(targetCell.textContent).to.equal(sourceCell.textContent));
      });

      it('column type: dateTime', async () => {
        const rows = [
          { id: 0, dateTime: new Date(2023, 3, 17, 15, 45) },
          { id: 1, dateTime: new Date(2022, 2, 26, 9, 12) },
        ];
        const columns: GridColDef[] = [
          { field: 'id' },
          { field: 'dateTime', type: 'dateTime', editable: true },
        ];

        render(<CopyPasteTest columns={columns} rows={rows} />);
        // Call after render to override the `@testing-library/user-event` stub
        stubClipboard();

        const sourceCell = getCell(0, 1);
        const targetCell = getCell(1, 1);
        await waitFor(() => expect(targetCell.textContent).not.to.equal(sourceCell.textContent));

        copyCell(sourceCell);
        pasteIntoCell(targetCell);

        await waitFor(() => expect(targetCell.textContent).to.equal(sourceCell.textContent));
      });

      it('column type: singleSelect', async () => {
        const rows = [
          { id: 0, value: 'Three' },
          { id: 1, value: 'One' },
        ];
        const columns: GridColDef[] = [
          { field: 'id' },
          {
            field: 'value',
            type: 'singleSelect',
            valueOptions: ['One', 'Two', 'Three'],
            editable: true,
          },
        ];

        render(<CopyPasteTest columns={columns} rows={rows} />);
        // Call after render to override the `@testing-library/user-event` stub
        stubClipboard();

        const sourceCell = getCell(0, 1);
        const targetCell = getCell(1, 1);
        await waitFor(() => expect(targetCell.textContent).not.to.equal(sourceCell.textContent));

        copyCell(sourceCell);
        pasteIntoCell(targetCell);

        await waitFor(() => expect(targetCell.textContent).to.equal(sourceCell.textContent));
      });

      it('column type: singleSelect advanced', async () => {
        const rows = [
          { id: 0, size: { size: 'M', sizeNumber: 10 } },
          { id: 1, size: { size: 'L', sizeNumber: 12 } },
        ];
        const sizes = [
          { size: 'S', sizeNumber: 8 },
          { size: 'M', sizeNumber: 10 },
          { size: 'L', sizeNumber: 12 },
        ];
        const columns: GridColDef[] = [
          { field: 'id' },
          {
            field: 'size',
            type: 'singleSelect',
            valueOptions: sizes,
            valueGetter: (value: { size: number }) => value.size,
            valueSetter: (value: string, row) => {
              const size = sizes.find((option) => option.size === value);
              return { ...row, size };
            },
            getOptionValue: (option: any) => option.size,
            getOptionLabel: (option: any) => option.size,
            editable: true,
          },
        ];

        render(<CopyPasteTest columns={columns} rows={rows} />);
        // Call after render to override the `@testing-library/user-event` stub
        stubClipboard();

        const sourceCell = getCell(0, 1);
        const targetCell = getCell(1, 1);
        await waitFor(() => expect(targetCell.textContent).not.to.equal(sourceCell.textContent));

        copyCell(sourceCell);
        pasteIntoCell(targetCell);

        await waitFor(() => expect(targetCell.textContent).to.equal(sourceCell.textContent));
      });
    });

    it('should use `splitClipboardPastedText` prop to parse the clipboard string', async () => {
      const cellDelimiter = ',';
      const rowDelimiter = ';\n';

      const splitClipboardText = (text: string) =>
        text.split(rowDelimiter).map((row) => row.split(cellDelimiter));

      render(<Test rowLength={5} colLength={5} splitClipboardPastedText={splitClipboardText} />);

      const cell = getCell(0, 1);
      cell.focus();
      fireUserEvent.mousePress(cell);

      fireEvent.keyDown(cell, { key: 'Shift' });
      fireEvent.click(getCell(2, 2), { shiftKey: true });

      const clipboardData = [
        ['01', '02'],
        ['11', '12'],
        ['21', '22'],
      ]
        .map((row) => row.join(cellDelimiter))
        .join(rowDelimiter);
      paste(cell, clipboardData);

      // selected cells should be updated
      await waitFor(() => {
        expect(getCell(0, 1)).to.have.text('01');
      });
      expect(getCell(0, 2)).to.have.text('02');
      expect(getCell(1, 1)).to.have.text('11');
      expect(getCell(1, 2)).to.have.text('12');
      expect(getCell(2, 1)).to.have.text('21');
      expect(getCell(2, 2)).to.have.text('22');
    });

    it('should remove the last line break when pasting', async () => {
      render(<Test rowLength={5} colLength={5} />);

      const cell = getCell(0, 1);
      cell.focus();
      fireUserEvent.mousePress(cell);

      let clipboardData = ['01', '11'].join('\n');
      // Add newline at the end
      clipboardData += '\n';

      paste(cell, clipboardData);

      await waitFor(() => {
        expect(getCell(0, 1)).to.have.text('01');
      });
      expect(getCell(1, 1)).to.have.text('11');
      // Should not be empty
      expect(getCell(2, 1)).to.have.text('GBPEUR');
    });
  });
});
