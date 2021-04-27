import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
  // @ts-expect-error need to migrate helpers to TypeScript
  waitFor,
} from 'test/utils';
import { expect } from 'chai';
import { GridApiRef, GridComponentProps, useGridApiRef, XGrid } from '@material-ui/x-grid';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<XGrid /> - Columns', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  let apiRef: GridApiRef;

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
    columns: [{ field: 'brand' }],
  };

  const Test = (props: Partial<GridComponentProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid apiRef={apiRef} {...baselineProps} {...props} />
      </div>
    );
  };

  describe('showColumnMenu', () => {
    it('should open the column menu', async () => {
      render(<Test />);
      expect(screen.queryByRole('menu')).to.equal(null);
      apiRef!.current.showColumnMenu('brand');
      await waitFor(() => expect(screen.queryByRole('menu')).to.not.equal(null));
    });

    it('should set the correct id and aria-labelledby', async () => {
      render(<Test />);
      expect(screen.queryByRole('menu')).to.equal(null);
      apiRef!.current.showColumnMenu('brand');
      await waitFor(() => {
        const menu = screen.queryByRole('menu');
        expect(menu.id).to.match(/^mui-[0-9]+/);
        expect(menu.getAttribute('aria-labelledby')).to.match(/^mui-[0-9]+/);
      });
    });
  });

  describe('toggleColumnMenu', () => {
    it('should toggle the column menu', async () => {
      render(<Test />);
      expect(screen.queryByRole('menu')).to.equal(null);
      apiRef!.current.toggleColumnMenu('brand');
      await waitFor(() => expect(screen.queryByRole('menu')).to.not.equal(null));
      apiRef!.current.toggleColumnMenu('brand');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));
    });
  });
});
