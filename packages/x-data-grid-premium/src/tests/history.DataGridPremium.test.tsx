import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  GridApi,
  useGridApiRef,
  DataGridPremium,
  DataGridPremiumProps,
  GridHistoryEventHandler,
  GridEvents,
} from '@mui/x-data-grid-premium';
import { createRenderer, waitFor, act, fireEvent, MuiRenderResult } from '@mui/internal-test-utils';
import { getCell, getColumnValues } from 'test/utils/helperFn';
import { spy } from 'sinon';
import { getBasicGridData } from '@mui/x-data-grid-generator';
import { isJSDOM } from 'test/utils/skipIf';

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

  describe('API', () => {
    it('should start with an empty queue', () => {
      render(<Test />);

      expect(apiRef.current!.history.canUndo()).to.equal(false);
      expect(apiRef.current!.history.canRedo()).to.equal(false);
    });

    it('should return false for undo when there is nothing to undo/redo', async () => {
      render(<Test />);

      const resultUndo = await apiRef.current!.history.undo();
      expect(resultUndo).to.equal(false);

      const resultRedo = await apiRef.current!.history.redo();
      expect(resultRedo).to.equal(false);
    });

    it('should clear the queue', async () => {
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
        validate: () => true,
      };

      const historyEvents = new Map<GridEvents, GridHistoryEventHandler>();
      historyEvents.set('cellClick', customHandler);

      const { user } = render(<Test historyEvents={historyEvents} />);

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
        store: () => ({ test: 'data' }),
        undo: async () => {},
        redo: async () => {},
        validate: (_, operation) => {
          if (operation === 'undo') {
            return shouldValidate;
          }
          return true;
        },
      };

      const historyEvents = new Map<GridEvents, GridHistoryEventHandler>();
      historyEvents.set('cellClick', customHandler);

      const { user } = render(<Test historyEvents={historyEvents} />);

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
        validate: () => true,
      };

      const historyEvents = new Map<GridEvents, GridHistoryEventHandler>();
      historyEvents.set('cellClick', customHandler);

      ({ user } = render(<Test historyEvents={historyEvents} />));

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

  describe('Queue management', () => {
    it('should respect historyQueueSize limit and keep the latest items', async () => {
      let lastUndoData: any = null;
      const customHandler: GridHistoryEventHandler = {
        store: (params: any) => ({ rowId: params.id }),
        undo: async (storedData) => {
          lastUndoData = storedData;
        },
        redo: async () => {},
        validate: () => true,
      };

      const historyEvents = new Map<GridEvents, GridHistoryEventHandler>();
      historyEvents.set('cellClick', customHandler);

      const { user } = render(<Test historyQueueSize={2} historyEvents={historyEvents} />);

      // Make 3 clicks
      await user.click(getCell(0, 2));
      await user.click(getCell(1, 2));
      await user.click(getCell(2, 2));

      await waitFor(() => {
        expect(apiRef.current!.history.canUndo()).to.equal(true);
      });

      // Should only be able to undo 2 times (queue size limit) and only for the last two items
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

    it('should validate the previous queue item after undo', async () => {
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
        validate: () => true,
      };

      const historyEvents = new Map<GridEvents, GridHistoryEventHandler>();
      historyEvents.set('cellClick', firstHandler);
      historyEvents.set('cellDoubleClick', secondHandler);

      const { user } = render(
        <Test historyEvents={historyEvents} historyValidationEvents={['stateChange']} />,
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

    it('should clear forward history when making a new action after undo', async () => {
      const customHandler: GridHistoryEventHandler = {
        store: () => ({ data: 'test' }),
        undo: async () => {},
        redo: async () => {},
        validate: () => true,
      };

      const historyEvents = new Map<GridEvents, GridHistoryEventHandler>();
      historyEvents.set('cellClick', customHandler);

      const { user } = render(
        <Test historyEvents={historyEvents} historyValidationEvents={['stateChange']} />,
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
  });

  describe('Events', () => {
    it('should fire `onUndo` callback', async () => {
      const onUndo = spy();

      const customHandler: GridHistoryEventHandler = {
        store: () => ({ data: 'test' }),
        undo: async () => {},
        redo: async () => {},
        validate: () => true,
      };

      const historyEvents = new Map<GridEvents, GridHistoryEventHandler>();
      historyEvents.set('cellClick', customHandler);

      const { user } = render(<Test onUndo={onUndo} historyEvents={historyEvents} />);

      const cell = getCell(0, 2);
      await user.click(cell);

      await waitFor(() => {
        expect(apiRef.current!.history.canUndo()).to.equal(true);
      });

      // Undo
      await act(async () => {
        await apiRef.current!.history.undo();
      });

      expect(onUndo.callCount).to.equal(1);
      expect(onUndo.firstCall.args[0]).to.have.property('eventName', 'cellClick');
    });

    it('should fire `onRedo` callback', async () => {
      const onRedo = spy();

      const customHandler: GridHistoryEventHandler = {
        store: () => ({ data: 'test' }),
        undo: async () => {},
        redo: async () => {},
        validate: () => true,
      };

      const historyEvents = new Map<GridEvents, GridHistoryEventHandler>();
      historyEvents.set('cellClick', customHandler);

      const { user } = render(<Test onRedo={onRedo} historyEvents={historyEvents} />);

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

      expect(onRedo.callCount).to.equal(1);
      expect(onRedo.firstCall.args[0]).to.have.property('eventName', 'cellClick');
    });
  });

  describe('Disabled history', () => {
    it('should not track history when `historyQueueSize` is 0', async () => {
      const customHandler: GridHistoryEventHandler = {
        store: () => ({ data: 'test' }),
        undo: async () => {},
        redo: async () => {},
        validate: () => true,
      };

      const historyEvents = new Map<GridEvents, GridHistoryEventHandler>();
      historyEvents.set('cellClick', customHandler);

      const { user } = render(<Test historyQueueSize={0} historyEvents={historyEvents} />);

      const cell = getCell(0, 2);
      await user.click(cell);

      expect(apiRef.current!.history.canUndo()).to.equal(false);
    });
  });

  // These tests are flaky in JSDOM
  describe.skipIf(isJSDOM)('Clipboard paste history', () => {
    function paste(cell: HTMLElement, pasteText: string) {
      const pasteEvent = new Event('paste');

      // @ts-ignore
      pasteEvent.clipboardData = {
        getData: () => pasteText,
      };

      fireEvent.keyDown(cell, { key: 'v', keyCode: 86, ctrlKey: true }); // Ctrl+V
      act(() => document.activeElement!.dispatchEvent(pasteEvent));
    }

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
});
