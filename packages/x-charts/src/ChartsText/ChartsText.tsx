'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { GetWordsByLinesParams, getWordsByLines } from '../internals/getWordsByLines';
import { useIsHydrated } from '../hooks/useIsHydrated';

export interface ChartsTextProps
  extends Omit<
      React.SVGTextElementAttributes<SVGTextElement>,
      'width' | 'ref' | 'style' | 'dominantBaseline'
    >,
    GetWordsByLinesParams {
  /**
   * Height of a text line (in `em`).
   */
  lineHeight?: number;
  ownerState?: any;
}

/**
 * Helper component to manage multiline text in SVG
 */
function ChartsText(props: ChartsTextProps) {
  const { x, y, style: styleProps, text, ownerState, ...textProps } = props;

  const { angle, textAnchor, dominantBaseline, ...style } = styleProps ?? {};

  const isHydrated = useIsHydrated();

  const wordsByLines = React.useMemo(
    () => getWordsByLines({ style, needsComputation: isHydrated && text.includes('\n'), text }),
    [style, text, isHydrated],
  );

  let startDy: number;
  switch (dominantBaseline) {
    case 'hanging':
    case 'text-before-edge':
      startDy = 0;
      break;
    case 'central':
      startDy = ((wordsByLines.length - 1) / 2) * -wordsByLines[0].height;
      break;
    default:
      startDy = (wordsByLines.length - 1) * -wordsByLines[0].height;
      break;
  }

  return (
    <text
      {...textProps}
      transform={angle ? `rotate(${angle}, ${x}, ${y})` : undefined}
      x={x}
      y={y}
      textAnchor={textAnchor}
      dominantBaseline={dominantBaseline}
      style={style}
    >
      {wordsByLines.map((line, index) => (
        <tspan
          x={x}
          dy={`${index === 0 ? startDy : wordsByLines[0].height}px`}
          dominantBaseline={dominantBaseline} // Propagated to fix Safari issue: https://github.com/mui/mui-x/issues/10808
          key={index}
        >
          {line.text}
        </tspan>
      ))}
    </text>
  );
}

ChartsText.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Height of a text line (in `em`).
   */
  lineHeight: PropTypes.number,
  /**
   * If `true`, the line width is computed.
   * @default false
   */
  needsComputation: PropTypes.bool,
  ownerState: PropTypes.any,
  /**
   * Style applied to text elements.
   */
  style: PropTypes.object,
  /**
   * Text displayed.
   */
  text: PropTypes.string.isRequired,
} as any;

export { ChartsText };
