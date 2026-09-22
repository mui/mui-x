import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { createRenderer, fireEvent, act, screen, within } from '@mui/internal-test-utils';
import { getCell, getColumnValues, microtasks } from 'test/utils/helperFn';
import {
  DataGridPremium,
  useGridApiRef,
  gridClasses,
  gridColumnFieldsSelector,
  gridColumnVisibilityModelSelector,
  gridVisibleColumnFieldsSelector,
  gridHistoryEnabledSelector,
  createComputedColumnsHistoryHandler,
  GridSidebarValue,
} from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import type {
  DataGridPremiumProps,
  GridApi,
  GridComputedColumnDefinition,
  GridComputedColumnsModel,
  GridEvents,
  GridHistoryEventHandler,
} from '@mui/x-data-grid-premium';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';

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
const tax = define('tax', '=price * 0.5', { headerName: 'Tax' });
const sum = define('sum', '=price + quantity', { headerName: 'Sum' });

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
const VALIDATION_SELECTOR = `.${gridClasses.computedColumnsPanelValidation}`;
const UNDO_KEY = { key: 'z', keyCode: 90, ctrlKey: true };
const REDO_KEY = { key: 'y', keyCode: 89, ctrlKey: true };
const REDO_SHIFT_KEY = { key: 'Z', keyCode: 90, ctrlKey: true, shiftKey: true };

