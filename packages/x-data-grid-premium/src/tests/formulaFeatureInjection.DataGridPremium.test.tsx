import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, act, fireEvent, waitFor } from '@mui/internal-test-utils';
import { getCell, getColumnValues, microtasks } from 'test/utils/helperFn';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import type { DataGridPremiumProps, GridApi, GridColDef } from '@mui/x-data-grid-premium';
import { isJSDOM } from 'test/utils/skipIf';

/**
 * The formula feature is injectable (`featureDependencies={{ formula: formulaFeature }}`).
 * These tests cover the grid WITHOUT the feature: `=` values must render as raw
 * strings, every formula-adjacent code path must degrade gracefully, and the
 * dev-only diagnostics must point at the missing dependency.
 */
describe('<DataGridPremium /> - Formula feature injection', () => {
  const { render: originalRender } = createRenderer();

  const render = async (...args: Parameters<typeof originalRender>) => {
    const utils = originalRender(...args);
    await microtasks();
    return utils;
  };

  let apiRef: RefObject<GridApi | null>;

  // `allowFormulas` is deliberately absent from the baseline: using it without
  // the feature warns (asserted in its own test below), and the raw-string
  // rendering of `=` values does not depend on it.
  const baselineProps: DataGridPremiumProps = {
    autoHeight: isJSDOM,
    disableVirtualization: true,
    rows: [
      { id: 0, item: 'Apple', price: 2, quantity: 3, total: '=price * quantity' },
      { id: 1, item: 'Banana', price: 1, quantity: 5, total: '' },
    ],
    columns: [
      { field: 'item' },
      { field: 'price', type: 'number' },
      { field: 'quantity', type: 'number' },
      { field: 'total', editable: true },
    ],
  };

  const columnsWithFormulas: GridColDef[] = [
    { field: 'item' },
    { field: 'price', type: 'number' },
    { field: 'quantity', type: 'number' },
    { field: 'total', editable: true, allowFormulas: true },
  ];

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 500, height: 400 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  it('renders `=` cell values as raw strings when the feature is not provided', async () => {
    await render(<Test />);
    expect(getColumnValues(3)).to.deep.equal(['=price * quantity', '']);
  });

  it('evaluates formulas when the feature is provided', async () => {
    await render(
      <Test featureDependencies={{ formula: formulaFeature }} columns={columnsWithFormulas} />,
    );
    expect(getColumnValues(3)).to.deep.equal(['6', '']);
  });

  it('initializes an empty formula state slice when the feature is not provided', async () => {
    await render(<Test />);
    expect(apiRef.current!.state.formula).to.deep.equal({ lookup: {}, activeEdit: null });
  });

  it('warns about formula-related props used without the feature', () => {
    expect(() => {
      originalRender(<Test columns={columnsWithFormulas} />);
    }).toWarnDev(['MUI X Data Grid: Formula-related props were provided']);
    // The grid still works — `=` values render as raw strings.
    expect(getColumnValues(3)).to.deep.equal(['=price * quantity', '']);
  });

  it('warns when `featureDependencies` changes after the first render', async () => {
    const { setProps } = await render(
      <Test featureDependencies={{ formula: formulaFeature }} columns={columnsWithFormulas} />,
    );
    expect(() => {
      setProps({ featureDependencies: { formula: { ...formulaFeature } } });
    }).toWarnDev([
      'MUI X Data Grid: The `featureDependencies` prop changed after the first render',
    ]);
    // The change is ignored — the initially captured feature keeps working.
    expect(getColumnValues(3)).to.deep.equal(['6', '']);
  });

  it('does not render the formula bar without the feature', async () => {
    expect(() => {
      originalRender(<Test showToolbar slotProps={{ toolbar: { formulaBar: true } }} />);
    }).toWarnDev(['MUI X Data Grid: Formula-related props were provided']);
    expect(document.querySelector('.MuiDataGrid-formulaBar')).to.equal(null);
  });

  it('keeps the fill-down shortcut working without the feature (copies the raw value)', async () => {
    const { user } = await render(
      <Test cellSelection cellSelectionFillHandle rowSelection={false} />,
    );
    await user.click(getCell(0, 3));
    fireEvent.keyDown(getCell(0, 3), { key: 'd', keyCode: 68, ctrlKey: true });
    // Without the feature there is no formula re-anchoring — the raw string is copied.
    await waitFor(() => {
      expect(apiRef.current!.getRow(1)!.total).to.equal('=price * quantity');
    });
    expect(getColumnValues(3)).to.deep.equal(['=price * quantity', '=price * quantity']);
  });

  it('exports `=` values to Excel as plain strings without the feature', async () => {
    await render(<Test />);
    const workbook = await act(() => apiRef.current!.getDataAsExcel({ escapeFormulas: false }));
    const worksheet = workbook!.worksheets[0];
    // Not a live formula cell — the export layout seam is absent without the feature.
    expect(worksheet.getCell('D2').value).to.equal('=price * quantity');
  });
});
