import { type Position } from '@mui/x-charts/models';
import { type FunnelLabelOptions } from './funnel.types';
import { type Point } from './curves';

type AlignReturnType = {
  textAnchor: FunnelLabelOptions['textAnchor'];
  dominantBaseline: Exclude<FunnelLabelOptions['dominantBaseline'], 'baseline'>;
};

/**
 * It tries to keep the label inside the bounds of the section based on the position.
 *
 * @returns The text anchor and dominant baseline of the label.
 */
export const alignLabel = ({
  position,
  textAnchor,
  dominantBaseline,
}: Omit<FunnelLabelOptions, 'margin'>): AlignReturnType => {
  const vertical: Position['vertical'] = position?.vertical ?? 'middle';
  const horizontal: Position['horizontal'] = position?.horizontal ?? 'center';
  let anchor: FunnelLabelOptions['textAnchor'] = 'middle';
  let baseline: Exclude<FunnelLabelOptions['dominantBaseline'], 'baseline'> = 'central';

  if (vertical === 'top') {
    baseline = 'hanging';
  } else if (vertical === 'bottom') {
    baseline = 'auto';
  }

  if (horizontal === 'start') {
    anchor = 'start';
  } else if (horizontal === 'end') {
    anchor = 'end';
  }

  return {
    textAnchor: textAnchor ?? anchor,
    dominantBaseline: dominantBaseline === 'baseline' ? 'auto' : (dominantBaseline ?? baseline),
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
  isHorizontal,
  values,
}: Omit<FunnelLabelOptions, 'textAnchor' | 'dominantBaseline'> & {
  isHorizontal: boolean;
  values: readonly Point[];
}) => {
  const vertical: Position['vertical'] = position?.vertical ?? 'middle';
  const horizontal: Position['horizontal'] = position?.horizontal ?? 'center';

  let x: number | undefined = 0;
  let y: number | undefined = 0;

  // The min/max values are due to the sections possibly being sloped.
  // Importance of values differs from the horizontal and vertical sections.
  // Example (vertical):
  // MaxL         MaxT         MaxR
  //  \                          /
  //   \                        /
  //    MinL      MaxB      MinR
  let minTop: number = 0;
  let maxTop: number = 0;
  let minBottom: number = 0;
  let maxBottom: number = 0;
  let minLeft: number = 0;
  let maxLeft: number = 0;
  let minRight: number = 0;
  let maxRight: number = 0;
  let middle: number = 0;
  let center: number = 0;

  const mv = typeof offset === 'number' ? offset : (offset?.y ?? 0);
  const mh = typeof offset === 'number' ? offset : (offset?.x ?? 0);

  // Min ... Max
  const Ys = values.map((v) => v.y).toSorted((a, b) => a - b);
  const Xs = values.map((v) => v.x).toSorted((a, b) => a - b);

  // Visualization of the points in a hierarchical order:
  //              MaxT
  //              MinT
  // MaxL MinL  Cent/Mid  MinR MaxR
  //              MinB
  //              MaxB
  if (isHorizontal) {
    maxTop = Ys.at(0)! - mv;
    minTop = Ys.at(1)! - mv;
    minBottom = Ys.at(2)! + mv;
    maxBottom = (Ys.at(3) ?? Ys.at(2))! + mv;

    maxRight = (Xs.at(3) ?? Xs.at(2))! + mh;
    // We don't need (minRight/minLeft) for horizontal
    maxLeft = Xs.at(0)! + mh;

    center = (maxRight + maxLeft) / 2;
    middle = (maxBottom + maxTop) / 2;
  } else {
    maxTop = Ys.at(0)! - mv;
    // We don't need (minTop/minBottom) for vertical
    maxBottom = (Ys.at(3) ?? Ys.at(2))! - mv;

    maxRight = (Xs.at(3) ?? Xs.at(2))! + mh;
    minRight = Xs.at(2)! + mh;
    minLeft = Xs.at(1)! - mh;
    maxLeft = Xs.at(0)! - mh;

    center = (maxRight + maxLeft) / 2;
    middle = (maxBottom + maxTop) / 2;
  }

  if (isHorizontal) {
    if (horizontal === 'center') {
      x = center;
      if (vertical === 'top') {
        y = (maxTop + minTop) / 2;
      } else if (vertical === 'middle') {
        y = middle;
      } else if (vertical === 'bottom') {
        y = (maxBottom + minBottom) / 2;
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
        x = (maxLeft + minLeft) / 2;
      } else if (horizontal === 'center') {
        x = center;
      } else if (horizontal === 'end') {
        x = (maxRight + minRight) / 2;
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
