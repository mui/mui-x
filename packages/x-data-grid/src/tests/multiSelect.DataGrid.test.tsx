import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { getColumnValues } from 'test/utils/helperFn';

// `multiSelect` is a Pro/Premium-only column type. Importing a Pro/Premium grid registers it in
// the shared core column-type registry, so this suite (where Pro is loaded via the test setup)
// reproduces the mixed-bundle case: a community `DataGrid` must NOT resolve the `multiSelect`
// colDef, even though it is registered globally.
describe('<DataGrid /> - Column type: multiSelect (community)', () => {
  const { render } = createRenderer();

  const columns: GridColDef[] = [
    {
      field: 'tags',
      type: 'multiSelect',
      valueOptions: ['React', 'Vue'],
    },
  ];
  const rows = [{ id: 1, tags: ['React', 'Vue'] }];

  it('does not render Pro multiSelect chips in the community DataGrid', () => {
    expect(() => {
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid rows={rows} columns={columns} />
        </div>,
      );
    }).toWarnDev(['MUI X: The `multiSelect` column type is available in Pro and Premium versions']);
    // Falls back to a plain column — no chip elements from the Pro renderer.
    expect(document.querySelectorAll('[class*="multiSelectCell"]')).to.have.length(0);
    // Renders the raw value, not the multiSelect chip formatting.
    expect(getColumnValues(0)).to.deep.equal(['React,Vue']);
  });
});
