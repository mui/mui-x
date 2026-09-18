import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent, act, screen, waitFor, within } from '@mui/internal-test-utils';
import { getCell, getColumnHeadersTextContent, microtasks } from 'test/utils/helperFn';
import {
  DataGridPremium,
  useGridApiRef,
  gridClasses,
  gridColumnFieldsSelector,
  gridSidebarStateSelector,
  GridSidebarValue,
} from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import type {
  DataGridPremiumProps,
  GridApi,
  GridComputedColumnDefinition,
  GridComputedColumnsModel,
} from '@mui/x-data-grid-premium';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';
import type { GridPrivateApiPremium } from '../models/gridApiPremium';

const define = (
  field: string,
  formula: string,
  other: Partial<GridComputedColumnDefinition> = {},
): GridComputedColumnDefinition => ({
  field,
  headerName: field,
  formula,
  type: 'number',
  ...other,
});

const total = define('total', '=price * quantity', { headerName: 'Total' });

const baselineProps: DataGridPremiumProps = {
  autoHeight: isJSDOM,
  disableVirtualization: true,
  featureDependencies: { formula: formulaFeature },
  rows: [
    { id: 0, item: 'Apple', price: 2, quantity: 3 },
    { id: 1, item: 'Banana', price: 10, quantity: 5 },
    { id: 2, item: 'Cherry', price: 4, quantity: 2 },
  ],
  columns: [
    { field: 'item' },
    { field: 'price', type: 'number' },
    { field: 'quantity', type: 'number' },
  ],
};

const PANEL_SELECTOR = `.${gridClasses.computedColumnsPanel}`;
const PREVIEW_SELECTOR = `.${gridClasses.computedColumnsPanelPreview}`;
const VALIDATION_SELECTOR = `.${gridClasses.computedColumnsPanelValidation}`;

