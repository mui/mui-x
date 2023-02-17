import * as React from 'react';
import {
  GridApi,
  useGridApiRef,
  DataGridPremium,
  DataGridPremiumProps,
} from '@mui/x-data-grid-premium';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, fireEvent, userEvent, act } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { stub, SinonStub, spy } from 'sinon';
import { getCell } from 'test/utils/helperFn';
import { getBasicGridData } from '@mui/x-data-grid-generator';

describe('<DataGridPremium /> - Clipboard', () => {
  const { render } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;

  function Test({
    rowLength = 4,
    ...other
  }: Omit<DataGridPremiumProps, 'rows' | 'columns' | 'apiRef'> &
    Partial<Pick<DataGridPremiumProps, 'rows' | 'columns'>> & { rowLength?: number }) {
    apiRef = useGridApiRef();

    const data = React.useMemo(() => {
      const basicData = getBasicGridData(rowLength, 3);
      return {
        ...basicData,
        columns: basicData.columns.map((column) => ({ ...column, editable: true })),
      };
    }, [rowLength]);

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium
          {...data}
          {...other}
          apiRef={apiRef}
          rowSelection={false}
          unstable_cellSelection
          disableVirtualization
        />
      </div>
    );
  }

  describe('copy', () => {
    let writeText: SinonStub;
    const originalClipboard = navigator.clipboard;

    beforeEach(function beforeEachHook() {
      writeText = stub().resolves();

      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        writable: true,
      });
    });

    afterEach(function afterEachHook() {
      Object.defineProperty(navigator, 'clipboard', { value: originalClipboard });
    });

    ['ctrlKey', 'metaKey'].forEach((key) => {
      it(`should copy the selected cells to the clipboard when ${key} + C is pressed`, () => {
        render(<Test />);

        const cell = getCell(0, 0);
        cell.focus();
        userEvent.mousePress(cell);

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

      const cell = getCell(0, 0);
      cell.focus();
      userEvent.mousePress(cell);

      fireEvent.keyDown(cell, { key: 'Shift' });
      fireEvent.click(getCell(0, 2), { shiftKey: true });

      fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
      expect(writeText.firstCall.args[0]).to.equal([['0', 'USDGBP', '1'].join('\t')].join('\r\n'));
    });
  });

  describe('paste', () => {
    let readText: SinonStub;
    const originalClipboard = navigator.clipboard;

    beforeEach(function beforeEachHook() {
      readText = stub().resolves();

      Object.defineProperty(navigator, 'clipboard', {
        value: { readText },
        writable: true,
      });
    });

    afterEach(function afterEachHook() {
      Object.defineProperty(navigator, 'clipboard', { value: originalClipboard });
    });

    ['ctrlKey', 'metaKey'].forEach((key) => {
      it(`should not enter cell edit mode when ${key} + V is pressed`, () => {
        render(<Test />);

        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 1);
        userEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'v', keyCode: 86, [key]: true }); // Ctrl+V
        expect(listener.callCount).to.equal(0);
      });
    });

    it('should paste into each cell of the range when single value is pasted', async () => {
      render(<Test />);

      const clipboardData = '12';
      readText.returns(clipboardData);

      const cell = getCell(0, 1);
      cell.focus();
      userEvent.mousePress(cell);

      fireEvent.keyDown(cell, { key: 'Shift' });
      fireEvent.click(getCell(2, 2), { shiftKey: true });

      fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true }); // Ctrl+V

      await act(() => Promise.resolve());

      expect(getCell(0, 1)).to.have.text(clipboardData);
      expect(getCell(0, 2)).to.have.text(clipboardData);
      expect(getCell(1, 1)).to.have.text(clipboardData);
      expect(getCell(1, 2)).to.have.text(clipboardData);
      expect(getCell(2, 1)).to.have.text(clipboardData);
      expect(getCell(2, 2)).to.have.text(clipboardData);
    });
  });
});
