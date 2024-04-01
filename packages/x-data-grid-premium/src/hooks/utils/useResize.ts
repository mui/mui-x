import * as React from 'react';

export const useResize = <TElement extends HTMLElement>(options: {
  getInitialWidth: (handleElement: TElement) => number;
  onWidthChange: (newWidth: number, handleElement: TElement) => void;
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

    const { onWidthChange, getInitialWidth } = optionsRef.current;

    let startX: null | number = null;
    let startWidth: null | number = null;

    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault();
      if (startX === null || startWidth === null) {
        return;
      }
      const newWidth = startWidth + (startX - event.clientX);
      onWidthChange(newWidth, handle);
    };

    const handlePointerUp = (event: PointerEvent) => {
      startX = null;
      startWidth = null;
      handle.removeEventListener('pointermove', handlePointerMove);
      handle.releasePointerCapture(event.pointerId);
    };

    const handlePointerDown = (event: PointerEvent) => {
      startX = event.clientX;
      startWidth = getInitialWidth(handle);
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
