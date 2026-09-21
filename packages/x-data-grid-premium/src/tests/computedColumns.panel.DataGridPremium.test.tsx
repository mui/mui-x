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
import { GRID_FORMULA_FUNCTIONS, formulaFeature } from '@mui/x-data-grid-premium/formula';
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
  const getPreviewRowLabel = () =>
    getPanel()!.querySelector(PREVIEW_SELECTOR)!.firstElementChild!.textContent;
  const focusCell = async (id: number, field: string) => {
    await act(async () => apiRef.current!.setCellFocus(id, field));
  };
  // Places the caret at the end of the editable (jsdom leaves the selection at the start).
  const placeCaretAtEnd = () => {
    const editable = getFormulaEditable();
    const range = document.createRange();
    range.selectNodeContents(editable);
    range.collapse(false);
    const selection = document.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
  };
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

  // A keydown that belongs to an IME composition (Enter confirming a candidate, Escape cancelling it).
  const composingKeyDown = (element: HTMLElement, key: string) => {
    fireEvent.keyDown(element, { key, keyCode: 229, isComposing: true });
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

    it('opens the list when the sidebar is shown without a request', async () => {
      await render(<Test />);
      await act(async () => apiRef.current!.showSidebar(GridSidebarValue.ComputedColumns));
      expect(within(getPanel()!).getByText('Computed columns')).not.to.equal(null);
      expect(within(getPanel()!).getByText('No computed columns yet')).not.to.equal(null);
      expect(within(getPanel()!).queryByText('New computed column')).to.equal(null);
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

  describe('list view', () => {
    const openList = async () => {
      await act(async () => apiRef.current!.showSidebar(GridSidebarValue.ComputedColumns));
    };
    const getListItems = () =>
      Array.from(getPanel()!.querySelectorAll(`.${gridClasses.computedColumnsPanelListItem}`));
    const getItemButton = (name: string) =>
      within(getPanel()!).getByRole('button', { name: new RegExp(name) });

    it('lists the definitions in model order with their formula and flags invalid ones', async () => {
      const broken = define('broken', '=nope * 2', { headerName: 'Broken' });
      await render(<Test initialState={{ computedColumns: { model: [total, broken] } }} />);
      await openList();

      const items = getListItems();
      expect(items.map((item) => item.textContent)).to.deep.equal([
        'ƒxTotal=price * quantity',
        'ƒxBroken=nope * 2',
      ]);
      const badges = items.map((item) => item.querySelector('[role="img"]')!);
      expect(badges[0].getAttribute('aria-label')).to.equal('Computed column');
      expect(badges[1].getAttribute('aria-label')).to.equal(
        'Computed column with an invalid formula',
      );
      expect(badges[1].getAttribute('title')).to.equal('Column "nope" does not exist.');
      expect(within(getPanel()!).queryByText('No computed columns yet')).to.equal(null);
    });

    it('adds a column from the list and returns to it with the new item focused', async () => {
      await render(<Test />);
      await openList();
      fireEvent.click(getButton('Add computed column'));
      await microtasks();

      expect(within(getPanel()!).getByText('New computed column')).not.to.equal(null);
      expect(document.activeElement).to.equal(getNameInput());
      typeName('Total');
      typeFormula('=price * quantity');
      fireEvent.click(getButton('Add column'));
      await microtasks();

      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
      expect(getSidebar().open).to.equal(true);
      expect(within(getPanel()!).getByText('Computed columns')).not.to.equal(null);
      expect(getListItems()).to.have.length(1);
      expect(document.activeElement).to.equal(getItemButton('Total'));
      expect(apiRef.current!.state.focus.columnHeader).to.equal(null);
    });

    it('edits a column from its row and returns to the list on Cancel and on Apply', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await openList();
      fireEvent.click(getItemButton('Total'));
      await microtasks();

      expect(within(getPanel()!).getByText('Edit computed column')).not.to.equal(null);
      expect(getNameInput().value).to.equal('Total');
      typeName('Changed');
      fireEvent.click(getButton('Cancel'));
      await microtasks();

      expect(getModel()).to.deep.equal([total]);
      expect(getSidebar().open).to.equal(true);
      expect(getListItems()).to.have.length(1);
      expect(document.activeElement).to.equal(getItemButton('Total'));

      fireEvent.click(getItemButton('Total'));
      await microtasks();
      typeName('Amount');
      fireEvent.click(getButton('Apply'));
      await microtasks();

      expect(getModel()[0].headerName).to.equal('Amount');
      expect(getSidebar().open).to.equal(true);
      expect(getListItems()[0].textContent).to.equal('ƒxAmount=price * quantity');
    });

    it('edits and removes a column from the item menu', async () => {
      const tax = define('tax', '=price * 0.2', { headerName: 'Tax' });
      await render(<Test initialState={{ computedColumns: { model: [total, tax] } }} />);
      await openList();
      const menuButtons = within(getPanel()!).getAllByRole('button', {
        name: 'Computed column actions',
      });
      expect(menuButtons).to.have.length(2);

      fireEvent.click(menuButtons[0]);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Edit computed column' }));
      await microtasks();
      expect(within(getPanel()!).getByText('Edit computed column')).not.to.equal(null);
      expect(getNameInput().value).to.equal('Total');

      fireEvent.click(getButton('Back to the list'));
      await microtasks();
      expect(within(getPanel()!).getByText('Computed columns')).not.to.equal(null);

      fireEvent.click(
        within(getPanel()!).getAllByRole('button', { name: 'Computed column actions' })[0],
      );
      fireEvent.click(screen.getByRole('menuitem', { name: 'Remove computed column' }));
      await microtasks();

      expect(getModel()).to.deep.equal([tax]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'tax']);
      expect(getListItems()).to.have.length(1);
      expect(document.activeElement).to.equal(getItemButton('Tax'));
    });

    it('goes back to the list from a request-opened editor and discards the draft', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await openEditor('total');
      typeName('Changed');
      fireEvent.click(getButton('Back to the list'));
      await microtasks();

      expect(getModel()).to.deep.equal([total]);
      expect(getSidebar().open).to.equal(true);
      expect(within(getPanel()!).getByText('Computed columns')).not.to.equal(null);
      expect(within(getPanel()!).queryByRole('button', { name: 'Back to the list' })).to.equal(
        null,
      );
    });

    it('closes the panel from a request-opened editor on Apply, Delete and Cancel', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await openEditor('total');
      fireEvent.click(getButton('Apply'));
      await microtasks();
      expect(getSidebar().open).to.equal(false);

      await openEditor('total');
      fireEvent.click(getButton('Delete column'));
      await microtasks();
      expect(getSidebar().open).to.equal(false);
      expect(getModel()).to.deep.equal([]);
    });
  });

  describe('toolbar trigger', () => {
    const getTrigger = () => screen.queryByRole('button', { name: 'Computed columns' });

    it('toggles the panel and reports aria-expanded/aria-controls', async () => {
      await render(<Test showToolbar />);
      const trigger = getTrigger()!;
      expect(trigger).not.to.equal(null);
      expect(trigger.getAttribute('aria-expanded')).to.equal(null);

      fireEvent.click(trigger);
      await microtasks();
      expect(getSidebar().open).to.equal(true);
      expect(getSidebar().value).to.equal(GridSidebarValue.ComputedColumns);
      expect(within(getPanel()!).getByText('No computed columns yet')).not.to.equal(null);
      expect(trigger.getAttribute('aria-expanded')).to.equal('true');
      const sidebar = document.querySelector<HTMLElement>(`.${gridClasses.sidebar}`)!;
      expect(trigger.getAttribute('aria-controls')).to.equal(sidebar.id);
      expect(sidebar.getAttribute('aria-labelledby')).to.equal(trigger.id);

      fireEvent.click(trigger);
      await microtasks();
      expect(getSidebar().open).to.equal(false);
      expect(trigger.getAttribute('aria-expanded')).to.equal(null);
    });

    it('is hidden when computed columns are not available', async () => {
      const { unmount } = await render(<Test showToolbar featureDependencies={undefined} />);
      expect(getTrigger()).to.equal(null);
      unmount();

      const view = await render(<Test showToolbar disableComputedColumns />);
      expect(getTrigger()).to.equal(null);
      view.unmount();

      await render(<Test showToolbar disableFormulas />);
      expect(getTrigger()).to.equal(null);
    });

    it('returns the focus to the trigger when the panel closes', async () => {
      await render(<Test showToolbar />);
      const trigger = getTrigger()!;
      await act(async () => trigger.focus());
      fireEvent.click(trigger);
      await microtasks();
      fireEvent.click(getButton('Add computed column'));
      await microtasks();
      expect(document.activeElement).to.equal(getNameInput());

      fireEvent.click(getButton('Close computed columns panel'));
      await microtasks();
      expect(getSidebar().open).to.equal(false);
      expect(document.activeElement).to.equal(trigger);
    });
  });

  describe('focus return', () => {
    it('focuses the column header again when a menu-opened editor is cancelled', async () => {
      await render(<Test />);
      await act(async () => apiRef.current!.showColumnMenu('price'));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Add computed column' }));
      await microtasks();
      expect(document.activeElement).to.equal(getNameInput());

      fireEvent.click(getButton('Cancel'));
      await microtasks();
      expect(getSidebar().open).to.equal(false);
      expect(apiRef.current!.state.focus.columnHeader).to.deep.equal({ field: 'price' });
      expect(document.activeElement!.closest(`.${gridClasses.columnHeader}`)).not.to.equal(null);
      expect(document.activeElement!.closest('[data-field]')!.getAttribute('data-field')).to.equal(
        'price',
      );
    });

    it('focuses the cell again when a gesture-opened editor is closed', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      const cell = getCell(1, 3);
      fireEvent.mouseUp(cell);
      fireEvent.click(cell);
      await act(async () => cell.focus());
      fireEvent.doubleClick(cell);
      await microtasks();
      expect(document.activeElement).to.equal(getFormulaEditable());

      fireEvent.click(getButton('Close computed columns panel'));
      await microtasks();
      expect(getSidebar().open).to.equal(false);
      expect(apiRef.current!.state.focus.cell).to.deep.equal({ id: 1, field: 'total' });
      expect(document.activeElement).to.equal(getCell(1, 3));
    });
  });

  describe('preview row', () => {
    it('follows the focused cell and keeps the last row when focus leaves the cells', async () => {
      await render(<Test />);
      await openEditor(null);
      typeFormula('=price * quantity');
      expect(getPreviewRowLabel()).to.equal('Row 1');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('6');
      });

      await focusCell(2, 'price');
      expect(getPreviewRowLabel()).to.equal('Row 3');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('8');
      });

      await act(async () => getNameInput().focus());
      expect(getPreviewRowLabel()).to.equal('Row 3');
      expect(apiRef.current!.state.focus.cell).to.deep.equal({ id: 2, field: 'price' });
    });

    it('keeps the sample row of the request over a cell focused before', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await focusCell(0, 'price');
      await openEditor('total', { sampleRowId: 2 });
      expect(getPreviewRowLabel()).to.equal('Row 3');
    });

    it('acquires a preview row when rows arrive in an initially empty grid', async () => {
      const { setProps } = await render(
        <Test rows={[]} initialState={{ computedColumns: { model: [total] } }} />,
      );
      await openEditor('total');
      expect(getPreviewRowLabel()).to.equal('No rows to preview');

      setProps({ rows: baselineProps.rows });
      await microtasks();
      expect(getPreviewRowLabel()).to.equal('Row 1');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('6');
      });
    });

    it('acquires a preview row again after the grid was emptied', async () => {
      const { setProps } = await render(
        <Test initialState={{ computedColumns: { model: [total] } }} />,
      );
      await openEditor('total', { sampleRowId: 1 });
      await waitFor(() => {
        expect(getPreviewText()).to.equal('50');
      });

      setProps({ rows: [] });
      await microtasks();
      expect(getPreviewRowLabel()).to.equal('No rows to preview');
      expect(getPreviewText()).to.equal('');

      setProps({ rows: baselineProps.rows });
      await microtasks();
      expect(getPreviewRowLabel()).to.equal('Row 1');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('6');
      });
    });

    it('falls back to the first data row when the preview row is removed', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await openEditor('total', { sampleRowId: 0 });
      await waitFor(() => {
        expect(getPreviewText()).to.equal('6');
      });

      await act(async () => apiRef.current!.updateRows([{ id: 0, _action: 'delete' }]));
      expect(getPreviewRowLabel()).to.equal('Row 1');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('50');
      });
    });
  });

  describe('preview invalidation', () => {
    // Longer than the debounce of the preview: a re-evaluation that was scheduled has run.
    const flushPreviewDebounce = async () => {
      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 300);
        });
      });
    };

    const createProbe = () => {
      const apply = vi.fn((args: any[]) => args[0]);
      const PROBE = { name: 'PROBE', minArgs: 1, maxArgs: 1, apply };
      return { apply, PROBE, functions: () => ({ ...GRID_FORMULA_FUNCTIONS, PROBE }) as any };
    };

    const formulaColumns: DataGridPremiumProps['columns'] = [
      { field: 'price', type: 'number' },
      { field: 'net', type: 'number', allowFormulas: true, editable: true },
    ];

    it('follows the data of the preview row updated through `updateRows`', async () => {
      await render(<Test />);
      await openEditor(null);
      typeFormula('=price * quantity');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('6');
      });

      await act(async () => apiRef.current!.updateRows([{ id: 0, quantity: 7 }]));
      await waitFor(() => {
        expect(getPreviewText()).to.equal('14');
      });
    });

    it('follows a `rows` prop replaced with the same row id', async () => {
      const { setProps } = await render(<Test />);
      await openEditor(null);
      typeFormula('=price * quantity');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('6');
      });

      setProps({
        rows: baselineProps.rows!.map((row) => (row.id === 0 ? { ...row, quantity: 7 } : row)),
      });
      await waitFor(() => {
        expect(getPreviewText()).to.equal('14');
      });
    });

    it('follows a referenced computed column whose formula changes through the API', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await openEditor(null);
      typeFormula('=total + 1');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('7');
      });

      await act(async () =>
        apiRef.current!.updateComputedColumn('total', { formula: '=price + quantity' }),
      );
      await waitFor(() => {
        expect(getPreviewText()).to.equal('6');
      });
    });

    it('follows a referenced formula cell re-evaluated without a change of the preview row', async () => {
      await render(
        <Test
          columns={formulaColumns}
          rows={[
            { id: 0, price: 2, net: '=price + 1' },
            { id: 1, price: 10, net: '=REF(COLUMN("net"), ROW(0)) * 2' },
          ]}
        />,
      );
      await openEditor(null, { sampleRowId: 1 });
      typeFormula('=net * 2');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('12');
      });

      // Row 1 is not updated: its formula cell changes through its dependency on row 0,
      // and no stored computed column references `net`.
      const previewRow = apiRef.current!.getRow(1);
      await act(async () => apiRef.current!.updateRows([{ id: 0, price: 4 }]));
      expect(apiRef.current!.getRow(1)).to.equal(previewRow);
      await waitFor(() => {
        expect(getPreviewText()).to.equal('20');
      });
    });

    it('follows a function of the registry that is replaced', async () => {
      const boost = (factor: number) => ({
        ...GRID_FORMULA_FUNCTIONS,
        BOOST: {
          name: 'BOOST',
          minArgs: 1,
          maxArgs: 1,
          apply: (args: any[]) => (args[0] as number) * factor,
        },
      });
      const { setProps } = await render(<Test formulaFunctions={boost(2) as any} />);
      await openEditor(null);
      typeFormula('=BOOST(price)');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('4');
      });

      setProps({ formulaFunctions: boost(3) });
      await waitFor(() => {
        expect(getPreviewText()).to.equal('6');
      });
    });

    it('follows a referenced column whose `valueGetter` is replaced before any computed column exists', async () => {
      const { setProps } = await render(<Test />);
      await openEditor(null);
      typeFormula('=price * 2');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('4');
      });

      setProps({
        columns: [
          { field: 'item' },
          { field: 'price', type: 'number', valueGetter: (value: number) => value * 10 },
          { field: 'quantity', type: 'number' },
        ],
      });
      await waitFor(() => {
        expect(getPreviewText()).to.equal('40');
      });
    });

    it('does not evaluate again when an equivalent inline `formulaFunctions` map is passed', async () => {
      const probe = createProbe();
      const { setProps } = await render(<Test formulaFunctions={probe.functions()} />);
      await openEditor(null);
      typeFormula('=PROBE(price)');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('2');
      });
      await flushPreviewDebounce();
      const calls = probe.apply.mock.calls.length;

      setProps({ formulaFunctions: probe.functions() });
      await flushPreviewDebounce();
      expect(probe.apply.mock.calls.length).to.equal(calls);
    });

    it('does not evaluate again when another row is updated', async () => {
      const probe = createProbe();
      await render(<Test formulaFunctions={probe.functions()} />);
      await openEditor(null);
      typeFormula('=PROBE(price)');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('2');
      });
      await flushPreviewDebounce();
      const calls = probe.apply.mock.calls.length;

      await act(async () => apiRef.current!.updateRows([{ id: 1, price: 11 }]));
      await flushPreviewDebounce();
      expect(probe.apply.mock.calls.length).to.equal(calls);
    });

    it('does not evaluate again when a formula cell of another row is re-evaluated', async () => {
      const probe = createProbe();
      await render(
        <Test
          formulaFunctions={probe.functions()}
          columns={formulaColumns}
          rows={[
            { id: 0, price: 2, net: '=price + 1' },
            { id: 1, price: 10, net: '=price + 1' },
          ]}
        />,
      );
      await openEditor(null, { sampleRowId: 0 });
      typeFormula('=PROBE(net)');
      await waitFor(() => {
        expect(getPreviewText()).to.equal('3');
      });
      await flushPreviewDebounce();
      const calls = probe.apply.mock.calls.length;

      await act(async () => apiRef.current!.updateRows([{ id: 1, price: 11 }]));
      expect(getCell(1, 1).textContent).to.equal('12');
      await flushPreviewDebounce();
      expect(probe.apply.mock.calls.length).to.equal(calls);
    });
  });

  describe('number format preservation', () => {
    const renderWithFormat = (numberFormat: Intl.NumberFormatOptions) =>
      render(
        <Test
          initialState={{
            computedColumns: { model: [define('total', '=price * quantity', { numberFormat })] },
          }}
        />,
      );
    const apply = async () => {
      fireEvent.click(getButton('Apply'));
      await microtasks();
    };
    const typeDecimals = (value: string) => {
      fireEvent.change(screen.getByRole('spinbutton', { name: 'Decimals' }), { target: { value } });
    };

    it('keeps distinct fraction bounds when only the name changes', async () => {
      await renderWithFormat({ minimumFractionDigits: 0, maximumFractionDigits: 2 });
      await openEditor('total');
      typeName('Renamed');
      await apply();
      expect(getModel()[0].headerName).to.equal('Renamed');
      expect(getModel()[0].numberFormat).to.deep.equal({
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    });

    it('keeps the stored format on an Apply without any change', async () => {
      await renderWithFormat({ minimumFractionDigits: 0, maximumFractionDigits: 2 });
      await openEditor('total');
      await apply();
      expect(getModel()[0].numberFormat).to.deep.equal({
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    });

    it('keeps a format with only one fraction bound, or none', async () => {
      await renderWithFormat({ maximumFractionDigits: 2 });
      await openEditor('total');
      typeName('Max only');
      await apply();
      expect(getModel()[0].numberFormat).to.deep.equal({ maximumFractionDigits: 2 });

      await act(async () =>
        apiRef.current!.updateComputedColumn('total', {
          numberFormat: { minimumFractionDigits: 1 },
        }),
      );
      await openEditor('total');
      typeName('Min only');
      await apply();
      expect(getModel()[0].numberFormat).to.deep.equal({ minimumFractionDigits: 1 });

      await act(async () =>
        apiRef.current!.updateComputedColumn('total', { numberFormat: { style: 'percent' } }),
      );
      await openEditor('total');
      typeName('Unset');
      await apply();
      expect(getModel()[0].numberFormat).to.deep.equal({ style: 'percent' });
    });

    it('writes both fraction bounds once the decimals are edited', async () => {
      await renderWithFormat({ minimumFractionDigits: 0, maximumFractionDigits: 2 });
      await openEditor('total');
      typeDecimals('3');
      await apply();
      expect(getModel()[0].numberFormat).to.deep.equal({
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
    });

    it('keeps the stored bounds when the decimals are back to their initial value', async () => {
      await renderWithFormat({ minimumFractionDigits: 0, maximumFractionDigits: 2 });
      await openEditor('total');
      typeDecimals('3');
      typeDecimals('2');
      await apply();
      expect(getModel()[0].numberFormat).to.deep.equal({
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    });

    it('keeps the fraction bounds when only the thousands separator is toggled', async () => {
      const { user } = await renderWithFormat({
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      await openEditor('total');
      await user.click(screen.getByRole('switch', { name: 'Thousands separator' }));
      await apply();
      expect(getModel()[0].numberFormat).to.deep.equal({
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: false,
      });
    });

    it('keeps the fraction bounds when only the style changes', async () => {
      const { user } = await renderWithFormat({
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      await openEditor('total');
      await user.click(screen.getByRole('combobox', { name: 'Format' }));
      await user.click(within(screen.getByRole('listbox')).getByText('Percent'));
      await apply();
      expect(getModel()[0].numberFormat).to.deep.equal({
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    });

    it('keeps the options the editor does not manage next to an edited group', async () => {
      await renderWithFormat({
        notation: 'compact',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      await openEditor('total');
      typeDecimals('1');
      await apply();
      expect(getModel()[0].numberFormat).to.deep.equal({
        notation: 'compact',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
    });
  });

  describe('result type on Apply', () => {
    const dateProps: Partial<DataGridPremiumProps> = {
      rows: [{ id: 0, item: 'Apple', price: 2, quantity: 3, day: new Date(2024, 0, 15) }],
      columns: [...baselineProps.columns, { field: 'day', type: 'date' }],
    };
    const pressEnterInFormula = async () => {
      await act(async () => getFormulaEditable().focus());
      fireEvent.keyDown(getFormulaEditable(), { key: 'Enter' });
      await microtasks();
    };

    // No test below waits for the debounced preview between the last formula change and the Apply.
    it('infers a text result when Enter comes before the debounced preview', async () => {
      await render(<Test />);
      await openEditor(null);
      typeName('Greeting');
      typeFormula('="hello"');
      await pressEnterInFormula();
      expect(getModel()[0].type).to.equal('string');
      expect(apiRef.current!.getCellValue(0, 'greeting')).to.equal('hello');
    });

    it('infers boolean and date results', async () => {
      await render(<Test {...dateProps} />);
      await openEditor(null);
      typeName('Flag');
      typeFormula('=price > 1');
      await pressEnterInFormula();
      expect(getModel()[0].type).to.equal('boolean');
      expect(apiRef.current!.getCellValue(0, 'flag')).to.equal(true);

      await openEditor(null);
      typeName('When');
      typeFormula('=day');
      await pressEnterInFormula();
      expect(getModel()[1].type).to.equal('date');
      expect(apiRef.current!.getCellValue(0, 'when')).to.deep.equal(new Date(2024, 0, 15));
    });

    it('follows a type flip made right before Enter and drops the format with it', async () => {
      await render(<Test />);
      await openEditor(null);
      typeName('Flip');
      typeFormula('=item & "!"');
      await waitFor(() => {
        expect(getTypeSelect().textContent).to.equal('Text');
      });
      typeFormula('=price * 2');
      await pressEnterInFormula();
      expect(getModel()[0].type).to.equal('number');
      expect(apiRef.current!.getCellValue(1, 'flip')).to.equal(20);

      await openEditor(null);
      typeName('Flop');
      typeFormula('=price');
      fireEvent.change(screen.getByRole('spinbutton', { name: 'Decimals' }), {
        target: { value: '2' },
      });
      typeFormula('=item');
      await pressEnterInFormula();
      expect(getModel()[1].type).to.equal('string');
      expect(getModel()[1]).not.to.have.property('numberFormat');
    });

    it('infers the type from Ctrl+Enter and from the button', async () => {
      await render(<Test />);
      await openEditor(null);
      typeName('First');
      typeFormula('=item');
      await act(async () => getNameInput().focus());
      fireEvent.keyDown(getNameInput(), { key: 'Enter', ctrlKey: true });
      await microtasks();
      expect(getModel()[0].type).to.equal('string');

      await openEditor(null);
      typeName('Second');
      typeFormula('=item');
      fireEvent.click(getButton('Add column'));
      await microtasks();
      expect(getModel()[1].type).to.equal('string');
    });

    it('keeps the type the user picked', async () => {
      const { user } = await render(<Test />);
      await openEditor(null);
      typeName('Picked');
      await selectType(user, 'Boolean');
      typeFormula('=item');
      await pressEnterInFormula();
      expect(getModel()[0].type).to.equal('boolean');
    });

    it('keeps the default type without a preview row or with an error result', async () => {
      await render(<Test rows={[]} />);
      await openEditor(null);
      typeName('Greeting');
      typeFormula('="hello"');
      await pressEnterInFormula();
      expect(getModel()[0].type).to.equal('number');

      await act(async () => apiRef.current!.updateRows([{ id: 0, price: 1, quantity: 0 }]));
      await openEditor(null);
      typeName('Ratio');
      typeFormula('=price / quantity');
      await pressEnterInFormula();
      expect(getModel()[1].type).to.equal('number');
    });

    it('shows a hidden invalid format instead of applying it with the inferred type', async () => {
      const { user } = await render(<Test />);
      await openEditor(null);
      typeName('Amount');
      typeFormula('=price');
      await user.click(screen.getByRole('combobox', { name: 'Format' }));
      await user.click(within(screen.getByRole('listbox')).getByText('Currency'));
      fireEvent.change(screen.getByRole('textbox', { name: 'Currency code' }), {
        target: { value: 'U' },
      });
      typeFormula('=item');
      await waitFor(() => {
        expect(getTypeSelect().textContent).to.equal('Text');
      });
      expect(getButton('Add column')).to.have.property('disabled', false);

      typeFormula('=price * 2');
      await pressEnterInFormula();
      expect(getModel()).to.deep.equal([]);
      expect(getSidebar().open).to.equal(true);
      expect(getTypeSelect().textContent).to.equal('Number');
      expect(screen.getByRole('textbox', { name: 'Currency code' })).not.to.equal(null);
      expect(getButton('Add column')).to.have.property('disabled', true);
    });
  });

  describe('IME composition', () => {
    const currencyTotal = define('total', '=price * quantity', {
      headerName: 'Total',
      numberFormat: { style: 'currency', currency: 'EUR' },
    });

    it('does not apply when Enter confirms a composition in a text field', async () => {
      await render(<Test initialState={{ computedColumns: { model: [currencyTotal] } }} />);
      await openEditor('total');
      typeName('Changed');
      const inputs = [
        getNameInput(),
        screen.getByRole('textbox', { name: 'Currency code' }),
        screen.getByRole('spinbutton', { name: 'Decimals' }),
      ];
      for (let index = 0; index < inputs.length; index += 1) {
        const input = inputs[index];
        // eslint-disable-next-line no-await-in-loop
        await act(async () => input.focus());
        fireEvent.compositionStart(input);
        composingKeyDown(input, 'Enter');
      }
      await microtasks();
      expect(getSidebar().open).to.equal(true);
      expect(getModel()).to.deep.equal([currencyTotal]);
    });

    it('does not apply when Enter confirms a composition in the formula', async () => {
      await render(<Test initialState={{ computedColumns: { model: [currencyTotal] } }} />);
      await openEditor('total');
      typeName('Changed');
      await act(async () => getFormulaEditable().focus());
      fireEvent.compositionStart(getFormulaEditable());
      composingKeyDown(getFormulaEditable(), 'Enter');
      await microtasks();
      expect(getSidebar().open).to.equal(true);
      expect(getModel()).to.deep.equal([currencyTotal]);
    });

    it('does not apply on Ctrl+Enter during a composition', async () => {
      await render(<Test initialState={{ computedColumns: { model: [currencyTotal] } }} />);
      await openEditor('total');
      typeName('Changed');
      await act(async () => getNameInput().focus());
      fireEvent.compositionStart(getNameInput());
      fireEvent.keyDown(getNameInput(), {
        key: 'Enter',
        ctrlKey: true,
        keyCode: 229,
        isComposing: true,
      });
      await microtasks();
      expect(getSidebar().open).to.equal(true);
      expect(getModel()).to.deep.equal([currencyTotal]);
    });

    it('applies on a plain Enter once the composition ended', async () => {
      await render(<Test initialState={{ computedColumns: { model: [currencyTotal] } }} />);
      await openEditor('total');
      typeName('Changed');
      await act(async () => getNameInput().focus());
      fireEvent.compositionStart(getNameInput());
      composingKeyDown(getNameInput(), 'Enter');
      fireEvent.compositionEnd(getNameInput());
      fireEvent.keyDown(getNameInput(), { key: 'Enter' });
      await microtasks();
      expect(getModel()[0].headerName).to.equal('Changed');
    });

    it('does not cancel when Escape cancels a composition', async () => {
      await render(<Test initialState={{ computedColumns: { model: [currencyTotal] } }} />);
      await openEditor('total');
      await act(async () => getNameInput().focus());
      fireEvent.compositionStart(getNameInput());
      composingKeyDown(getNameInput(), 'Escape');
      await microtasks();
      expect(getSidebar().open).to.equal(true);

      await act(async () => getFormulaEditable().focus());
      fireEvent.compositionStart(getFormulaEditable());
      composingKeyDown(getFormulaEditable(), 'Escape');
      await microtasks();
      expect(getSidebar().open).to.equal(true);
    });
  });

  describe('outlines', () => {
    const getActiveEdit = () => apiRef.current!.state.formula.activeEdit;

    it('publishes the draft for the preview row, follows it and clears it on close', async () => {
      await render(<Test />);
      await openEditor(null);
      expect(getActiveEdit()).to.deep.equal({ id: 0, field: '__computed_draft__', draft: '=' });

      typeName('Total');
      typeFormula('=price * quantity');
      expect(getActiveEdit()).to.deep.equal({
        id: 0,
        field: 'total',
        draft: '=price * quantity',
      });

      await focusCell(2, 'price');
      expect(getActiveEdit()).to.deep.equal({
        id: 2,
        field: 'total',
        draft: '=price * quantity',
      });

      fireEvent.click(getButton('Cancel'));
      await microtasks();
      expect(getActiveEdit()).to.equal(null);
    });

    it('reclaims the highlight after another owner cleared it', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await openEditor('total');
      expect(getActiveEdit()).to.deep.equal({ id: 0, field: 'total', draft: '=price * quantity' });

      // The formula bar clears any draft on a cell focus move, `cellEditStop` unconditionally.
      await act(async () => getPrivateApi().setFormulaActiveEdit!(null));
      await microtasks();
      expect(getActiveEdit()).to.deep.equal({ id: 0, field: 'total', draft: '=price * quantity' });

      // A cell editor owns the highlight while a cell is edited.
      await act(async () => getPrivateApi().setFormulaActiveEdit!({ id: 1, field: 'price' }));
      await microtasks();
      expect(getActiveEdit()).to.deep.equal({ id: 1, field: 'price' });
      typeFormula('=price');
      expect(getActiveEdit()).to.deep.equal({ id: 1, field: 'price' });
      await act(async () => getPrivateApi().setFormulaActiveEdit!(null));
      await microtasks();
      expect(getActiveEdit()).to.deep.equal({ id: 0, field: 'total', draft: '=price' });
    });

    it.skipIf(isJSDOM)('outlines the referenced cells of the preview row', async () => {
      await render(<Test />);
      await openEditor(null);
      typeFormula('=price * quantity');
      const getRects = () => document.querySelectorAll('.MuiDataGrid-formulaReferenceHighlight');
      await waitFor(() => {
        expect(getRects()).to.have.length(2);
      });

      fireEvent.click(getButton('Cancel'));
      await microtasks();
      expect(getRects()).to.have.length(0);
    });
  });

  describe('reference pane', () => {
    const getReferencePane = () =>
      getPanel()!.querySelector<HTMLElement>(`.${gridClasses.computedColumnsPanelReference}`)!;
    const getReferenceItems = () =>
      within(getReferencePane())
        .getAllByRole('listitem')
        .map((node) => node.textContent);
    const getSearch = () => within(getReferencePane()).getByRole('searchbox') as HTMLInputElement;

    it('lists the columns and functions, filtered by the search', async () => {
      await render(
        <Test
          columns={[
            { field: 'item', headerName: 'Item' },
            { field: 'price', type: 'number' },
            { field: 'unit price', type: 'number', headerName: 'Unit price' },
          ]}
          initialState={{ computedColumns: { model: [total] } }}
        />,
      );
      await openEditor('total');
      const items = getReferenceItems();
      expect(items.slice(0, 3)).to.deep.equal([
        'itemItem',
        'price',
        'FIELD("unit price")Unit price',
      ]);
      expect(items.some((item) => item.startsWith('SUM(value1'))).to.equal(true);
      expect(items.some((item) => item.startsWith('total'))).to.equal(false);

      fireEvent.change(getSearch(), { target: { value: 'unit' } });
      expect(getReferenceItems()).to.deep.equal(['FIELD("unit price")Unit price']);

      fireEvent.change(getSearch(), { target: { value: 'zzz' } });
      expect(within(getReferencePane()).getByText('No matches')).not.to.equal(null);

      await act(async () => getSearch().focus());
      fireEvent.keyDown(getSearch(), { key: 'Escape' });
      expect(getSearch().value).to.equal('');
      expect(getSidebar().open).to.equal(true);
      expect(within(getPanel()!).getByText('Edit computed column')).not.to.equal(null);
    });

    it('inserts a column reference and a function call into the formula', async () => {
      await render(<Test />);
      await openEditor(null);
      fireEvent.click(within(getReferencePane()).getByRole('button', { name: /^price$/ }));
      await microtasks();
      expect(getFormulaEditable().textContent).to.equal('=price');
      expect(document.activeElement).to.equal(getFormulaEditable());

      typeFormula('=price * ');
      placeCaretAtEnd();
      fireEvent.click(within(getReferencePane()).getByRole('button', { name: /^SUM\(/ }));
      await microtasks();
      expect(getFormulaEditable().textContent).to.equal('=price * SUM(');

      typeFormula('');
      fireEvent.click(within(getReferencePane()).getByRole('button', { name: /^quantity$/ }));
      await microtasks();
      expect(getFormulaEditable().textContent).to.equal('=quantity');
    });

    describe('function registry', () => {
      const custom = (name: string, description: string) => ({
        name,
        minArgs: 1,
        maxArgs: 1,
        signature: `${name}(amount)`,
        description,
        apply: (args: any[]) => args[0],
      });
      const withFunctions = (...definitions: ReturnType<typeof custom>[]) => {
        const functions: Record<string, unknown> = { ...GRID_FORMULA_FUNCTIONS };
        definitions.forEach((definition) => {
          functions[definition.name] = definition;
        });
        return functions as any;
      };
      const getFunctionItems = (name: string) =>
        getReferenceItems().filter((item) => item !== null && item.startsWith(`${name}(`));

      it('lists a function added while the pane is open and inserts it', async () => {
        const { setProps } = await render(<Test />);
        await openEditor(null);
        expect(getFunctionItems('VAT')).to.deep.equal([]);

        setProps({ formulaFunctions: withFunctions(custom('VAT', 'Adds the tax.')) });
        await microtasks();
        expect(getFunctionItems('VAT')).to.deep.equal(['VAT(amount)Adds the tax.']);

        fireEvent.click(within(getReferencePane()).getByRole('button', { name: /^VAT\(/ }));
        await microtasks();
        expect(getFormulaEditable().textContent).to.equal('=VAT(');
      });

      it('removes a function removed while the pane is open', async () => {
        const { setProps } = await render(
          <Test formulaFunctions={withFunctions(custom('VAT', 'Adds the tax.'))} />,
        );
        await openEditor(null);
        expect(getFunctionItems('VAT')).to.have.length(1);

        setProps({ formulaFunctions: withFunctions() });
        await microtasks();
        expect(getFunctionItems('VAT')).to.deep.equal([]);
      });

      it('follows a replaced function under an active search query', async () => {
        const { setProps } = await render(
          <Test formulaFunctions={withFunctions(custom('VAT', 'Adds the tax.'))} />,
        );
        await openEditor(null);
        fireEvent.change(getSearch(), { target: { value: 'vat' } });
        expect(getReferenceItems()).to.deep.equal(['VAT(amount)Adds the tax.']);

        setProps({ formulaFunctions: withFunctions(custom('VAT', 'Adds the reduced tax.')) });
        await microtasks();
        expect(getReferenceItems()).to.deep.equal(['VAT(amount)Adds the reduced tax.']);

        setProps({
          formulaFunctions: withFunctions(custom('DISCOUNT', 'Applies the VAT-free price.')),
        });
        await microtasks();
        expect(getReferenceItems()).to.deep.equal(['DISCOUNT(amount)Applies the VAT-free price.']);
      });
    });

    it.skipIf(isJSDOM)('inserts at the caret and places the caret after the token', async () => {
      const { user } = await render(<Test />);
      await openEditor(null);
      const editable = getFormulaEditable();
      await user.click(editable);
      await user.keyboard('1 * 2');
      await user.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}');
      await user.click(within(getReferencePane()).getByRole('button', { name: /^price$/ }));

      expect(editable.textContent).to.equal('=1 price* 2');
      expect(document.activeElement).to.equal(editable);
      const selection = document.getSelection()!;
      expect(selection.isCollapsed).to.equal(true);
      const range = selection.getRangeAt(0);
      const preRange = document.createRange();
      preRange.selectNodeContents(editable);
      preRange.setEnd(range.startContainer, range.startOffset);
      expect(preRange.toString().length).to.equal('=1 price'.length);
    });
  });

  describe('keyboard', () => {
    it('cancels on Escape from any field', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await openEditor('total');
      typeName('Changed');
      await act(async () => getNameInput().focus());
      fireEvent.keyDown(getNameInput(), { key: 'Escape' });
      await microtasks();
      expect(getSidebar().open).to.equal(false);
      expect(getModel()).to.deep.equal([total]);

      await act(async () => apiRef.current!.showSidebar(GridSidebarValue.ComputedColumns));
      fireEvent.click(within(getPanel()!).getByRole('button', { name: /Total/ }));
      await microtasks();
      await act(async () => getFormulaEditable().focus());
      fireEvent.keyDown(getFormulaEditable(), { key: 'Escape' });
      await microtasks();
      expect(getSidebar().open).to.equal(true);
      expect(within(getPanel()!).getByText('Computed columns')).not.to.equal(null);
    });

    it('applies on Ctrl/Cmd+Enter from any field', async () => {
      await render(<Test />);
      await openEditor(null);
      typeName('Total');
      typeFormula('=price * quantity');
      await act(async () => getTypeSelect().focus());
      fireEvent.keyDown(getTypeSelect(), { key: 'Enter', ctrlKey: true });
      await microtasks();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
      expect(getSidebar().open).to.equal(false);

      await openEditor('total');
      typeName('Amount');
      await act(async () => getNameInput().focus());
      fireEvent.keyDown(getNameInput(), { key: 'Enter', metaKey: true });
      await microtasks();
      expect(getModel()[0].headerName).to.equal('Amount');
    });

    it('swallows End/Home when the caret is already at that edge of the formula', async () => {
      // Chromium would otherwise scroll the panel body away from the formula.
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await openEditor('total');
      const editable = getFormulaEditable();
      placeCaretAtEnd();
      const atEnd = new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true });
      act(() => {
        editable.dispatchEvent(atEnd);
      });
      expect(atEnd.defaultPrevented).to.equal(true);
      const homeFromEnd = new KeyboardEvent('keydown', {
        key: 'Home',
        bubbles: true,
        cancelable: true,
      });
      act(() => {
        editable.dispatchEvent(homeFromEnd);
      });
      expect(homeFromEnd.defaultPrevented).to.equal(false);
      expect(getSidebar().open).to.equal(true);
    });

    it('underlines the span of a parse error once the draft is dirty', async () => {
      await render(<Test />);
      await openEditor(null);
      typeFormula('=price *');
      const getErrorTokens = () =>
        Array.from(getFormulaEditable().querySelectorAll('.MuiDataGrid-formulaErrorToken')).map(
          (node) => node.textContent,
        );
      expect(
        getValidationMessages().some((message) => message!.startsWith('Formula error')),
      ).to.equal(true);
      expect(getErrorTokens()).to.have.length.greaterThan(0);

      typeFormula('=price * quantity');
      expect(getErrorTokens()).to.deep.equal([]);
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
