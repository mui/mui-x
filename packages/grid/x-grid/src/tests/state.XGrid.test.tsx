import * as React from 'react';
// @ts-expect-error need to migrate helpers to TypeScript
import { fireEvent, screen, createClientRenderStrictMode } from 'test/utils';
import { getColumnValues } from 'test/utils/helperFn';
import { expect } from 'chai';
import { XGrid, useGridApiRef } from '@material-ui/x-grid';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<XGrid /> - State', () => {
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

  it('should trigger on state change and pass the correct params', () => {
    let onStateParams;
    let apiRef;

    function Test() {
      apiRef = useGridApiRef();
      const onStateChange = (params) => {
        onStateParams = params;
      };

      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid {...baselineProps} onStateChange={onStateChange} apiRef={apiRef} />
        </div>
      );
    }

    render(<Test />);
    const header = screen.getByRole('columnheader', { name: 'brand' });
    fireEvent.click(header);
    // expect(onStateParams.api).to.equal(apiRef.current);
    expect(onStateParams).to.equal(apiRef.current.state);
    expect(onStateParams).to.not.equal(undefined);
  });

  it('should allow to control the state using apiRef', () => {
    function GridStateTest() {
      const apiRef = useGridApiRef();
      React.useEffect(() => {
        apiRef.current.setState((prev) => ({
          ...prev,
          sorting: { ...prev.sorting, sortModel: [{ field: 'brand', sort: 'asc' }] },
        }));
      }, [apiRef]);
      return (
        <div style={{ width: 300, height: 300 }}>
          <XGrid {...baselineProps} apiRef={apiRef} />
        </div>
      );
    }

    render(<GridStateTest />);
    expect(getColumnValues()).to.deep.equal(['Adidas', 'Nike', 'Puma']);
  });
});
