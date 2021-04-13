import * as React from 'react';
import { createClientRenderStrictMode } from 'test/utils';
import { expect } from 'chai';
import {
  GridApiRef,
  GridComponentProps,
  useGridApiRef,
  XGrid,
  GRID_SELECTION_CHANGED,
} from '@material-ui/x-grid';

describe('<XGrid /> - Selection', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  describe('getSelectedRows', () => {
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
      columns: [{ field: 'brand' }],
    };

    it('should always return the latest values', () => {
      let apiRef: GridApiRef;
      const Test = (props: Partial<GridComponentProps>) => {
        apiRef = useGridApiRef();
        return (
          <div style={{ width: 300, height: 300 }}>
            <XGrid apiRef={apiRef} {...baselineProps} {...props} />
          </div>
        );
      };
      render(<Test />);
      expect(apiRef!.current.getSelectedRows().size).to.equal(0);
      apiRef!.current.on(GRID_SELECTION_CHANGED, () => {
        expect(apiRef!.current.getSelectedRows().size).to.equal(1);
        // TODO remove cast to string once state.selection is converted to Map
        expect(apiRef!.current.getSelectedRows().get('1')).to.equal(baselineProps.rows[1]);
      });
      apiRef!.current.selectRow(1);
    });
  });
});
