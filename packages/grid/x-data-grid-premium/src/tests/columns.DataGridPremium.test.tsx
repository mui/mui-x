import * as React from 'react';
import { createRenderer, fireEvent } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import {
  DataGridPremium,
  gridClasses,
  GRID_AGGREGATION_ROOT_FOOTER_ROW_ID,
} from '@mui/x-data-grid-premium';
import { getColumnHeaderCell } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPremium /> - Columns', () => {
  const { render } = createRenderer();

  describe('resizing', () => {
    // https://github.com/mui/mui-x/issues/10078
    it('should properly resize aggregated column', function test() {
      if (isJSDOM) {
        // Need layouting
        this.skip();
      }

      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGridPremium
            rows={[
              { id: 0, brand: 'Nike' },
              { id: 1, brand: 'Adidas' },
              { id: 2, brand: 'Puma' },
            ]}
            columns={[{ field: 'brand' }]}
            initialState={{ aggregation: { model: { brand: 'size' } } }}
          />
        </div>,
      );

      const separator = document.querySelector(`.${gridClasses['columnSeparator--resizable']}`)!;
      fireEvent.mouseDown(separator, { clientX: 100 });
      fireEvent.mouseMove(separator, { clientX: 150, buttons: 1 });
      fireEvent.mouseUp(separator);

      expect(getColumnHeaderCell(0)).toHaveInlineStyle({ width: '150px' });
      const aggregationCell = document.querySelector(
        `[data-id="${GRID_AGGREGATION_ROOT_FOOTER_ROW_ID}"] [role="cell"][data-colindex="0"]`,
      );
      expect(aggregationCell?.getBoundingClientRect().width).to.equal(150);
    });
  });
});
