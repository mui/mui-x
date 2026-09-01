import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { useGridApiRef, DataGridPremium } from '@mui/x-data-grid-premium';
import type {
  GridApi,
  DataGridPremiumProps,
  GridHistoryEventHandler,
  GridEvents,
  GridDataSource,
  GridUpdateRowParams,
} from '@mui/x-data-grid-premium';
import { createRenderer, waitFor, act, fireEvent, screen } from '@mui/internal-test-utils';
import type { MuiRenderResult } from '@mui/internal-test-utils';
import { getCell, getColumnValues } from 'test/utils/helperFn';
import { getBasicGridData } from '@mui/x-data-grid-generator';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';

describe('<DataGridPremium /> - History', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  const basicData = getBasicGridData(10, 5);
  const data = {
    ...basicData,
    columns: basicData.columns.map((column) => ({
      ...column,
      editable: true,
    })),
  };

  function Test(props: Partial<DataGridPremiumProps>) {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPremium
          {...data}
          {...props}
          apiRef={apiRef}
          disableRowSelectionOnClick
          disableVirtualization
          cellSelection
        />
      </div>
    );
  }

  function paste(cell: HTMLElement, pasteText: string) {
    const pasteEvent = new Event('paste');

    // @ts-ignore
    pasteEvent.clipboardData = {
      getData: () => pasteText,
    };

    fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true }); // Ctrl+V
    act(() => document.activeElement!.dispatchEvent(pasteEvent));
  }

  describe('API', () => {
    it('should start with an empty stack', () => {
      render(<Test />);

      expect(apiRef.current!.history.canUndo()).to.equal(false);
      expect(apiRef.current!.history.canRedo()).to.equal(false);
    });

    it('should return false when there is nothing to undo/redo', async () => {
      render(<Test />);

      const resultUndo = await apiRef.current!.history.undo();
      expect(resultUndo).to.equal(false);

      const resultRedo = await apiRef.current!.history.redo();
      expect(resultRedo).to.equal(false);
    });

    it('should clear the stack', async () => {
      const { user } = render(<Test />);

      // Edit a cell
      const cell = getCell(0, 2);
      await user.dblClick(cell);
      await user.keyboard('10000');
      // Click another cell to confirm edit
      await user.click(getCell(1, 2));

      // Undo should be available
      expect(apiRef.current!.history.canUndo()).to.equal(true);

      await act(async () => {
        apiRef.current!.history.clear();
      });

      expect(apiRef.current!.history.canUndo()).to.equal(false);
    });

    it('should undo a cell edit on a page other than the first', async () => {
      const { user } = render(
        <Test
          pagination
          initialState={{ pagination: { paginationModel: { page: 1, pageSize: 3 } } }}
          pageSizeOptions={[3]}
        />,
      );
      const originalValue = apiRef.current!.getRow(3).currencyPair;
      const cell = getCell(3, 2);
      await user.dblClick(cell);
      await user.keyboard('10000');
      await user.click(getCell(4, 2));

      let result: boolean | undefined;
      await act(async () => {
        result = await apiRef.current!.history.undo();
      });

      expect(result).to.equal(true);
      expect(apiRef.current!.getRow(3).currencyPair).to.equal(originalValue);
    });
  });

  describe('Row updates through API', () => {
    it('should not track updates made programmatically', async () => {
      render(<Test />);

      // Update a row programmatically
      await act(async () => {
        await apiRef.current!.updateRows([{ id: 0, currencyPair: 'TEST' }]);
      });

      expect(apiRef.current!.history.canUndo()).to.equal(false);
    });
  });

  describe('Custom history handlers', () => {
    it('should use custom history handlers', async () => {
      let storedData: any = null;
      let undoCalled = false;
      let redoCalled = false;

      const customHandler: GridHistoryEventHandler = {
        store: (...params: any[]) => {
          storedData = { params };
          return storedData;
        },
        undo: async () => {
          undoCalled = true;
        },
        redo: async () => {
          redoCalled = true;
        },
      };

      const historyEventHandlers = {
        cellClick: customHandler,
      } as Record<GridEvents, GridHistoryEventHandler>;

      const { user } = render(<Test historyEventHandlers={historyEventHandlers} />);

      // Trigger the custom event
      const cell = getCell(0, 2);
      await user.click(cell);

      // Wait for async operations
      await waitFor(() => {
        expect(apiRef.current!.history.canUndo()).to.equal(true);
      });

      expect(storedData).to.not.equal(null);

      // Undo
      await act(async () => {
        await apiRef.current!.history.undo();
      });

      expect(undoCalled).to.equal(true);
      expect(apiRef.current!.history.canRedo()).to.equal(true);

      // Redo
      await act(async () => {
        await apiRef.current!.history.redo();
      });

      expect(redoCalled).to.equal(true);
    });

    it('should handle validation failures', async () => {
      let shouldValidate = true;

      const customHandler: GridHistoryEventHandler = {
        store: () => ({ data: 'test' }),
        undo: async () => {},
        redo: async () => {},
        validate: (_, operation) => {
          if (operation === 'undo') {
            return shouldValidate;
          }
          return true;
        },
      };

      const historyEventHandlers = {
        cellClick: customHandler,
      } as Record<GridEvents, GridHistoryEventHandler>;

      const { user } = render(<Test historyEventHandlers={historyEventHandlers} />);

      // Trigger the custom event
      const cell = getCell(0, 2);
      await user.click(cell);

      await waitFor(() => {
        expect(apiRef.current!.history.canUndo()).to.equal(true);
      });

      // Make validation fail
      shouldValidate = false;

      // Try to undo
      const result = await act(async () => apiRef.current!.history.undo());

      expect(result).to.equal(false);
    });

    it('should not store history during undo/redo operations', async () => {
      let storeCallCount = 0;
      let user: MuiRenderResult['user'];

      const customHandler: GridHistoryEventHandler = {
        store: () => {
          storeCallCount += 1;
          return { test: 'data' };
        },
        undo: async () => {
          // Trigger the same event during undo
          const cell = getCell(0, 2);
          await user.click(cell);
        },
        redo: async () => {
          // Trigger the same event during redo
          const cell = getCell(0, 2);
          await user.click(cell);
        },
      };

      const historyEventHandlers = {
        cellClick: customHandler,
      } as Record<GridEvents, GridHistoryEventHandler>;

      ({ user } = render(<Test historyEventHandlers={historyEventHandlers} />));

      // Trigger the custom event
      const cell = getCell(0, 2);
      await user.click(cell);

      await waitFor(() => {
        expect(apiRef.current!.history.canUndo()).to.equal(true);
      });

      expect(storeCallCount).to.equal(1);

      // Undo (should trigger event but not store it)
      await act(async () => {
        await apiRef.current!.history.undo();
      });

      expect(storeCallCount).to.equal(1); // Should still be 1

      // Redo (should trigger event but not store it)
      await act(async () => {
        await apiRef.current!.history.redo();
      });

      expect(storeCallCount).to.equal(1); // Should still be 1
    });
  });

  describe('Stack management', () => {
    it('should respect historyStackSize limit and keep the latest items', async () => {
      let lastUndoData: any = null;
      const customHandler: GridHistoryEventHandler = {
        store: (params: any) => ({ rowId: params.id }),
        undo: async (storedData) => {
          lastUndoData = storedData;
        },
        redo: async () => {},
      };

      const historyEventHandlers = {
        cellClick: customHandler,
      } as Record<GridEvents, GridHistoryEventHandler>;

      const { user } = render(
        <Test historyStackSize={2} historyEventHandlers={historyEventHandlers} />,
      );

      // Make 3 clicks
      await user.click(getCell(0, 2));
      await user.click(getCell(1, 2));
      await user.click(getCell(2, 2));

      await waitFor(() => {
        expect(apiRef.current!.history.canUndo()).to.equal(true);
      });

      // Should only be able to undo 2 times (stack size limit) and only for the last two items
      await act(async () => {
        await apiRef.current!.history.undo();
      });
      expect(lastUndoData.rowId).to.equal(2);
      expect(apiRef.current!.history.canUndo()).to.equal(true);

      await act(async () => {
        await apiRef.current!.history.undo();
      });
      expect(lastUndoData.rowId).to.equal(1);
      expect(apiRef.current!.history.canUndo()).to.equal(false);
    });

    it('should validate the previous stack item after undo', async () => {
      let firstEventValid = true;

      const firstHandler: GridHistoryEventHandler = {
        store: () => ({}),
        undo: async () => {},
        redo: async () => {},
        validate: (_, operation) => {
          if (operation === 'undo') {
            return firstEventValid;
          }
          return true;
        },
      };

      const secondHandler: GridHistoryEventHandler = {
        store: () => ({}),
        undo: async () => {},
        redo: async () => {},
      };

      const historyEventHandlers = {
        cellClick: firstHandler,
        cellDoubleClick: secondHandler,
      } as Record<GridEvents, GridHistoryEventHandler>;

      const { user } = render(
        <Test
          historyEventHandlers={historyEventHandlers}
          historyValidationEvents={['stateChange']}
        />,
      );

      // First event
      const cell = getCell(0, 2);
      await user.click(cell);

      expect(apiRef.current!.history.canUndo()).to.equal(true);

      // Second event
      await user.dblClick(cell);

      expect(apiRef.current!.history.canUndo()).to.equal(true);

      // Invalidate the first event
      firstEventValid = false;

      // Can still undo
      expect(apiRef.current!.history.canUndo()).to.equal(true);

      // Undo the second event
      await act(async () => {
        const result = await apiRef.current!.history.undo();
        expect(result).to.equal(true);
      });

      // Since the first event is invalid, undo should be cleared
      await waitFor(() => {
        expect(apiRef.current!.history.canUndo()).to.equal(false);
      });
      // Redo is not affected
      expect(apiRef.current!.history.canRedo()).to.equal(true);
    });

    it('should validate the current item after redo', async () => {
      let eventValid = true;

      const firstHandler: GridHistoryEventHandler = {
        store: () => ({}),
        undo: async () => {},
        redo: async () => {},
        validate: (_, operation) => {
          if (operation === 'redo') {
            return eventValid;
          }
          return true;
        },
      };

      const historyEventHandlers = {
        cellClick: firstHandler,
      } as Record<GridEvents, GridHistoryEventHandler>;

      const { user } = render(
        <Test
          historyEventHandlers={historyEventHandlers}
          historyValidationEvents={['stateChange']}
        />,
      );

      const cell = getCell(0, 2);
      await user.click(cell);

      expect(apiRef.current!.history.canUndo()).to.equal(true);

      // Undo the event
      await act(async () => {
        const result = await apiRef.current!.history.undo();
        expect(result).to.equal(true);
      });

      // Invalidate the event
      eventValid = false;

      // Can still redo
      expect(apiRef.current!.history.canRedo()).to.equal(true);

      // Redo the event
      await act(async () => {
        const result = await apiRef.current!.history.redo();
        // redo is invalid, the result should be false
        expect(result).to.equal(false);
      });

      // Make the redo valid
      eventValid = true;

      // Since the event was invalid, stack should be cleared
      expect(apiRef.current!.history.canRedo()).to.equal(false);
    });

    it('should clear undo history when the first event is invalid', async () => {
      let eventValid = true;

      const customHandler: GridHistoryEventHandler = {
        store: () => ({ data: 'test' }),
        undo: async () => {},
        redo: async () => {},
        validate: () => eventValid,
      };

      const historyEventHandlers = {
        cellClick: customHandler,
      } as Record<GridEvents, GridHistoryEventHandler>;

      const { user } = render(<Test historyEventHandlers={historyEventHandlers} />);

      const cell = getCell(0, 2);
      await user.click(cell);
      expect(apiRef.current!.history.canUndo()).to.equal(true);

      eventValid = false;

      // Trigger rowsSet event
      await act(async () => {
        await apiRef.current!.updateRows([{ id: 0, currencyPair: 'TEST' }]);
      });

      // Wait for validation to complete (it's debounced)
      await waitFor(() => {
        expect(apiRef.current!.history.canUndo()).to.equal(false);
      });
      expect(apiRef.current!.history.canRedo()).to.equal(false);
    });

    it('should not add items to the stack if the store method returns null', async () => {
      const customHandler: GridHistoryEventHandler = {
        store: () => null,
        undo: async () => {},
        redo: async () => {},
      };

      const historyEventHandlers = {
        cellClick: customHandler,
      } as Record<GridEvents, GridHistoryEventHandler>;

      const { user } = render(<Test historyEventHandlers={historyEventHandlers} />);

      const cell = getCell(0, 2);
      await user.click(cell);

      expect(apiRef.current!.history.canUndo()).to.equal(false);
      expect(apiRef.current!.history.canRedo()).to.equal(false);
    });

    it('should clear forward history when making a new action after undo', async () => {
      const customHandler: GridHistoryEventHandler = {
        store: () => ({ data: 'test' }),
        undo: async () => {},
        redo: async () => {},
      };

      const historyEventHandlers = {
        cellClick: customHandler,
      } as Record<GridEvents, GridHistoryEventHandler>;

      const { user } = render(
        <Test
          historyEventHandlers={historyEventHandlers}
          historyValidationEvents={['stateChange']}
        />,
      );

      const cell = getCell(0, 2);

      // First click
      await user.click(cell);
      expect(apiRef.current!.history.canUndo()).to.equal(true);

      // Undo
      await act(async () => {
        await apiRef.current!.history.undo();
      });

      expect(apiRef.current!.history.canRedo()).to.equal(true);

      // Make a new click (should clear redo history)
      await user.click(cell);

      expect(apiRef.current!.history.canRedo()).to.equal(false);
    });

    it('should clear the stack when `historyStackSize` is reduced below the current stack size', async () => {
      const customHandler: GridHistoryEventHandler = {
        store: () => ({ data: 'test' }),
        undo: async () => {},
        redo: async () => {},
      };

      const historyEventHandlers = {
        cellClick: customHandler,
      } as Record<GridEvents, GridHistoryEventHandler>;

      function TestWithDynamicStackSize({ initialStackSize }: { initialStackSize: number }) {
        const [stackSize, setStackSize] = React.useState(initialStackSize);
        apiRef = useGridApiRef();

        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGridPremium
              {...data}
              apiRef={apiRef}
              disableRowSelectionOnClick
              disableVirtualization
              cellSelection
              historyStackSize={stackSize}
              historyEventHandlers={historyEventHandlers}
            />
            <button
              data-testid="reduce-stack-size"
              onClick={() => setStackSize((prev) => prev - 1)}
            >
              Reduce Stack Size
            </button>
          </div>
        );
      }

      const { user } = render(<TestWithDynamicStackSize initialStackSize={4} />);

      const button = screen.getByTestId('reduce-stack-size');

      // Create 3 history items
      await user.click(getCell(0, 2));
      await user.click(getCell(1, 2));
      await user.click(getCell(2, 2));

      // Undo to have both undo and redo available
      await act(async () => {
        await apiRef.current!.history.undo();
      });

      expect(apiRef.current!.history.canUndo()).to.equal(true);
      expect(apiRef.current!.history.canRedo()).to.equal(true);

      // Reduce the stack size to 3 (current stack size)
      await user.click(button);

      // undo and redo still available
      expect(apiRef.current!.history.canUndo()).to.equal(true);
      expect(apiRef.current!.history.canRedo()).to.equal(true);

      // Reduce the stack size to 2 (smaller than current stack size)
      await user.click(button);

      // undo and redo are not available anymore
      expect(apiRef.current!.history.canUndo()).to.equal(false);
      expect(apiRef.current!.history.canRedo()).to.equal(false);
    });
  });

  describe('Events', () => {
    it('should fire `onUndo` callback', async () => {
      const onUndo = vi.fn();

      const customHandler: GridHistoryEventHandler = {
        store: () => ({ data: 'test' }),
        undo: async () => {},
        redo: async () => {},
      };

      const historyEventHandlers = {
        cellClick: customHandler,
      } as Record<GridEvents, GridHistoryEventHandler>;

      const { user } = render(<Test onUndo={onUndo} historyEventHandlers={historyEventHandlers} />);

      const cell = getCell(0, 2);
      await user.click(cell);

      await waitFor(() => {
        expect(apiRef.current!.history.canUndo()).to.equal(true);
      });

      // Undo
      await act(async () => {
        await apiRef.current!.history.undo();
      });

      expect(onUndo.mock.calls.length).to.equal(1);
      expect(onUndo.mock.calls[0][0]).to.have.property('eventName', 'cellClick');
    });

    it('should fire `onRedo` callback', async () => {
      const onRedo = vi.fn();

      const customHandler: GridHistoryEventHandler = {
        store: () => ({ data: 'test' }),
        undo: async () => {},
        redo: async () => {},
      };

      const historyEventHandlers = {
        cellClick: customHandler,
      } as Record<GridEvents, GridHistoryEventHandler>;

      const { user } = render(<Test onRedo={onRedo} historyEventHandlers={historyEventHandlers} />);

      const cell = getCell(0, 2);
      await user.click(cell);

      await waitFor(() => {
        expect(apiRef.current!.history.canUndo()).to.equal(true);
      });

      // Undo
      await act(async () => {
        await apiRef.current!.history.undo();
      });

      // Redo
      await act(async () => {
        await apiRef.current!.history.redo();
      });

      expect(onRedo.mock.calls.length).to.equal(1);
      expect(onRedo.mock.calls[0][0]).to.have.property('eventName', 'cellClick');
    });
  });

  describe('Disabled history', () => {
    it('should not track history when `historyStackSize` is 0', async () => {
      const customHandler: GridHistoryEventHandler = {
        store: () => ({ data: 'test' }),
        undo: async () => {},
        redo: async () => {},
      };

      const historyEventHandlers = {
        cellClick: customHandler,
      } as Record<GridEvents, GridHistoryEventHandler>;

      const { user } = render(
        <Test historyStackSize={0} historyEventHandlers={historyEventHandlers} />,
      );

      const cell = getCell(0, 2);
      await user.click(cell);

      expect(apiRef.current!.history.canUndo()).to.equal(false);
    });
  });

  describe('Data source integration', () => {
    it('should not track history when dataSource exists without updateRow method', async () => {
      function TestWithDataSourceNoUpdate() {
        const dataSource = React.useMemo(
          () => ({
            getRows: async () => ({ rows: data.rows, rowCount: data.rows.length }),
          }),
          [],
        );

        return (
          <div style={{ width: 300, height: 300 }}>
            <Test rows={undefined} dataSource={dataSource} />
          </div>
        );
      }

      const { user } = render(<TestWithDataSourceNoUpdate />);

      // Wait for data to load
      await waitFor(() => {
        expect(getCell(0, 2)).not.to.equal(null);
      });

      // Edit a cell
      const cell = getCell(0, 2);
      await user.dblClick(cell);
      await user.keyboard('10000');
      // Click another cell to confirm edit
      await user.click(getCell(1, 2));

      // Undo should not be available when `dataSource` doesn't have `updateRow`
      expect(apiRef.current!.history.canUndo()).to.equal(false);
    });

    it('should call `dataSource.updateRow` when undoing with data source', async () => {
      const updateRowSpy = vi.fn();

      function TestWithDataSource() {
        const dataSource = React.useMemo(
          () => ({
            getRows: async () => ({ rows: data.rows, rowCount: data.rows.length }),
            updateRow: async (params: any) => {
              updateRowSpy(params);
              return params.updatedRow;
            },
          }),
          [],
        );

        return (
          <div style={{ width: 300, height: 300 }}>
            <Test rows={undefined} dataSource={dataSource} />
          </div>
        );
      }

      const { user } = render(<TestWithDataSource />);

      // Wait for data to load
      await waitFor(() => {
        expect(getCell(0, 2)).not.to.equal(null);
      });

      // Get the original value before editing
      const originalValue = apiRef.current!.getRow(0).currencyPair;

      // Edit a cell
      const cell = getCell(0, 2);
      await user.dblClick(cell);
      await user.keyboard('10000');
      // Click another cell to confirm edit
      await user.click(getCell(1, 2));

      // Undo should be available
      await waitFor(() => {
        expect(apiRef.current!.history.canUndo()).to.equal(true);
      });

      // Reset the call count
      updateRowSpy.mockClear();

      // Perform undo
      await act(async () => {
        await apiRef.current!.history.undo();
      });

      // one additional call to `updateRow` should have been made
      expect(updateRowSpy.mock.calls.length).to.equal(1);
      const undoCall = updateRowSpy.mock.lastCall;
      expect(undoCall?.[0]).to.have.property('rowId', 0);
      expect(undoCall?.[0].updatedRow).to.have.property('currencyPair', originalValue);
    });
  });

  // These tests are flaky in JSDOM
  describe.skipIf(isJSDOM)('Clipboard paste history', () => {
    it('should undo clipboard paste and restore original values', async () => {
      const { user } = render(<Test />);

      // Get original values
      const originalCol1 = getColumnValues(1);
      const originalCol2 = getColumnValues(2);

      const cell = getCell(0, 1);
      await user.click(cell);

      fireEvent.keyDown(cell, { key: 'Shift' });
      fireEvent.click(getCell(2, 2), { shiftKey: true });

      const clipboardData = [
        ['1', '2'].join('\t'),
        ['3', '4'].join('\t'),
        ['5', '6'].join('\t'),
      ].join('\n');
      paste(cell, clipboardData);

      await waitFor(() => {
        expect(getCell(0, 1)).to.have.text('1');
      });
      expect(getCell(0, 2)).to.have.text('2');
      expect(getCell(1, 1)).to.have.text('3');
      expect(getCell(1, 2)).to.have.text('4');
      expect(getCell(2, 1)).to.have.text('5');
      expect(getCell(2, 2)).to.have.text('6');

      // Undo the paste
      await act(async () => {
        await apiRef.current!.history.undo();
      });

      // All values should be restored
      expect(getColumnValues(1)).to.deep.equal(originalCol1);
      expect(getColumnValues(2)).to.deep.equal(originalCol2);
    });

    it('should redo clipboard paste after undo', async () => {
      const { user } = render(<Test />);

      const cell = getCell(0, 1);
      await act(() => cell.focus());
      await user.click(cell);

      fireEvent.keyDown(cell, { key: 'Shift' });
      fireEvent.click(getCell(1, 1), { shiftKey: true });

      const clipboardData = 'PASTED';
      paste(cell, clipboardData);

      await waitFor(() => {
        expect(getCell(0, 1)).to.have.text(clipboardData);
      });
      expect(getCell(1, 1)).to.have.text(clipboardData);

      // Undo
      await act(async () => {
        await apiRef.current!.history.undo();
      });

      expect(getCell(0, 1)).not.to.have.text(clipboardData);
      expect(getCell(1, 1)).not.to.have.text(clipboardData);
      expect(apiRef.current!.history.canRedo()).to.equal(true);

      // Redo the paste
      await act(async () => {
        await apiRef.current!.history.redo();
      });

      // Pasted values should be restored
      expect(getCell(0, 1)).to.have.text(clipboardData);
      expect(getCell(1, 1)).to.have.text(clipboardData);
    });

    it('should fail validation if the row was modified or deleted after paste', async () => {
      const { user } = render(<Test />);

      const cell = getCell(0, 1);
      await act(() => cell.focus());
      await user.click(cell);

      const clipboardData = 'PASTED';
      paste(cell, clipboardData);

      await waitFor(() => {
        expect(getCell(0, 1)).to.have.text(clipboardData);
      });

      expect(apiRef.current!.history.canUndo()).to.equal(true);

      // Modify the row externally
      await act(async () => {
        await apiRef.current!.updateRows([{ id: 0, currencyPair: 'MODIFIED' }]);
      });

      expect(apiRef.current!.history.canUndo()).to.equal(false);

      // Paste again
      paste(cell, clipboardData);

      await waitFor(() => {
        expect(getCell(0, 1)).to.have.text(clipboardData);
      });

      expect(apiRef.current!.history.canUndo()).to.equal(true);

      // Delete the row
      await act(async () => {
        await apiRef.current!.updateRows([{ id: 0, _action: 'delete' }]);
      });

      expect(apiRef.current!.history.canUndo()).to.equal(false);
    });
  });

  describe('Restoring rows that a merge cannot rebuild', () => {
    class Commodity {
      id: number;

      commodity: string;

      #revision: number;

      constructor(id: number, commodity: string, revision = 0) {
        this.id = id;
        this.commodity = commodity;
        this.#revision = revision;
      }

      get revision() {
        return this.#revision;
      }

      withCommodity(commodity: string) {
        return new Commodity(this.id, commodity, this.#revision + 1);
      }
    }

    function ReplaceTest(props: Partial<DataGridPremiumProps>) {
      apiRef = useGridApiRef();

      return (
        <div style={{ width: 300, height: 300 }}>
          <DataGridPremium
            rows={[new Commodity(0, 'Nickel'), new Commodity(1, 'Cobalt')]}
            columns={[{ field: 'commodity', editable: true }]}
            apiRef={apiRef}
            processRowUpdate={(newRow, oldRow) => ({
              _action: 'replace',
              row: (oldRow as Commodity).withCommodity(newRow.commodity),
            })}
            disableVirtualization
            cellSelection
            {...props}
          />
        </div>
      );
    }

    // Editing through the API would not publish `cellEditStop`, which is what the history
    // feature listens to.
    async function editFirstCommodityCell(user: MuiRenderResult['user'], value: string) {
      await user.dblClick(getCell(0, 0));
      await user.keyboard(`{Control>}a{/Control}${value}`);
      await user.click(getCell(1, 0));

      await waitFor(() => {
        expect(apiRef.current!.getRow(0).commodity).to.equal(value);
      });
    }

    it('should restore the stored rows rather than merged copies on paste', async () => {
      const { user } = render(<ReplaceTest />);

      const cell = getCell(0, 0);
      await user.click(cell);
      paste(cell, 'Silver');

      await waitFor(() => {
        expect(apiRef.current!.getRow(0).commodity).to.equal('Silver');
      });
      // `processRowUpdate()` replaced the row, so the paste kept the instance.
      expect(apiRef.current!.getRow(0).revision).to.equal(1);

      await act(async () => {
        await apiRef.current!.history.undo();
      });

      // Merging the snapshot back in would build a copy without the `#revision` state,
      // and reading it would throw.
      expect(apiRef.current!.getRow(0).commodity).to.equal('Nickel');
      expect(apiRef.current!.getRow(0).revision).to.equal(0);

      await act(async () => {
        await apiRef.current!.history.redo();
      });

      expect(apiRef.current!.getRow(0).commodity).to.equal('Silver');
      expect(apiRef.current!.getRow(0).revision).to.equal(1);
    });

    it('should restore the stored rows rather than merged copies on cell edit', async () => {
      const { user } = render(<ReplaceTest />);

      await editFirstCommodityCell(user, 'Silver');
      expect(apiRef.current!.getRow(0).revision).to.equal(1);

      await act(async () => {
        await apiRef.current!.history.undo();
      });

      expect(apiRef.current!.getRow(0).commodity).to.equal('Nickel');
      expect(apiRef.current!.getRow(0).revision).to.equal(0);

      // `processRowUpdate()` resolves after `cellEditStop`, so the row it stored is only
      // available to the redo because the undo captured it on the way past.
      await act(async () => {
        await apiRef.current!.history.redo();
      });

      expect(apiRef.current!.getRow(0).commodity).to.equal('Silver');
      expect(apiRef.current!.getRow(0).revision).to.equal(1);
    });

    it('should restore the stored rows rather than merged copies on row edit', async () => {
      const { user } = render(<ReplaceTest editMode="row" />);

      await user.dblClick(getCell(0, 0));
      await user.keyboard('{Control>}a{/Control}Silver{Enter}');

      await waitFor(() => {
        expect(apiRef.current!.getRow(0).commodity).to.equal('Silver');
      });
      expect(apiRef.current!.getRow(0).revision).to.equal(1);

      await act(async () => {
        await apiRef.current!.history.undo();
      });

      expect(apiRef.current!.getRow(0).commodity).to.equal('Nickel');
      expect(apiRef.current!.getRow(0).revision).to.equal(0);

      await act(async () => {
        await apiRef.current!.history.redo();
      });

      expect(apiRef.current!.getRow(0).commodity).to.equal('Silver');
      expect(apiRef.current!.getRow(0).revision).to.equal(1);
    });

    it('should hand the stored row to `dataSource.updateRow()` when undoing', async () => {
      const rows = [new Commodity(0, 'Nickel'), new Commodity(1, 'Cobalt')];
      const updateRow = vi.fn(async (params: GridUpdateRowParams) => ({
        _action: 'replace' as const,
        row: (params.previousRow as Commodity).withCommodity(params.updatedRow.commodity),
      }));
      const dataSource: GridDataSource = {
        getRows: async () => ({ rows, rowCount: rows.length }),
        updateRow,
      };

      const { user } = render(<ReplaceTest rows={undefined} dataSource={dataSource} />);

      // The rows arrive in the API before they are rendered, and the edit goes through
      // the cell.
      await waitFor(() => {
        expect(getColumnValues(0)).to.deep.equal(['Nickel', 'Cobalt']);
      });

      await editFirstCommodityCell(user, 'Silver');

      await act(async () => {
        await apiRef.current!.history.undo();
      });

      const undoParams = updateRow.mock.lastCall?.[0];
      // Rebuilding the request as `{ ...row, commodity: oldValue }` would send a plain
      // object, so the server would never see the row it stored.
      expect(undoParams?.updatedRow).to.be.instanceOf(Commodity);
      expect((undoParams?.updatedRow as Commodity).revision).to.equal(0);
      expect(undoParams?.previousRow).to.be.instanceOf(Commodity);
      expect((undoParams?.previousRow as Commodity).revision).to.equal(1);
    });

    it('should still restore a single field when the row is a plain object', async () => {
      const { user } = render(
        <ReplaceTest
          rows={[
            { id: 0, commodity: 'Nickel', region: 'EU' },
            { id: 1, commodity: 'Cobalt', region: 'EU' },
          ]}
          processRowUpdate={(newRow) => newRow}
        />,
      );

      await editFirstCommodityCell(user, 'Silver');

      // Something else updates a field the edit never touched.
      await act(async () => {
        apiRef.current!.updateRows([{ id: 0, region: 'APAC' }]);
      });

      await act(async () => {
        await apiRef.current!.history.undo();
      });

      expect(apiRef.current!.getRow(0).commodity).to.equal('Nickel');
      // Restoring the whole row would have rolled `region` back to `EU` as well.
      expect(apiRef.current!.getRow(0).region).to.equal('APAC');
    });
  });
});
