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

  it('should not reset the column order when onSelectionChange is binded', () => {
    let apiRef: ApiRef;
    const Test = () => {
      apiRef = useApiRef();
      const [rows] = React.useState([{ id: 0, brand: 'Nike' }]);
      const [columns] = React.useState([{ field: 'brand' }, { field: 'desc' }, { field: 'type' }]);

      const [myState, setMyState] = React.useState(false);
      const handleSelection = React.useCallback(() => {
        setMyState(!myState);
      }, [myState]);

      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            onSelectionChange={handleSelection}
          />
        </div>
      );
    };

    render(<Test />);
    expect(getColumnHeaders()).to.deep.equal(['brand', 'desc', 'type']);
    apiRef!.current.moveColumn('brand', 2);
    expect(getColumnHeaders()).to.deep.equal(['desc', 'type', 'brand']);
    fireEvent.click(getCell(0, 0));

    const row = getRow(0);
    expect(row.classList.contains('Mui-selected')).to.equal(true);
    expect(getColumnHeaders()).to.deep.equal(['desc', 'type', 'brand']);
  });
});
