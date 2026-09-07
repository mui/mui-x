import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, act } from '@mui/internal-test-utils';
import {
  DataGridPro,
  useGridApiRef,
  gridDetailPanelExpandedRowIdsSelector,
} from '@mui/x-data-grid-pro';
import type { DataGridProProps, GridApiPro, GridRowId } from '@mui/x-data-grid-pro';
import { getBasicGridData } from '@mui/x-data-grid-generator';
import { describe, it, expect } from 'vitest';

describe('<DataGridPro /> - GridCallbackDetails apiRef', () => {
  const { render } = createRenderer();

  const defaultData = getBasicGridData(4, 2);

  let apiRef: RefObject<GridApiPro | null>;

  function TestCase(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro apiRef={apiRef} {...defaultData} {...props} />
      </div>
    );
  }

  it('should expose a Pro-typed apiRef on onDetailPanelExpandedRowIdsChange', () => {
    let receivedApiRef: RefObject<GridApiPro> | null = null;
    render(
      <TestCase
        getDetailPanelContent={() => <div>Detail</div>}
        onDetailPanelExpandedRowIdsChange={(ids, details) => {
          receivedApiRef = details.apiRef;
        }}
      />,
    );

    act(() => apiRef.current?.toggleDetailPanel(0));

    expect(receivedApiRef).not.to.equal(null);
    expect(gridDetailPanelExpandedRowIdsSelector(receivedApiRef!)).to.deep.equal(
      new Set<GridRowId>([0]),
    );
  });

  it('should expose a Pro-typed apiRef on onCellModesModelChange (editing hook path)', () => {
    let receivedApiRef: RefObject<GridApiPro> | null = null;
    render(
      <TestCase
        columns={defaultData.columns.map((column) =>
          column.field === 'currencyPair' ? { ...column, editable: true } : column,
        )}
        onCellModesModelChange={(model, details) => {
          receivedApiRef = details.apiRef;
        }}
      />,
    );

    act(() => apiRef.current?.startCellEditMode({ id: 0, field: 'currencyPair' }));

    expect(receivedApiRef).not.to.equal(null);
    expect(receivedApiRef!.current).to.equal(apiRef.current);
  });

  it('should expose a Pro-typed apiRef on a community-inherited callback (onFilterModelChange)', () => {
    let expandedRowIds: Set<GridRowId> | null = null;
    render(
      <TestCase
        getDetailPanelContent={() => <div>Detail</div>}
        onFilterModelChange={(model, details) => {
          // A Pro selector must accept the apiRef of a callback declared in the community props.
          expandedRowIds = gridDetailPanelExpandedRowIdsSelector(details.apiRef);
        }}
      />,
    );

    act(() => apiRef.current?.toggleDetailPanel(0));
    act(() =>
      apiRef.current?.setFilterModel({
        items: [{ field: 'id', operator: '>', value: '0' }],
      }),
    );

    expect(expandedRowIds).to.deep.equal(new Set<GridRowId>([0]));
  });
});
