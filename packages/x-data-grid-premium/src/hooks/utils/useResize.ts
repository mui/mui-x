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

    const handleMouseMove = (event: MouseEvent) => {
      if (startX === null || startWidth === null) {
        return;
      }
      const newWidth = startWidth + (startX - event.clientX);
      onWidthChange(newWidth, handle);
    };

    const handleMouseUp = () => {
      startX = null;
      startWidth = null;

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      startX = event.clientX;
      startWidth = getInitialWidth(handle);

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    handle.addEventListener('mousedown', handleMouseDown);

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return {
    ref: resizeHandleRef,
  };
};
