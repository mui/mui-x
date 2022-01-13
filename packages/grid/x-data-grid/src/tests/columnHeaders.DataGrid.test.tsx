import * as React from 'react';
import { createRenderer, fireEvent } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { DataGrid } from '@mui/x-data-grid';
import { getColumnHeaderCell, getColumnHeadersTextContent } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Column Headers', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  const baselineProps = {
    autoHeight: isJSDOM,
    rows: [
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

  describe('header menu', () => {
    it('should allow to hide column', () => {
      const { getByRole, getAllByLabelText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={[{ field: 'id' }, { field: 'brand', headerClassName: 'foobar' }]}
          />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);

      fireEvent.click(getAllByLabelText('Menu')[0]);
      fireEvent.click(getByRole('menuitem', { name: 'Hide' }));

      clock.runToLast();
      expect(getColumnHeadersTextContent()).to.deep.equal(['brand']);
    });

    it('should not allow to hide the only visible column', () => {
      const { getByRole, getAllByLabelText } = render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            columns={[{ field: 'id' }, { field: 'brand', headerClassName: 'foobar', hide: true }]}
          />
        </div>,
      );

      expect(getColumnHeadersTextContent()).to.deep.equal(['id']);

      fireEvent.click(getAllByLabelText('Menu')[0]);

      const hideButton = getByRole('menuitem', { name: 'Hide' });
      /**
       * Clicking disabled `ButtonBase` as `li` element would
       * call onClick handler in testing environment.
       * It doesn't happen with user click in browser.
       * So instead of firing click event, we only check `aria-disabled` here.
       */
      expect(hideButton.getAttribute('aria-disabled')).to.equal('true');
    });
  });
});
