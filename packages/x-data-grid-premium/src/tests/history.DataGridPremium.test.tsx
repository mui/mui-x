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
import { createRenderer, waitFor, act, MuiRenderResult } from '@mui/internal-test-utils';
import { getCell } from 'test/utils/helperFn';
import { spy } from 'sinon';
import { getBasicGridData } from '@mui/x-data-grid-generator';

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
      await user.click(cell);
      await user.keyboard('{Enter}');
      await user.keyboard('10000');
      await user.keyboard('{Enter}');

      // Undo should be available
      expect(apiRef.current!.history.canUndo()).to.equal(true);

      act(() => {
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

    it('should clear forward history when making a new action after undo', async () => {
      const customHandler: GridHistoryEventHandler = {
        store: () => ({ data: 'test' }),
        undo: async () => {},
        redo: async () => {},
        validate: () => true,
      };

      const historyEvents = new Map<GridEvents, GridHistoryEventHandler>();
      historyEvents.set('cellClick', customHandler);

      const { user } = render(<Test historyEvents={historyEvents} />);

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
});
