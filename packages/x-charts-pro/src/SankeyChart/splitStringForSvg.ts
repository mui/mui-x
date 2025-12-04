import { getStringSize } from '@mui/x-charts/internals';

/**
 * Splits a string into multiple lines based on spaces, hyphens, or hard splits to fit within a specified maximum width for SVG rendering.
 *
 * @param text The input string to be split.
 * @param maxWidth The maximum width allowed for each line in pixels.
 * @param compute Whether to compute the actual string widths. If false, returns the text as a single line.
 * @param styles The CSS styles to apply when measuring text width.
 * @returns An object containing the split lines array and the line height.
 */
export function splitStringForSvg(
  text: string,
  maxWidth: number,
  compute: boolean,
  styles: React.CSSProperties,
): { lines: string[]; lineHeight: number } {
  if (!compute) {
    return { lines: [text], lineHeight: 0 };
  }

  const paragraphs = text.split('\n');
  const lines: string[] = [];
  let lineHeight = 0;

  for (let p = 0; p < paragraphs.length; p += 1) {
    const paragraph = paragraphs[p].trim();
    if (paragraph.length === 0) {
      continue;
    }

    let pos = 0;

    while (pos < paragraph.length) {
      // Build the line by finding the longest substring that fits
      let testEnd = pos + 1;
      let bestEnd = pos + 1;
      let bestBoundaryEnd = -1;

      // Forward scan to find where line should end
      while (testEnd <= paragraph.length) {
        const testLine = paragraph.substring(pos, testEnd);
        const { width, height } = getStringSize(testLine, styles);
        lineHeight = height;

        if (width <= maxWidth) {
          bestEnd = testEnd;
          // Track word boundaries (after space or hyphen)
          if (testEnd < paragraph.length) {
            const char = paragraph[testEnd - 1];
            if (char === ' ' || char === '-') {
              bestBoundaryEnd = testEnd;
            }
          }
          testEnd += 1;
        } else {
          break;
        }
      }

      // Use word boundary if we found one and we need to split (not at end)
      let splitAt = bestEnd;
      if (bestEnd < paragraph.length && bestBoundaryEnd > pos) {
        splitAt = bestBoundaryEnd;
      }

      // Check if splitting here would leave a single trailing character
      if (splitAt < paragraph.length) {
        const remaining = paragraph.substring(splitAt).trim();
        if (remaining.length === 1) {
          // Would leave single char, keep the whole word together
          splitAt = paragraph.length;
        }
      }

      // Extract the line
      let line = paragraph.substring(pos, splitAt).trim();

      // If the current line is just one character and we haven't made progress,
      // it means even one char doesn't fit - just take the whole word
      if (line.length === 1 && pos === 0 && splitAt < paragraph.length) {
        // Find end of first word
        let wordEnd = 1;
        while (
          wordEnd < paragraph.length &&
          paragraph[wordEnd] !== ' ' &&
          paragraph[wordEnd] !== '-'
        ) {
          wordEnd += 1;
        }

        // If the first word is longer than 1 char, take the whole word
        if (wordEnd > 1) {
          line = paragraph.substring(0, wordEnd).trim();
          splitAt = wordEnd;
        }
      }

      // Check if this would leave a single-character fragment
      // A fragment is a single char that's part of a larger word
      if (line.length === 1 && splitAt < paragraph.length) {
        const nextPos = splitAt;
        // Skip spaces
        let nextNonSpace = nextPos;
        while (nextNonSpace < paragraph.length && paragraph[nextNonSpace] === ' ') {
          nextNonSpace += 1;
        }

        // If there's content after and our char is not after a space/hyphen, it's a fragment
        if (nextNonSpace < paragraph.length) {
          const prevChar = pos > 0 ? paragraph[pos - 1] : ' ';
          const isStandalone = prevChar === ' ' || prevChar === '-' || pos === 0;

          if (!isStandalone) {
            // It's a fragment, try to add next char
            splitAt = Math.min(splitAt + 1, paragraph.length);
            line = paragraph.substring(pos, splitAt).trim();
          }
        }
      }

      lines.push(line);
      pos = splitAt;

      // Skip whitespace after split
      while (pos < paragraph.length && paragraph[pos] === ' ') {
        pos += 1;
      }
    }
  }

  // Post-process: merge single-character fragments that slipped through
  const result: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.length === 1 && i < lines.length - 1) {
      const prevLine = i > 0 ? lines[i - 1] : '';
      const nextLine = lines[i + 1];

      // Check if this single char is a fragment by looking at adjacent lines
      const prevEndsWithBoundary =
        prevLine.length === 0 ||
        prevLine[prevLine.length - 1] === ' ' ||
        prevLine[prevLine.length - 1] === '-';

      if (!prevEndsWithBoundary) {
        // Fragment detected, merge with next line, preserving space if needed
        const merged = `${line} ${nextLine}`;
        result.push(merged);
        i += 2; // Skip both current and next
        continue;
      }
    }

    result.push(line);
    i += 1;
  }

  return { lines: result, lineHeight };
}
