import * as React from 'react';
import { spy } from 'sinon';
import {
  DataGrid,
  GridFilterPanelBase,
  GridPreferencePanelsValue,
  gridFilterModelSelector,
  useGridApiContext,
} from '@mui/x-data-grid';
import type { DataGridProps, GridFilterModel, GridFilterPanelProps } from '@mui/x-data-grid';
import { createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { getColumnValues, getSelectByName } from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

function setOperatorValue(operator: string) {
  fireEvent.change(getSelectByName('Operator'), {
    target: { value: operator },
  });
}

/**
 * A controlled filter panel that keeps the edited (draft) filter model outside of the grid state
 * and only syncs it to the grid when the `Apply` button is clicked.
 */
type ControlledFilterPanelProps = GridFilterPanelProps & {
  onDraftChange?: (model: GridFilterModel, reason?: string) => void;
  onClose?: () => void;
};

function ControlledFilterPanel(props: ControlledFilterPanelProps) {
  const apiRef = useGridApiContext();
  const { onDraftChange, ...other } = props;
  const [draftModel, setDraftModel] = React.useState<GridFilterModel>(() =>
    gridFilterModelSelector(apiRef),
  );

  const handleFilterModelChange = (model: GridFilterModel, reason?: string) => {
    setDraftModel(model);
    onDraftChange?.(model, reason);
  };

  return (
    <div>
      <GridFilterPanelBase
        {...other}
        filterModel={draftModel}
        onFilterModelChange={handleFilterModelChange}
      />
      <button type="button" onClick={() => apiRef.current.setFilterModel(draftModel)}>
        Apply
      </button>
    </div>
  );
}

describe('<DataGrid /> - Filter panel base (controlled)', () => {
  const { render } = createRenderer();

  const baselineProps: DataGridProps = {
    autoHeight: isJSDOM,
    disableVirtualization: true,
    rows: [
      { id: 0, brand: 'Nike', isPublished: false },
      { id: 1, brand: 'Adidas', isPublished: true },
      { id: 2, brand: 'Puma', isPublished: true },
    ],
    columns: [{ field: 'brand' }, { field: 'isPublished', type: 'boolean' }],
  };

  function TestCase(props: Partial<DataGridProps>) {
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid {...baselineProps} {...props} />
      </div>
    );
  }

  it('should not change the grid filter model until the draft is applied', () => {
    const onDraftChange = spy();
    render(
      <TestCase
        slots={{ filterPanel: ControlledFilterPanel }}
        slotProps={{ filterPanel: { onDraftChange } as any }}
        initialState={{
          filter: {
            filterModel: { items: [{ field: 'isPublished', operator: 'is' }] },
          },
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />,
    );

    // No value yet: all rows are visible.
    expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);

    // Editing the panel updates the draft...
    fireEvent.change(getSelectByName('Value'), { target: { value: 'true' } });
    expect(onDraftChange.callCount).to.be.greaterThan(0);

    // ...but the grid is not filtered yet.
    expect(getColumnValues(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);

    // Applying the draft filters the grid.
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);
  });

  it('should report edits through onFilterModelChange without mutating the grid state', () => {
    const onDraftChange = spy();
    const onFilterModelChange = spy();
    render(
      <TestCase
        slots={{ filterPanel: ControlledFilterPanel }}
        slotProps={{ filterPanel: { onDraftChange } as any }}
        onFilterModelChange={onFilterModelChange}
        initialState={{
          filter: {
            filterModel: { items: [{ field: 'brand', operator: 'contains', value: 'a' }] },
          },
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />,
    );

    // The grid filters by `brand contains 'a'` initially.
    expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);

    setOperatorValue('equals');

    // The draft received the change with the upsert reason.
    expect(onDraftChange.lastCall.args[0].items[0].operator).to.equal('equals');
    expect(onDraftChange.lastCall.args[1]).to.equal('upsertFilterItem');

    // The grid's own filter model was not touched (it stays controlled by the draft):
    // its onFilterModelChange never fired and the rows keep matching the original model.
    expect(onFilterModelChange.callCount).to.equal(0);
    expect(getColumnValues(0)).to.deep.equal(['Adidas', 'Puma']);
  });

  it('should call onClose when the last valid filter is removed', () => {
    const onClose = spy();
    render(
      <TestCase
        slots={{ filterPanel: ControlledFilterPanel }}
        slotProps={{ filterPanel: { onClose } as any }}
        initialState={{
          filter: {
            filterModel: { items: [{ field: 'brand', operator: 'contains', value: 'a' }] },
          },
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onClose.callCount).to.equal(1);
  });
});
