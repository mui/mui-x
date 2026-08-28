import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import {
  DataGrid,
  useGridApiRef,
  gridSortModelSelector,
  gridFilterModelSelector,
} from '@mui/x-data-grid';
import type {
  DataGridProps,
  GridApi,
  GridApiCommon,
  GridColumnHeaderParams,
  GridFilterModel,
} from '@mui/x-data-grid';
import { getColumnHeaderCell } from 'test/utils/helperFn';
import { describe, it, expect } from 'vitest';

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

  it('should expose a stable read-only apiRef that cannot re-point the internal ref', () => {
    const receivedApiRefs: RefObject<GridApiCommon>[] = [];
    render(
      <TestCase
        onSortModelChange={(model, details) => {
          receivedApiRefs.push(details.apiRef);
        }}
      />,
    );

    fireEvent.click(getColumnHeaderCell(0));
    fireEvent.click(getColumnHeaderCell(0));

    expect(receivedApiRefs).to.have.length(2);
    expect(receivedApiRefs[1]).to.equal(receivedApiRefs[0]);
    expect(receivedApiRefs[0]).not.to.equal(apiRef);

    // The details' apiRef is getter-based: it cannot be used to re-point the grid's internal ref.
    expect(() => {
      (receivedApiRefs[0] as any).current = null;
    }).to.throw(TypeError);
    expect(apiRef.current).not.to.equal(null);
  });

  it('should return the previous state from selectors when the model is controlled', () => {
    let callbackModel: GridFilterModel | null = null;
    let selectedModel: GridFilterModel | null = null;
    render(
      <TestCase
        filterModel={{ items: [] }}
        onFilterModelChange={(model, details) => {
          callbackModel = model;
          selectedModel = gridFilterModelSelector(details.apiRef);
        }}
      />,
    );

    act(() =>
      apiRef.current?.setFilterModel({
        items: [{ field: 'brand', operator: 'contains', value: 'Nike' }],
      }),
    );

    expect(callbackModel!.items).to.have.length(1);
    // The controlled model was not applied to the state yet, so selectors return the previous value.
    expect(selectedModel!.items).to.have.length(0);
  });
});
