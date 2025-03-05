import { clampAngle } from '../internals/clampAngle';
import { ChartsTextStyle } from '../internals/getWordsByLines';

/**
 * Provide the text-anchor based on the angle between the text and the associated element.
 * - 0 means the element is on top of the text, 180 bellow, and 90 on the right of the text.
 * @param {number} angle The angle between the text and the element.
 * @returns
 */
export function getDefaultTextAnchor(angle: number): ChartsTextStyle['textAnchor'] {
  const adjustedAngle = clampAngle(angle);

  if (adjustedAngle <= 30 || adjustedAngle >= 330) {
    // +/-30° around 0°
    return 'middle';
  }

  if (adjustedAngle <= 210 && adjustedAngle >= 150) {
    // +/-30° around 180°
    return 'middle';
  }

  if (adjustedAngle <= 180) {
    return 'end';
  }

  return 'start';
}

export function getDefaultBaseline(angle: number): ChartsTextStyle['dominantBaseline'] {
  const adjustedAngle = clampAngle(angle);

  if (adjustedAngle <= 60 || adjustedAngle >= 300) {
    // +/-60° around 0°
    return 'hanging';
  }

  if (adjustedAngle <= 240 && adjustedAngle >= 120) {
    // +/-60° around 180°
    return 'auto';
  }

  return 'central';
}
