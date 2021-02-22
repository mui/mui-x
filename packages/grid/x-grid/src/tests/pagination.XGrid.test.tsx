import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  act,
} from 'test/utils';
import * as React from 'react';
import { expect } from 'chai';
import { XGrid, useGridApiRef } from '@material-ui/x-grid';

describe('<XGrid /> - Pagination', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
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
    columns: [{ field: 'brand', width: 100 }],
  };

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  it('should apply setPage correctly', () => {
    let apiRef;
    const GridTest = () => {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid {...baselineProps} apiRef={apiRef} pagination pageSize={1} hideFooter />
        </div>
      );
    };

    render(<GridTest />);

    let cell = document.querySelector('[role="cell"][aria-colindex="0"]')!;
    expect(cell).to.have.text('Nike');
    act(() => {
      apiRef.current.setPage(1);
    });

    cell = document.querySelector('[role="cell"][aria-colindex="0"]')!;
    expect(cell).to.have.text('Adidas');
  });
});
