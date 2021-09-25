import { useEffect, useRef, useState } from 'react';
import { ResizeObserver } from '@juggle/resize-observer';

const combineChartDimensions = (dimensions) => {
  const parsedDimensions = {
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 10,
    ...dimensions,
  };

  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom,
      0,
    ),
    boundedWidth: Math.max(
      parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight,
      0,
    ),
  };
};

const useChartDimensions = (passedSettings) => {
  const ref = useRef();
  const dimensions = combineChartDimensions(passedSettings);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      return [ref, dimensions];
    }

    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (Array.isArray(entries) && entries.length) {
        const entry = entries[0];
        setWidth(entry.contentRect.width);
        setHeight(entry.contentRect.height);
      }
    });
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [dimensions, height, width]);

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return [ref, newSettings];
};

export default useChartDimensions;
