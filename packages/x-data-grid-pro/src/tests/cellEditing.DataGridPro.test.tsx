import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import {
  GridApi,
  DataGridProProps,
  useGridApiRef,
  DataGridPro,
  GridRenderEditCellParams,
  GridValueSetter,
  GridPreProcessEditCellProps,
  GridCellProps,
  GridCellModes,
} from '@mui/x-data-grid-pro';
import { getBasicGridData } from '@mui/x-data-grid-generator';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { getCell, spyApi } from 'test/utils/helperFn';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<DataGridPro /> - Cell editing', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  let apiRef: React.MutableRefObject<GridApi>;

  const defaultData = getBasicGridData(4, 2);

  const renderEditCell = spy((() => <input />) as (
    props: GridRenderEditCellParams,
  ) => React.ReactNode);

  let columnProps: any = {};

  function TestCase(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro
          apiRef={apiRef}
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
  }

  afterEach(() => {
    renderEditCell.resetHistory();
    columnProps = {};
  });

  describe('apiRef', () => {
    describe('startCellEditMode', () => {
      it('should throw when the cell is already in edit mode', () => {
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(() => {
          apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' });
        }).to.throw('MUI X: The cell with id=0 and field=currencyPair is not in view mode.');
      });

      it('should update the CSS class of the cell', () => {
        render(<TestCase />);
        expect(getCell(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(getCell(0, 1)).to.have.class('MuiDataGrid-cell--editing');
      });

      it('should render the component given in renderEditCell', () => {
        render(<TestCase />);
        expect(renderEditCell.callCount).to.equal(0);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(renderEditCell.callCount).not.to.equal(0);
      });

      it('should pass props to renderEditCell', () => {
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(renderEditCell.lastCall.args[0].value).to.equal('USDGBP');
        expect(renderEditCell.lastCall.args[0].error).to.equal(false);
        expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(false);
      });

      it('should empty the value if deleteValue is true', () => {
        render(<TestCase />);
        act(() =>
          apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair', deleteValue: true }),
        );
        expect(renderEditCell.lastCall.args[0].value).to.equal('');
        expect(renderEditCell.lastCall.args[0].error).to.equal(false);
        expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(false);
      });
    });

    describe('setEditCellValue', () => {
      it('should update the value prop given to renderEditCell', async () => {
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(renderEditCell.lastCall.args[0].value).to.equal('USDGBP');
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'usdgbp' }),
        );
        expect(renderEditCell.lastCall.args[0].value).to.equal('usdgbp');
      });

      it('should pass to renderEditCell the row with the value updated', async () => {
        const valueSetter: GridValueSetter = (value: string, row) => ({
          ...row,
          currencyPair: value.trim(),
        });
        columnProps.valueSetter = valueSetter;
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(renderEditCell.lastCall.args[0].row).to.deep.equal(defaultData.rows[0]);
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: ' usdgbp ' }),
        );
        expect(renderEditCell.lastCall.args[0].row).to.deep.equal({
          ...defaultData.rows[0],
          currencyPair: 'usdgbp',
        });
      });

      it('should pass the new value through the value parser if defined', async () => {
        columnProps.valueParser = spy((value) => value.toLowerCase());
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(columnProps.valueParser.callCount).to.equal(0);
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        expect(columnProps.valueParser.callCount).to.equal(1);
        expect(renderEditCell.lastCall.args[0].value).to.equal('usd gbp');
      });

      it('should return true if no preProcessEditCellProps is defined', async () => {
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(
          await act(() =>
            apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
          ),
        ).to.equal(true);
      });

      it('should set isProcessingProps to true before calling preProcessEditCellProps', async () => {
        columnProps.preProcessEditCellProps = spy(
          ({ props }: GridPreProcessEditCellProps) => props,
        );
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        let promise: Promise<boolean> | null = null;
        // We want to flush updates before preProcessEditCellProps resolves
        act(() => {
          promise = apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD GBP',
          }) as Promise<boolean>;
        });
        expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(true);
        return act(() => promise);
      });

      it('should call preProcessEditCellProps with the correct params', async () => {
        columnProps.preProcessEditCellProps = spy(
          ({ props }: GridPreProcessEditCellProps) => props,
        );
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(() =>
          apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD GBP',
          }),
        );
        const args = columnProps.preProcessEditCellProps.lastCall.args[0];
        expect(args.id).to.equal(0);
        expect(args.row).to.deep.equal(defaultData.rows[0]);
        expect(args.hasChanged).to.equal(true);
        expect(args.props).to.deep.equal({
          value: 'USD GBP',
          error: false,
          isProcessingProps: true,
          changeReason: 'setEditCellValue',
        });
      });

      it('should not publish onCellEditStop if field has error', async () => {
        columnProps.preProcessEditCellProps = spy(({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          error: true,
        }));

        const handleEditCellStop = spy();

        render(<TestCase onCellEditStop={handleEditCellStop} />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(() =>
          apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD GBP',
          }),
        );
        const cell = getCell(0, 1);
        cell.focus();

        fireEvent.keyDown(cell, { key: 'Enter' });

        expect(handleEditCellStop.callCount).to.equal(0);
      });

      it('should pass to renderEditCell the props returned by preProcessEditCellProps', async () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          foo: 'bar',
        });
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(renderEditCell.lastCall.args[0].foo).to.equal(undefined);
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        expect(renderEditCell.lastCall.args[0].foo).to.equal('bar');
      });

      it('should not pass to renderEditCell the value returned by preProcessEditCellProps', async () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          value: 'foobar',
        });
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(renderEditCell.lastCall.args[0].value).to.equal('USDGBP');
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        expect(renderEditCell.lastCall.args[0].value).to.equal('USD GBP');
      });

      it('should set isProcessingProps to false after calling preProcessEditCellProps', async () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => props;
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        let promise: Promise<boolean> | null = null;
        // We want to flush updates before preProcessEditCellProps resolves
        act(() => {
          promise = apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD GBP',
          }) as Promise<boolean>;
        });
        expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(true);
        await act(() => promise);
        expect(renderEditCell.lastCall.args[0].isProcessingProps).to.equal(false);
      });

      it('should return false if preProcessEditCellProps sets an error', async () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          error: true,
        });
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(
          await act(() =>
            apiRef.current.setEditCellValue({
              id: 0,
              field: 'currencyPair',
              value: 'USD GBP',
            }),
          ),
        ).to.equal(false);
      });

      it('should return false if the cell left the edit mode while calling preProcessEditCellProps', (done) => {
        let resolveCallback: () => void;
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) =>
          new Promise((resolve) => {
            resolveCallback = () => resolve(props);
          });
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));

        let promise: Promise<boolean>;
        act(() => {
          promise = apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD GBP',
          }) as Promise<boolean>;
        });

        promise!.then((result) => {
          expect(result).to.equal(false);
          done();
        });

        act(() =>
          apiRef.current.stopCellEditMode({
            id: 0,
            field: 'currencyPair',
            ignoreModifications: true,
          }),
        );

        resolveCallback!();
      });

      describe('with debounceMs > 0', () => {
        it('should debounce multiple changes if debounceMs > 0', () => {
          render(<TestCase />);
          act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
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
      function CustomEditComponent({ hasFocus }: GridCellProps) {
        const ref = React.useRef<HTMLInputElement>(null);
        React.useLayoutEffect(() => {
          if (hasFocus) {
            ref.current!.focus();
          }
        }, [hasFocus]);
        return <input ref={ref} />;
      }

      it('should throw an error when the cell is not in edit mode', () => {
        render(<TestCase />);
        expect(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' })).to.throw(
          'MUI X: The cell with id=0 and field=currencyPair is not in edit mode.',
        );
      });

      it('should update the row with the new value stored', async () => {
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(getCell(0, 1).textContent).to.equal('USD GBP');
      });

      it('should not update the row if ignoreModifications=true', async () => {
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        act(() =>
          apiRef.current.stopCellEditMode({
            id: 0,
            field: 'currencyPair',
            ignoreModifications: true,
          }),
        );
        expect(getCell(0, 1).textContent).to.equal('USDGBP');
      });

      it('should do nothing if props are still being processed and ignoreModifications=false', async () => {
        let resolveCallback: () => void;
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) =>
          new Promise((resolve) => {
            resolveCallback = () => resolve(props);
          });
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));

        let promise: Promise<boolean>;
        act(() => {
          promise = apiRef.current.setEditCellValue({
            id: 0,
            field: 'currencyPair',
            value: 'USD GBP',
          }) as Promise<boolean>;
        });

        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));

        expect(getCell(0, 1)).to.have.class('MuiDataGrid-cell--editing');

        resolveCallback!();

        await act(() => promise); // Run all updates scheduled for when preProcessEditCellProps resolves
      });

      it('should do nothing if props contain error=true', async () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          error: true,
        });
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(getCell(0, 1)).to.have.class('MuiDataGrid-cell--editing');
      });

      it('should keep mode=edit if props of any column contains error=true', async () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          error: true,
        });
        const onCellModesModelChange = spy();
        render(<TestCase onCellModesModelChange={onCellModesModelChange} />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(onCellModesModelChange.lastCall.args[0]).to.deep.equal({
          0: { currencyPair: { mode: 'edit' } },
        });
      });

      it('should allow a 2nd call if the first call was when error=true', async () => {
        columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
          ...props,
          error: props.value.length === 0,
        });
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));

        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: '' }),
        );
        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(getCell(0, 1)).to.have.class('MuiDataGrid-cell--editing');

        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(getCell(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
      });

      it('should update the CSS class of the cell', async () => {
        render(<TestCase />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(getCell(0, 1)).to.have.class('MuiDataGrid-cell--editing');
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(getCell(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
      });

      it('should call processRowUpdate before updating the row', async () => {
        const processRowUpdate = spy((row) => ({ ...row, currencyPair: 'USD-GBP' }));
        render(<TestCase processRowUpdate={processRowUpdate} />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(() => Promise.resolve());
        expect(processRowUpdate.callCount).to.equal(1);
        expect(getCell(0, 1).textContent).to.equal('USD-GBP');
      });

      it('should call processRowUpdate with the new and old row', async () => {
        const processRowUpdate = spy((newRow, oldRow) => ({ ...oldRow, ...newRow }));
        render(<TestCase processRowUpdate={processRowUpdate} />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(() => Promise.resolve());
        expect(processRowUpdate.lastCall.args[0]).to.deep.equal({
          ...defaultData.rows[0],
          currencyPair: 'USD GBP',
        });
        expect(processRowUpdate.lastCall.args[1]).to.deep.equal(defaultData.rows[0]);
      });

      it('should stay in edit mode if processRowUpdate throws an error', async () => {
        const processRowUpdate = () => {
          throw new Error('Something went wrong');
        };
        render(<TestCase processRowUpdate={processRowUpdate} />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(() =>
          act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' })),
        ).toErrorDev(
          'MUI X: A call to `processRowUpdate` threw an error which was not handled because `onProcessRowUpdateError` is missing.',
        );
        expect(getCell(0, 1)).to.have.class('MuiDataGrid-cell--editing');
      });

      it('should call onProcessRowUpdateError if processRowUpdate throws an error', () => {
        const error = new Error('Something went wrong');
        const processRowUpdate = () => {
          throw error;
        };
        const onProcessRowUpdateError = spy();
        render(
          <TestCase
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={onProcessRowUpdateError}
          />,
        );
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(onProcessRowUpdateError.lastCall.args[0]).to.equal(error);
      });

      it('should call onProcessRowUpdateError if processRowUpdate rejects', async () => {
        const error = new Error('Something went wrong');
        const processRowUpdate = async () => {
          throw error;
        };
        const onProcessRowUpdateError = spy();
        render(
          <TestCase
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={onProcessRowUpdateError}
          />,
        );
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(() => Promise.resolve());
        expect(onProcessRowUpdateError.lastCall.args[0]).to.equal(error);
      });

      it('should keep mode=edit if processRowUpdate rejects', async () => {
        const error = new Error('Something went wrong');
        const processRowUpdate = () => {
          throw error;
        };
        const onProcessRowUpdateError = spy();
        const onCellModesModelChange = spy();
        render(
          <TestCase
            onCellModesModelChange={onCellModesModelChange}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={onProcessRowUpdateError}
          />,
        );
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(onCellModesModelChange.lastCall.args[0]).to.deep.equal({
          0: { currencyPair: { mode: 'edit' } },
        });
      });

      it('should pass the new value through the value setter before calling processRowUpdate', async () => {
        columnProps.valueSetter = spy<GridValueSetter>((value, row) => ({
          ...row,
          _currencyPair: value,
        }));
        const processRowUpdate = spy(() => new Promise(() => {}));
        render(<TestCase processRowUpdate={processRowUpdate} />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
        expect((processRowUpdate.lastCall as any).args[0]).to.deep.equal({
          ...defaultData.rows[0],
          currencyPair: 'USDGBP',
          _currencyPair: 'USD GBP',
        });
        expect(columnProps.valueSetter.lastCall.args[0]).to.equal('USD GBP');
        expect(columnProps.valueSetter.lastCall.args[1]).to.deep.equal(defaultData.rows[0]);
      });

      it('should move focus to the cell below when cellToFocusAfter=below', async () => {
        columnProps.renderEditCell = (props: GridCellProps) => <CustomEditComponent {...props} />;
        render(<TestCase />);

        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(getCell(0, 1).querySelector('input')).toHaveFocus();
        act(() =>
          apiRef.current.stopCellEditMode({
            id: 0,
            field: 'currencyPair',
            cellToFocusAfter: 'below',
          }),
        );
        expect(getCell(1, 1)).toHaveFocus();
      });

      it('should move focus to the cell on the right when cellToFocusAfter=right', async () => {
        columnProps.renderEditCell = (props: GridCellProps) => <CustomEditComponent {...props} />;
        render(
          <TestCase
            {...getBasicGridData(1, 3)}
            columns={[
              { field: 'id' },
              { field: 'currencyPair', editable: true },
              { field: 'price1M', editable: true },
            ]}
          />,
        );

        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(getCell(0, 1).querySelector('input')).toHaveFocus();
        act(() =>
          apiRef.current.stopCellEditMode({
            id: 0,
            field: 'currencyPair',
            cellToFocusAfter: 'right',
          }),
        );
        expect(getCell(0, 2)).toHaveFocus();
      });

      it('should move focus to the cell on the left when cellToFocusAfter=left', async () => {
        columnProps.renderEditCell = (props: GridCellProps) => <CustomEditComponent {...props} />;
        render(
          <TestCase
            {...getBasicGridData(1, 3)}
            columns={[
              { field: 'id' },
              { field: 'currencyPair', editable: true },
              { field: 'price1M', editable: true },
            ]}
          />,
        );

        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'price1M' }));
        expect(getCell(0, 2).querySelector('input')).toHaveFocus();
        act(() =>
          apiRef.current.stopCellEditMode({
            id: 0,
            field: 'price1M',
            cellToFocusAfter: 'left',
          }),
        );
        expect(getCell(0, 1)).toHaveFocus();
      });

      it('should run all pending value mutations before calling processRowUpdate', async () => {
        const processRowUpdate = spy(() => new Promise(() => {}));
        render(<TestCase processRowUpdate={processRowUpdate} />);
        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(
          () =>
            new Promise<void>((resolve) => {
              apiRef.current.setEditCellValue({
                id: 0,
                field: 'currencyPair',
                value: 'USD GBP',
                debounceMs: 100,
              });
              resolve();
            }),
        );
        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(renderEditCell.lastCall.args[0].value).to.equal('USD GBP');
        expect((processRowUpdate.lastCall as any).args[0].currencyPair).to.equal('USD GBP');
      });

      it('should keep in edit mode the cells that entered edit mode while processRowUpdate is called', async () => {
        const onCellModesModelChange = spy();
        let resolveCallback: () => void;
        const processRowUpdate = (newRow: any) =>
          new Promise((resolve) => {
            resolveCallback = () => resolve(newRow);
          });
        render(
          <TestCase
            processRowUpdate={processRowUpdate}
            onCellModesModelChange={onCellModesModelChange}
          />,
        );

        act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
        expect(onCellModesModelChange.lastCall.args[0]).to.deep.equal({
          0: { currencyPair: { mode: 'view' } },
        });

        act(() => apiRef.current.startCellEditMode({ id: 1, field: 'currencyPair' }));
        expect(onCellModesModelChange.lastCall.args[0]).to.have.keys('0', '1');
        expect(onCellModesModelChange.lastCall.args[0][1]).to.deep.equal({
          currencyPair: { mode: 'edit' },
        });

        resolveCallback!();
        await act(() => Promise.resolve());
        expect(onCellModesModelChange.lastCall.args[0]).to.deep.equal({
          1: { currencyPair: { mode: 'edit' } },
        });
      });
    });
  });

  describe('start edit mode', () => {
    describe('by double-click', () => {
      it(`should publish 'cellEditStart' with reason=cellDoubleClick`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 1);
        fireEvent.doubleClick(cell);
        expect(listener.lastCall.args[0].reason).to.equal('cellDoubleClick');
      });

      it(`should not publish 'cellEditStart' if the cell is not editable`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 0);
        fireEvent.doubleClick(cell);
        expect(listener.callCount).to.equal(0);
      });

      it('should call startCellEditMode', () => {
        render(<TestCase />);
        const spiedStartCellEditMode = spyApi(apiRef.current, 'startCellEditMode');
        const cell = getCell(0, 1);
        fireEvent.doubleClick(cell);
        expect(spiedStartCellEditMode.callCount).to.equal(1);
      });
    });

    describe('by pressing a special character', () => {
      it(`should publish 'cellEditStart' with reason=printableKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: '$' });
        expect(listener.lastCall.args[0].reason).to.equal('printableKeyDown');
      });

      it(`should not publish 'cellEditStart' if space is pressed`, () => {
        render(<TestCase autoHeight />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: ' ' });
        expect(listener.callCount).to.equal(0);
      });
    });

    describe('by pressing a number', () => {
      it(`should publish 'cellEditStart' with reason=printableKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: '1' });
        expect(listener.lastCall.args[0].reason).to.equal('printableKeyDown');
      });
    });

    describe('by pressing Enter', () => {
      it(`should publish 'cellEditStart' with reason=enterKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
      });

      it(`should not publish 'cellEditStart' if the cell is not editable`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 0);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(listener.callCount).to.equal(0);
      });

      it('should call startCellEditMode', () => {
        render(<TestCase />);
        const spiedStartCellEditMode = spyApi(apiRef.current, 'startCellEditMode');
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(spiedStartCellEditMode.callCount).to.equal(1);
      });
    });

    describe('by pressing Delete', () => {
      it(`should publish 'cellEditStart' with reason=deleteKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'Delete' });
        expect(listener.lastCall.args[0].reason).to.equal('deleteKeyDown');
      });

      it(`should not publish 'cellEditStart' if the cell is not editable`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 0);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'Delete' });
        expect(listener.callCount).to.equal(0);
      });

      it('should call startCellEditMode', () => {
        render(<TestCase />);
        const spiedStartCellEditMode = spyApi(apiRef.current, 'startCellEditMode');
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'Delete' });
        expect(spiedStartCellEditMode.callCount).to.equal(1);
      });

      it('should empty the cell', () => {
        render(<TestCase />);
        const spiedStartCellEditMode = spyApi(apiRef.current, 'startCellEditMode');
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'Delete' });
        expect(spiedStartCellEditMode.callCount).to.equal(1);
        expect(spiedStartCellEditMode.lastCall.args[0]).to.deep.equal({
          id: 0,
          field: 'currencyPair',
          deleteValue: true,
        });
      });
    });

    describe('by pressing a printable character', () => {
      it('should call startCellEditMode', () => {
        render(<TestCase />);
        const spiedStartCellEditMode = spyApi(apiRef.current, 'startCellEditMode');
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'a' }); // A
        expect(spiedStartCellEditMode.callCount).to.equal(1);
      });

      it(`should publish 'cellEditStart' with reason=printableKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'a' }); // A
        expect(listener.lastCall.args[0].reason).to.equal('printableKeyDown');
      });

      it(`should not publish 'cellEditStart' if the cell is not editable`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 0);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'a' }); // A
        expect(listener.callCount).to.equal(0);
      });

      ['ctrlKey', 'metaKey'].forEach((key) => {
        it(`should not publish 'cellEditStart' if ${key} is pressed`, () => {
          render(<TestCase />);
          const listener = spy();
          apiRef.current.subscribeEvent('cellEditStart', listener);
          const cell = getCell(0, 1);
          fireUserEvent.mousePress(cell);
          fireEvent.keyDown(cell, { key: 'a', [key]: true }); // for example Ctrl + A, copy
          expect(listener.callCount).to.equal(0);
        });
      });

      it(`should call startCellEditMode if shiftKey is pressed with a letter`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'a', shiftKey: true }); // Print A in uppercase
        expect(listener.callCount).to.equal(1);
      });

      it(`should call startCellEditMode if the paste shortcut is pressed`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'v', ctrlKey: true }); // Ctrl+V
        expect(listener.callCount).to.equal(1);
      });

      it(`should call startCellEditMode if a special character on macOS is pressed`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStart', listener);
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'π', altKey: true }); // ⌥ Option + P
        expect(listener.callCount).to.equal(1);
      });

      it('should empty the cell', () => {
        render(<TestCase />);
        const spiedStartCellEditMode = spyApi(apiRef.current, 'startCellEditMode');
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.keyDown(cell, { key: 'a' });
        expect(spiedStartCellEditMode.callCount).to.equal(1);
        expect(spiedStartCellEditMode.lastCall.args[0]).to.deep.equal({
          id: 0,
          field: 'currencyPair',
          deleteValue: true,
        });
      });

      it(`should ignore keydown event until the IME is confirmed with a letter`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStop', listener);
        const cell = getCell(0, 1);
        fireEvent.doubleClick(cell);
        const input = cell.querySelector('input')!;
        fireEvent.change(input, { target: { value: 'あ' } });
        fireEvent.keyDown(cell, { key: 'Enter', keyCode: 229 });
        expect(listener.callCount).to.equal(0);
        fireEvent.keyDown(cell, { key: 'Enter', keyCode: 13 });
        expect(listener.callCount).to.equal(1);
        expect(input.value).to.equal('あ');
        expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
      });

      it(`should ignore keydown event until the IME is confirmed with multiple letters`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStop', listener);
        const cell = getCell(0, 1);
        fireEvent.doubleClick(cell);
        const input = cell.querySelector('input')!;
        fireEvent.change(input, { target: { value: 'ありがとう' } });
        fireEvent.keyDown(cell, { key: 'Enter', keyCode: 229 });
        expect(listener.callCount).to.equal(0);
        fireEvent.keyDown(cell, { key: 'Enter', keyCode: 13 });
        expect(listener.callCount).to.equal(1);
        expect(input.value).to.equal('ありがとう');
        expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
      });
    });
  });

  describe('stop edit mode', () => {
    describe('by clicking outside the cell', () => {
      it(`should publish 'cellEditStop' with reason=cellFocusOut`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStop', listener);
        fireEvent.doubleClick(getCell(0, 1));
        expect(listener.callCount).to.equal(0);
        fireUserEvent.mousePress(getCell(1, 1));
        expect(listener.lastCall.args[0].reason).to.equal('cellFocusOut');
      });

      it('should call stopCellEditMode with ignoreModifications=false and cellToFocusAfter=undefined', () => {
        render(<TestCase />);
        const spiedStopCellEditMode = spyApi(apiRef.current, 'stopCellEditMode');
        fireEvent.doubleClick(getCell(0, 1));
        fireUserEvent.mousePress(getCell(1, 1));
        expect(spiedStopCellEditMode.callCount).to.equal(1);
        expect(spiedStopCellEditMode.lastCall.args[0]).to.deep.equal({
          id: 0,
          field: 'currencyPair',
          cellToFocusAfter: undefined,
          ignoreModifications: false,
        });
      });

      it('should call stopCellEditMode with ignoreModifications=false if the props are being processed', async () => {
        columnProps.preProcessEditCellProps = () => new Promise(() => {});
        render(<TestCase />);
        const spiedStopCellEditMode = spyApi(apiRef.current, 'stopCellEditMode');
        fireEvent.doubleClick(getCell(0, 1));
        await act(
          () =>
            new Promise<void>((resolve) => {
              apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
              resolve();
            }),
        );
        fireUserEvent.mousePress(getCell(1, 1));
        expect(spiedStopCellEditMode.callCount).to.equal(1);
        expect(spiedStopCellEditMode.lastCall.args[0].ignoreModifications).to.equal(false);
      });
    });

    describe('by pressing Escape', () => {
      it(`should publish 'cellEditStop' with reason=escapeKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStop', listener);
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.doubleClick(cell);
        expect(listener.callCount).to.equal(0);
        fireEvent.keyDown(cell, { key: 'Escape' });
        expect(listener.lastCall.args[0].reason).to.equal('escapeKeyDown');
      });

      it('should call stopCellEditMode with ignoreModifications=true and cellToFocusAfter=undefined', () => {
        render(<TestCase />);
        const spiedStopCellEditMode = spyApi(apiRef.current, 'stopCellEditMode');
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.doubleClick(cell);
        fireEvent.keyDown(cell, { key: 'Escape' });
        expect(spiedStopCellEditMode.callCount).to.equal(1);
        expect(spiedStopCellEditMode.lastCall.args[0]).to.deep.equal({
          id: 0,
          field: 'currencyPair',
          cellToFocusAfter: undefined,
          ignoreModifications: true,
        });
      });
    });

    describe('by pressing Enter', () => {
      it(`should publish 'cellEditStop' with reason=enterKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStop', listener);
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.doubleClick(cell);
        expect(listener.callCount).to.equal(0);
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(listener.lastCall.args[0].reason).to.equal('enterKeyDown');
      });

      it('should call stopCellEditMode with ignoreModifications=false and cellToFocusAfter=below', () => {
        render(<TestCase />);
        const spiedStopCellEditMode = spyApi(apiRef.current, 'stopCellEditMode');
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
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

      it('should call stopCellEditMode with ignoreModifications=false if the props are being processed', async () => {
        columnProps.preProcessEditCellProps = () => new Promise(() => {});
        render(<TestCase />);
        const spiedStopCellEditMode = spyApi(apiRef.current, 'stopCellEditMode');
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.doubleClick(cell);
        await act(
          () =>
            new Promise<void>((resolve) => {
              apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
              resolve();
            }),
        );
        fireEvent.keyDown(cell, { key: 'Enter' });
        expect(spiedStopCellEditMode.callCount).to.equal(1);
        expect(spiedStopCellEditMode.lastCall.args[0].ignoreModifications).to.equal(false);
      });
    });

    describe('by pressing Tab', () => {
      it(`should publish 'cellEditStop' with reason=tabKeyDown`, () => {
        render(<TestCase />);
        const listener = spy();
        apiRef.current.subscribeEvent('cellEditStop', listener);
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.doubleClick(cell);
        expect(listener.callCount).to.equal(0);
        fireEvent.keyDown(cell, { key: 'Tab' });
        expect(listener.lastCall.args[0].reason).to.equal('tabKeyDown');
      });

      it('should call stopCellEditMode with ignoreModifications=false and cellToFocusAfter=right', () => {
        render(<TestCase />);
        const spiedStopCellEditMode = spyApi(apiRef.current, 'stopCellEditMode');
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
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

      it('should call stopCellEditMode with ignoreModifications=false if the props are being processed', async () => {
        columnProps.preProcessEditCellProps = () => new Promise(() => {});
        render(<TestCase />);
        const spiedStopCellEditMode = spyApi(apiRef.current, 'stopCellEditMode');
        const cell = getCell(0, 1);
        fireUserEvent.mousePress(cell);
        fireEvent.doubleClick(cell);
        await act(
          () =>
            new Promise<void>((resolve) => {
              apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' });
              resolve();
            }),
        );
        fireEvent.keyDown(cell, { key: 'Tab' });
        expect(spiedStopCellEditMode.callCount).to.equal(1);
        expect(spiedStopCellEditMode.lastCall.args[0].ignoreModifications).to.equal(false);
      });
    });
  });

  describe('prop: cellModesModel', () => {
    describe('mode=view to mode=edit', () => {
      it('should start edit mode', () => {
        const { setProps } = render(<TestCase />);
        expect(getCell(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
        setProps({ cellModesModel: { 0: { currencyPair: { mode: GridCellModes.Edit } } } });
        expect(getCell(0, 1)).to.have.class('MuiDataGrid-cell--editing');
      });
    });

    describe('mode=edit to mode=view', () => {
      it('should stop edit mode', () => {
        const { setProps } = render(
          <TestCase cellModesModel={{ 0: { currencyPair: { mode: GridCellModes.Edit } } }} />,
        );
        expect(getCell(0, 1)).to.have.class('MuiDataGrid-cell--editing');
        setProps({ cellModesModel: { 0: { currencyPair: { mode: GridCellModes.View } } } });
        expect(getCell(0, 1)).not.to.have.class('MuiDataGrid-cell--editing');
      });

      it('should ignode modifications if ignoreModifications=true', async () => {
        const { setProps } = render(
          <TestCase cellModesModel={{ 0: { currencyPair: { mode: GridCellModes.Edit } } }} />,
        );
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        setProps({
          cellModesModel: {
            0: { currencyPair: { mode: GridCellModes.View, ignoreModifications: true } },
          },
        });
        expect(getCell(0, 1).textContent).to.equal('USDGBP');
      });

      it('should move focus to the cell that is set in cellToFocusAfter', async () => {
        const { setProps } = render(
          <TestCase cellModesModel={{ 0: { currencyPair: { mode: GridCellModes.Edit } } }} />,
        );
        await act(() =>
          apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
        );
        setProps({
          cellModesModel: {
            0: { currencyPair: { mode: GridCellModes.View, cellToFocusAfter: 'below' } },
          },
        });
        expect(getCell(1, 1)).toHaveFocus();
      });
    });

    it(`should publish 'cellModesModelChange' when the model changes`, () => {
      render(<TestCase />);
      const listener = spy();
      apiRef.current.subscribeEvent('cellModesModelChange', listener);
      const cell = getCell(0, 1);
      fireEvent.doubleClick(cell);
      expect(listener.lastCall.args[0]).to.deep.equal({
        0: { currencyPair: { mode: 'edit' } },
      });
    });

    it(`should publish 'cellModesModelChange' when the prop changes`, () => {
      const { setProps } = render(<TestCase cellModesModel={{}} />);
      const listener = spy();
      expect(listener.callCount).to.equal(0);
      apiRef.current.subscribeEvent('cellModesModelChange', listener);
      setProps({ cellModesModel: { 0: { currencyPair: { mode: 'edit' } } } });
      expect(listener.lastCall.args[0]).to.deep.equal({
        0: { currencyPair: { mode: 'edit' } },
      });
    });

    it(`should not publish 'cellModesModelChange' when the model changes and cellModesModel is set`, () => {
      render(<TestCase cellModesModel={{}} />);
      const listener = spy();
      apiRef.current.subscribeEvent('cellModesModelChange', listener);
      const cell = getCell(0, 1);
      fireEvent.doubleClick(cell);
      expect(listener.callCount).to.equal(0);
    });

    it('should not mutate the cellModesModel prop if props of any column contains error=true', async () => {
      columnProps.preProcessEditCellProps = ({ props }: GridPreProcessEditCellProps) => ({
        ...props,
        error: true,
      });
      const { setProps } = render(<TestCase />);
      const cell = getCell(0, 1);
      fireEvent.mouseUp(cell);
      fireEvent.click(cell);
      fireEvent.doubleClick(cell);

      await act(() =>
        apiRef.current.setEditCellValue({ id: 0, field: 'currencyPair', value: 'USD GBP' }),
      );

      const cellModesModel = { 0: { currencyPair: { mode: 'view' } } };
      setProps({ cellModesModel });
      expect(cellModesModel).to.deep.equal({ 0: { currencyPair: { mode: 'view' } } });
    });
  });

  describe('prop: onCellModesModelChange', () => {
    it('should call with mode=edit when startEditMode is called', () => {
      const onCellModesModelChange = spy();
      render(<TestCase onCellModesModelChange={onCellModesModelChange} />);
      expect(onCellModesModelChange.callCount).to.equal(0);
      act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
      expect(onCellModesModelChange.callCount).to.equal(1);
      expect(onCellModesModelChange.lastCall.args[0]).to.deep.equal({
        0: { currencyPair: { mode: 'edit' } },
      });
    });

    it('should call with mode=view when stopEditMode is called', () => {
      const onCellModesModelChange = spy();
      render(<TestCase onCellModesModelChange={onCellModesModelChange} />);
      act(() => apiRef.current.startCellEditMode({ id: 0, field: 'currencyPair' }));
      onCellModesModelChange.resetHistory();
      act(() => apiRef.current.stopCellEditMode({ id: 0, field: 'currencyPair' }));
      expect(onCellModesModelChange.args[0][0]).to.deep.equal({
        0: { currencyPair: { mode: 'view' } },
      });
      expect(onCellModesModelChange.args[1][0]).to.deep.equal({});
    });

    it(`should not be called when changing the cellModesModel prop`, () => {
      const onCellModesModelChange = spy();
      const { setProps } = render(
        <TestCase cellModesModel={{}} onCellModesModelChange={onCellModesModelChange} />,
      );
      expect(onCellModesModelChange.callCount).to.equal(0);
      setProps({ cellModesModel: { 0: { currencyPair: { mode: 'edit' } } } });
      expect(onCellModesModelChange.callCount).to.equal(0);
    });
  });
});
