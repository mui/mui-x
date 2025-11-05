'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useIsHydrated } from '@mui/x-charts/hooks';
import { getStringSize } from '@mui/x-charts/internals';
import { SankeyLayoutNode } from './sankey.types';

const NODE_PADDING = 6;

export interface SankeyNodeLabelProps {
  /**
   * The node data
   */
  node: SankeyLayoutNode;
}

/**
 * @ignore - internal component.
 */
export const SankeyNodeLabel = React.forwardRef<SVGTextElement, SankeyNodeLabelProps>(
  function SankeyNodeLabel({ node }, ref) {
    const theme = useTheme();
    const isHydrated = useIsHydrated();

    const x0 = node.x0 ?? 0;
    const y0 = node.y0 ?? 0;
    const x1 = node.x1 ?? 0;
    const y1 = node.y1 ?? 0;

    // Determine label position
    const labelX =
      node.depth === 0
        ? x1 + NODE_PADDING // Right side for first column
        : x0 - NODE_PADDING; // Left side for other columns

    const labelAnchor = node.depth === 0 ? ('start' as const) : ('end' as const);
    const areaWidth = node.nodeDistance - NODE_PADDING * 2;
    const styles = React.useMemo(
      () =>
        ({
          textAnchor: labelAnchor,
          fill: (theme.vars || theme).palette.text.primary,
          fontSize: theme.typography.caption.fontSize,
          fontFamily: theme.typography.fontFamily,
          pointerEvents: 'none',
          dominantBaseline: 'central',
        }) as const,
      [labelAnchor, theme],
    );

    const texts = React.useMemo(
      () =>
        !node.label
          ? { lines: [], lineHeight: 0 }
          : splitStringOnSpaceHyphenOrHardSplit(node.label, areaWidth, isHydrated, styles),
      [node.label, areaWidth, isHydrated, styles],
    );

    if (!node.label) {
      return null; // No label or invalid coordinates, nothing to render
    }

    return (
      <text {...styles} ref={ref} x={labelX} y={(y0 + y1) / 2} data-node={node.id}>
        {texts.lines.map((text, index) => (
          <tspan
            key={index}
            x={labelX}
            y={(y0 + y1) / 2 - ((texts.lines.length - 1) * texts.lineHeight) / 2}
            dy={texts.lineHeight * index}
          >
            {text}
          </tspan>
        ))}
      </text>
    );
  },
);

const isSplit = (char: string) => /\s/.test(char) || char === '-';

/**
 * Splits a string into multiple lines based on spaces, hyphens, or hard splits to fit within a specified maximum width.
 *
 * It attempts to avoid leaving very short words at the end of lines by backtracking a few characters to find a better split point.
 * If the resulting line would create a single letter at the start of the next line, we move the entire word to the next line if we can't break it.
 *
 * @param text The input string to be split.
 * @param maxWidth The maximum width allowed for each line.
 * @param backtrack Number of characters to backtrack when splitting to avoid breaking words. We try to find the last space or hyphen within the backtrack range before forcing a split.
 * @returns An array of strings, each representing a line of text.
 */
