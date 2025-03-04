const segmenter =
  typeof window !== 'undefined' && 'Intl' in window && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

function sliceUntilFallback(text: string, endIndex: number) {
  return text.slice(0, endIndex);
}

function sliceUntilModern(text: string, endIndex: number) {
  const segments = segmenter!.segment(text);

  let newText = '';
  let i = 0;

  for (const segment of segments) {
    newText += segment.segment;
    i += 1;

    if (i >= endIndex) {
      break;
    }
  }

  return newText;
}

/** Creates a slice of {@link text} from the start until the {@link endIndex}th grapheme (basically character). */
export const sliceUntil = segmenter ? sliceUntilModern : sliceUntilFallback;
