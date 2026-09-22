import * as React from 'react';
import { Draggable } from '@base-ui/react/draggable';
import { screen, fireEvent } from '@mui/internal-test-utils';
import { describe, it, expect, afterEach } from 'vitest';
import {
  createSchedulerRenderer,
  startDrag,
  moveDrag,
  dropDrag,
  cancelDrag,
} from 'test/utils/scheduler';
import { useDraggableDialog } from './useDraggableDialog';

function TestDialog() {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const { draggableProps } = useDraggableDialog(elementRef, (transform) => {
    elementRef.current!.style.transform = transform;
  });
  return (
    <Draggable.Root {...draggableProps} ref={elementRef} data-testid="dialog">
      <Draggable.Handle data-testid="handle">Move dialog</Draggable.Handle>
      <input aria-label="Title" />
      <Draggable.Preview disabled />
    </Draggable.Root>
  );
}

describe('useDraggableDialog', () => {
  const { render } = createSchedulerRenderer();
  afterEach(cancelDrag);

  it('moves from its handle and accumulates completed drags', () => {
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

  it('restores the last completed position when Escape cancels a drag', () => {
    render(
      <Draggable.Provider>
        <TestDialog />
      </Draggable.Provider>,
    );
    const handle = screen.getByTestId('handle');
    startDrag(handle);
    dropDrag(handle, { clientX: 30, clientY: 20 });
    startDrag(handle);
    moveDrag(handle, { clientX: 100, clientY: 100 });
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(screen.getByTestId('dialog').style.transform).toBe('translate(30px, 20px)');
  });

  it('keeps form controls interactive and does not start a drag outside the handle', () => {
    render(
      <Draggable.Provider>
        <TestDialog />
      </Draggable.Provider>,
    );
    const input = screen.getByRole<HTMLInputElement>('textbox', { name: 'Title' });
    startDrag(input);
    dropDrag(input, { clientX: 100, clientY: 100 });
    fireEvent.change(input, { target: { value: 'Updated title' } });
    expect(input.value).toBe('Updated title');
    expect(screen.getByTestId('dialog').style.transform).toBe('');
  });
});
