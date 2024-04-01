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

    const handlePointerUp = () => {
      startX = null;
      startWidth = null;

      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    const handlePointerDown = (event: PointerEvent) => {
      event.preventDefault();
      startX = event.clientX;
      startWidth = getInitialWidth(handle);

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    };

    handle.addEventListener('pointerdown', handlePointerDown);

    return () => {
      handle.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return {
    ref: resizeHandleRef,
  };
};
