import * as React from 'react';
import { XGrid, useApiRef, ApiRef } from '@material-ui/x-grid';
import { createClientRenderStrictMode } from 'test/utils';
import { expect } from 'chai';
import { getColumnHeaders } from 'test/utils/helperFn';

describe('<XGrid /> - Reorder', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  it('should not reset the column order when a prop change', () => {
    let apiRef: ApiRef;
    const rows = [{ id: 0, brand: 'Nike' }];
    const columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];

    const Test = () => {
      apiRef = useApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid apiRef={apiRef} rows={rows} columns={columns} onPageChange={() => {}} />
        </div>
      );
    };

    const { forceUpdate } = render(<Test />);
    expect(getColumnHeaders()).to.deep.equal(['brand', 'desc', 'type']);
    apiRef!.current.moveColumn('brand', 2);
    expect(getColumnHeaders()).to.deep.equal(['desc', 'type', 'brand']);
    forceUpdate(); // test stability
    expect(getColumnHeaders()).to.deep.equal(['desc', 'type', 'brand']);
  });
});
