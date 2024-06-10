import * as React from 'react';
import { useSvgRef } from '../../hooks';
import { useZoom } from './useZoom';

export const useSetupZoom = () => {
  const { scaleX, setScaleX } = useZoom();

  const svgRef = useSvgRef();

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handleZoom = (event: WheelEvent) => {
      event.preventDefault();
      if (element === null) {
        return;
      }

      const { deltaY } = event;

      const scale = deltaY < 0 ? 0.99 : 1.01;

      const maxScale = 10;
      const minScale = 1;

      const newZoom = Math.min(Math.max(scaleX * scale, minScale), maxScale);

      setScaleX(newZoom);
    };

    element.addEventListener('wheel', handleZoom);

    return () => {
      element.removeEventListener('wheel', handleZoom);
    };
  }, [svgRef, scaleX, setScaleX]);
};
