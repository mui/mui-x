import * as React from 'react';
import PropTypes from 'prop-types';
import { getStringSize } from '../internals/domUtils';

export type ChartsTextBaseline = 'hanging' | 'central' | 'auto';

export interface ChartsTextStyle extends React.CSSProperties {
  angle?: number;
  /**
   * The text baseline
   * @default 'central'
   */
  dominantBaseline?: ChartsTextBaseline;
}

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

interface GetWordsByLinesParams {
  /**
   * Text displayed.
   */
  text: string;
  /**
   * Style applied to text elements.
   */
  style?: ChartsTextStyle;
  /**
   * If `true`, the line width is computed.
   * @default false
   */
  needsComputation?: boolean;
}

export function getWordsByLines({ style, needsComputation, text }: GetWordsByLinesParams) {
  return text.split('\n').map((subText) => ({
    text: subText,
    ...(needsComputation ? getStringSize(subText, style) : { width: 0, height: 0 }),
  }));
}

/**
 * Helper component to manage multiline text in SVG
 */
function ChartsText(props: ChartsTextProps) {
  const { x, y, style: styleProps, text, ownerState, ...textProps } = props;

  const { angle, textAnchor, dominantBaseline, ...style } = styleProps ?? {};

  const wordsByLines = React.useMemo(
    () => getWordsByLines({ style, needsComputation: text.includes('\n'), text }),
    [style, text],
  );

  let startDy: number;
  switch (dominantBaseline) {
    case 'hanging':
      startDy = 0;
      break;
    case 'central':
      startDy = ((wordsByLines.length - 1) / 2) * -wordsByLines[0].height;
      break;
    default:
      startDy = (wordsByLines.length - 1) * -wordsByLines[0].height;
      break;
  }

  const transforms = [];
  // if (scaleToFit) {
  //   const lineWidth = wordsByLines[0].width;
  //   transforms.push(`scale(${(isNumber(width as number) ? (width as number) / lineWidth : 1) / lineWidth})`);
  // }
  if (angle) {
    transforms.push(`rotate(${angle}, ${x}, ${y})`);
  }
  if (transforms.length) {
    textProps.transform = transforms.join(' ');
  }

  return (
    <text
      {...textProps}
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
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
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
