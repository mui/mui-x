import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
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

  function Grid(props: { columns: GridColDef[]; isCellEditable?: (params: any) => boolean }) {
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid rows={rows} columns={props.columns} isCellEditable={props.isCellEditable} />
      </div>
    );
  }

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

  it('keeps the community fallback after a watched prop changes', () => {
    let setProps: (props: Partial<React.ComponentProps<typeof Grid>>) => void;
    expect(() => {
      ({ setProps } = render(<Grid columns={columns} />));
    }).toWarnDev(['MUI X: The `multiSelect` column type is available in Pro and Premium versions']);

    expect(document.querySelectorAll('[class*="multiSelectCell"]')).to.have.length(0);

    // Change a prop watched by `useGridProps` — its effect must preserve `signature`.
    setProps!({ columns, isCellEditable: () => true });
    // Force column re-hydration so `createColumnsState` re-reads `state.props.signature`.
    setProps!({ columns: [...columns], isCellEditable: () => true });

    // Still community → must keep falling back, never resolve the globally-registered Pro renderer.
    expect(document.querySelectorAll('[class*="multiSelectCell"]')).to.have.length(0);
    expect(getColumnValues(0)).to.deep.equal(['React,Vue']);
  });
});
