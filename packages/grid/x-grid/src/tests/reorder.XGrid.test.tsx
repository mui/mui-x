import * as React from 'react';
import { expect } from 'chai';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  act,
} from 'test/utils';
import { getColumnHeadersTextContent, raf } from 'test/utils/helperFn';
import { GridApiRef, useGridApiRef, XGrid } from '@material-ui/x-grid';

describe('<XGrid /> - Reorder', () => {
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
    ],
    columns: [{ field: 'id' }, { field: 'brand' }],
  };

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  describe('Columns', () => {
    it('resizing after columns reorder should respect the new columns order', async () => {
      let apiRef: GridApiRef;

      const TestCase = (props: { width: number }) => {
        const { width } = props;
        apiRef = useGridApiRef();
        return (
          <div style={{ width, height: 300 }}>
            <XGrid apiRef={apiRef} columns={baselineProps.columns} rows={baselineProps.rows} />
          </div>
        );
      };

      const { setProps } = render(<TestCase width={300} />);

      expect(getColumnHeadersTextContent()).to.deep.equal(['id', 'brand']);
      act(() => {
        apiRef!.current.setColumnIndex('id', 1);
      });
      setProps({ width: 200 });
      await raf();
      expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'id']);
    });
  });

  it('should not reset the column order when a prop change', () => {
    let apiRef: GridApiRef;
    const rows = [{ id: 0, brand: 'Nike' }];
    const columns = [{ field: 'brand' }, { field: 'desc' }, { field: 'type' }];

    const Test = () => {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid apiRef={apiRef} rows={rows} columns={columns} onPageChange={() => {}} />
        </div>
      );
    };

    const { forceUpdate } = render(<Test />);
    expect(getColumnHeadersTextContent()).to.deep.equal(['brand', 'desc', 'type']);
    apiRef!.current.setColumnIndex('brand', 2);
    expect(getColumnHeadersTextContent()).to.deep.equal(['desc', 'type', 'brand']);
    forceUpdate(); // test stability
    expect(getColumnHeadersTextContent()).to.deep.equal(['desc', 'type', 'brand']);
  });
});
