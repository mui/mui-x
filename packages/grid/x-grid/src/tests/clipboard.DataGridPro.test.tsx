import * as React from 'react';
import { GridApiRef, useGridApiRef, DataGridPro } from '@mui/x-data-grid-pro';
import { expect } from 'chai';
import { stub } from 'sinon';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
} from 'test/utils';
import { getCell } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Clipboard', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    autoHeight: isJSDOM,
  };

  const columns = [{ field: 'id' }, { field: 'brand', headerName: 'Brand' }];

  let apiRef: GridApiRef;

  function Test() {
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

  describe('copySelectedRowsToClipboard', () => {
    let writeText;

    before(function beforeHook() {
      if (!isJSDOM) {
        // Needs permission to read the clipboard
        this.skip();
      }
    });

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
        render(<Test />);
        apiRef.current.selectRows([0, 1]);
        const cell = getCell(0, 0);
        cell.focus();
        fireEvent.keyDown(cell, { key: 'c', [key]: true });
        expect(writeText.firstCall.args[0]).to.equal(['0\tNike', '1\tAdidas'].join('\r\n'));
      });
    });
  });
});
