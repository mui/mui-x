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

  const angledWidth = textSize.width * Math.cos(angle) + textSize.height * Math.sin(angle);
  const angledHeight = textSize.width * Math.sin(angle) + textSize.height * Math.cos(angle);

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

  do {
    lastLength = newLength;
    newLength = Math.floor(text.length * by);

    ellipsizedText = text.slice(0, newLength).trim();
    const fits = doesTextFitInRect(ellipsizedText + ELLIPSIS, config);
    step += 1;

    if (fits) {
      by += 1 / 2 ** step;
    } else {
      by -= 1 / 2 ** step;
    }
  } while (newLength !== lastLength);

  return ellipsizedText.length === 0 ? '' : ellipsizedText + ELLIPSIS;
}

export function shortenText(text: string, by: number) {
  // If text has less than two characters, we can't shorten it, so just return an empty string.
  if (text.length <= 1) {
    return '';
  }

  const isMultiline = text.includes('\n');

  if (isMultiline) {
    return text.split('\n').slice(0, -1).join('\n');
  }

  const newLength = Math.floor(text.length * by);

  // FIXME: This breaks for unicode characters. Check if we can use Intl.Segmenter.
  return text.slice(0, newLength).trim();
}

/** Converts degrees to radians. */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
