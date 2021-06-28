import * as React from 'react';
import {
  createClientRenderStrictMode,
} from 'test/utils';
import { expect } from 'chai';
import { DataGrid } from '@material-ui/data-grid';
import {getColumnHeaderCell} from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Column Headers', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    autoHeight: isJSDOM,
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

  describe('headerClassName', () => {
    it('should append the CSS class defined in headerClassName', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid {...baselineProps} columns={[{ field: 'brand', headerClassName: 'foobar' }]} />
        </div>,
      );
      expect(getColumnHeaderCell(0)).to.have.class('foobar');
    });

    it('should append the CSS class returned by headerClassName', () => {
      render(
        <div style={{ width: 300, height: 500 }}>
          <DataGrid
            {...baselineProps}
            columns={[{ field: 'brand', headerClassName: () => 'foobar' }]}
          />
        </div>,
      );
      expect(getColumnHeaderCell(0)).to.have.class('foobar');
    });
  });
});
