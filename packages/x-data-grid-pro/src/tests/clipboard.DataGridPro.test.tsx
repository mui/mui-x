import * as React from 'react';
import { GridApi, useGridApiRef, DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { SinonSpy, spy } from 'sinon';
import { getCell } from 'test/utils/helperFn';
import { fireUserEvent } from 'test/utils/fireUserEvent';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Clipboard', () => {
  const { render } = createRenderer();

  const baselineProps = {
    autoHeight: isJSDOM,
  };

  const columns = [{ field: 'id' }, { field: 'brand', headerName: 'Brand' }];

  let apiRef: React.MutableRefObject<GridApi>;

  function Test(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          {...baselineProps}
          apiRef={apiRef}
          columns={columns}
          rows={[
            { id: 0, brand: 'Nike' },
            { id: 1, brand: 'Adidas' },
            { id: 2, brand: 'Puma' },
          ]}
          {...props}
        />
      </div>
    );
  }

  describe('copy to clipboard', () => {
    let writeText: SinonSpy | undefined;

    afterEach(function afterEachHook() {
      writeText?.restore();
    });

    ['ctrlKey', 'metaKey'].forEach((key) => {
      it(`should copy the selected rows to the clipboard when ${key} + C is pressed`, () => {
        render(<Test disableRowSelectionOnClick />);

        writeText = spy(navigator.clipboard, 'writeText');

        act(() => apiRef.current.selectRows([0, 1]));
        const cell = getCell(0, 0);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'c', keyCode: 67, [key]: true });
        expect(writeText.firstCall.args[0]).to.equal(['0\tNike', '1\tAdidas'].join('\r\n'));
      });
    });

    it('should not escape double quotes when copying a single cell to clipboard', () => {
      render(
        <Test
          columns={[{ field: 'value' }]}
          rows={[{ id: 0, value: '1 " 1' }]}
          disableRowSelectionOnClick
        />,
      );

      writeText = spy(navigator.clipboard, 'writeText');

      const cell = getCell(0, 0);
      cell.focus();
      fireUserEvent.mousePress(cell);

      fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
      expect(writeText.lastCall.firstArg).to.equal('1 " 1');
    });

    it('should not escape double quotes when copying rows to clipboard', () => {
      render(
        <Test
          columns={[{ field: 'value' }]}
          rows={[
            { id: 0, value: '1 " 1' },
            { id: 1, value: '2' },
          ]}
          disableRowSelectionOnClick
        />,
      );

      writeText = spy(navigator.clipboard, 'writeText');

      act(() => apiRef.current.selectRows([0, 1]));
      const cell = getCell(0, 0);
      fireUserEvent.mousePress(cell);
      fireEvent.keyDown(cell, { key: 'c', keyCode: 67, ctrlKey: true });
      expect(writeText.firstCall.args[0]).to.equal(['1 " 1', '2'].join('\r\n'));
    });
  });
});
