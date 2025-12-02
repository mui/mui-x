const segmenter =
  typeof window !== 'undefined' && 'Intl' in window && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

function getGraphemeCountFallback(text: string) {
  return text.length;
}

function getGraphemeCountModern(text: string) {
  const segments = segmenter!.segment(text);

  let count = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/naming-convention,no-underscore-dangle
  for (const _unused of segments) {
    count += 1;
  }

  return count;
}

/** Returns the number of graphemes (basically characters) present in {@link text}. */
export const getGraphemeCount = segmenter ? getGraphemeCountModern : getGraphemeCountFallback;
