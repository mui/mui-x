import { FunnelDataPoints, FunnelLabelOptions } from './funnel.types';

export const alignLabel = ({
  position,
  textAnchor,
  dominantBaseline,
}: Omit<FunnelLabelOptions, 'margin'>) => {
  const vertical = position?.vertical ?? 'middle';
  const horizontal = position?.horizontal ?? 'middle';
  let anchor = 'middle';
  let baseline = 'central';

  if (vertical === 'top') {
    baseline = 'hanging';
  } else if (vertical === 'bottom') {
    baseline = 'baseline';
  }

  if (horizontal === 'left') {
    anchor = 'start';
  } else if (horizontal === 'right') {
    anchor = 'end';
  }

  return {
    textAnchor: textAnchor ?? anchor,
    dominantBaseline: dominantBaseline ?? baseline,
  };
};

export const positionLabel = ({
  position,
  margin,
  xPosition,
  yPosition,
  isHorizontal,
  values,
  dataIndex,
  baseScaleData,
}: Omit<FunnelLabelOptions, 'textAnchor' | 'dominantBaseline'> & {
  xPosition: (
    value: number,
    bandIndex: number,
    stackOffset?: number,
    useBand?: boolean,
  ) => number | undefined;
  yPosition: (
    value: number,
    bandIndex: number,
    stackOffset?: number,
    useBand?: boolean,
  ) => number | undefined;
  isHorizontal: boolean;
  values: FunnelDataPoints[];
  dataIndex: number;
  baseScaleData: number[];
}) => {
  const vertical = position?.vertical ?? 'middle';
  const horizontal = position?.horizontal ?? 'middle';

  let x: number | undefined = 0;
  let y: number | undefined = 0;

  // TODO: should we provide these to the user when they override the label?
  // We can optimize this by only calculating the necessary values
  // And simplifying the if/else mess :)
  let minTop: number = 0;
  let maxTop: number = 0;
  let minBottom: number = 0;
  let maxBottom: number = 0;
  let minLeft: number = 0;
  let maxLeft: number = 0;
  let minRight: number = 0;
  let maxRight: number = 0;
  let center: number = 0;
  let leftCenter: number = 0;
  let rightCenter: number = 0;
  let middle: number = 0;
  let topMiddle: number = 0;
  let bottomMiddle: number = 0;

  const mt = typeof margin === 'number' ? margin : (margin?.top ?? 0);
  const mr = typeof margin === 'number' ? margin : (margin?.right ?? 0);
  const mb = typeof margin === 'number' ? margin : (margin?.bottom ?? 0);
  const ml = typeof margin === 'number' ? margin : (margin?.left ?? 0);

  const stackOffset = values[0].stackOffset;

  if (isHorizontal) {
    maxTop = yPosition(values[0].y, baseScaleData[dataIndex], stackOffset)! + mt;
    minTop = yPosition(values[1].y, baseScaleData[dataIndex], stackOffset)! + mt;
    minBottom = yPosition(values[2].y, baseScaleData[dataIndex], stackOffset)! - mb;
    maxBottom = yPosition(values[3].y, baseScaleData[dataIndex], stackOffset)! - mb;
    minRight = 0;
    maxRight =
      xPosition(Math.min(...values.map((v) => v.x)), baseScaleData[dataIndex], stackOffset, true)! -
      mr;
    minLeft = 0;
    maxLeft =
      xPosition(Math.max(...values.map((v) => v.x)), baseScaleData[dataIndex], stackOffset)! + ml;
    center = maxRight - (maxRight - maxLeft) / 2;
    leftCenter = 0;
    rightCenter = 0;
    middle = yPosition(0, baseScaleData[dataIndex], stackOffset)!;
    topMiddle =
      yPosition(
        values[0].y - (values[0].y - values[1].y) / 2,
        baseScaleData[dataIndex],
        stackOffset,
      )! + mt;
    bottomMiddle =
      yPosition(
        values[3].y - (values[3].y - values[2].y) / 2,
        baseScaleData[dataIndex],
        stackOffset,
      )! - mb;
  } else {
    minTop = 0;
    maxTop =
      yPosition(Math.max(...values.map((v) => v.y)), baseScaleData[dataIndex], stackOffset)! + mt;
    minBottom = 0;
    maxBottom =
      yPosition(Math.min(...values.map((v) => v.y)), baseScaleData[dataIndex], stackOffset, true)! -
      mb;
    maxRight = xPosition(values[0].x, baseScaleData[dataIndex], stackOffset)! - mr;
    minRight = xPosition(values[1].x, baseScaleData[dataIndex], stackOffset)! - mr;
    minLeft = xPosition(values[2].x, baseScaleData[dataIndex], stackOffset)! + ml;
    maxLeft = xPosition(values[3].x, baseScaleData[dataIndex], stackOffset)! + ml;
    center = xPosition(0, baseScaleData[dataIndex], stackOffset)!;
    rightCenter =
      xPosition(
        values[0].x - (values[0].x - values[1].x) / 2,
        baseScaleData[dataIndex],
        stackOffset,
      )! - mr;
    leftCenter =
      xPosition(
        values[3].x - (values[3].x - values[2].x) / 2,
        baseScaleData[dataIndex],
        stackOffset,
      )! + ml;
    middle = yPosition(
      values[0].y - (values[0].y - values[1].y) / 2,
      baseScaleData[dataIndex],
      stackOffset,
    )!;
    middle = maxTop - (maxTop - maxBottom) / 2;
    topMiddle = 0;
    bottomMiddle = 0;
  }

  if (isHorizontal) {
    if (horizontal === 'middle') {
      x = center;
      if (vertical === 'top') {
        y = topMiddle;
      } else if (vertical === 'middle') {
        y = middle;
      } else if (vertical === 'bottom') {
        y = bottomMiddle;
      }
    } else if (horizontal === 'left') {
      x = maxLeft;
      if (vertical === 'top') {
        y = maxTop;
      } else if (vertical === 'middle') {
        y = middle;
      } else if (vertical === 'bottom') {
        y = maxBottom;
      }
    } else if (horizontal === 'right') {
      x = maxRight;
      if (vertical === 'top') {
        y = minTop;
      } else if (vertical === 'middle') {
        y = middle;
      } else if (vertical === 'bottom') {
        y = minBottom;
      }
    }
  }

  if (!isHorizontal) {
    if (vertical === 'middle') {
      y = middle;
      if (horizontal === 'left') {
        x = leftCenter;
      } else if (horizontal === 'middle') {
        x = center;
      } else if (horizontal === 'right') {
        x = rightCenter;
      }
    } else if (vertical === 'top') {
      y = maxTop;
      if (horizontal === 'left') {
        x = maxLeft;
      } else if (horizontal === 'middle') {
        x = center;
      } else if (horizontal === 'right') {
        x = maxRight;
      }
    } else if (vertical === 'bottom') {
      y = maxBottom;
      if (horizontal === 'left') {
        x = minLeft;
      } else if (horizontal === 'middle') {
        x = center;
      } else if (horizontal === 'right') {
        x = minRight;
      }
    }
  }

  return {
    x,
    y,
  };
};
