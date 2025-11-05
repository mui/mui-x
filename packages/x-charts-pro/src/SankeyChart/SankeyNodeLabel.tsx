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

    const labelAnchor = node.depth === 0 ? 'start' : 'end';
    const areaWidth = node.nodeDistance - NODE_PADDING * 2;

    const texts = React.useMemo(
      () =>
        !node.label
          ? { lines: [], lineHeight: 0 }
          : splitStringOnSpaceHyphenOrHardSplit(node.label, areaWidth, isHydrated),
      [node.label, areaWidth, isHydrated],
    );

    if (!node.label) {
      return null; // No label or invalid coordinates, nothing to render
    }

    return (
      <text
        ref={ref}
        x={labelX}
        y={(y0 + y1) / 2}
        textAnchor={labelAnchor}
        fill={(theme.vars || theme).palette.text.primary}
        fontSize={theme.typography.caption.fontSize}
        fontFamily={theme.typography.fontFamily}
        pointerEvents="none"
        dominantBaseline="central"
        data-node={node.id}
        width={node.nodeDistance}
      >
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
    const { width: testWidth, height: lineHeight } = getStringSize(testLine);
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
        words.push(lineToPush.trim());
        currentLine = testLine.slice(splitIndex).trimStart();
      } else {
        // No suitable split point found, force split
        words.push(currentLine.trim());
        currentLine = char;
      }
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    words.push(currentLine.trim());
  }

  return { lines: words, lineHeight: height };
}
