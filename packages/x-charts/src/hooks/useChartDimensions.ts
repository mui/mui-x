import * as React from 'react';
import { DEFAULT_MARGINS } from '../const';

const useChartDimensions = (width, height, margin) => {
  const defaultizedMargin = {
    ...DEFAULT_MARGINS,
    ...margin,
  };

  const drawingArea = React.useMemo(
    () => ({
      left: defaultizedMargin.left,
      top: defaultizedMargin.top,
      width: Math.max(0, width - defaultizedMargin.left - defaultizedMargin.right),
      height: Math.max(0, height - defaultizedMargin.top - defaultizedMargin.bottom),
    }),
    [
      width,
      height,
      defaultizedMargin.top,
      defaultizedMargin.bottom,
      defaultizedMargin.left,
      defaultizedMargin.right,
    ],
  );

  return drawingArea;
};

export default useChartDimensions;
