import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, act, fireEvent } from '@mui/internal-test-utils';
import {
  DataGridPremium,
  useGridApiRef,
  gridRowGroupingSanitizedModelSelector,
} from '@mui/x-data-grid-premium';
import type {
  DataGridPremiumProps,
  GridApiPremium,
  GridRowGroupingModel,
  GridRowsProp,
} from '@mui/x-data-grid-premium';
import { getColumnHeaderCell } from 'test/utils/helperFn';

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

  it('should accept Premium selectors on community-inherited callbacks', () => {
    let modelFromFilterCallback: GridRowGroupingModel | null = null;
    let modelFromHeaderClick: GridRowGroupingModel | null = null;
    render(
      <TestCase
        rowGroupingModel={['category']}
        onFilterModelChange={(model, details) => {
          // Control-state callback declared in the community props interface.
          modelFromFilterCallback = gridRowGroupingSanitizedModelSelector(details.apiRef);
        }}
        onColumnHeaderClick={(params, event, details) => {
          // `GridEventListener`-based callback declared in the community props interface.
          modelFromHeaderClick = gridRowGroupingSanitizedModelSelector(details.apiRef);
        }}
      />,
    );

    fireEvent.click(getColumnHeaderCell(0));
    act(() =>
      apiRef.current?.setFilterModel({
        items: [{ field: 'category', operator: 'contains', value: 'A' }],
      }),
    );

    expect(modelFromFilterCallback).to.deep.equal(['category']);
    expect(modelFromHeaderClick).to.deep.equal(['category']);
  });
});
