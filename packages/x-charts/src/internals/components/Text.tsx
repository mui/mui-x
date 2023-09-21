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
export interface TextProps
  extends Omit<React.SVGTextElementAttributes<SVGTextElement>, 'width' | 'ref'>,
    GetWordsByLinesParams {
  /**
   * Height of a text line (in `em`).
   */
  lineHeight?: number;
  dominantBaseline?: 'hanging' | 'central' | 'auto';
  ownerState?: any;
}

function getWordsByLines({ style, needsComputation, text }: GetWordsByLinesParams) {
  return text.split('\n').map((subText) => ({
    text: subText,
    width: needsComputation ? getStringSize(subText, style) : null,
  }));
}

function Text(props: TextProps) {
  const {
    x,
    y,
    textAnchor = 'start',
    dominantBaseline = 'central',
    lineHeight = 1,
    style,
    text,
    ownerState,
    ...textProps
  } = props;

  const wordsByLines = React.useMemo(() => getWordsByLines({ style, text }), [style, text]);

  let startDy: number;
  switch (dominantBaseline) {
    case 'hanging':
      startDy = 0;
      break;
    case 'central':
      startDy = ((wordsByLines.length - 1) / 2) * -lineHeight;
      break;
    default:
      startDy = (wordsByLines.length - 1) * -lineHeight;
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
        <tspan x={x} dy={`${index === 0 ? startDy : lineHeight}em`} key={index}>
          {line.text}
        </tspan>
      ))}
    </text>
  );
}

export { Text };
