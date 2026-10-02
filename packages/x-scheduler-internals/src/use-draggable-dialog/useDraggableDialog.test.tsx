import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { screen, fireEvent } from '@mui/internal-test-utils';
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createSchedulerRenderer,
  startDrag,
  startLongPressDrag,
  moveDrag,
  moveDragAndWait,
  dropDrag,
} from 'test/utils/scheduler';
import { useDraggableDialog } from './useDraggableDialog';

function TestDialog() {
  const { elementRef, resetDrag, draggableProps } = useDraggableDialog();
  return (
    <Draggable.Root {...draggableProps} ref={elementRef} data-testid="dialog">
      <Draggable.Handle data-testid="handle">
        Move dialog
        <input aria-label="Title" />
        <button type="button">Close</button>
      </Draggable.Handle>
      <div data-testid="content">Dialog content</div>
      <button type="button" onClick={resetDrag}>
        Reset
      </button>
      <Draggable.Preview disabled />
    </Draggable.Root>
  );
}

describe('useDraggableDialog', () => {
  const { render } = createSchedulerRenderer();
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should move from its handle and accumulate completed drags', () => {
    render(
      <Draggable.Provider>
        <TestDialog />
      </Draggable.Provider>,
    );
    const dialog = screen.getByTestId('dialog');
    const handle = screen.getByTestId('handle');
    startDrag(handle);
    dropDrag(handle, { clientX: 30, clientY: 20 });
    expect(dialog.style.transform).toBe('translate(30px, 20px)');
    startDrag(handle);
    dropDrag(handle, { clientX: 10, clientY: 15 });
    expect(dialog.style.transform).toBe('translate(40px, 35px)');
  });

  it('should return to its initial position when reset', () => {
    render(
      <Draggable.Provider>
        <TestDialog />
      </Draggable.Provider>,
    );
    const dialog = screen.getByTestId('dialog');
    const handle = screen.getByTestId('handle');
    startDrag(handle);
    dropDrag(handle, { clientX: 30, clientY: 20 });

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(dialog.style.transform).toBe('none');

    // The next drag starts from the initial position again.
    startDrag(handle);
    dropDrag(handle, { clientX: 10, clientY: 5 });
    expect(dialog.style.transform).toBe('translate(10px, 5px)');
  });

  it('should restore the last completed position when Escape cancels a drag', async () => {
    render(
      <Draggable.Provider>
        <TestDialog />
      </Draggable.Provider>,
    );
    const dialog = screen.getByTestId('dialog');
    const handle = screen.getByTestId('handle');
    startDrag(handle);
    dropDrag(handle, { clientX: 30, clientY: 20 });
    startDrag(handle);
    await moveDragAndWait(handle, { clientX: 100, clientY: 100 });
    expect(dialog.style.transform).toBe('translate(130px, 120px)');
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(dialog.style.transform).toBe('translate(30px, 20px)');
  });

  it('should not move from a form control inside the handle', () => {
    render(
      <Draggable.Provider>
        <TestDialog />
      </Draggable.Provider>,
    );
    const input = screen.getByRole('textbox', { name: 'Title' });
    startDrag(input, { expectDrag: false });
    dropDrag(input, { clientX: 100, clientY: 100 });
    expect(screen.getByTestId('dialog').style.transform).toBe('');
  });

  it('should move from the header on touch after a long press', async () => {
    vi.useFakeTimers();
    render(
      <Draggable.Provider>
        <TestDialog />
      </Draggable.Provider>,
    );
    const handle = screen.getByTestId('handle');
    await startLongPressDrag(handle, { clientX: 0, clientY: 0 });
    moveDrag(handle, { pointerType: 'touch', clientX: 30, clientY: 20 });
    dropDrag(handle, { pointerType: 'touch', clientX: 30, clientY: 20 });
    expect(screen.getByTestId('dialog').style.transform).toBe('translate(30px, 20px)');
  });

  it.each(['Title', 'Close'])('should not drag from the %s control on touch', async (name) => {
    vi.useFakeTimers();
    render(
      <Draggable.Provider>
        <TestDialog />
      </Draggable.Provider>,
    );
    const control = screen.getByRole(name === 'Title' ? 'textbox' : 'button', { name });
    await startLongPressDrag(control, { clientX: 0, clientY: 0, expectDrag: false });
    moveDrag(control, { pointerType: 'touch', clientX: 30, clientY: 20 });
    dropDrag(control, { pointerType: 'touch', clientX: 30, clientY: 20 });
    expect(screen.getByTestId('dialog').style.transform).toBe('');
  });

  it('should not drag from content outside the handle', () => {
    render(
      <Draggable.Provider>
        <TestDialog />
      </Draggable.Provider>,
    );
    const content = screen.getByTestId('content');
    startDrag(content, { expectDrag: false });
    dropDrag(content, { clientX: 30, clientY: 20 });
    expect(screen.getByTestId('dialog').style.transform).toBe('');
  });
});
