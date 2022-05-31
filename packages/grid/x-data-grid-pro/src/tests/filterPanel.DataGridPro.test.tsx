import * as React from 'react';
import { expect } from 'chai';
import {
  DataGridPro,
  DataGridProProps,
  gridFilterModelSelector,
  GridApi,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
// @ts-ignore Remove once the test utils are typed
import { createRenderer } from '@mui/monorepo/test/utils';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Filter panel', () => {
  const { render } = createRenderer();

  const baselineProps: DataGridProProps = {
    autoHeight: isJSDOM,
    disableVirtualization: true,
    rows: [],
    columns: [{ field: 'brand' }],
  };

  let apiRef: React.MutableRefObject<GridApi>;

  const TestCase = (props: Partial<DataGridProProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro apiRef={apiRef} {...baselineProps} {...props} />
      </div>
    );
  };

  it('should add an id and operatorValue to the filter item created when opening the filter panel', () => {
    render(<TestCase />);
    apiRef.current.showFilterPanel('brand');
    const model = gridFilterModelSelector(apiRef);
    expect(model.items).to.have.length(1);
    expect(model.items[0].id).to.not.equal(null);
    expect(model.items[0].operatorValue).to.not.equal(null);
  });
});
