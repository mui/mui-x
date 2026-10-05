import { getGraphemeCount } from './getGraphemeCount';
import { degToRad } from './degToRad';
import { sliceUntil } from './sliceUntil';
import type { ChartsTextAnchor, ChartsTextBaseline } from './getWordsByLines';

const ELLIPSIS = '…';

interface EllipsizeConfig {
  width: number;
  height: number;
  /** Angle, in degrees, in which the text should be displayed */
  angle: number;
  measureText: (text: string) => { width: number; height: number };
}

export function doesTextFitInRect(text: string, config: EllipsizeConfig) {
  const { width, height, measureText } = config;
  const angle = degToRad(config.angle);
  const textSize = measureText(text);

  const angledWidth =
    Math.abs(textSize.width * Math.cos(angle)) + Math.abs(textSize.height * Math.sin(angle));
  const angledHeight =
    Math.abs(textSize.width * Math.sin(angle)) + Math.abs(textSize.height * Math.cos(angle));

  return angledWidth <= width && angledHeight <= height;
}

/**
 * Position of the text bounding box relative to its anchor point, as a fraction of the text width.
 * `0` means the box starts at the anchor, `-1` that it ends there.
 */
function getHorizontalAnchorOffset(textAnchor: ChartsTextAnchor | undefined, isRtl: boolean) {
  const anchor = textAnchor ?? 'middle';

  if (anchor === 'middle') {
    return -1 / 2;
  }

  const startsAtAnchor = isRtl ? anchor === 'end' : anchor === 'start';

  return startsAtAnchor ? 0 : -1;
}

/**
 * Position of the text bounding box relative to its anchor point, as a fraction of the text height.
 * `0` means the box starts at the anchor, `-1` that it ends there.
 */
function getVerticalAnchorOffset(dominantBaseline: ChartsTextBaseline | undefined) {
  switch (dominantBaseline ?? 'central') {
    case 'hanging':
    case 'text-before-edge':
      return 0;
    case 'central':
      return -1 / 2;
    default:
      return -1;
  }
}

export interface RotatedTextBoundsConfig {
  /** Angle, in degrees, in which the text is displayed. */
  angle: number;
  textAnchor?: ChartsTextAnchor;
  dominantBaseline?: ChartsTextBaseline;
  isRtl?: boolean;
}

export interface RotatedTextBounds {
  /** Width of the text bounding box once rotated. */
  width: number;
  /** How far the text extends above its anchor point. */
  above: number;
  /** How far the text extends below its anchor point. */
  below: number;
}

/**
 * Returns the size of a rotated text, and how far it extends on each side of its anchor point.
 *
 * Which side of the anchor the text is drawn on depends on both the text anchoring and the rotation,
 * so `above` and `below` are not necessarily equal. Either of them is negative when the whole text
 * sits on the other side of the anchor point.
 *
 * @param textSize The size of the text before rotation.
 * @param config How the text is anchored and rotated.
 */
export function getRotatedTextBounds(
  textSize: { width: number; height: number },
  config: RotatedTextBoundsConfig,
): RotatedTextBounds {
  const angle = degToRad(config.angle);
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  const left = getHorizontalAnchorOffset(config.textAnchor, config.isRtl ?? false) * textSize.width;
  const right = left + textSize.width;
  const top = getVerticalAnchorOffset(config.dominantBaseline) * textSize.height;
  const bottom = top + textSize.height;

  /* A rotation by `angle` maps a point to `(x * cos - y * sin, x * sin + y * cos)`. Both terms of
   * the vertical coordinate are independent, so the extrema of their sum are the sums of their
   * extrema. */
  const fromWidth = [left * sin, right * sin];
  const fromHeight = [top * cos, bottom * cos];

  return {
    width: Math.abs(textSize.width * cos) + Math.abs(textSize.height * sin),
    above: -(Math.min(...fromWidth) + Math.min(...fromHeight)),
    below: Math.max(...fromWidth) + Math.max(...fromHeight),
  };
}

/** This function finds the best place to clip the text to add an ellipsis.
 *  This function assumes that the {@link doesTextFit} never returns true for longer text after returning false for
 *  shorter text.
 *
 *  @param text Text to ellipsize if needed
 *  @param doesTextFit a function that returns whether a string fits inside a container.
 */
export function ellipsize(text: string, doesTextFit: (text: string) => boolean) {
  if (doesTextFit(text)) {
    return text;
  }

  let shortenedText = text;
  let step = 1;
  let by = 1 / 2;
  const graphemeCount = getGraphemeCount(text);
  let newLength = graphemeCount;
  let lastLength = graphemeCount;
  let longestFittingText: string | null = null;

  do {
    lastLength = newLength;
    newLength = Math.floor(graphemeCount * by);

    if (newLength === 0) {
      break;
    }

    shortenedText = sliceUntil(text, newLength).trim();
    const fits = doesTextFit(shortenedText + ELLIPSIS);
    step += 1;

    if (fits) {
      longestFittingText = shortenedText;
      by += 1 / 2 ** step;
    } else {
      by -= 1 / 2 ** step;
    }
  } while (Math.abs(newLength - lastLength) !== 1);

  return longestFittingText ? longestFittingText + ELLIPSIS : '';
}
