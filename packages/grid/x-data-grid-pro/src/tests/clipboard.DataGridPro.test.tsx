import * as React from 'react';
import { GridApi, useGridApiRef, DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';
import { createRenderer, fireEvent } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { stub } from 'sinon';
import { getCell } from 'test/utils/helperFn';

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
          {...props}
        />
      </div>
    );
  }

  describe('copySelectedRowsToClipboard', () => {
    let writeText;

    beforeEach(function beforeEachHook() {
      writeText = stub().resolves();

      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        writable: true,
      });
    });

    afterEach(function afterEachHook() {
      Object.defineProperty(navigator, 'clipboard', { value: undefined });
    });

    it('should copy the selected rows to the clipboard', () => {
      render(<Test />);
      apiRef.current.selectRows([0, 1]);
      apiRef.current.unstable_copySelectedRowsToClipboard();
      expect(writeText.firstCall.args[0]).to.equal(['0\tNike', '1\tAdidas'].join('\r\n'));
    });

    it('should include the headers when includeHeaders=true', () => {
      render(<Test />);
      apiRef.current.selectRows([0, 1]);
      apiRef.current.unstable_copySelectedRowsToClipboard(true);
      expect(writeText.firstCall.args[0]).to.equal(
        ['id\tBrand', '0\tNike', '1\tAdidas'].join('\r\n'),
      );
    });

    ['ctrlKey', 'metaKey'].forEach((key) => {
      it(`should copy the selected rows to the clipboard when ${key} + C is pressed`, () => {
        render(<Test disableSelectionOnClick />);
        apiRef.current.selectRows([0, 1]);
        const cell = getCell(0, 0);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'c', keyCode: 67, [key]: true });
        expect(writeText.firstCall.args[0]).to.equal(['0\tNike', '1\tAdidas'].join('\r\n'));
      });
    });

    it(`should copy the selected rows and headers to the clipboard when Alt + C is pressed`, () => {
      render(<Test />);
      apiRef.current.selectRows([0, 1]);
      const cell = getCell(0, 0);
      fireEvent.mouseUp(cell);
      fireEvent.click(cell);
      fireEvent.keyDown(cell, { key: 'c', keyCode: 67, altKey: true });
      expect(writeText.callCount).to.equal(1, "writeText wasn't called");
      expect(writeText.firstCall.args[0]).to.equal(['id\tBrand', '0\tNike'].join('\r\n'));
    });
  });
});
