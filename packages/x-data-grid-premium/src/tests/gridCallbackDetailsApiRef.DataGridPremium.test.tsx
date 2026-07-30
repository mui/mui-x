import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, act } from '@mui/internal-test-utils';
import {
  DataGridPremium,
  useGridApiRef,
  gridRowGroupingSanitizedModelSelector,
} from '@mui/x-data-grid-premium';
import type { DataGridPremiumProps, GridApiPremium, GridRowsProp } from '@mui/x-data-grid-premium';

describe('<DataGridPremium /> - GridCallbackDetails apiRef', () => {
  const { render } = createRenderer();

  const rows: GridRowsProp = [
    { id: 0, category: 'Cat A' },
    { id: 1, category: 'Cat B' },
  ];

  const columns = [{ field: 'id' }, { field: 'category' }];

  let apiRef: RefObject<GridApiPremium | null>;

  function TestCase(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium apiRef={apiRef} rows={rows} columns={columns} {...props} />
      </div>
    );
  }

  it('should expose a Premium-typed apiRef on onRowGroupingModelChange', () => {
    let receivedApiRef: RefObject<GridApiPremium> | null = null;
    render(
      <TestCase
        onRowGroupingModelChange={(model, details) => {
          receivedApiRef = details.apiRef;
        }}
      />,
    );

    act(() => apiRef.current?.setRowGroupingModel(['category']));

    expect(receivedApiRef).not.to.equal(null);
    expect(gridRowGroupingSanitizedModelSelector(receivedApiRef!)).to.deep.equal(['category']);
  });
});
