import * as React from 'react';

export type ResizeDirection = 'horizontal' | 'vertical';

export const useResize = <TElement extends HTMLDivElement>(options: {
  getInitialSize: (handleElement: TElement) => number;
  onSizeChange: (newSize: number, handleElement: TElement) => void;
  direction?: ResizeDirection;
}) => {
  const resizeHandleRef = React.useRef<TElement>(null);
  const optionsRef = React.useRef(options);

  React.useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  React.useEffect(() => {
    const handle = resizeHandleRef.current;
    if (!handle) {
      return undefined;
    }

    const { onSizeChange, getInitialSize, direction = 'horizontal' } = optionsRef.current;

    let startPosition: null | number = null;
    let startSize: null | number = null;

    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault();

      if (startPosition === null || startSize === null) {
        return;
      }

      const delta =
        direction === 'horizontal' ? startPosition - event.clientX : startPosition - event.clientY;

      const newSize = startSize + delta;
      onSizeChange(newSize, handle);
    };

    const handlePointerUp = (event: PointerEvent) => {
      startPosition = null;
      startSize = null;
      handle.removeEventListener('pointermove', handlePointerMove);
      handle.releasePointerCapture(event.pointerId);
    };

    const handlePointerDown = (event: PointerEvent) => {
      startPosition = direction === 'horizontal' ? event.clientX : event.clientY;
      startSize = getInitialSize(handle);
      handle.addEventListener('pointermove', handlePointerMove);
      handle.setPointerCapture(event.pointerId);
    };

    handle.addEventListener('pointerdown', handlePointerDown);
    handle.addEventListener('pointerup', handlePointerUp);

    return () => {
      handle.removeEventListener('pointerdown', handlePointerDown);
      handle.removeEventListener('pointerup', handlePointerUp);
      handle.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return {
    ref: resizeHandleRef,
  };
};
