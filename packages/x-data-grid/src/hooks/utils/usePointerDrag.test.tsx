import * as React from 'react';
import { createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { hasTouchSupport, isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { usePointerDrag } from './usePointerDrag';
import type { UsePointerDragOptions } from './usePointerDrag';

type TestProps = Partial<UsePointerDragOptions<string>> & {
  onHandleClick?: () => void;
};

function Test(props: TestProps) {
  const { onHandleClick, ...options } = props;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const { onPointerDown } = usePointerDrag<string>({
    getCaptureElement: () => rootRef.current,
    ...options,
  });

  return (
    <div ref={rootRef} data-testid="root" style={{ width: 200, height: 200 }}>
      <div
        data-testid="handle"
        style={{ width: 50, height: 50 }}
        onPointerDown={(event) => onPointerDown(event, 'item')}
        onClick={onHandleClick}
      />
      <div data-testid="target" style={{ width: 50, height: 50 }} />
    </div>
  );
}

const pointer = (pointerType: string, clientX: number, clientY: number) => ({
  pointerId: 1,
  pointerType,
  isPrimary: true,
  button: 0,
  buttons: 1,
  clientX,
  clientY,
});

describe('usePointerDrag', () => {
  const { render } = createRenderer();

  afterEach(async () => {
    vi.useRealTimers();
    // The click suppression after a drag is removed on the next task
    await new Promise((resolve) => {
      setTimeout(resolve);
    });
  });

  describe('mouse', () => {
    it('should start the drag only after the pointer moved the activation distance', () => {
      const onDragStart = vi.fn();
      const onDragMove = vi.fn();
      render(<Test onDragStart={onDragStart} onDragMove={onDragMove} mouseDistance={5} />);
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('mouse', 10, 10));
      fireEvent.pointerMove(handle, pointer('mouse', 13, 10));
      expect(onDragStart).toHaveBeenCalledTimes(0);

      fireEvent.pointerMove(handle, pointer('mouse', 16, 10));
      expect(onDragStart).toHaveBeenCalledTimes(1);
      expect(onDragStart.mock.calls[0][0]).toMatchObject({
        data: 'item',
        pointerType: 'mouse',
        clientX: 16,
        clientY: 10,
      });
      expect(onDragMove).toHaveBeenCalledTimes(1);
    });

    it('should call onDragEnd with the last pointer position', () => {
      const onDragEnd = vi.fn();
      const onDragCancel = vi.fn();
      render(<Test onDragEnd={onDragEnd} onDragCancel={onDragCancel} />);
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('mouse', 10, 10));
      fireEvent.pointerMove(handle, pointer('mouse', 30, 10));
      fireEvent.pointerUp(handle, pointer('mouse', 40, 20));

      expect(onDragEnd).toHaveBeenCalledTimes(1);
      expect(onDragEnd.mock.calls[0][0]).toMatchObject({ data: 'item', clientX: 40, clientY: 20 });
      expect(onDragCancel).toHaveBeenCalledTimes(0);
    });

    it('should not start a drag nor block the click when the pointer did not move', () => {
      const onDragStart = vi.fn();
      const onDragEnd = vi.fn();
      const onHandleClick = vi.fn();
      render(
        <Test onDragStart={onDragStart} onDragEnd={onDragEnd} onHandleClick={onHandleClick} />,
      );
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('mouse', 10, 10));
      fireEvent.pointerUp(handle, pointer('mouse', 10, 10));
      fireEvent.click(handle);

      expect(onDragStart).toHaveBeenCalledTimes(0);
      expect(onDragEnd).toHaveBeenCalledTimes(0);
      expect(onHandleClick).toHaveBeenCalledTimes(1);
    });

    it('should prevent the click that follows a drag', async () => {
      const onHandleClick = vi.fn();
      render(<Test onHandleClick={onHandleClick} />);
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('mouse', 10, 10));
      fireEvent.pointerMove(handle, pointer('mouse', 30, 10));
      fireEvent.pointerUp(handle, pointer('mouse', 30, 10));
      fireEvent.click(handle);
      expect(onHandleClick).toHaveBeenCalledTimes(0);

      // Only the next click is prevented
      fireEvent.click(handle);
      expect(onHandleClick).toHaveBeenCalledTimes(1);
    });

    it('should stop preventing clicks when no click followed the drag', async () => {
      const onHandleClick = vi.fn();
      render(<Test onHandleClick={onHandleClick} />);
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('mouse', 10, 10));
      fireEvent.pointerMove(handle, pointer('mouse', 30, 10));
      fireEvent.pointerUp(handle, pointer('mouse', 30, 10));
      await new Promise((resolve) => {
        setTimeout(resolve);
      });

      fireEvent.click(handle);
      expect(onHandleClick).toHaveBeenCalledTimes(1);
    });

    it('should ignore buttons other than the main one', () => {
      const onDragStart = vi.fn();
      render(<Test onDragStart={onDragStart} />);
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, { ...pointer('mouse', 10, 10), button: 2 });
      fireEvent.pointerMove(handle, pointer('mouse', 30, 10));

      expect(onDragStart).toHaveBeenCalledTimes(0);
    });

    it('should end a pending session when the button was released outside the window', () => {
      const onDragStart = vi.fn();
      render(<Test onDragStart={onDragStart} />);
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('mouse', 10, 10));
      fireEvent.pointerMove(handle, { ...pointer('mouse', 30, 10), buttons: 0 });
      fireEvent.pointerMove(handle, pointer('mouse', 40, 10));

      expect(onDragStart).toHaveBeenCalledTimes(0);
    });
  });

  describe('touch', () => {
    it('should start the drag after the pointer was held still for the delay', () => {
      vi.useFakeTimers();
      const onDragStart = vi.fn();
      render(<Test onDragStart={onDragStart} touchDelay={300} touchTolerance={8} />);
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('touch', 10, 10));
      // Small moves within the tolerance keep the pending drag
      fireEvent.pointerMove(handle, pointer('touch', 14, 10));
      vi.advanceTimersByTime(299);
      expect(onDragStart).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(1);
      expect(onDragStart).toHaveBeenCalledTimes(1);
      expect(onDragStart.mock.calls[0][0]).toMatchObject({
        data: 'item',
        pointerType: 'touch',
        clientX: 14,
      });
    });

    it('should not start the drag when the pointer moved before the delay', () => {
      vi.useFakeTimers();
      const onDragStart = vi.fn();
      render(<Test onDragStart={onDragStart} touchDelay={300} touchTolerance={8} />);
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('touch', 10, 10));
      fireEvent.pointerMove(handle, pointer('touch', 10, 30));
      vi.advanceTimersByTime(300);

      expect(onDragStart).toHaveBeenCalledTimes(0);
    });

    it('should not start the drag when the browser canceled the pointer before the delay', () => {
      vi.useFakeTimers();
      const onDragStart = vi.fn();
      const onDragCancel = vi.fn();
      render(<Test onDragStart={onDragStart} onDragCancel={onDragCancel} />);
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('touch', 10, 10));
      fireEvent.pointerCancel(handle, pointer('touch', 10, 10));
      vi.advanceTimersByTime(1000);

      expect(onDragStart).toHaveBeenCalledTimes(0);
      // The drag never started, so there is nothing to cancel
      expect(onDragCancel).toHaveBeenCalledTimes(0);
    });

    it.skipIf(!hasTouchSupport)('should prevent scrolling only while dragging', () => {
      vi.useFakeTimers();
      render(<Test touchDelay={300} />);
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('touch', 10, 10));
      // `fireEvent` returns `false` when the event's default action was prevented
      expect(fireEvent.touchMove(handle, { cancelable: true })).to.equal(true);

      vi.advanceTimersByTime(300);
      expect(fireEvent.touchMove(handle, { cancelable: true })).to.equal(false);

      fireEvent.pointerUp(handle, pointer('touch', 10, 10));
      expect(fireEvent.touchMove(handle, { cancelable: true })).to.equal(true);
    });

    it('should prevent the context menu of a long press', () => {
      render(<Test />);
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('touch', 10, 10));
      expect(fireEvent.contextMenu(handle)).to.equal(false);

      fireEvent.pointerUp(handle, pointer('touch', 10, 10));
      expect(fireEvent.contextMenu(handle)).to.equal(true);
    });
  });

  describe('cancel', () => {
    it('should cancel the drag on Escape', () => {
      const onDragEnd = vi.fn();
      const onDragCancel = vi.fn();
      render(<Test onDragEnd={onDragEnd} onDragCancel={onDragCancel} />);
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('mouse', 10, 10));
      fireEvent.pointerMove(handle, pointer('mouse', 30, 10));
      fireEvent.keyDown(document.body, { key: 'Escape' });
      fireEvent.pointerUp(handle, pointer('mouse', 30, 10));

      expect(onDragCancel).toHaveBeenCalledTimes(1);
      expect(onDragCancel.mock.calls[0][0]).to.equal('item');
      expect(onDragEnd).toHaveBeenCalledTimes(0);
    });

    it('should cancel the drag on pointercancel', () => {
      const onDragEnd = vi.fn();
      const onDragCancel = vi.fn();
      render(<Test onDragEnd={onDragEnd} onDragCancel={onDragCancel} />);
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('mouse', 10, 10));
      fireEvent.pointerMove(handle, pointer('mouse', 30, 10));
      fireEvent.pointerCancel(handle, pointer('mouse', 30, 10));
      fireEvent.pointerUp(handle, pointer('mouse', 30, 10));

      expect(onDragCancel).toHaveBeenCalledTimes(1);
      expect(onDragEnd).toHaveBeenCalledTimes(0);
    });

    it('should only cancel when the capture element loses the capture', () => {
      const onDragCancel = vi.fn();
      render(<Test onDragCancel={onDragCancel} />);
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('mouse', 10, 10));
      fireEvent.pointerMove(handle, pointer('mouse', 30, 10));

      // A touch pointer's implicit capture on the handle is lost when the drag starts
      fireEvent.lostPointerCapture(handle, pointer('mouse', 30, 10));
      expect(onDragCancel).toHaveBeenCalledTimes(0);

      fireEvent.lostPointerCapture(screen.getByTestId('root'), pointer('mouse', 30, 10));
      expect(onDragCancel).toHaveBeenCalledTimes(1);
    });

    it('should stop listening when unmounted during a drag', () => {
      const onDragMove = vi.fn();
      const onDragEnd = vi.fn();
      const onDragCancel = vi.fn();
      const { unmount } = render(
        <Test onDragMove={onDragMove} onDragEnd={onDragEnd} onDragCancel={onDragCancel} />,
      );
      const handle = screen.getByTestId('handle');

      fireEvent.pointerDown(handle, pointer('mouse', 10, 10));
      fireEvent.pointerMove(handle, pointer('mouse', 30, 10));
      expect(onDragMove).toHaveBeenCalledTimes(1);

      unmount();
      fireEvent.pointerMove(document.body, pointer('mouse', 40, 10));
      fireEvent.pointerUp(document.body, pointer('mouse', 40, 10));

      expect(onDragMove).toHaveBeenCalledTimes(1);
      expect(onDragEnd).toHaveBeenCalledTimes(0);
      expect(onDragCancel).toHaveBeenCalledTimes(0);
    });
  });

  // Hit-testing needs a real layout
  describe.skipIf(isJSDOM)('hit-testing', () => {
    it('should report the element under the pointer and whether it is inside the capture element', () => {
      const onDragMove = vi.fn();
      const onDragEnd = vi.fn();
      render(<Test onDragMove={onDragMove} onDragEnd={onDragEnd} />);
      const handle = screen.getByTestId('handle');
      const target = screen.getByTestId('target');
      const rootRect = screen.getByTestId('root').getBoundingClientRect();
      const handleRect = handle.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      fireEvent.pointerDown(handle, pointer('mouse', handleRect.left + 5, handleRect.top + 5));
      fireEvent.pointerMove(handle, pointer('mouse', targetRect.left + 25, targetRect.top + 25));
      expect(onDragMove.mock.calls[0][0].elementAtPoint).to.equal(target);
      expect(onDragMove.mock.calls[0][0].isInside).to.equal(true);

      fireEvent.pointerUp(handle, pointer('mouse', rootRect.right + 20, rootRect.top + 5));
      expect(onDragEnd.mock.calls[0][0].isInside).to.equal(false);
    });
  });
});
