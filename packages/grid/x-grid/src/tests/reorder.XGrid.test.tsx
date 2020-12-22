import * as React from 'react';
import { expect } from 'chai';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  act,
} from 'test/utils';
import { getColumnHeaders, raf } from 'test/utils/helperFn';
import { ApiRef, useApiRef, XGrid } from '@material-ui/x-grid';

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
      let apiRef: ApiRef;

      const TestCase = (props: { width: number }) => {
        const { width } = props;
        apiRef = useApiRef();
        return (
          <div style={{ width, height: 300 }}>
            <XGrid apiRef={apiRef} columns={baselineProps.columns} rows={baselineProps.rows} />
          </div>
        );
      };

      const { setProps } = render(<TestCase width={300} />);

      expect(getColumnHeaders()).to.deep.equal(['id', 'brand']);
      act(() => {
        apiRef!.current.moveColumn('id', 1);
      });
      setProps({ width: 200 });
      await raf();
      expect(getColumnHeaders()).to.deep.equal(['brand', 'id']);
    });
  });
});
