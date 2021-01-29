import * as React from 'react';
import { XGrid, useApiRef, ApiRef } from '@material-ui/x-grid';
// @ts-expect-error need to migrate helpers to TypeScript
import { fireEvent, createClientRenderStrictMode } from 'test/utils';
import { expect } from 'chai';
import { getCell, getColumnHeaders, getRow } from '../../../../../test/utils/helperFn';

describe('<XGrid /> - Selection', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  it('should not reset the column order', () => {
    let apiRef: ApiRef;
    const Test = (props) => {
      apiRef = useApiRef();

      return (
        <div style={{width: 300, height: 300}}>
          <XGrid
            apiRef={apiRef}
            rows={[
              {
                id: 0,
                brand: 'Nike',
              },
            ]}
            columns={[{field: 'brand'}, {field: 'desc'}, {field: 'type'}]}
          />
        </div>
      );
    };

    render(<Test/>);
    apiRef!.current.moveColumn('brand', 2);
    expect(getColumnHeaders()).to.deep.equal(['desc', 'type', 'brand']);
    fireEvent.click(getCell(0, 0));

    const row = getRow(0);
    expect(row.classList.contains('Mui-selected')).to.equal(true);
    expect(getColumnHeaders()).to.deep.equal(['desc', 'type', 'brand']);
  });
});
