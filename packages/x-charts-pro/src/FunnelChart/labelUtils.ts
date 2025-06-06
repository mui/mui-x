import { Position } from '@mui/x-charts/models';
import { FunnelDataPoints, FunnelLabelOptions, PositionGetter } from './funnel.types';

/**
 * It tries to keep the label inside the bounds of the section based on the position.
 *
 * @returns The text anchor and dominant baseline of the label.
 */
export const alignLabel = ({
  position,
  textAnchor,
  dominantBaseline,
}: Omit<FunnelLabelOptions, 'margin'>) => {
  const vertical: Position['vertical'] = position?.vertical ?? 'middle';
  const horizontal: Position['horizontal'] = position?.horizontal ?? 'center';
  let anchor = 'middle';
  let baseline = 'central';

  if (vertical === 'top') {
    baseline = 'hanging';
  } else if (vertical === 'bottom') {
    baseline = 'baseline';
  }

  if (horizontal === 'start') {
    anchor = 'start';
  } else if (horizontal === 'end') {
    anchor = 'end';
  }

  return {
    textAnchor: textAnchor ?? anchor,
    dominantBaseline: dominantBaseline ?? baseline,
  };
};

/**
 * This function calculates the position of the label based on the position and margin.
 *
 * It is quite complex, because it needs to calculate the position based on the position of the points of a rectangle.
 * And we are manually calculating each possible position of the label.
 *
 * @returns The x and y position of the label.
 */
export const positionLabel = ({
  position,
  offset,
  xPosition,
  yPosition,
  isHorizontal,
  values,
  dataIndex,
  baseScaleData,
}: Omit<FunnelLabelOptions, 'textAnchor' | 'dominantBaseline'> & {
  xPosition: PositionGetter;
  yPosition: PositionGetter;
  isHorizontal: boolean;
  values: readonly FunnelDataPoints[];
  dataIndex: number;
  baseScaleData: readonly number[];
}) => {
  const vertical: Position['vertical'] = position?.vertical ?? 'middle';
  const horizontal: Position['horizontal'] = position?.horizontal ?? 'center';

  let x: number | undefined = 0;
  let y: number | undefined = 0;

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

  const mv = typeof offset === 'number' ? offset : (offset?.y ?? 0);
  const mh = typeof offset === 'number' ? offset : (offset?.x ?? 0);

  const stackOffset = values[0].stackOffset;

  if (isHorizontal) {
    maxTop = yPosition(values[0].y, baseScaleData[dataIndex], stackOffset)! - mv;
    minTop = yPosition(values[1].y, baseScaleData[dataIndex], stackOffset)! - mv;
    minBottom = yPosition(values[2].y, baseScaleData[dataIndex], stackOffset)! + mv;
    maxBottom = yPosition(values[3].y, baseScaleData[dataIndex], stackOffset)! + mv;
    minRight = 0;
    maxRight =
      xPosition(
        Math.min(...values.map((v) => v.x)),
        dataIndex,
        baseScaleData[dataIndex],
        stackOffset,
        true,
      )! + mh;
    minLeft = 0;
    maxLeft =
      xPosition(
        Math.max(...values.map((v) => v.x)),
        dataIndex,
        baseScaleData[dataIndex],
        stackOffset,
      )! + mh;
    center = maxRight - (maxRight - maxLeft) / 2;
    leftCenter = 0;
    rightCenter = 0;
    middle = yPosition(0, dataIndex, baseScaleData[dataIndex], stackOffset)! - mv;
    topMiddle =
      yPosition(
        values[0].y - (values[0].y - values[1].y) / 2,
        dataIndex,
        baseScaleData[dataIndex],
        stackOffset,
      )! - mv;
    bottomMiddle =
      yPosition(
        values[3].y - (values[3].y - values[2].y) / 2,
        dataIndex,
        baseScaleData[dataIndex],
        stackOffset,
      )! + mv;
  } else {
    minTop = 0;
    maxTop =
      yPosition(
        Math.max(...values.map((v) => v.y)),
        dataIndex,
        baseScaleData[dataIndex],
        stackOffset,
      )! - mv;
    minBottom = 0;
    maxBottom =
      yPosition(
        Math.min(...values.map((v) => v.y)),
        dataIndex,
        baseScaleData[dataIndex],
        stackOffset,
        true,
      )! - mv;
    maxRight = xPosition(values[0].x, dataIndex, baseScaleData[dataIndex], stackOffset)! + mh;
    minRight = xPosition(values[1].x, dataIndex, baseScaleData[dataIndex], stackOffset)! + mh;
    minLeft = xPosition(values[2].x, dataIndex, baseScaleData[dataIndex], stackOffset)! - mh;
    maxLeft = xPosition(values[3].x, dataIndex, baseScaleData[dataIndex], stackOffset)! - mh;
    center = xPosition(0, dataIndex, baseScaleData[dataIndex], stackOffset)! - mh;
    rightCenter =
      xPosition(
        values[0].x - (values[0].x - values[1].x) / 2,
        dataIndex,
        baseScaleData[dataIndex],
        stackOffset,
      )! + mh;
    leftCenter =
      xPosition(
        values[3].x - (values[3].x - values[2].x) / 2,
        dataIndex,
        baseScaleData[dataIndex],
        stackOffset,
      )! - mh;
    middle = yPosition(
      values[0].y - (values[0].y - values[1].y) / 2,
      dataIndex,
      baseScaleData[dataIndex],
      stackOffset,
    )!;
    middle = maxTop - (maxTop - maxBottom) / 2;
    topMiddle = 0;
    bottomMiddle = 0;
  }

  if (isHorizontal) {
    if (horizontal === 'center') {
      x = center;
      if (vertical === 'top') {
        y = topMiddle;
      } else if (vertical === 'middle') {
        y = middle;
      } else if (vertical === 'bottom') {
        y = bottomMiddle;
      }
    } else if (horizontal === 'start') {
      x = maxLeft;
      if (vertical === 'top') {
        y = maxTop;
      } else if (vertical === 'middle') {
        y = middle;
      } else if (vertical === 'bottom') {
        y = maxBottom;
      }
    } else if (horizontal === 'end') {
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
      if (horizontal === 'start') {
        x = leftCenter;
      } else if (horizontal === 'center') {
        x = center;
      } else if (horizontal === 'end') {
        x = rightCenter;
      }
    } else if (vertical === 'top') {
      y = maxTop;
      if (horizontal === 'start') {
        x = maxLeft;
      } else if (horizontal === 'center') {
        x = center;
      } else if (horizontal === 'end') {
        x = maxRight;
      }
    } else if (vertical === 'bottom') {
      y = maxBottom;
      if (horizontal === 'start') {
        x = minLeft;
      } else if (horizontal === 'center') {
        x = center;
      } else if (horizontal === 'end') {
        x = minRight;
      }
    }
  }

  return {
    x,
    y,
  };
};
