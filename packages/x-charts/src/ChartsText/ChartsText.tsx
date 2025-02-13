'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { GetWordsByLinesParams, getWordsByLines } from '../internals/getWordsByLines';

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
  /**
   * When true, this component is being rendered only for measuring its size.
   * Its size is needed to avoid overlapping text.
   * When this property is true, the component should be not visible (e.g., using `visibility: 'hidden'`).
   */
  measuring: boolean;
}

/**
 * Helper component to manage multiline text in SVG
 */
const ChartsText = React.forwardRef<SVGTextElement, ChartsTextProps>(
  function ChartsText(props, ref) {
    const { x, y, style: styleProps, text, ownerState, ...textProps } = props;
    const [measuringElement, setMeasuringElement] = React.useState<SVGGElement | null>(null);

    const { angle, textAnchor, dominantBaseline, ...style } = styleProps ?? {};

    const wordsByLines = React.useMemo(
      () =>
        getWordsByLines({
          className: textProps?.className,
          style,
          needsComputation: text.includes('\n'),
          text,
          measuringElement,
        }),
      [measuringElement, style, text, textProps?.className],
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

    const transforms: string[] = [];
    // if (scaleToFit) {
    //   const lineWidth = wordsByLines[0].width;
    //   transforms.push(`scale(${(isNumber(width as number) ? (width as number) / lineWidth : 1) / lineWidth})`);
    // }
    if (angle) {
      transforms.push(`rotate(${angle}, ${x}, ${y})`);
    }

    return (
      <text
        ref={ref}
        {...textProps}
        transform={transforms.length > 0 ? transforms.join(' ') : undefined}
        x={x}
        y={y}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        style={measuringElement ? { ...style, visibility: 'hidden' } : style}
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
  },
);

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
