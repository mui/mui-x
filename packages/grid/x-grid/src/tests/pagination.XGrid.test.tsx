import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  act,
} from 'test/utils';
import { getColumnValues } from 'test/utils/helperFn';
import * as React from 'react';
import { expect } from 'chai';
import { XGrid, useGridApiRef } from '@material-ui/x-grid';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<XGrid /> - Pagination', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

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
    columns: [{ field: 'brand', width: 100 }],
  };

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

    expect(getColumnValues()).to.deep.equal(['Nike']);
    act(() => {
      apiRef.current.setPage(1);
    });

    expect(getColumnValues()).to.deep.equal(['Adidas']);
  });
});
