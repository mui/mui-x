'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { GetWordsByLinesParams } from '../internals/getWordsByLines';

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

  const lines = text.split('\n');

  let startDy: string;
  switch (dominantBaseline) {
    case 'hanging':
      startDy = '0em';
      break;
    case 'central':
      startDy = `-${(lines.length - 1) / 2}em`;
      break;
    case 'text-top':
      startDy = '0em';
      break;
    case 'text-bottom':
      startDy = `-${lines.length - 0.5}em`;
      break;
    default:
      startDy = `-${lines.length - 1}em`;
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
      {lines.map((line, index) => (
        <tspan
          x={x}
          dy={index === 0 ? startDy : '1em'}
          dominantBaseline={dominantBaseline} // Propagated to fix Safari issue: https://github.com/mui/mui-x/issues/10808
          key={index}
        >
          {line}
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