describe('<DataGridPremium /> - Computed columns history', () => {
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

  const api = () => apiRef.current!;
  const typedApiRef = () => apiRef as RefObject<GridApi>;
  const getFields = () => gridColumnFieldsSelector(typedApiRef());
  const getModel = () => api().state.computedColumns.model;
  const getColumnValuesOf = (field: string) => getColumnValues(getFields().indexOf(field));
  const canUndo = () => api().history.canUndo();
  const canRedo = () => api().history.canRedo();
  const undo = async () => {
    let result = false;
    await act(async () => {
      result = await api().history.undo();
    });
    return result;
  };
  const redo = async () => {
    let result = false;
    await act(async () => {
      result = await api().history.redo();
    });
    return result;
  };
  const getPanel = () => document.querySelector<HTMLElement>(PANEL_SELECTOR);
  const getNameInput = () => screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
  const getFormulaEditable = () =>
    getPanel()!.querySelector<HTMLDivElement>(
      '[role="combobox"][aria-label="Formula"], [role="textbox"][aria-label="Formula"]',
    )!;
  const getButton = (name: string) => screen.getByRole('button', { name });
  const getListItems = () =>
    Array.from(getPanel()!.querySelectorAll(`.${gridClasses.computedColumnsPanelListItem}`));
  const getItemButton = (name: string) =>
    within(getPanel()!).getByRole('button', { name: new RegExp(name) });
  const getValidationMessages = () =>
    Array.from(getPanel()?.querySelectorAll(`${VALIDATION_SELECTOR} li`) ?? []).map(
      (node) => node.textContent,
    );
  const openList = async () => {
    await act(async () => api().showSidebar(GridSidebarValue.ComputedColumns));
  };
  const openEditor = async (field: string | null = null) => {
    await act(async () => api().showComputedColumnEditor(field));
  };
  const typeName = (value: string) => {
    fireEvent.change(getNameInput(), { target: { value } });
  };
  const typeFormula = (value: string) => {
    const editable = getFormulaEditable();
    editable.textContent = value;
    fireEvent.input(editable);
  };
  // The toolbar buttons sit in a tooltip-labelled wrapper.
  const getToolbarButton = (label: string) => screen.getByLabelText(label).querySelector('button')!;

  describe('API changes', () => {
    it('records an added column as one step and re-adds it at its index and width on redo', async () => {
      await render(<Test />);
      expect(canUndo()).to.equal(false);

      await act(async () => api().addComputedColumn(total, { columnIndex: 1 }));
      expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity']);
      expect(canUndo()).to.equal(true);
      await act(async () => api().setColumnWidth('total', 222));

      expect(await undo()).to.equal(true);
      expect(getModel()).to.deep.equal([]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
      expect(canUndo()).to.equal(false);
      expect(canRedo()).to.equal(true);

      expect(await redo()).to.equal(true);
      expect(getModel()).to.deep.equal([total]);
      expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity']);
      expect(api().getColumn('total')!.width).to.equal(222);
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);
      expect(canUndo()).to.equal(true);
      expect(canRedo()).to.equal(false);
    });

    it('records an edit as one step and restores the previous values in the cells', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);

      await act(async () =>
        api().updateComputedColumn('total', { formula: '=price + quantity', headerName: 'Sum' }),
      );
      expect(getColumnValuesOf('total')).to.deep.equal(['5', '15', '6']);

      await undo();
      expect(getModel()).to.deep.equal([total]);
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);
      expect(canUndo()).to.equal(false);

      await redo();
      expect(getModel()[0]).to.include({ formula: '=price + quantity', headerName: 'Sum' });
      expect(getColumnValuesOf('total')).to.deep.equal(['5', '15', '6']);
    });

    it('restores the column, its position, width and visibility when undoing a removal', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await act(async () => api().setColumnIndex('total', 1));
      await act(async () => api().setColumnWidth('total', 180));
      await act(async () => api().setColumnVisibility('total', false));
      expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity']);

      await act(async () => api().removeComputedColumn('total'));
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
      // "Show all columns" drops the key of the removed column from the visibility model.
      await act(async () => api().setColumnVisibilityModel({}));

      await undo();
      expect(getModel()).to.deep.equal([total]);
      expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity']);
      expect(api().getColumn('total')!.width).to.equal(180);
      expect(gridColumnVisibilityModelSelector(typedApiRef())).to.deep.equal({ total: false });
      expect(gridVisibleColumnFieldsSelector(typedApiRef())).to.deep.equal([
        'item',
        'price',
        'quantity',
      ]);
    });

    it('does not pin the default width of a column that was never resized', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      const defaultWidth = api().getColumn('total')!.width;
      await act(async () => api().removeComputedColumn('total'));
      await undo();
      expect(api().getColumn('total')!.width).to.equal(defaultWidth);
      expect(api().getColumn('total')!.hasBeenResized).not.to.equal(true);
    });

    it('brings a redone removal back where the column was left after the undo', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await act(async () => api().removeComputedColumn('total'));
      await undo();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);

      await act(async () => api().setColumnIndex('total', 0));
      expect(getFields()).to.deep.equal(['total', 'item', 'price', 'quantity']);

      await redo();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
      await undo();
      expect(getFields()).to.deep.equal(['total', 'item', 'price', 'quantity']);
    });

    it('records a `setComputedColumns` call touching several columns as one step', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total, tax] } }} />);
      await act(async () => api().setColumnIndex('tax', 0));
      expect(getFields()).to.deep.equal(['tax', 'item', 'price', 'quantity', 'total']);

      await act(async () => api().setComputedColumns([sum]));
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'sum']);

      await undo();
      expect(getModel()).to.deep.equal([total, tax]);
      expect(getFields()).to.deep.equal(['tax', 'item', 'price', 'quantity', 'total']);
      expect(canUndo()).to.equal(false);

      await redo();
      expect(getModel()).to.deep.equal([sum]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'sum']);
    });

    it('does not record anything when `historyStackSize` is 0', async () => {
      await render(<Test historyStackSize={0} />);
      await act(async () => api().addComputedColumn(total));
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
      expect(canUndo()).to.equal(false);
    });

    it('records nothing under a controlled model without `onComputedColumnsChange`', async () => {
      await render(<Test computedColumns={[total]} />);
      await act(async () => api().removeComputedColumn('total'));
      expect(getModel()).to.deep.equal([total]);
      expect(canUndo()).to.equal(false);
    });
  });

  describe('availability', () => {
    it('enables the history for a grid without editable columns', async () => {
      await render(<Test showToolbar />);
      expect(gridHistoryEnabledSelector(typedApiRef())).to.equal(true);
      expect(getToolbarButton('Undo').disabled).to.equal(true);
      expect(getToolbarButton('Redo').disabled).to.equal(true);
    });

    it('registers no handler without the formula feature', async () => {
      await render(<Test showToolbar featureDependencies={undefined} />);
      expect(gridHistoryEnabledSelector(typedApiRef())).to.equal(false);
      expect(screen.queryByLabelText('Undo')).to.equal(null);
      await act(async () => api().addComputedColumn(total));
      expect(getModel()).to.deep.equal([total]);
      expect(canUndo()).to.equal(false);
    });

    it('registers no handler when computed columns are disabled', async () => {
      await render(<Test showToolbar disableComputedColumns />);
      expect(gridHistoryEnabledSelector(typedApiRef())).to.equal(false);
      await act(async () => api().addComputedColumn(total));
      expect(canUndo()).to.equal(false);
    });

    it('keeps the editing handlers alongside the computed columns one', async () => {
      await render(
        <Test
          columns={[
            { field: 'item', editable: true },
            { field: 'price', type: 'number' },
            { field: 'quantity', type: 'number' },
          ]}
        />,
      );
      await act(async () => api().addComputedColumn(total));
      expect(canUndo()).to.equal(true);
      await undo();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
    });

    it('composes with a custom `historyEventHandlers` map', async () => {
      function CustomHandlers() {
        const customApiRef = useGridApiRef();
        apiRef = customApiRef;
        const handlers = React.useMemo(
          () =>
            ({
              computedColumnsChange: createComputedColumnsHistoryHandler(
                customApiRef as RefObject<GridApi>,
              ),
            }) as Record<GridEvents, GridHistoryEventHandler>,
          [customApiRef],
        );
        return (
          <div style={{ width: 900, height: 500 }}>
            <DataGridPremium
              {...baselineProps}
              apiRef={customApiRef}
              historyEventHandlers={handlers}
              initialState={{ computedColumns: { model: [total] } }}
            />
          </div>
        );
      }
      await render(<CustomHandlers />);

      await act(async () => api().addComputedColumn(tax));
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total', 'tax']);
      await undo();
      expect(getModel()).to.deep.equal([total]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
      await redo();
      expect(getModel()).to.deep.equal([total, tax]);
    });
  });

  describe('toolbar and shortcuts', () => {
    it('undoes and redoes from the toolbar buttons', async () => {
      await render(<Test showToolbar />);
      await act(async () => api().addComputedColumn(total));
      expect(getToolbarButton('Undo').disabled).to.equal(false);
      expect(getToolbarButton('Redo').disabled).to.equal(true);

      fireEvent.click(getToolbarButton('Undo'));
      await microtasks();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
      expect(getToolbarButton('Undo').disabled).to.equal(true);
      expect(getToolbarButton('Redo').disabled).to.equal(false);

      fireEvent.click(getToolbarButton('Redo'));
      await microtasks();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
    });

    it('undoes and redoes with the keyboard shortcuts', async () => {
      await render(<Test />);
      await act(async () => api().addComputedColumn(total));
      const cell = getCell(0, 0);
      await act(async () => cell.focus());

      fireEvent.keyDown(cell, UNDO_KEY);
      await microtasks();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);

      fireEvent.keyDown(cell, REDO_KEY);
      await microtasks();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);

      fireEvent.keyDown(cell, UNDO_KEY);
      await microtasks();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);

      fireEvent.keyDown(cell, REDO_SHIFT_KEY);
      await microtasks();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
    });
  });

  function Controlled({
    initialModel,
    onChange,
    copy,
    ...gridProps
  }: Partial<DataGridPremiumProps> & {
    initialModel?: GridComputedColumnsModel;
    onChange?: (model: GridComputedColumnsModel) => void;
    copy?: boolean;
  }) {
    const [model, setModel] = React.useState<GridComputedColumnsModel>(initialModel ?? []);
    return (
      <Test
        {...gridProps}
        computedColumns={model}
        onComputedColumnsChange={(nextModel) => {
          onChange?.(nextModel);
          setModel(copy ? [...nextModel] : nextModel);
        }}
      />
    );
  }

  describe('controlled model', () => {
    it('records the applied model once and ignores the echo of an undo/redo', async () => {
      const onChange = vi.fn();
      await render(<Controlled onChange={onChange} />);

      await act(async () => api().addComputedColumn(total, { columnIndex: 1 }));
      expect(getModel()).to.deep.equal([total]);
      expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity']);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(canUndo()).to.equal(true);
      await act(async () => api().setColumnWidth('total', 150));

      await undo();
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenLastCalledWith([]);
      expect(getModel()).to.deep.equal([]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
      // The echo of the undo is not a new step.
      expect(canUndo()).to.equal(false);
      expect(canRedo()).to.equal(true);

      await redo();
      expect(onChange).toHaveBeenCalledTimes(3);
      expect(getModel()).to.deep.equal([total]);
      expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity']);
      expect(api().getColumn('total')!.width).to.equal(150);
      expect(canUndo()).to.equal(true);
      expect(canRedo()).to.equal(false);

      await undo();
      expect(getModel()).to.deep.equal([]);
      expect(canUndo()).to.equal(false);
    });

    it('recognizes the echo of a parent that copies the model', async () => {
      await render(<Controlled copy initialModel={[total]} />);
      await act(async () => api().removeComputedColumn('total'));
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);

      await undo();
      expect(getModel()).to.deep.equal([total]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
      expect(canUndo()).to.equal(false);
      expect(canRedo()).to.equal(true);

      await redo();
      expect(getModel()).to.deep.equal([]);
      expect(canUndo()).to.equal(true);
      expect(canRedo()).to.equal(false);
    });

    it('records the echo when the parent passes `featureDependencies` inline', async () => {
      // A new `featureDependencies` object on every render of the parent must not
      // re-create the handlers in the commit that publishes the echoed model.
      function InlineFeature() {
        const [model, setModel] = React.useState<GridComputedColumnsModel>([]);
        return (
          <Test
            featureDependencies={{ formula: formulaFeature }}
            computedColumns={model}
            onComputedColumnsChange={setModel}
          />
        );
      }
      await render(<InlineFeature />);
      await act(async () => api().addComputedColumn(total));
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
      expect(canUndo()).to.equal(true);

      await undo();
      expect(getModel()).to.deep.equal([]);
      expect(canUndo()).to.equal(false);
      expect(canRedo()).to.equal(true);
    });

    it('restores the columns when the parent echoes before the operation returns', async () => {
      // In a browser, a click on Undo/Redo lets React flush the parent's `setModel` (and
      // the effect that publishes the echo) at the first `await` of the operation, while
      // the history hook still ignores every event as "triggered by undo/redo". A native
      // click outside `act` reproduces that timing; `act` would hold the update back.
      const clickOutsideAct = async (button: HTMLButtonElement) => {
        const actEnvironment = (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
        (globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
        try {
          button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          await microtasks();
        } finally {
          (globalThis as any).IS_REACT_ACT_ENVIRONMENT = actEnvironment;
        }
      };
      await render(<Controlled showToolbar />);
      await act(async () => api().addComputedColumn(total));
      await act(async () => api().setColumnWidth('total', 150));
      await act(async () => api().setColumnVisibility('total', false));

      await clickOutsideAct(getToolbarButton('Undo'));
      expect(getModel()).to.deep.equal([]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
      expect(api().state.history.stack).to.have.length(1);
      expect(canUndo()).to.equal(false);
      expect(canRedo()).to.equal(true);

      await clickOutsideAct(getToolbarButton('Redo'));
      expect(getModel()).to.deep.equal([total]);
      expect(api().getColumn('total')!.width).to.equal(150);
      expect(gridColumnVisibilityModelSelector(typedApiRef())).to.deep.equal({ total: false });
      expect(api().state.history.stack).to.have.length(1);
      expect(canUndo()).to.equal(true);
      expect(canRedo()).to.equal(false);

      // A later change equal to the last echo is a step of its own.
      await act(async () => api().removeComputedColumn('total'));
      expect(getModel()).to.deep.equal([]);
      expect(api().state.history.stack).to.have.length(2);
      await undo();
      expect(getModel()).to.deep.equal([total]);
      expect(api().getColumn('total')!.width).to.equal(150);
    });

    it('records a model set by the parent as a step', async () => {
      let setModel: React.Dispatch<React.SetStateAction<GridComputedColumnsModel>>;
      function Parent() {
        const [model, setModelState] = React.useState<GridComputedColumnsModel>([]);
        setModel = setModelState;
        return <Test computedColumns={model} onComputedColumnsChange={setModelState} />;
      }
      await render(<Parent />);
      await act(async () => setModel([total]));
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
      expect(canUndo()).to.equal(true);
      await undo();
      expect(getModel()).to.deep.equal([]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
    });
  });

  describe('re-enabled history', () => {
    const getStackSize = () => api().state.history.stack.length;

    it('records from the model that held when recording resumed', async () => {
      const { setProps } = await render(<Test historyStackSize={0} />);
      await act(async () => api().addComputedColumn(total));
      expect(canUndo()).to.equal(false);

      setProps({ historyStackSize: 20 });
      await act(async () => api().addComputedColumn(tax));
      expect(getStackSize()).to.equal(1);

      await undo();
      expect(getModel()).to.deep.equal([total]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
      expect(canUndo()).to.equal(false);
      await redo();
      expect(getModel()).to.deep.equal([total, tax]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total', 'tax']);
    });

    it('records from the model that held when recording resumed (controlled model)', async () => {
      const { setProps } = await render(<Controlled historyStackSize={0} />);
      await act(async () => api().addComputedColumn(total));
      expect(getModel()).to.deep.equal([total]);
      expect(canUndo()).to.equal(false);

      setProps({ historyStackSize: 20 });
      await act(async () => api().addComputedColumn(tax));
      expect(getModel()).to.deep.equal([total, tax]);
      expect(getStackSize()).to.equal(1);

      await undo();
      expect(getModel()).to.deep.equal([total]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
      expect(canUndo()).to.equal(false);
      expect(canRedo()).to.equal(true);
      await redo();
      expect(getModel()).to.deep.equal([total, tax]);
    });

    it('neither records nor undoes the changes made while the history was off', async () => {
      const { setProps } = await render(<Test />);
      await act(async () => api().addComputedColumn(total));
      expect(getStackSize()).to.equal(1);

      setProps({ historyStackSize: 0 });
      await act(async () => api().addComputedColumn(tax));
      expect(canUndo()).to.equal(false);
      expect(getStackSize()).to.equal(0);

      setProps({ historyStackSize: 20 });
      await act(async () => api().addComputedColumn(sum));
      expect(getStackSize()).to.equal(1);

      await undo();
      expect(getModel()).to.deep.equal([total, tax]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total', 'tax']);
      expect(canUndo()).to.equal(false);
      expect(canRedo()).to.equal(true);

      await redo();
      expect(getModel()).to.deep.equal([total, tax, sum]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total', 'tax', 'sum']);
    });
  });

  describe('inline props', () => {
    // Every render of the parent hands the grid a new `isCellEditable` / `columns` /
    // `historyEventHandlers` identity, so the handlers map is re-created in the commit
    // that echoes a controlled model. The inline values are created inside the parent's
    // render: a prop of `Controlled` would keep its identity across its re-renders.
    const getStackSize = () => api().state.history.stack.length;

    function InlineEditable() {
      const [model, setModel] = React.useState<GridComputedColumnsModel>([]);
      return (
        <Test
          isCellEditable={() => true}
          computedColumns={model}
          onComputedColumnsChange={setModel}
        />
      );
    }

    it('records exactly one step under an inline `isCellEditable` with a controlled model', async () => {
      await render(<InlineEditable />);
      await act(async () => api().addComputedColumn(total));
      expect(getModel()).to.deep.equal([total]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
      expect(getStackSize()).to.equal(1);
      expect(canUndo()).to.equal(true);

      await undo();
      expect(getModel()).to.deep.equal([]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
      expect(canUndo()).to.equal(false);
      expect(canRedo()).to.equal(true);

      await redo();
      expect(getModel()).to.deep.equal([total]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
      expect(getStackSize()).to.equal(1);
    });

    it('records the echo when the parent passes `columns` inline', async () => {
      function InlineColumns() {
        const [model, setModel] = React.useState<GridComputedColumnsModel>([]);
        return (
          <Test
            columns={[...baselineProps.columns]}
            computedColumns={model}
            onComputedColumnsChange={setModel}
          />
        );
      }
      await render(<InlineColumns />);
      await act(async () => api().addComputedColumn(total, { columnIndex: 1 }));
      expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity']);
      expect(getStackSize()).to.equal(1);

      await undo();
      expect(getModel()).to.deep.equal([]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);
      expect(canUndo()).to.equal(false);
      await redo();
      expect(getFields()).to.deep.equal(['item', 'total', 'price', 'quantity']);
    });

    it('recognizes the echo of an undo under an inline `isCellEditable` and restores the width', async () => {
      await render(<InlineEditable />);
      await act(async () => api().addComputedColumn(total));
      await act(async () => api().setColumnWidth('total', 150));

      await undo();
      expect(getModel()).to.deep.equal([]);
      // The echo is the undo itself, not a new step.
      expect(getStackSize()).to.equal(1);
      expect(canUndo()).to.equal(false);
      expect(canRedo()).to.equal(true);

      await redo();
      expect(getModel()).to.deep.equal([total]);
      expect(api().getColumn('total')!.width).to.equal(150);
      expect(canUndo()).to.equal(true);
      expect(canRedo()).to.equal(false);
    });

    it('keeps recording with a custom `historyEventHandlers` map re-created on every render', async () => {
      function InlineHandlers() {
        const customApiRef = useGridApiRef();
        apiRef = customApiRef;
        const [model, setModel] = React.useState<GridComputedColumnsModel>([total]);
        return (
          <div style={{ width: 900, height: 500 }}>
            <DataGridPremium
              {...baselineProps}
              apiRef={customApiRef}
              historyEventHandlers={
                {
                  computedColumnsChange: createComputedColumnsHistoryHandler(
                    customApiRef as RefObject<GridApi>,
                  ),
                } as Record<GridEvents, GridHistoryEventHandler>
              }
              computedColumns={model}
              onComputedColumnsChange={setModel}
            />
          </div>
        );
      }
      await render(<InlineHandlers />);

      await act(async () => api().addComputedColumn(tax));
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total', 'tax']);
      expect(getStackSize()).to.equal(1);
      await act(async () => api().setColumnWidth('tax', 160));

      await undo();
      expect(getModel()).to.deep.equal([total]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
      expect(canUndo()).to.equal(false);
      expect(canRedo()).to.equal(true);

      await redo();
      expect(getModel()).to.deep.equal([total, tax]);
      expect(api().getColumn('tax')!.width).to.equal(160);
      expect(canUndo()).to.equal(true);
    });
  });

  describe('panel', () => {
    it('records Apply from the editor as one step', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await openEditor('total');
      typeName('Amount');
      typeFormula('=price + quantity');
      fireEvent.click(getButton('Apply'));
      await microtasks();
      expect(getModel()[0]).to.include({ headerName: 'Amount', formula: '=price + quantity' });
      expect(canUndo()).to.equal(true);

      await undo();
      expect(getModel()).to.deep.equal([total]);
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);
      expect(canUndo()).to.equal(false);
    });

    it('records a removal from the list as one step and shows the column again on undo', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total, tax] } }} />);
      await openList();
      fireEvent.click(
        within(getPanel()!).getAllByRole('button', { name: 'Computed column actions' })[0],
      );
      fireEvent.click(screen.getByRole('menuitem', { name: 'Remove computed column' }));
      await microtasks();
      expect(getListItems()).to.have.length(1);
      expect(canUndo()).to.equal(true);

      await undo();
      expect(getModel()).to.deep.equal([total, tax]);
      expect(getListItems().map((item) => item.textContent)).to.deep.equal([
        'ƒxTotal=price * quantity',
        'ƒxTax=price * 0.5',
      ]);
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total', 'tax']);
      expect(canUndo()).to.equal(false);
    });

    it('records a removal from the column menu as one step', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await act(async () => api().showColumnMenu('total'));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Remove computed column' }));
      await microtasks();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity']);

      await undo();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
      expect(canUndo()).to.equal(false);
    });

    it('leaves the undo shortcut to the text fields of the panel', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await act(async () => api().addComputedColumn(tax));
      await openEditor('total');

      const nameInput = getNameInput();
      await act(async () => nameInput.focus());
      fireEvent.keyDown(nameInput, UNDO_KEY);
      await microtasks();
      expect(getModel()).to.deep.equal([total, tax]);
      expect(canUndo()).to.equal(true);

      const editable = getFormulaEditable();
      await act(async () => editable.focus());
      fireEvent.keyDown(editable, UNDO_KEY);
      await microtasks();
      expect(getModel()).to.deep.equal([total, tax]);

      const applyButton = getButton('Apply');
      await act(async () => applyButton.focus());
      fireEvent.keyDown(applyButton, UNDO_KEY);
      await microtasks();
      expect(getModel()).to.deep.equal([total]);
      expect(canUndo()).to.equal(false);
    });

    it('shows the list when the edited column leaves the model', async () => {
      await render(<Test />);
      await act(async () => api().addComputedColumn(total));
      await openList();
      fireEvent.click(getItemButton('Total'));
      await microtasks();
      expect(within(getPanel()!).getByText('Edit computed column')).not.to.equal(null);
      expect(document.activeElement).to.equal(getFormulaEditable());

      await undo();
      expect(getModel()).to.deep.equal([]);
      expect(within(getPanel()!).getByText('Computed columns')).not.to.equal(null);
      expect(within(getPanel()!).getByText('No computed columns yet')).not.to.equal(null);
      // The focus was inside the editor: it stays in the panel.
      expect(document.activeElement).to.equal(getButton('Add computed column'));

      await redo();
      expect(getListItems()).to.have.length(1);
    });

    it('does not move the focus into the list when it was outside the panel', async () => {
      await render(<Test />);
      await act(async () => api().addComputedColumn(total));
      await openEditor('total');
      const cell = getCell(0, 0);
      await act(async () => cell.focus());

      await undo();
      expect(within(getPanel()!).getByText('Computed columns')).not.to.equal(null);
      expect(document.activeElement).to.equal(cell);
    });

    it('keeps the draft when the edited definition changes under the editor', async () => {
      await render(<Test initialState={{ computedColumns: { model: [total] } }} />);
      await act(async () => api().updateComputedColumn('total', { formula: '=price + quantity' }));
      await openEditor('total');
      expect(getFormulaEditable().textContent).to.equal('=price + quantity');
      typeName('Changed');

      await undo();
      expect(getColumnValuesOf('total')).to.deep.equal(['6', '50', '8']);
      expect(within(getPanel()!).getByText('Edit computed column')).not.to.equal(null);
      expect(getNameInput().value).to.equal('Changed');
      expect(getFormulaEditable().textContent).to.equal('=price + quantity');

      fireEvent.click(getButton('Apply'));
      await microtasks();
      expect(getModel()[0]).to.include({ headerName: 'Changed', formula: '=price + quantity' });
    });

    it('re-validates the draft when a redo takes its field', async () => {
      await render(<Test />);
      await act(async () => api().addComputedColumn(total));
      await undo();
      await openList();
      fireEvent.click(getButton('Add computed column'));
      await microtasks();
      typeName('Total');
      typeFormula('=price');
      expect(getValidationMessages()).to.deep.equal([]);
      expect((getButton('Add column') as HTMLButtonElement).disabled).to.equal(false);

      await redo();
      expect(getFields()).to.deep.equal(['item', 'price', 'quantity', 'total']);
      expect(getValidationMessages()).to.deep.equal([
        'A column with the field "total" already exists.',
      ]);
      expect((getButton('Add column') as HTMLButtonElement).disabled).to.equal(true);
    });
  });
});
