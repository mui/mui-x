import * as React from 'react';
import { createClientRenderStrictMode } from 'test/utils';
import { useFakeTimers } from 'sinon';
import { expect } from 'chai';
import { getColumnValues } from 'test/utils/helperFn';
import { ApiRef, useApiRef, XGrid } from '@material-ui/x-grid';

describe('<XGrid /> - Rows ', () => {
  let clock;

  beforeEach(() => {
    clock = useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
    rows: [
      {
        clientId: 'c1',
        first: 'Mike',
        age: 11,
      },
      {
        clientId: 'c2',
        first: 'Jack',
        age: 11,
      },
      {
        clientId: 'c3',
        first: 'Mike',
        age: 20,
      },
    ],
    columns: [{ field: 'id' }, { field: 'first' }, { field: 'age' }],
  };

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  it('should not display an horizontal scrollbar', () => {
    const rows: any = [
      { id: 1, col1: 'Hello', col2: 'World' },
      { id: 2, col1: 'XGrid', col2: 'is Awesome' },
      { id: 3, col1: 'Material-UI', col2: 'is Amazing' },
      { id: 4, col1: 'Hello', col2: 'World' },
      { id: 5, col1: 'XGrid', col2: 'is Awesome' },
      { id: 6, col1: 'Material-UI', col2: 'is Amazing' },
    ];

    const columns: any[] = [
      { field: 'id', hide: true },
      { field: 'col1', headerName: 'Column 1', width: 150 },
      { field: 'col2', headerName: 'Column 2', width: 150 },
    ];
    let apiRef: ApiRef;
    const Test = () => {
      apiRef = useApiRef();
      return (
        <div style={{ height: 300, width: 600 }}>
          <XGrid rows={rows} columns={columns} apiRef={apiRef} />
        </div>
      );
    };
    render(<Test />);

    const viewport = document.querySelector('.MuiDataGrid-viewport')!;
    const scrollbarState = apiRef!.current.state.scrollBar.scrollBarSize;
    const scrollbar = apiRef!.current.state.options.scrollbarSize;

    expect(viewport.clientWidth).to.equal(583);
    expect(scrollbarState).to.deep.equal({ y: 15, x: 0 });
    expect(scrollbar).to.equal(15);
  });

  describe('getRowId', () => {
    describe('updateRows', () => {
      it('should apply getRowId before updating rows', () => {
        const getRowId = (row) => `${row.clientId}`;
        let apiRef: ApiRef;
        const Test = () => {
          apiRef = useApiRef();
          return (
            <div style={{ width: 300, height: 300 }}>
              <XGrid {...baselineProps} getRowId={getRowId} apiRef={apiRef} />
            </div>
          );
        };
        render(<Test />);
        expect(getColumnValues()).to.deep.equal(['c1', 'c2', 'c3']);
        apiRef!.current.updateRows([
          { clientId: 'c2', age: 30 },
          { clientId: 'c3', age: 31 },
        ]);
        clock.tick(100);

        expect(getColumnValues(2)).to.deep.equal(['11', '30', '31']);
      });
    });
  });
});
