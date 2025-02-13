'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { ChartsTextStyle } from '../internals/getWordsByLines';

export interface ChartsTextProps
  extends Omit<
    React.SVGTextElementAttributes<SVGTextElement>,
    'width' | 'ref' | 'style' | 'dominantBaseline'
  > {
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
  measuring?: boolean;
  text: string;
  style?: ChartsTextStyle;
}

/**
 * Helper component to manage multiline text in SVG
 */
const ChartsText = React.forwardRef<SVGTextElement, ChartsTextProps>(
  function ChartsText(props, ref) {
    const { x, y, style: styleProps, text, ownerState, measuring, ...textProps } = props;
    const firstLineTSpanRef = React.useRef<SVGTSpanElement | null>(null);
    const [lineHeight, setLineHeight] = React.useState(0);
    const lines = text.split('\n');

    const { angle, textAnchor, dominantBaseline, ...style } = styleProps ?? {};

    React.useLayoutEffect(
      function getLineHeight() {
        const bbox = firstLineTSpanRef.current?.getBBox();
        if (bbox) {
          setLineHeight(bbox.height);
        }
      },
      [style, text, textProps.className],
    );

    let startDy: number;
    switch (dominantBaseline) {
      case 'hanging':
        startDy = 0;
        break;
      case 'central':
        startDy = ((lines.length - 1) / 2) * -lineHeight;
        break;
      default:
        startDy = (lines.length - 1) * -lineHeight;
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
        style={measuring ? { ...style, visibility: 'hidden' } : style}
      >
        {lines.map((line, index) => (
          <tspan
            ref={index === 0 ? firstLineTSpanRef : undefined}
            x={x}
            dy={`${index === 0 ? startDy : lineHeight}px`}
            dominantBaseline={dominantBaseline} // Propagated to fix Safari issue: https://github.com/mui/mui-x/issues/10808
            key={index}
          >
            {line}
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
