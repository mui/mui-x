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
import { getCell, getRow } from 'test/utils/helperFn';
import { spy } from 'sinon';
import { getData } from 'storybook/src/data/data-service';

describe('<DataGridPro /> - Row Editing', () => {
  const { render, clock } = createRenderer();

  let apiRef: React.MutableRefObject<GridApi>;

  const defaultData = getData(4, 4);

  const renderEditCell1 = spy((() => <input />) as (
    props: GridRenderEditCellParams,
  ) => React.ReactNode);

  const renderEditCell2 = spy((() => <input />) as (
    props: GridRenderEditCellParams,
  ) => React.ReactNode);

  let column1Props: any = {};
  let column2Props: any = {};

  const TestCase = (props: Partial<DataGridProProps>) => {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          apiRef={apiRef}
          editMode="row"
          disableVirtualization
          experimentalFeatures={{ newEditingApi: true }}
          {...defaultData}
          columns={defaultData.columns.map((column) => {
            if (column.field === 'currencyPair') {
              return {
                ...column,
                renderEditCell: renderEditCell1,
                editable: true,
                ...column1Props,
              };
            }
            if (column.field === 'price1M') {
              return {
                ...column,
                renderEditCell: renderEditCell2,
                editable: true,
                ...column2Props,
              };
            }
            return column;
          })}
          {...props}
        />
      </div>
    );
  };

  afterEach(() => {
    renderEditCell1.resetHistory();
    renderEditCell2.resetHistory();
    column1Props = {};
    column2Props = {};
  });

  describe('apiRef', () => {
    describe('startRowEditMode', () => {
      it('should throw when the row is already in edit mode', () => {
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        expect(() => {
          apiRef.current.startRowEditMode({ id: 0 });
        }).to.throw('MUI: The row with id=0 is not in view mode.');
      });

      it('should update the CSS class of all editable cells', () => {
        render(<TestCase />);
        expect(getCell(0, 1).className).not.to.contain('MuiDataGrid-cell--editing');
        apiRef.current.startRowEditMode({ id: 0 });
        expect(getCell(0, 1).className).to.contain('MuiDataGrid-cell--editing');
        expect(getCell(0, 2).className).to.contain('MuiDataGrid-cell--editing');
        expect(getCell(0, 3).className).not.to.contain('MuiDataGrid-cell--editing');
      });

      it('should update the CSS class of the row', () => {
        render(<TestCase />);
        expect(getRow(0).className).not.to.contain('MuiDataGrid-row--editing');
        apiRef.current.startRowEditMode({ id: 0 });
        expect(getRow(0).className).to.contain('MuiDataGrid-row--editing');
      });

      it('should render the components given in renderEditCell', () => {
        render(<TestCase />);
        expect(renderEditCell1.callCount).to.equal(0);
        expect(renderEditCell2.callCount).to.equal(0);
        apiRef.current.startRowEditMode({ id: 0 });
        expect(renderEditCell1.callCount).not.to.equal(0);
        expect(renderEditCell2.callCount).not.to.equal(0);
      });

      it('should pass props to renderEditCell', () => {
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        expect(renderEditCell1.lastCall.args[0].value).to.equal('USDGBP');
        expect(renderEditCell1.lastCall.args[0].error).to.equal(false);
        expect(renderEditCell1.lastCall.args[0].isProcessingProps).to.equal(false);
        expect(renderEditCell2.lastCall.args[0].value).to.equal(1);
        expect(renderEditCell2.lastCall.args[0].error).to.equal(false);
        expect(renderEditCell2.lastCall.args[0].isProcessingProps).to.equal(false);
      });
    });

    describe('setEditCellValue', () => {
      it('should update the value prop given to renderEditCell', async () => {
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        expect(renderEditCell1.lastCall.args[0].value).to.equal('USDGBP');
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'usdgbp' });
        expect(renderEditCell1.lastCall.args[0].value).to.equal('usdgbp');
      });

      it('should pass the new value through the value parser if defined', async () => {
        column1Props.valueParser = spy((value) => value.toLowerCase());
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        expect(column1Props.valueParser.callCount).to.equal(0);
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        expect(column1Props.valueParser.callCount).to.equal(1);
        expect(renderEditCell1.lastCall.args[0].value).to.equal('usd gbp');
      });

      it('should return true if no preProcessEditCellProps is defined', async () => {
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        expect(
          await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        ).to.equal(true);
      });

      it('should set isProcessingProps to true before calling preProcessEditCellProps', async () => {
        column1Props.preProcessEditCellProps = spy(
          ({ props }: GridPreProcessEditCellProps) => props,
        );
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        expect(renderEditCell1.lastCall.args[0].isProcessingProps).to.equal(true);
      });

      it('should call all preProcessEditCellProps with the correct params', async () => {
        column1Props.preProcessEditCellProps = spy(
          ({ props }: GridPreProcessEditCellProps) => props,
        );
        column2Props.preProcessEditCellProps = spy(
          ({ props }: GridPreProcessEditCellProps) => props,
        );
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });

        const args1 = column1Props.preProcessEditCellProps.lastCall.args[0];
        expect(args1.id).to.equal(0);
        expect(args1.row).to.deep.equal(defaultData.rows[0]);
        expect(args1.hasChanged).to.equal(true);
        expect(args1.props).to.deep.equal({
          value: 'USD GBP',
          error: false,
          isProcessingProps: true,
        });

        const args2 = column2Props.preProcessEditCellProps.lastCall.args[0];
        expect(args2.id).to.equal(0);
        expect(args2.row).to.deep.equal(defaultData.rows[0]);
        expect(args2.hasChanged).to.equal(false);
        expect(args2.props).to.deep.equal({
          value: 1,
          error: false,
          isProcessingProps: true,
        });
      });

      it('should pass to renderEditCell the props returned by preProcessEditCellProps', async () => {
        column1Props.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          foo: 'bar',
        });
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        expect(renderEditCell1.lastCall.args[0].foo).to.equal(undefined);
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        expect(renderEditCell1.lastCall.args[0].foo).to.equal('bar');
      });

      it('should not pass to renderEditCell the value returned by preProcessEditCellProps', async () => {
        column1Props.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          value: 'foobar',
        });
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        expect(renderEditCell1.lastCall.args[0].value).to.equal('USDGBP');
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        expect(renderEditCell1.lastCall.args[0].value).to.equal('USD GBP');
      });

      it('should set isProcessingProps to false after calling preProcessEditCellProps', async () => {
        column1Props.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => props;
        column2Props.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => props;
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        const promise = apiRef.current.setEditCellValue({
          id: 0,
          field: 'currencyPair',
          value: 'USD GBP',
        }) as Promise<boolean>;
        expect(renderEditCell1.lastCall.args[0].isProcessingProps).to.equal(true);
        expect(renderEditCell2.lastCall.args[0].isProcessingProps).to.equal(true);
        return promise.then(() => {
          expect(renderEditCell1.lastCall.args[0].isProcessingProps).to.equal(false);
          expect(renderEditCell2.lastCall.args[0].isProcessingProps).to.equal(false);
        });
      });

      it('should return false if preProcessEditCellProps sets an error', async () => {
        column1Props.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          error: true,
        });
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        expect(
          await apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD GBP',
          }),
        ).to.equal(false);
      });

      it('should return false if the cell left the edit mode while calling preProcessEditCellProps', async () => {
        column1Props.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) =>
          new Promise((resolve) => {
            // Simulates the user cancelling the editing while processing the props
            apiRef.current.stopRowEditMode({
              id: 0,
              ignoreModifications: true,
            });
            resolve(props);
          });
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        expect(
          await apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD GBP',
          }),
        ).to.equal(false);
      });

      describe('with debounceMs > 0', () => {
        clock.withFakeTimers();

        it('should debounce multiple changes if debounceMs > 0', () => {
          render(<TestCase />);
          apiRef.current.startRowEditMode({ id: 0 });
          expect(renderEditCell1.lastCall.args[0].value).to.equal('USDGBP');
          renderEditCell1.resetHistory();
          apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD',
            debounceMs: 100,
          });
          expect(renderEditCell1.callCount).to.equal(0);
          apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD GBP',
            debounceMs: 100,
          });
          expect(renderEditCell1.callCount).to.equal(0);
          clock.tick(100);
          expect(renderEditCell1.callCount).not.to.equal(0);
          expect(renderEditCell1.lastCall.args[0].value).to.equal('USD GBP');
        });
      });
    });

    describe('stopRowEditMode', () => {
      it('should reject when the cell is not in edit mode', async () => {
        render(<TestCase />);
        return apiRef.current.stopRowEditMode({ id: 0 }).catch((error) => {
          expect(error.message).to.equal('MUI: The row with id=0 is not in edit mode.');
        });
      });

      it('should update the row with the new value stored', async () => {
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        await apiRef.current.stopRowEditMode({ id: 0 });
        expect(getCell(0, 1).textContent).to.equal('USD GBP');
      });

      it('should not update the row if ignoreModifications=true', async () => {
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        await apiRef.current.stopRowEditMode({ id: 0, ignoreModifications: true });
        expect(getCell(0, 1).textContent).to.equal('USDGBP');
      });

      it('should do nothing if props are still being processed and ignoreModifications=false', async () => {
        column1Props.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) =>
          new Promise((resolve) => {
            // Simulates the user stopping the editing while processing the props
            apiRef.current.stopRowEditMode({ id: 0 }).then(() => resolve(props));
          });
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        expect(getCell(0, 1).className).to.contain('MuiDataGrid-cell--editing');
      });

      it('should do nothing if props of any column contain error=true', async () => {
        column1Props.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          error: true,
        });
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        await apiRef.current.stopRowEditMode({ id: 0 });
        expect(getCell(0, 1).className).to.contain('MuiDataGrid-cell--editing');
      });

      it('should update the CSS class of the cell', async () => {
        render(<TestCase />);
        apiRef.current.startRowEditMode({ id: 0 });
        expect(getCell(0, 1).className).to.contain('MuiDataGrid-cell--editing');
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        await apiRef.current.stopRowEditMode({ id: 0 });
        expect(getCell(0, 1).className).not.to.contain('MuiDataGrid-cell--editing');
      });

      it('should call processRowUpdate before updating the row', async () => {
        const processRowUpdate = spy((row) => ({ ...row, currencyPair: 'USD-GBP' }));
        render(<TestCase processRowUpdate={processRowUpdate} />);
        apiRef.current.startRowEditMode({ id: 0 });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        await apiRef.current.stopRowEditMode({ id: 0 });
        expect(processRowUpdate.callCount).to.equal(1);
        expect(getCell(0, 1).textContent).to.equal('USD-GBP');
      });

      it('should call processRowUpdate with the new and old row', async () => {
        const processRowUpdate = spy((newRow, oldRow) => ({ ...oldRow, ...newRow }));
        render(<TestCase processRowUpdate={processRowUpdate} />);
        apiRef.current.startRowEditMode({ id: 0 });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        await apiRef.current.stopRowEditMode({ id: 0 });
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
        apiRef.current.startRowEditMode({ id: 0 });
        await apiRef.current.stopRowEditMode({ id: 0 });
        expect(getCell(0, 1).className).to.contain('MuiDataGrid-cell--editing');
      });

      it('should pass the new value through all value setters before calling processRowUpdate', async () => {
        column1Props.valueSetter = spy(({ value, row }) => ({ ...row, _currencyPair: value }));
        column2Props.valueSetter = spy(({ value, row }) => ({ ...row, _price1M: value }));
        const processRowUpdate = spy((newRow) => newRow);
        render(<TestCase processRowUpdate={processRowUpdate} />);
        apiRef.current.startRowEditMode({ id: 0 });
        await apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        await apiRef.current.stopRowEditMode({ id: 0 });
        expect(processRowUpdate.lastCall.args[0]).to.deep.equal({
          ...defaultData.rows[0],
          currencyPair: 'USDGBP',
          _currencyPair: 'USD GBP',
          price1M: 1,
          _price1M: 1,
        });
        expect(column1Props.valueSetter.lastCall.args[0]).to.deep.equal({
          value: 'USD GBP',
          row: defaultData.rows[0],
        });
        expect(column2Props.valueSetter.lastCall.args[0]).to.deep.equal({
          value: 1,
          row: { ...defaultData.rows[0], currencyPair: 'USDGBP', _currencyPair: 'USD GBP' }, // Ensure that the row contains the values from the previous setter
        });
      });

      it('should move focus to the cell below when fieldFromRowBelowToFocus is passed', async () => {
        const CustomEditComponent = ({ hasFocus }: GridCellProps) => {
          const ref = React.useRef<HTMLInputElement>(null);
          React.useLayoutEffect(() => {
            if (hasFocus) {
              ref.current!.focus();
            }
          }, [hasFocus]);
          return <input ref={ref} />;
        };
        column1Props.renderEditCell = (props: GridCellProps) => <CustomEditComponent {...props} />;
        render(<TestCase />);

        apiRef.current.startRowEditMode({ id: 0, fieldToFocus: 'currencyPair' });
        expect(getCell(0, 1).querySelector('input')).toHaveFocus();
        await apiRef.current.stopRowEditMode({ id: 0, fieldFromRowBelowToFocus: 'currencyPair' });
        expect(getCell(1, 1)).toHaveFocus();
      });

      describe('with pending value mutation', () => {
        clock.withFakeTimers();

        it('should run all pending value mutations before calling processRowUpdate', async () => {
          const processRowUpdate = spy((newRow) => newRow);
          render(<TestCase processRowUpdate={processRowUpdate} />);
          apiRef.current.startRowEditMode({ id: 0 });
          apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD GBP',
            debounceMs: 100,
          });
          await apiRef.current.stopRowEditMode({ id: 0 });
          expect(renderEditCell1.lastCall.args[0].value).to.equal('USD GBP');
          expect(processRowUpdate.lastCall.args[0].currencyPair).to.equal('USD GBP');
        });
      });
    });
  });

  describe('start edit mode', () => {
    describe('by double-click', () => {
      it(`should publish 'rowEditStart' with reason=cellDoubleClick`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.rowEditStart, listener);
        const cell = getCell(0, 1);
        fireEvent.doubleClick(cell);
        expect(listener.lastCall.args[0].reason).to.equal('cellDoubleClick');
      });

      it(`should not publish 'rowEditStart' if the cell is not editable`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.rowEditStart, listener);
        const cell = getCell(0, 0);
        fireEvent.doubleClick(cell);
        expect(listener.callCount).to.equal(0);
      });

      it('should call startRowEditMode', () => {
        render(<TestCase />);
        const spiedStartRowEditMode = spy(apiRef.current, 'startRowEditMode');
        const cell = getCell(0, 1);
        fireEvent.doubleClick(cell);
        expect(spiedStartRowEditMode.callCount).to.equal(1);
      });
    });

    describe('by pressing Enter', () => {
      it(`should publish 'rowEditStart' with reason=enterKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.rowEditStart, listener);
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
      });

      it(`should not publish 'rowEditStart' if the cell is not editable`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.rowEditStart, listener);
        const cell = getCell(0, 0);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(listener.callCount).to.equal(0);
      });

      it('should call startRowEditMode passing fieldToFocus', () => {
        render(<TestCase />);
        const spiedStartRowEditMode = spy(apiRef.current, 'startRowEditMode');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(spiedStartRowEditMode.callCount).to.equal(1);
        expect(spiedStartRowEditMode.lastCall.args[0]).to.deep.equal({
          id: 0,
          fieldToFocus: 'currencyPair',
        });
      });
    });

    describe('by pressing Delete', () => {
      it(`should publish 'rowEditStart' with reason=deleteKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.rowEditStart, listener);
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'Delete' });
        expect(listener.lastCall.args[0].reason).to.equal('deleteKeyDown');
      });

      it(`should not publish 'rowEditStart' if the cell is not editable`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.rowEditStart, listener);
        const cell = getCell(0, 0);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'Delete' });
        expect(listener.callCount).to.equal(0);
      });

      it('should call startRowEditMode passing fieldToFocus', () => {
        render(<TestCase />);
        const spiedStartRowEditMode = spy(apiRef.current, 'startRowEditMode');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'Delete' });
        expect(spiedStartRowEditMode.callCount).to.equal(1);
        expect(spiedStartRowEditMode.lastCall.args[0]).to.deep.equal({
          id: 0,
          fieldToFocus: 'currencyPair',
        });
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
      it(`should publish 'rowEditStart' with reason=printableKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.rowEditStart, listener);
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'a' });
        expect(listener.lastCall.args[0].reason).to.equal('printableKeyDown');
      });

      it(`should not publish 'rowEditStart' if the cell is not editable`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.rowEditStart, listener);
        const cell = getCell(0, 0);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'a' });
        expect(listener.callCount).to.equal(0);
      });

      ['shiftKey', 'ctrlKey', 'metaKey', 'altKey'].forEach((key) => {
        it(`should not publish 'rowEditStart' if ${key} is pressed`, () => {
          render(<TestCase />);
          const listener = spy();
          apiRef.current.subscribeEvent(GridEvents.rowEditStart, listener);
          const cell = getCell(0, 1);
          fireEvent.mouseUp(cell);
          fireEvent.click(cell);
          fireEvent.keyDown(cell, { key: 'a', [key]: true });
          expect(listener.callCount).to.equal(0);
        });
      });

      it('should call startRowEditMode passing fieldToFocus', () => {
        render(<TestCase />);
        const spiedStartRowEditMode = spy(apiRef.current, 'startRowEditMode');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.keyDown(cell, { key: 'a' });
        expect(spiedStartRowEditMode.callCount).to.equal(1);
        expect(spiedStartRowEditMode.lastCall.args[0]).to.deep.equal({
          id: 0,
          fieldToFocus: 'currencyPair',
        });
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
      clock.withFakeTimers();

      it(`should publish 'rowEditStop' with reason=rowFocusOut`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.rowEditStop, listener);
        fireEvent.doubleClick(getCell(0, 1));
        expect(listener.callCount).to.equal(0);
        fireEvent.click(getCell(1, 1));
        clock.runToLast();
        expect(listener.lastCall.args[0].reason).to.equal('rowFocusOut');
      });

      it('should call stopRowEditMode with ignoreModifications=false and no fieldFromRowBelowToFocus', () => {
        render(<TestCase />);
        const spiedStopRowEditMode = spy(apiRef.current, 'stopRowEditMode');
        fireEvent.doubleClick(getCell(0, 1));
        fireEvent.click(getCell(1, 1));
        clock.runToLast();
        expect(spiedStopRowEditMode.callCount).to.equal(1);
        expect(spiedStopRowEditMode.lastCall.args[0]).to.deep.equal({
          id: 0,
          ignoreModifications: false,
          fieldFromRowBelowToFocus: undefined,
        });
      });

      it('should call stopRowEditMode with ignoreModifications=true if the props are being processed', () => {
        column1Props.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) =>
          new Promise((resolve) => resolve(props));
        render(<TestCase />);
        const spiedStopRowEditMode = spy(apiRef.current, 'stopRowEditMode');
        fireEvent.doubleClick(getCell(0, 1));
        apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        fireEvent.click(getCell(1, 1));
        clock.runToLast();
        expect(spiedStopRowEditMode.callCount).to.equal(1);
        expect(spiedStopRowEditMode.lastCall.args[0].ignoreModifications).to.equal(true);
      });
    });

    describe('by pressing Escape', () => {
      it(`should publish 'rowEditStop' with reason=escapeKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.rowEditStop, listener);
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.doubleClick(cell);
        expect(listener.callCount).to.equal(0);
        fireEvent.keyDown(cell, { key: 'Escape' });
        expect(listener.lastCall.args[0].reason).to.equal('escapeKeyDown');
      });

      it('should call stopRowEditMode with ignoreModifications=true', () => {
        render(<TestCase />);
        const spiedStopRowEditMode = spy(apiRef.current, 'stopRowEditMode');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.doubleClick(cell);
        fireEvent.keyDown(cell, { key: 'Escape' });
        expect(spiedStopRowEditMode.callCount).to.equal(1);
        expect(spiedStopRowEditMode.lastCall.args[0]).to.deep.equal({
          id: 0,
          ignoreModifications: true,
          fieldFromRowBelowToFocus: undefined,
        });
      });
    });

    describe('by pressing Enter', () => {
      it(`should publish 'rowEditStop' with reason=enterKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent(GridEvents.rowEditStop, listener);
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.doubleClick(cell);
        expect(listener.callCount).to.equal(0);
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
      });

      it('should call stopRowEditMode with ignoreModifications=false and fieldFromRowBelowToFocus', () => {
        render(<TestCase />);
        const spiedStopRowEditMode = spy(apiRef.current, 'stopRowEditMode');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.doubleClick(cell);
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(spiedStopRowEditMode.callCount).to.equal(1);
        expect(spiedStopRowEditMode.lastCall.args[0]).to.deep.equal({
          id: 0,
          ignoreModifications: false,
          fieldFromRowBelowToFocus: 'currencyPair',
        });
      });

      it('should call stopRowEditMode with ignoreModifications=true if the props are being processed', () => {
        column1Props.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) =>
          new Promise((resolve) => resolve(props));
        render(<TestCase />);
        const spiedStopRowEditMode = spy(apiRef.current, 'stopRowEditMode');
        const cell = getCell(0, 1);
        fireEvent.mouseUp(cell);
        fireEvent.click(cell);
        fireEvent.doubleClick(cell);
        apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(spiedStopRowEditMode.callCount).to.equal(1);
        expect(spiedStopRowEditMode.lastCall.args[0].ignoreModifications).to.equal(true);
      });
    });
  });
});
