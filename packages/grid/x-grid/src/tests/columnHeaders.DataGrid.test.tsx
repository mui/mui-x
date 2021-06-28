import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
} from 'test/utils';
import { expect } from 'chai';
import { XGrid } from '@material-ui/x-grid';
import { getColumnHeaderCell, raf } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<XGrid /> - Column Headers', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    autoHeight: isJSDOM,
    disableColumnResize: false,
    rows: [
      {
        id: 0,
        brand: 'Nike',
        foundationYear: 1964,
      },
      {
        id: 1,
        brand: 'Adidas',
        foundationYear: 1949,
      },
      {
        id: 2,
        brand: 'Puma',
        foundationYear: 1948,
      },
    ],
  };

  describe('GridColumnHeaderMenu', () => {
    it('should close menu when resizing a column', async () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <XGrid
            {...baselineProps}
            columns={[
              { field: 'brand', resizable: true },
              { field: 'foundationYear', resizable: true },
            ]}
          />
        </div>,
      );

      expect(document.querySelectorAll('.MuiGridMenu-root')).to.have.length(0);

      fireEvent.click(getColumnHeaderCell(0).querySelector('.MuiDataGrid-menuIconButton'));

      expect(document.querySelectorAll('.MuiGridMenu-root')).to.have.length(1);

      fireEvent.mouseDown(getColumnHeaderCell(0).querySelector('.MuiDataGrid-iconSeparator'));

      await raf();

      expect(document.querySelectorAll('.MuiGridMenu-root')).to.have.length(0);
    });
  });
});
