import * as React from 'react';
import { getStringSize } from '../domUtils';

interface GetWordsByLinesParams {
  /**
   * Text displayed.
   */
  text: string;
  /**
   * Style applied to text elements.
   */
  style?: React.SVGAttributes<'text'>['style'];
  /**
   * If true, the line width is computed.
   * @default false
   */
  needsComputation?: boolean;
}

export type ChartsTextBaseline = 'hanging' | 'central' | 'auto';

export interface ChartsTextProps
  extends Omit<React.SVGTextElementAttributes<SVGTextElement>, 'width' | 'ref'>,
    GetWordsByLinesParams {
  /**
   * Height of a text line (in `em`).
   */
  lineHeight?: number;
  /**
   * The text baseline
   * @default 'central'
   */
  dominantBaseline?: ChartsTextBaseline;
  ownerState?: any;
}

export function getWordsByLines({ style, needsComputation, text }: GetWordsByLinesParams) {
  return text.split('\n').map((subText) => ({
    text: subText,
    ...(needsComputation ? getStringSize(subText, style) : { width: 0, height: 0 }),
  }));
}

export function ChartsText(props: ChartsTextProps) {
  const {
    x,
    y,
    textAnchor = 'start',
    dominantBaseline = 'central',
    style,
    text,
    ownerState,
    ...textProps
  } = props;

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

  // const transforms = [];
  // if (scaleToFit) {
  //   const lineWidth = wordsByLines[0].width;
  //   transforms.push(`scale(${(isNumber(width as number) ? (width as number) / lineWidth : 1) / lineWidth})`);
  // }
  // if (angle) {
  //   transforms.push(`rotate(${angle}, ${x}, ${y})`);
  // }
  // if (transforms.length) {
  //   textProps.transform = transforms.join(' ');
  // }

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
        <tspan x={x} dy={`${index === 0 ? startDy : wordsByLines[0].height}px`} key={index}>
          {line.text}
        </tspan>
      ))}
    </text>
  );
}