describe('<DataGridPremium /> - Computed columns panel', () => {
  const { render: originalRender } = createRenderer();

  const render = async (...args: Parameters<typeof originalRender>) => {
    const utils = originalRender(...args);
    await microtasks();
    return utils;
  };

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 900, height: 500 }}>
        <DataGridPremium {...baselineProps} apiRef={apiRef} {...props} />
      </div>
    );
  }

  const getPrivateApi = () => unwrapPrivateAPI<GridPrivateApiPremium, GridApi>(apiRef.current!);
  const getFields = () => gridColumnFieldsSelector(apiRef as RefObject<GridApi>);
  const getModel = () => apiRef.current!.state.computedColumns.model;
  const getSidebar = () => gridSidebarStateSelector(apiRef as RefObject<GridApi>);
  const getPanel = () => document.querySelector<HTMLElement>(PANEL_SELECTOR);
  const getNameInput = () => screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
  const getFieldInput = () => screen.getByRole('textbox', { name: 'Field' }) as HTMLInputElement;
  const getFormulaEditable = () =>
    getPanel()!.querySelector<HTMLDivElement>(
      '[role="combobox"][aria-label="Formula"], [role="textbox"][aria-label="Formula"]',
    )!;
  const getTypeSelect = () => screen.getByRole('combobox', { name: 'Result type' });
  const getButton = (name: string) => screen.getByRole('button', { name });
  const getPreviewText = () =>
    getPanel()!.querySelector(PREVIEW_SELECTOR)!.lastElementChild!.textContent;
  const getValidationMessages = () =>
    Array.from(getPanel()?.querySelectorAll(`${VALIDATION_SELECTOR} li`) ?? []).map(
      (node) => node.textContent,
    );

  const openEditor = async (
    field: string | null = null,
    options?: { sampleRowId?: number; columnIndex?: number },
  ) => {
    await act(async () => apiRef.current!.showComputedColumnEditor(field, options));
  };

  const typeName = (value: string) => {
    fireEvent.change(getNameInput(), { target: { value } });
  };

  const typeFormula = (value: string) => {
    const editable = getFormulaEditable();
    editable.textContent = value;
    fireEvent.input(editable);
  };

  const selectType = async (user: any, label: string) => {
    await user.click(getTypeSelect());
    await user.click(within(screen.getByRole('listbox')).getByText(label));
  };

  describe('column menu', () => {
    it('renders "Add computed column" on a data column and inserts after it', async () => {
      await render(<Test />);
      await act(async () => apiRef.current!.showColumnMenu('price'));

      expect(screen.queryByRole('menuitem', { name: 'Add computed column' })).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Edit computed column' })).to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Remove computed column' })).to.equal(null);

      fireEvent.click(screen.getByRole('menuitem', { name: 'Add computed column' }));
      await microtasks();

      expect(getSidebar()).to.include({ open: true, value: GridSidebarValue.ComputedColumns });
      expect(getPanel()).not.to.equal(null);
      expect(within(getPanel()!).getByText('New computed column')).not.to.equal(null);
      expect(document.activeElement).to.equal(getNameInput());

      typeName('Total price');
      typeFormula('=price * quantity');
      expect(getFieldInput().value).to.equal('totalPrice');
      fireEvent.click(getButton('Add column'));
      await microtasks();

      expect(getFields()).to.deep.equal(['item', 'price', 'totalPrice', 'quantity']);
      expect(getModel()).to.deep.equal([
        {
          field: 'totalPrice',
          headerName: 'Total price',
          formula: '=price * quantity',
          type: 'number',
        },
      ]);
      expect(getSidebar().open).to.equal(false);
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'item',
        'price',
        'ƒxTotal price',
        'quantity',
      ]);
    });

    it('renders "Edit" and "Remove" on a computed column', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await act(async () => apiRef.current!.showColumnMenu('total'));

      expect(screen.queryByRole('menuitem', { name: 'Edit computed column' })).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Add computed column' })).not.to.equal(null);

      fireEvent.click(screen.getByRole('menuitem', { name: 'Remove computed column' }));
      await microtasks();

      expect(getModel()).to.deep.equal([]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
    });

    it('opens the editor seeded with the column from "Edit computed column"', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await act(async () => apiRef.current!.showColumnMenu('total'));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Edit computed column' }));
      await microtasks();

      expect(within(getPanel()!).getByText('Edit computed column')).not.to.equal(null);
      expect(getNameInput().value).to.equal('Total');
      expect(getFieldInput().value).to.equal('total');
      expect(getFieldInput().disabled).to.equal(true);
      expect(getFormulaEditable().textContent).to.equal('=price * quantity');
      expect(document.activeElement).to.equal(getFormulaEditable());
    });

    it('hides the items on grouping and actions columns', async () => {
      await render(
        <Test
          columns={[
            ...baselineProps.columns,
            { field: 'actions', type: 'actions', getActions: () => [] },
          ]}
          initialState={{ rowGrouping: { model: ['item'] } }}
        />,
      );
      await act(async () => apiRef.current!.showColumnMenu('actions'));
      expect(screen.queryByRole('menuitem', { name: 'Add computed column' })).to.equal(null);
      await act(async () => apiRef.current!.hideColumnMenu());

      await act(async () => apiRef.current!.showColumnMenu('__row_group_by_columns_group__'));
      expect(screen.queryByRole('menuitem', { name: 'Add computed column' })).to.equal(null);
    });

    it('hides the item without the feature', async () => {
      await render(<Test featureDependencies={undefined} />);
      await act(async () => apiRef.current!.showColumnMenu('price'));
      expect(screen.queryByRole('menuitem', { name: 'Add computed column' })).to.equal(null);
    });

    it('follows disableComputedColumns', async () => {
      const { setProps } = await render(<Test disableComputedColumns />);
      await act(async () => apiRef.current!.showColumnMenu('price'));
      expect(screen.queryByRole('menuitem', { name: 'Add computed column' })).to.equal(null);
      await act(async () => apiRef.current!.hideColumnMenu());

      setProps({ disableComputedColumns: false });
      await act(async () => apiRef.current!.showColumnMenu('price'));
      expect(screen.queryByRole('menuitem', { name: 'Add computed column' })).not.to.equal(null);
    });

    it('hides the item with disableFormulas', async () => {
      await render(<Test disableFormulas />);
      await act(async () => apiRef.current!.showColumnMenu('price'));
      expect(screen.queryByRole('menuitem', { name: 'Add computed column' })).to.equal(null);
    });

    it('hides the item while pivoting is active', async () => {
      await render(
        <Test
          initialState={{
            pivoting: {
              enabled: true,
              model: { rows: [{ field: 'item' }], columns: [], values: [] },
            },
          }}
        />,
      );
      await act(async () => apiRef.current!.showColumnMenu('price'));
      expect(screen.queryByRole('menuitem', { name: 'Add computed column' })).to.equal(null);
    });
  });

  describe('editor', () => {
    it('opens a new-column editor from showComputedColumnEditor(null) and appends the column', async () => {
      await render(<Test />);
      await openEditor(null);

      expect(within(getPanel()!).getByText('New computed column')).not.to.equal(null);
      expect(getFieldInput().disabled).to.equal(false);
      expect(getFormulaEditable().textContent).to.equal('=');
      expect(getButton('Add column')).to.have.property('disabled', true);
      // Nothing typed yet: no validation noise.
      expect(getValidationMessages()).to.deep.equal([]);

      typeName('Double');
      typeFormula('=price * 2');
      fireEvent.click(getButton('Add column'));
      await microtasks();

      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'double']);
    });

    it('lets the user override the derived field of a new column', async () => {
      await render(<Test />);
      await openEditor(null);

      typeName('Total price');
      expect(getFieldInput().value).to.equal('totalPrice');
      fireEvent.change(getFieldInput(), { target: { value: 'tp' } });
      typeName('Total price 2');
      expect(getFieldInput().value).to.equal('tp');
    });

    it('avoids the fields of existing columns when deriving the field', async () => {
      await render(<Test />);
      await openEditor(null);

      typeName('Price');
      expect(getFieldInput().value).to.equal('price2');
    });

    it('applies the edited definition and keeps the field', async () => {
      const onComputedColumnsChange = vi.fn();
      await render(
        <Test
          initialState={{ computedColumns: { model: [total] } }}
          onComputedColumnsChange={onComputedColumnsChange}
        />,
      );
      await openEditor('total');

      typeName('Grand total');
      typeFormula('=price * quantity * 2');
      fireEvent.click(getButton('Apply'));
      await microtasks();

      expect(getModel()).to.deep.equal([
        {
          field: 'total',
          headerName: 'Grand total',
          formula: '=price * quantity * 2',
          type: 'number',
        },
      ]);
      expect(onComputedColumnsChange.mock.calls.length).to.equal(1);
      expect(getSidebar().open).to.equal(false);
      expect(getColumnHeadersTextContent()).to.deep.equal([
        'item',
        'price',
        'quantity',
        'ƒxGrand total',
      ]);
    });

    it('deletes the column from the editor', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await openEditor('total');

      fireEvent.click(getButton('Delete column'));
      await microtasks();

      expect(getModel()).to.deep.equal([]);
      expect(getSidebar().open).to.equal(false);
    });

    it('discards the draft on Cancel and on close', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await openEditor('total');
      typeName('Changed');
      fireEvent.click(getButton('Cancel'));
      await microtasks();

      expect(getModel()).to.deep.equal([total]);
      expect(getSidebar().open).to.equal(false);

      await openEditor('total');
      expect(getNameInput().value).to.equal('Total');
      typeName('Changed again');
      fireEvent.click(getButton('Close computed columns panel'));
      await microtasks();

      expect(getModel()).to.deep.equal([total]);
      expect(getSidebar().open).to.equal(false);
    });

    it('disables Apply and shows the issues of an invalid draft once it is dirty', async () => {
      await render(<Test />);
      await openEditor(null);

      typeName('Broken');
      typeFormula('=price * nope');
      expect(getButton('Add column')).to.have.property('disabled', true);
      expect(getValidationMessages()).to.deep.equal(['Column "nope" does not exist.']);

      typeFormula('=price * (');
      expect(getValidationMessages()[0]).to.match(/^Formula error: /);

      typeFormula('');
      expect(getValidationMessages()).to.deep.equal(['Enter a formula.']);

      typeFormula('=price');
      expect(getValidationMessages()).to.deep.equal([]);
      expect(getButton('Add column')).to.have.property('disabled', false);
    });

    it('shows the issues of a stored invalid definition right away', async () => {
      await render(
        <Test initialState={{ computedColumns: { model: [define('bad', '=price * nope')] } }} />,
      );
      await openEditor('bad');

      expect(getValidationMessages()).to.deep.equal(['Column "nope" does not exist.']);
      expect(getButton('Apply')).to.have.property('disabled', true);
    });

    it('normalizes a missing "=" on Apply', async () => {
      await render(<Test />);
      await openEditor(null);

      typeName('Total');
      typeFormula('price * quantity');
      fireEvent.click(getButton('Add column'));
      await microtasks();

      expect(getModel()[0].formula).to.equal('=price * quantity');
    });

    it('previews the formatted result of the preview row and error codes', async () => {
      await render(<Test />);
      await openEditor(null, { sampleRowId: 1 });

      expect(getPanel()!.querySelector(PREVIEW_SELECTOR)!.textContent).to.include('Row 2');
      expect(getPreviewText()).to.equal('');

      typeFormula('=price * quantity');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('50');
      });

      typeFormula('=price / 0');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('#DIV/0!');
      });

      typeFormula('=');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('');
      });
    });

    it('previews with the number format of the draft', async () => {
      const { user } = await render(<Test />);
      await openEditor(null, { sampleRowId: 1 });
      typeFormula('=price * quantity');

      await user.click(screen.getByRole('combobox', { name: 'Format' }));
      await user.click(within(screen.getByRole('listbox')).getByText('Currency'));
      fireEvent.change(screen.getByRole('textbox', { name: 'Currency code' }), {
        target: { value: 'eur' },
      });
      fireEvent.change(screen.getByRole('spinbutton', { name: 'Decimals' }), {
        target: { value: '2' },
      });

      await waitFor(() => {
        expect(getPreviewText()).to.equal('€50.00');
      });

      typeName('Total');
      fireEvent.click(getButton('Add column'));
      await microtasks();

      expect(getModel()[0].numberFormat).to.deep.equal({
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(getCell(1, 3).textContent).to.equal('€50.00');
    });

    it('disables Apply while the currency code is invalid', async () => {
      const { user } = await render(<Test />);
      await openEditor(null);
      typeName('Total');
      typeFormula('=price * quantity');
      expect(getButton('Add column')).to.have.property('disabled', false);

      await user.click(screen.getByRole('combobox', { name: 'Format' }));
      await user.click(within(screen.getByRole('listbox')).getByText('Currency'));
      fireEvent.change(screen.getByRole('textbox', { name: 'Currency code' }), {
        target: { value: 'E' },
      });
      expect(getButton('Add column')).to.have.property('disabled', true);
      expect(getValidationMessages()).to.deep.equal([]);
    });

    it('stores no number format when the format is the default', async () => {
      await render(<Test />);
      await openEditor(null);
      typeName('Total');
      typeFormula('=price * quantity');
      fireEvent.click(getButton('Add column'));
      await microtasks();

      expect(getModel()[0]).not.to.have.property('numberFormat');
    });

    it('selects the result type from the preview until the user picks one', async () => {
      const { user } = await render(<Test />);
      await openEditor(null);
      expect(getTypeSelect().textContent).to.equal('Number');

      typeFormula('=item & "!"');
      await waitFor(() => {
        expect(getTypeSelect().textContent).to.equal('Text');
      });
      typeFormula('=price > 5');
      await waitFor(() => {
        expect(getTypeSelect().textContent).to.equal('Boolean');
      });

      await selectType(user, 'Number');
      typeFormula('=item');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('#VALUE!');
      });
      expect(getTypeSelect().textContent).to.equal('Number');
    });

    it('does not auto-select the type of an existing column', async () => {
      await render(
        <Test
          initialState={{
            computedColumns: { model: [define('flag', '=price > 5', { type: 'boolean' })] },
          }}
        />,
      );
      await openEditor('flag');
      typeFormula('=price');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('#VALUE!');
      });
      expect(getTypeSelect().textContent).to.equal('Boolean');
    });

    it('seeds the format row from the stored format and clears it when reset', async () => {
      const { user } = await render(
        <Test
          initialState={{
            computedColumns: {
              model: [
                define('total', '=price * quantity', {
                  numberFormat: { style: 'percent', useGrouping: false, notation: 'compact' },
                }),
              ],
            },
          }}
        />,
      );
      await openEditor('total');
      expect(screen.getByRole('combobox', { name: 'Format' }).textContent).to.equal('Percent');
      expect(screen.getByRole('switch', { name: 'Thousands separator' })).to.have.property(
        'checked',
        false,
      );
      fireEvent.click(getButton('Apply'));
      await microtasks();
      // Untouched: the stored format (unmanaged keys included) is kept as is.
      expect(getModel()[0].numberFormat).to.deep.equal({
        style: 'percent',
        useGrouping: false,
        notation: 'compact',
      });

      await openEditor('total');
      await user.click(screen.getByRole('combobox', { name: 'Format' }));
      await user.click(within(screen.getByRole('listbox')).getByText('Number'));
      await user.click(screen.getByRole('switch', { name: 'Thousands separator' }));
      fireEvent.click(getButton('Apply'));
      await microtasks();
      expect(getModel()[0].numberFormat).to.deep.equal({ notation: 'compact' });

      await openEditor('total');
      typeName('Total');
      fireEvent.click(getButton('Apply'));
      await microtasks();
      expect(getModel()[0].numberFormat).to.deep.equal({ notation: 'compact' });
    });

    it('removes the number format property when the format is back to the default', async () => {
      const { user } = await render(
        <Test
          initialState={{
            computedColumns: {
              model: [define('total', '=price * quantity', { numberFormat: { style: 'percent' } })],
            },
          }}
        />,
      );
      await openEditor('total');
      await user.click(screen.getByRole('combobox', { name: 'Format' }));
      await user.click(within(screen.getByRole('listbox')).getByText('Number'));
      fireEvent.click(getButton('Apply'));
      await microtasks();
      expect(getModel()[0]).not.to.have.property('numberFormat');
    });

    it('applies on Enter in the formula and in the name field', async () => {
      await render(<Test />);
      await openEditor(null);
      typeName('Total');
      typeFormula('=price * quantity');
      await act(async () => getFormulaEditable().focus());
      fireEvent.keyDown(getFormulaEditable(), { key: 'Enter' });
      await microtasks();
      expect(getModel().map((definition) => definition.field)).to.deep.equal(['total']);

      await openEditor(null);
      typeName('Double');
      typeFormula('=price * 2');
      await act(async () => getNameInput().focus());
      fireEvent.keyDown(getNameInput(), { key: 'Enter' });
      await microtasks();
      expect(getModel().map((definition) => definition.field)).to.deep.equal(['total', 'double']);
    });

    it('does nothing on Enter while the draft is invalid', async () => {
      await render(<Test />);
      await openEditor(null);
      typeFormula('=price *');
      await act(async () => getFormulaEditable().focus());
      fireEvent.keyDown(getFormulaEditable(), { key: 'Enter' });
      await microtasks();
      expect(getModel()).to.deep.equal([]);
      expect(getSidebar().open).to.equal(true);
    });

    it('replaces the draft when a new request arrives while the panel is open', async () => {
      await render(
        <Test
          initialState={{
            computedColumns: {
              model: [total, define('double', '=price * 2', { headerName: 'Double' })],
            },
          }}
        />,
      );
      await openEditor('total');
      typeName('Changed');

      await openEditor('double', { sampleRowId: 2 });
      expect(getNameInput().value).to.equal('Double');
      expect(getPanel()!.querySelector(PREVIEW_SELECTOR)!.textContent).to.include('Row 3');
      expect(getModel()[0].headerName).to.equal('Total');
    });

    it('opens a new-column editor when the sidebar is shown without a request', async () => {
      await render(<Test />);
      await act(async () => apiRef.current!.showSidebar(GridSidebarValue.ComputedColumns));
      expect(within(getPanel()!).getByText('New computed column')).not.to.equal(null);
      expect(getPrivateApi().caches.computedColumns.editorRequest).to.equal(null);
    });

    it('does not render the panel when computed columns are disabled', async () => {
      await render(<Test disableComputedColumns />);
      await act(async () => apiRef.current!.showSidebar(GridSidebarValue.ComputedColumns));
      expect(getPanel()).to.equal(null);
    });

    it('focuses the header of the applied column', async () => {
      await render(<Test />);
      await openEditor(null);
      typeName('Total');
      typeFormula('=price * quantity');
      fireEvent.click(getButton('Add column'));
      await microtasks();

      expect(apiRef.current!.state.focus.columnHeader).to.deep.equal({ field: 'total' });
    });

    it('keeps the request index when the model is controlled', async () => {
      function ControlledTest() {
        const [model, setModel] = React.useState<GridComputedColumnsModel>([]);
        return <Test computedColumns={model} onComputedColumnsChange={setModel} />;
      }
      await render(<ControlledTest />);
      await openEditor(null, { columnIndex: 1 });
      typeName('Total');
      typeFormula('=price * quantity');
      fireEvent.click(getButton('Add column'));
      await microtasks();

      expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity']);
    });
  });

  describe('cell gestures', () => {
    it('opens the editor on double-click with the row as preview row', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      fireEvent.doubleClick(getCell(2, 3));
      await microtasks();

      expect(within(getPanel()!).getByText('Edit computed column')).not.to.equal(null);
      expect(getNameInput().value).to.equal('Total');
      expect(getPanel()!.querySelector(PREVIEW_SELECTOR)!.textContent).to.include('Row 3');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('8');
      });
    });

    it('opens the editor on Enter and ignores printable keys', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      const cell = getCell(1, 3);
      fireEvent.mouseUp(cell);
      fireEvent.click(cell);
      await act(async () => cell.focus());

      fireEvent.keyDown(cell, { key: 'a' });
      await microtasks();
      expect(getSidebar().open).to.equal(false);
      expect(apiRef.current!.getCellMode(1, 'total')).to.equal('view');

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      act(() => {
        cell.dispatchEvent(event);
      });
      await microtasks();
      expect(event.defaultPrevented).to.equal(true);
      expect(getSidebar()).to.include({ open: true, value: GridSidebarValue.ComputedColumns });
      expect(getPanel()!.querySelector(PREVIEW_SELECTOR)!.textContent).to.include('Row 2');
    });

    it('does not open the editor on Enter with a modifier', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      const cell = getCell(1, 3);
      fireEvent.mouseUp(cell);
      fireEvent.click(cell);
      await act(async () => cell.focus());

      fireEvent.keyDown(cell, { key: 'Enter', shiftKey: true });
      await microtasks();
      expect(getSidebar().open).to.equal(false);
    });

    it('ignores the gestures on data cells', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      fireEvent.doubleClick(getCell(1, 1));
      await microtasks();
      expect(getSidebar().open).to.equal(false);
    });
  });

  describe('autocomplete', () => {
    it.skipIf(isJSDOM)(
      'suggests fields inside the panel and splices the accepted one',
      async () => {
        const { user } = await render(<Test />);
        await openEditor(null);
        const editable = getFormulaEditable();
        await user.click(editable);
        await user.keyboard('pr');

        const option = await screen.findByRole('option', { name: /price/ });
        await user.click(option);

        expect(editable.textContent).to.equal('=price');
        expect(getSidebar().open).to.equal(true);
      },
    );
  });
});
