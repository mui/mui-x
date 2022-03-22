import * as React from 'react';
import {
  GridApi,
  DataGridProProps,
  useGridApiRef,
  GridEvents,
  DataGridPro,
  GridRenderEditCellParams,
  GridPreProcessEditCellProps,
  GridCellProps,
} from '@mui/x-data-grid-pro';
// @ts-ignore Remove once the test utils are typed
import { createRenderer, fireEvent } from '@mui/monorepo/test/utils';
import { expect } from 'chai';
import { getCell } from 'test/utils/helperFn';
import { spy } from 'sinon';
import { getData } from 'storybook/src/data/data-service';

const nativeSetTimeout = setTimeout;

describe('<DataGridPro /> - Cell Editing', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  let apiRef: React.MutableRefObject<GridApi>;

  const defaultData = getData(4, 2);

  const renderEditCell = spy((() => <input />) as (
    props: GridRenderEditCellParams,
  ) => React.ReactNode);

  let columnProps: any = {};

  const TestCase = (props: Partial<DataGridProProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          apiRef={apiRef}
          experimentalFeatures={{ newEditingApi: true }}
          {...defaultData}
          columns={defaultData.columns.map((column) =>
            column.field === 'currencyPair'
              ? { ...column, renderEditCell, editable: true, ...columnProps }
              : column,
          )}
          {...props}
        />
      </div>
    );
  };

  afterEach(() => {
    renderEditCell.resetHistory();
    columnProps = {};
  });

  describe('apiRef', () => {
    describe('startCellEditMode', () => {
      it('should throw when the cell is already in edit mode', () => {
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(() => {
          apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        }).to.throw('MUI: The cell with id=0 and field=currencyPair is not in view mode.');
      });

      it('should update the CSS class of the cell', () => {
        render(<TestCase />);
        expect(getCell(0, 1).className).not.to.contain('MuiDataGrid-cell--editing');
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(getCell(0, 1).className).to.contain('MuiDataGrid-cell--editing');
      });

      it('should render the component given in renderEditCell', () => {
        render(<TestCase />);
        expect(renderEditCell.callCount).to.equal(0);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(renderEditCell.callCount).not.to.equal(0);
      });

      it('should pass props to renderEditCell', () => {
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(renderEditCell.lastCall.args[0].value).to.equal('USDGBP');
        expect(renderEditCell.lastCall.args[0].error).to.equal(false);
        expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(false);
      });
    });

    describe('setEditCellValue', () => {
      it('should update the value prop given to renderEditCell', () => {
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(renderEditCell.lastCall.args[0].value).to.equal('USDGBP');
        apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'usdgbp' });
        expect(renderEditCell.lastCall.args[0].value).to.equal('usdgbp');
      });

      it('should pass the new value through the value parser if defined', () => {
        columnProps.valueParser = spy((value) => value.toLowerCase());
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(columnProps.valueParser.callCount).to.equal(0);
        apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        expect(columnProps.valueParser.callCount).to.equal(1);
        expect(renderEditCell.lastCall.args[0].value).to.equal('usd gbp');
      });

      it('should return true if no preProcessEditCellProps is defined', async () => {
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(
          await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        ).to.equal(true);
      });

      it('should set isProcessingProps to true before calling preProcessEditCellProps', async () => {
        columnProps.preProcessEditCellProps = spy(
          ({ props }: GridPreProcessEditCellProps) => props,
        );
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        const promise = apiRef.current.setEditCellValue({
          id: 0,
          field: 'currencyPair',
          value: 'USD GBP',
        });
        expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(true);
        return promise;
      });

      it('should call preProcessEditCellProps with the correct params', async () => {
        columnProps.preProcessEditCellProps = spy(
          ({ props }: GridPreProcessEditCellProps) => props,
        );
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        const args = columnProps.preProcessEditCellProps.lastCall.args[0];
        expect(args.id).to.equal(0);
        expect(args.row).to.deep.equal(defaultData.rows[0]);
        expect(args.hasChanged).to.equal(true);
        expect(args.props).to.deep.equal({
          value: 'USD GBP',
          error: false,
          isProcessingProps: true,
        });
      });

      it('should pass to renderEditCell the props returned by preProcessEditCellProps', async () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          foo: 'bar',
        });
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(renderEditCell.lastCall.args[0].foo).to.equal(undefined);
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        expect(renderEditCell.lastCall.args[0].foo).to.equal('bar');
      });

      it('should not pass to renderEditCell the value returned by preProcessEditCellProps', async () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          value: 'foobar',
        });
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(renderEditCell.lastCall.args[0].value).to.equal('USDGBP');
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        expect(renderEditCell.lastCall.args[0].value).to.equal('USD GBP');
      });

      it('should set isProcessingProps to false after calling preProcessEditCellProps', async () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => props;
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        const promise = apiRef.current.setEditCellValue({
          id: 0,
          field: 'currencyPair',
          value: 'USD GBP',
        }) as Promise<boolean>;
        expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(true);
        return promise.then(() => {
          expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(false);
        });
      });

      it('should return false if preProcessEditCellProps sets an error', async () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          error: true,
        });
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(
          await apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD GBP',
          }),
        ).to.equal(false);
      });

      it('should return false if the cell left the edit mode while calling preProcessEditCellProps', async () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) =>
          new Promise((resolve) => {
            // Simulates the user cancelling the editing while processing the props
            apiRef.current.stopCellEditMode({
              id: 0,
              field: 'currencyPair',
              ignoreModifications: true,
            });
            resolve(props);
          });
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(
          await apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD GBP',
          }),
        ).to.equal(false);
      });

      describe('with debounceMs > 0', () => {
        it('should debounce multiple changes if debounceMs > 0', () => {
          render(<TestCase />);
          apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
          expect(renderEditCell.lastCall.args[0].value).to.equal('USDGBP');
          renderEditCell.resetHistory();
          apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD',
            debounceMs: 100,
          });
          expect(renderEditCell.callCount).to.equal(0);
          apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD GBP',
            debounceMs: 100,
          });
          expect(renderEditCell.callCount).to.equal(0);
          clock.tick(100);
          expect(renderEditCell.callCount).not.to.equal(0);
          expect(renderEditCell.lastCall.args[0].value).to.equal('USD GBP');
        });
      });
    });

    describe('stopCellEditMode', () => {
      it('should throw an error when the cell is not in edit mode', () => {
        render(<TestCase />);
        expect(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' })).to.throw(
          'MUI: The cell with id=0 and field=currencyPair is not in edit mode.',
        );
      });

      it('should update the row with the new value stored', async () => {
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' });
        expect(getCell(0, 1).textContent).to.equal('USD GBP');
      });

      it('should not update the row if ignoreModifications=true', async () => {
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        apiRef.current.stopCellEditMode({
          id: 0,
          field: 'currencyPair',
          ignoreModifications: true,
        });
        expect(getCell(0, 1).textContent).to.equal('USDGBP');
      });

      it('should do nothing if props are still being processed and ignoreModifications=false', async () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) =>
          new Promise((resolve) => {
            // Simulates the user stopping the editing while processing the props
            apiRef.current.stopCellEditMode({
              id: 0,
              field: 'currencyPair',
            });
            resolve(props);
          });
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        expect(getCell(0, 1).className).to.contain('MuiDataGrid-cell--editing');
      });

      it('should do nothing if props contain error=true', async () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          error: true,
        });
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' });
        expect(getCell(0, 1).className).to.contain('MuiDataGrid-cell--editing');
      });

      it('should update the CSS class of the cell', async () => {
        render(<TestCase />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(getCell(0, 1).className).to.contain('MuiDataGrid-cell--editing');
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' });
        expect(getCell(0, 1).className).not.to.contain('MuiDataGrid-cell--editing');
      });

      it('should call processRowUpdate before updating the row', async () => {
        const processRowUpdate = spy((row) => ({ ...row, currencyPair: 'USD-GBP' }));
        render(<TestCase processRowUpdate={processRowUpdate} />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' });
        await new Promise((resolve) => nativeSetTimeout(resolve));
        expect(processRowUpdate.callCount).to.equal(1);
        expect(getCell(0, 1).textContent).to.equal('USD-GBP');
      });

      it('should call processRowUpdate with the new and old row', async () => {
        const processRowUpdate = spy((newRow, oldRow) => ({ ...oldRow, ...newRow }));
        render(<TestCase processRowUpdate={processRowUpdate} />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' });
        expect(processRowUpdate.lastCall.args[0]).to.deep.equal({
          ...defaultData.rows[0],
          currencyPair: 'USD GBP',
        });
        expect(processRowUpdate.lastCall.args[1]).to.deep.equal(defaultData.rows[0]);
      });

      it('should do nothing if processRowUpdate throws an error', async () => {
        const processRowUpdate = () => {
          throw new Error('Something went wrong');
        };
        render(<TestCase processRowUpdate={processRowUpdate} />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' })).to.throw();
        expect(getCell(0, 1).className).to.contain('MuiDataGrid-cell--editing');
      });

      it('should pass the new value through the value setter before calling processRowUpdate', async () => {
        columnProps.valueSetter = spy(({ value, row }) => ({ ...row, _currencyPair: value }));
        const processRowUpdate = spy((newRow) => newRow);
        render(<TestCase processRowUpdate={processRowUpdate} />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' });
        expect(processRowUpdate.lastCall.args[0]).to.deep.equal({
          ...defaultData.rows[0],
          currencyPair: 'USDGBP',
          _currencyPair: 'USD GBP',
        });
        expect(columnProps.valueSetter.lastCall.args[0]).to.deep.equal({
          value: 'USD GBP',
          row: defaultData.rows[0],
        });
      });

      it('should move focus to the cell below when cellToFocusAfter=below', async () => {
        const CustomEditComponent = ({ hasFocus }: GridCellProps) => {
          const ref = React.useRef<HTMLInputElement>(null);
          React.useLayoutEffect(() => {
            if (hasFocus) {
              ref.current!.focus();
            }
          }, [hasFocus]);
          return <input ref={ref} />;
        };
        columnProps.renderEditCell = (props: GridCellProps) => <CustomEditComponent {...props} />;
        render(<TestCase />);

        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(getCell(0, 1).querySelector('input')).toHaveFocus();
        apiRef.current.stopCellEditMode({
          id: 0,
          field: 'currencyPair',
          cellToFocusAfter: 'below',
        });
        expect(getCell(1, 1)).toHaveFocus();
      });

      it('should move focus to the cell on the right when cellToFocusAfter=right', async () => {
        const CustomEditComponent = ({ hasFocus }: GridCellProps) => {
          const ref = React.useRef<HTMLInputElement>(null);
          React.useLayoutEffect(() => {
            if (hasFocus) {
              ref.current!.focus();
            }
          }, [hasFocus]);
          return <input ref={ref} />;
        };
        columnProps.renderEditCell = (props: GridCellProps) => <CustomEditComponent {...props} />;
        render(
          <TestCase
            {...getData(1, 3)}
            columns={[
              { field: 'id' },
              { field: 'currencyPair', editable: true },
              { field: 'price1M', editable: true },
            ]}
          />,
        );

        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        expect(getCell(0, 1).querySelector('input')).toHaveFocus();
        apiRef.current.stopCellEditMode({
          id: 0,
          field: 'currencyPair',
          cellToFocusAfter: 'right',
        });
        expect(getCell(0, 2)).toHaveFocus();
      });

      it('should move focus to the cell on the left when cellToFocusAfter=left', async () => {
        const CustomEditComponent = ({ hasFocus }: GridCellProps) => {
          const ref = React.useRef<HTMLInputElement>(null);
          React.useLayoutEffect(() => {
            if (hasFocus) {
              ref.current!.focus();
            }
          }, [hasFocus]);
          return <input ref={ref} />;
        };
        columnProps.renderEditCell = (props: GridCellProps) => <CustomEditComponent {...props} />;
        render(
          <TestCase
            {...getData(1, 3)}
            columns={[
              { field: 'id' },
              { field: 'currencyPair', editable: true },
              { field: 'price1M', editable: true },
            ]}
          />,
        );

        apiRef.current.startCellEditMode({ id: 0, field: 'price1M' });
        expect(getCell(0, 2).querySelector('input')).toHaveFocus();
        apiRef.current.stopCellEditMode({
          id: 0,
          field: 'price1M',
          cellToFocusAfter: 'left',
        });
        expect(getCell(0, 1)).toHaveFocus();
      });

      it('should run all pending value mutations before calling processRowUpdate', async () => {
        const processRowUpdate = spy((newRow) => newRow);
        render(<TestCase processRowUpdate={processRowUpdate} />);
        apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        apiRef.current.setEditCellValue({
          id: 0,
          field: 'currencyPair',
          value: 'USD GBP',
          debounceMs: 100,
        });
        apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' });
        expect(renderEditCell.lastCall.args[0].value).to.equal('USD GBP');
        expect(processRowUpdate.lastCall.args[0].currencyPair).to.equal('USD GBP');
      });
    });
  });

  describe('start edit mode', () => {
    describe('by double-click', () => {
      it(`should publish 'cellEditStart' with reason=cellDoubleClick`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.cellEditStart, listener);
        const cell = getCell(0, 1);
        fireEvent.doubleClick(cell);
        expect(listener.lastCall.args[0].reason).to.equal('cellDoubleClick');
      });

      it(`should not publish 'cellEditStart' if the cell is not editable`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.cellEditStart, listener);
        const cell = getCell(0, 0);
        fireEvent.doubleClick(cell);
        expect(listener.callCount).to.equal(0);
      });

      it('should call startCellEditMode', () => {
        render(<TestCase />);
        const spiedStartCellEditMode = spy(apiRef.current, 'startCellEditMode');
        const cell = getCell(0, 1);
        fireEvent.doubleClick(cell);
        expect(spiedStartCellEditMode.callCount).to.equal(1);
      });
    });

    describe('by pressing Enter', () => {
      it(`should publish 'cellEditStart' with reason=enterKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.cellEditStart, listener);
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
      });

      it(`should not publish 'cellEditStart' if the cell is not editable`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.cellEditStart, listener);
        const cell = getCell(0, 0);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(listener.callCount).to.equal(0);
      });

      it('should call startCellEditMode', () => {
        render(<TestCase />);
        const spiedStartCellEditMode = spy(apiRef.current, 'startCellEditMode');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(spiedStartCellEditMode.callCount).to.equal(1);
      });
    });

    describe('by pressing Delete', () => {
      it(`should publish 'cellEditStart' with reason=deleteKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.cellEditStart, listener);
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'Delete' });
        expect(listener.lastCall.args[0].reason).to.equal('deleteKeyDown');
      });

      it(`should not publish 'cellEditStart' if the cell is not editable`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.cellEditStart, listener);
        const cell = getCell(0, 0);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'Delete' });
        expect(listener.callCount).to.equal(0);
      });

      it('should call startCellEditMode', () => {
        render(<TestCase />);
        const spiedStartCellEditMode = spy(apiRef.current, 'startCellEditMode');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'Delete' });
        expect(spiedStartCellEditMode.callCount).to.equal(1);
      });

      it('should empty the cell', () => {
        render(<TestCase />);
        const spiedSetEditCellValue = spy(apiRef.current, 'setEditCellValue');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'Delete' });
        expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
          id: 0,
          field: 'currencyPair',
          value: '',
        });
      });
    });

    describe('by pressing a printable character', () => {
      it(`should publish 'cellEditStart' with reason=printableKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.cellEditStart, listener);
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'a' });
        expect(listener.lastCall.args[0].reason).to.equal('printableKeyDown');
      });

      it(`should not publish 'cellEditStart' if the cell is not editable`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.cellEditStart, listener);
        const cell = getCell(0, 0);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'a' });
        expect(listener.callCount).to.equal(0);
      });

      ['shiftKey', 'ctrlKey', 'metaKey', 'altKey'].forEach((key) => {
        it(`should not publish 'cellEditStart' if ${key} is pressed`, () => {
          render(<TestCase />);
          const listener = spy();
          apiRef.current.subscribeEvent(GridEvents.cellEditStart, listener);
          const cell = getCell(0, 1);
          fireEvent.mouseUp(cell);
          fireEvent.click(cell);
          fireEvent.keyDown(cell, { key: 'a', [key]: true });
          expect(listener.callCount).to.equal(0);
        });
      });

      it('should call startCellEditMode', () => {
        render(<TestCase />);
        const spiedStartCellEditMode = spy(apiRef.current, 'startCellEditMode');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'a' });
        expect(spiedStartCellEditMode.callCount).to.equal(1);
      });

      it('should empty the cell', () => {
        render(<TestCase />);
        const spiedSetEditCellValue = spy(apiRef.current, 'setEditCellValue');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'a' });
        expect(spiedSetEditCellValue.lastCall.args[0]).to.deep.equal({
          id: 0,
          field: 'currencyPair',
          value: '',
        });
      });
    });
  });

  describe('stop edit mode', () => {
    describe('by clicking outside the cell', () => {
      it(`should publish 'cellEditStop' with reason=cellFocusOut`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.cellEditStop, listener);
        fireEvent.doubleClick(getCell(0, 1));
        expect(listener.callCount).to.equal(0);
        fireEvent.click(getCell(1, 1));
        expect(listener.lastCall.args[0].reason).to.equal('cellFocusOut');
      });

      it('should call stopCellEditMode with ignoreModifications=false and cellToFocusAfter=none', () => {
        render(<TestCase />);
        const spiedStopCellEditMode = spy(apiRef.current, 'stopCellEditMode');
        fireEvent.doubleClick(getCell(0, 1));
        fireEvent.click(getCell(1, 1));
        expect(spiedStopCellEditMode.callCount).to.equal(1);
        expect(spiedStopCellEditMode.lastCall.args[0]).to.deep.equal({
          id: 0,
          field: 'currencyPair',
          cellToFocusAfter: 'none',
          ignoreModifications: false,
        });
      });

      it('should call stopCellEditMode with ignoreModifications=true if the props are being processed', () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) =>
          new Promise((resolve) => resolve(props));
        render(<TestCase />);
        const spiedStopCellEditMode = spy(apiRef.current, 'stopCellEditMode');
        fireEvent.doubleClick(getCell(0, 1));
        apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        fireEvent.click(getCell(1, 1));
        expect(spiedStopCellEditMode.callCount).to.equal(1);
        expect(spiedStopCellEditMode.lastCall.args[0].ignoreModifications).to.equal(true);
      });
    });

    describe('by pressing Escape', () => {
      it(`should publish 'cellEditStop' with reason=escapeKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.cellEditStop, listener);
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.doubleClick(cell);
        expect(listener.callCount).to.equal(0);
        fireEvent.keyDown(cell, { key: 'Escape' });
        expect(listener.lastCall.args[0].reason).to.equal('escapeKeyDown');
      });

      it('should call stopCellEditMode with ignoreModifications=true and cellToFocusAfter=none', () => {
        render(<TestCase />);
        const spiedStopCellEditMode = spy(apiRef.current, 'stopCellEditMode');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.doubleClick(cell);
        fireEvent.keyDown(cell, { key: 'Escape' });
        expect(spiedStopCellEditMode.callCount).to.equal(1);
        expect(spiedStopCellEditMode.lastCall.args[0]).to.deep.equal({
          id: 0,
          field: 'currencyPair',
          cellToFocusAfter: 'none',
          ignoreModifications: true,
        });
      });
    });

    describe('by pressing Enter', () => {
      it(`should publish 'cellEditStop' with reason=enterKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.cellEditStop, listener);
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.doubleClick(cell);
        expect(listener.callCount).to.equal(0);
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
      });

      it('should call stopCellEditMode with ignoreModifications=false and cellToFocusAfter=below', () => {
        render(<TestCase />);
        const spiedStopCellEditMode = spy(apiRef.current, 'stopCellEditMode');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.doubleClick(cell);
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(spiedStopCellEditMode.callCount).to.equal(1);
        expect(spiedStopCellEditMode.lastCall.args[0]).to.deep.equal({
          id: 0,
          field: 'currencyPair',
          cellToFocusAfter: 'below',
          ignoreModifications: false,
        });
      });

      it('should call stopCellEditMode with ignoreModifications=true if the props are being processed', () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) =>
          new Promise((resolve) => resolve(props));
        render(<TestCase />);
        const spiedStopCellEditMode = spy(apiRef.current, 'stopCellEditMode');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.doubleClick(cell);
        apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(spiedStopCellEditMode.callCount).to.equal(1);
        expect(spiedStopCellEditMode.lastCall.args[0].ignoreModifications).to.equal(true);
      });
    });

    describe('by pressing Tab', () => {
      it(`should publish 'cellEditStop' with reason=tabKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.cellEditStop, listener);
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.doubleClick(cell);
        expect(listener.callCount).to.equal(0);
        fireEvent.keyDown(cell, { key: 'Tab' });
        expect(listener.lastCall.args[0].reason).to.equal('tabKeyDown');
      });

      it('should call stopCellEditMode with ignoreModifications=false and cellToFocusAfter=right', () => {
        render(<TestCase />);
        const spiedStopCellEditMode = spy(apiRef.current, 'stopCellEditMode');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.doubleClick(cell);
        fireEvent.keyDown(cell, { key: 'Tab' });
        expect(spiedStopCellEditMode.callCount).to.equal(1);
        expect(spiedStopCellEditMode.lastCall.args[0]).to.deep.equal({
          id: 0,
          field: 'currencyPair',
          cellToFocusAfter: 'right',
          ignoreModifications: false,
        });
      });

      it('should call stopCellEditMode with ignoreModifications=true if the props are being processed', () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) =>
          new Promise((resolve) => resolve(props));
        render(<TestCase />);
        const spiedStopCellEditMode = spy(apiRef.current, 'stopCellEditMode');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.doubleClick(cell);
        apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        fireEvent.keyDown(cell, { key: 'Tab' });
        expect(spiedStopCellEditMode.callCount).to.equal(1);
        expect(spiedStopCellEditMode.lastCall.args[0].ignoreModifications).to.equal(true);
      });
    });
  });
});