function splitStringOnSpaceHyphenOrHardSplit(
  text: string,
  maxWidth: number,
  compute: boolean,
  styles: React.CSSProperties,
  backtrack?: number,
): { lines: string[]; lineHeight: number } {
  const words: string[] = [];
  let currentLine = '';
  const bt = backtrack ?? Math.min(5, Math.floor(maxWidth / 10));
  let height = 0;

  if (!compute) {
    return { lines: [text], lineHeight: 0 };
  }

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const testLine = currentLine + char;
    const { width: testWidth, height: lineHeight } = getStringSize(testLine, styles);
    height = lineHeight;

    if (char === '\n') {
      words.push(currentLine.trim());
      currentLine = '';
    } else if (testWidth > maxWidth) {
      // Line exceeds max width, need to split
      let splitIndex = testLine.length - 1;

      // Backtrack to find a space or hyphen to split on
      for (let j = 0; j < bt && splitIndex > 0; j += 1) {
        const backChar = testLine[splitIndex - 1];
        if (isSplit(backChar)) {
          break;
        }
        splitIndex -= 1;
      }

      // Check if we are leaving a single letter at the end of the line and pull that in
      if (splitIndex === testLine.length - 1 - bt) {
        if (isSplit(testLine[splitIndex - 2])) {
          splitIndex -= 2;
        }
      }

      // If we found a suitable split point
      if (splitIndex < testLine.length - 1) {
        const lineToPush = testLine.slice(0, splitIndex).trimEnd();
        const remainder = testLine.slice(splitIndex).trimStart();
        const lineToPushTrimmed = lineToPush.trim();
        const remainderTrimmed = remainder.trim();

        // Get the last word in lineToPush to check if it's being broken
        const lastSpaceInLine = lineToPush.lastIndexOf(' ');
        const lastHyphenInLine = lineToPush.lastIndexOf('-');
        const lastSplitInLine = Math.max(lastSpaceInLine, lastHyphenInLine);
        const lastWordInLine =
          lastSplitInLine >= 0 ? lineToPush.slice(lastSplitInLine + 1).trim() : lineToPushTrimmed;

        // Check if we're breaking a word and creating a single character
        const isBreakingWord = lastSplitInLine < lineToPush.trimEnd().length - 2;
        const lastWordIsSingleChar = lastWordInLine.length === 1;
        const remainderIsSingleChar = remainderTrimmed.length === 1 && !isSplit(remainder[0]);

        if (isBreakingWord && lastWordIsSingleChar && lastSplitInLine >= 0) {
          // We're breaking a word and leaving a single character at the end
          // Move the whole word to the next line
          const lineWithoutLastWord = lineToPush.slice(0, lastSplitInLine + 1).trimEnd();
          words.push(lineWithoutLastWord);
          currentLine = (lineToPush.slice(lastSplitInLine + 1) + remainder).trimStart();
        } else if (remainderIsSingleChar) {
          // The remainder would be a single character
          // Include it in the current line instead
          words.push(testLine.trim());
          currentLine = '';
        } else {
          words.push(lineToPushTrimmed);
          currentLine = remainder;
        }
      } else {
        // No suitable split point found, need to force split
        // Push what we have and continue
        const currentLineTrimmed = currentLine.trim();
        if (currentLineTrimmed.length > 0) {
          words.push(currentLineTrimmed);
        }
        currentLine = char;
      }
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    words.push(currentLine.trim());
  }

  // Filter out empty lines
  const nonEmptyLines = words.filter((line) => line.length > 0);

  // Post-process to merge single-character lines with adjacent lines
  // A single character should only exist as its own line if it's a complete word (like "a" or "I")
  const mergedLines: string[] = [];
  for (let i = 0; i < nonEmptyLines.length; i += 1) {
    const line = nonEmptyLines[i];

    if (line.length === 1) {
      // Check if this is a standalone word or part of a broken word
      const prevLine = i > 0 ? nonEmptyLines[i - 1] : '';
      const nextLine = i < nonEmptyLines.length - 1 ? nonEmptyLines[i + 1] : '';

      // If previous line doesn't end with a space/hyphen, this is a broken word fragment
      const prevEndsWithSplit = prevLine.length > 0 && isSplit(prevLine[prevLine.length - 1]);
      // If next line doesn't start with a space/hyphen, this is a broken word fragment
      const nextStartsWithSplit = nextLine.length > 0 && isSplit(nextLine[0]);

      if (!prevEndsWithSplit && prevLine.length > 0) {
        // Merge with previous line
        if (mergedLines.length > 0) {
          mergedLines[mergedLines.length - 1] += line;
        } else {
          mergedLines.push(line);
        }
      } else if (!nextStartsWithSplit && nextLine.length > 0) {
        // Merge with next line
        mergedLines.push(line + nextLine);
        i += 1; // Skip the next line since we merged it
      } else {
        // It's a standalone single character word
        mergedLines.push(line);
      }
    } else {
      mergedLines.push(line);
    }
  }

  return { lines: mergedLines, lineHeight: height };
}
