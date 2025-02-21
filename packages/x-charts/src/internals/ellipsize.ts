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

  console.log({ text, textSize, config });

  const angledWidth = textSize.width * Math.cos(angle) + textSize.height * Math.sin(angle);
  const angledHeight = textSize.width * Math.sin(angle) + textSize.height * Math.cos(angle);

  return angledWidth <= width && angledHeight <= height;
}

export function ellipsize(text: string, config: EllipsizeConfig) {
  if (doesTextFitInRect(text, config)) {
    console.log({ text, config, result: text });
    return text;
  }

  let ellipsizedText = text;
  while (ellipsizedText.length > 1) {
    ellipsizedText = shortenText(ellipsizedText);

    if (doesTextFitInRect(ellipsizedText + ELLIPSIS, config)) {
      console.log({ text, config, result: ellipsizedText + ELLIPSIS });
      return ellipsizedText + ELLIPSIS;
    }
  }

  console.log({ text, config, result: '' });
  return '';
}

const WHITE_SPACE = /\s/g;

export function shortenText(text: string) {
  // If text has less than two characters, we can't shorten it, so just return an empty string.
  if (text.length <= 1) {
    return '';
  }

  const isMultiline = text.includes('\n');

  if (isMultiline) {
    return text.split('\n').slice(0, -1).join('\n');
  }

  const halfLength = Math.floor(text.length / 2);

  const firstWhiteSpaceAfterMidpoint = WHITE_SPACE.exec(text.slice(halfLength))?.index;

  if (firstWhiteSpaceAfterMidpoint !== undefined) {
    return text.slice(0, halfLength + firstWhiteSpaceAfterMidpoint).trim();
  }

  // FIXME: This breaks for unicode characters. Check if we can use Intl.Segmenter.
  return text.slice(0, halfLength).trim();
}

/** Converts degrees to radians. */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
