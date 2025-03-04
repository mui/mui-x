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

/** This function finds the best place to clip the text to add an ellipsis. */
export function ellipsize(text: string, config: EllipsizeConfig) {
  if (doesTextFitInRect(text, config)) {
    return text;
  }

  let ellipsizedText = text;
  let step = 1;
  let by = 1 / 2;
  let newLength = text.length;
  let lastLength = text.length;
  let longestFittingText: string | null = null;

  do {
    lastLength = newLength;
    newLength = Math.floor(text.length * by);

    ellipsizedText = sliceUntil(text, newLength).trim();
    const fits = doesTextFitInRect(ellipsizedText + ELLIPSIS, config);
    step += 1;

    if (fits) {
      longestFittingText = ellipsizedText;
      by += 1 / 2 ** step;
    } else {
      by -= 1 / 2 ** step;
    }
  } while (newLength !== lastLength);

  return longestFittingText ? longestFittingText + ELLIPSIS : '';
}
