import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent } from '@mui/internal-test-utils';
import { DataGrid, useGridApiRef, gridSortModelSelector } from '@mui/x-data-grid';
import type {
  DataGridProps,
  GridApi,
  GridApiCommon,
  GridColumnHeaderParams,
} from '@mui/x-data-grid';
import { getColumnHeaderCell } from 'test/utils/helperFn';

describe('<DataGrid /> - GridCallbackDetails apiRef', () => {
  const { render } = createRenderer();

  const baselineProps: DataGridProps = {
    rows: [
      { id: 0, brand: 'Nike' },
      { id: 1, brand: 'Adidas' },
      { id: 2, brand: 'Puma' },
    ],
    columns: [{ field: 'brand' }],
  };

  let apiRef: RefObject<GridApi | null>;

  function TestCase(props: Partial<DataGridProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid apiRef={apiRef} {...baselineProps} {...props} />
      </div>
    );
  }

  it('should expose a working apiRef on a control-state callback (onSortModelChange)', () => {
    let receivedApiRef: RefObject<GridApiCommon> | null = null;
    render(
      <TestCase
        onSortModelChange={(model, details) => {
          receivedApiRef = details.apiRef;
        }}
      />,
    );

    fireEvent.click(getColumnHeaderCell(0));

    expect(receivedApiRef).not.to.equal(null);
    expect(gridSortModelSelector(receivedApiRef!)).to.deep.equal(gridSortModelSelector(apiRef));
  });

  it('should expose a working apiRef on an event-based callback (onColumnHeaderClick)', () => {
    let receivedApiRef: RefObject<GridApiCommon> | null = null;
    let receivedParams: GridColumnHeaderParams | null = null;
    render(
      <TestCase
        onColumnHeaderClick={(params, event, details) => {
          receivedParams = params;
          receivedApiRef = details.apiRef;
        }}
      />,
    );

    fireEvent.click(getColumnHeaderCell(0));

    expect(receivedApiRef).not.to.equal(null);
    expect(receivedApiRef!.current).to.equal(apiRef.current);
    expect(receivedParams!.field).to.equal('brand');
  });

  it('should not expose the live internal apiRef, protecting the grid from corruption', () => {
    let receivedApiRef: RefObject<GridApiCommon> | null = null;
    render(
      <TestCase
        onSortModelChange={(model, details) => {
          receivedApiRef = details.apiRef;
        }}
      />,
    );

    fireEvent.click(getColumnHeaderCell(0));

    expect(receivedApiRef).not.to.equal(apiRef);

    // Reassigning `.current` on the details' apiRef must not affect the grid's own apiRef.
    (receivedApiRef as any).current = null;
    expect(apiRef.current).not.to.equal(null);
  });
});
