import { getGraphemeCount } from './getGraphemeCount';
import { degToRad } from './degToRad';
import { sliceUntil } from './sliceUntil';

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

/** This function finds the best place to clip the text to add an ellipsis.
 * This function assumes that the {@link doesTextFit} never return true for longer text after returning false for
 * shorter text.
 *
 * @param text Text to ellipsize if needed
 * @param doesTextFit a function that returns whether a string fits inside a container.
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
