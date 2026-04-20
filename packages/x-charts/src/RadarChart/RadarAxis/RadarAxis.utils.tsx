import { type RadarAxisProps } from './RadarAxis';

/**
 * Return text anchor of labels.
 * @param angle The axis angle (in rad) with clock direction and 0 at the top
 */
function getTextAnchor(angle: number) {
  if (angle < 20) {
    return 'start';
  }
  if (angle < 90 - 10) {
    return 'end';
  }

  if (angle < 270 - 10) {
    return 'start';
  }

  if (angle < 360 - 20) {
    return 'end';
  }
  return 'start';
}
function getDominantBaseline(angle: number) {
  if (angle < 160) {
    return 'auto';
  }
  if (angle < 360 - 20) {
    return 'hanging';
  }
  return 'auto';
}

const LABEL_MARGIN = 2;

interface GetLabelAttributesParams
  extends
    Required<Pick<RadarAxisProps, 'labelOrientation'>>,
    Partial<Pick<RadarAxisProps, 'textAnchor' | 'dominantBaseline'>> {
  x: number;
  y: number;
  angle: number;
}

export function getLabelAttributes(params: GetLabelAttributesParams) {
  const { x, y, angle } = params;

  if (params.labelOrientation === 'horizontal') {
    const textAnchor =
      typeof params.textAnchor === 'function'
        ? params.textAnchor(angle)
        : (params.textAnchor ?? getTextAnchor(angle));

    const dominantBaseline =
      typeof params.dominantBaseline === 'function'
        ? params.dominantBaseline(angle)
        : (params.dominantBaseline ?? getDominantBaseline(angle));

    const marginX = textAnchor === 'start' ? LABEL_MARGIN : -LABEL_MARGIN;
    const marginY = dominantBaseline === 'auto' ? -LABEL_MARGIN : LABEL_MARGIN;

    return {
      x: x + marginX,
      y: y + marginY,
      textAnchor,
      dominantBaseline,
    };
  }

  // orientation='rotated'

  const textAnchor =
    typeof params.textAnchor === 'function'
      ? params.textAnchor(angle)
      : (params.textAnchor ?? 'start');
  const dominantBaseline =
    typeof params.dominantBaseline === 'function'
      ? params.dominantBaseline(angle)
      : (params.dominantBaseline ?? 'auto');

  return {
    x,
    y,
    textAnchor,
    dominantBaseline,
    transform: `rotate(${angle}, ${x}, ${y})`,
  };
}
