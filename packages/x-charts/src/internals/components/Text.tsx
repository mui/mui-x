import * as React from 'react';

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
   * The max width per line (in px).
   */
  width?: number;
}
export interface TextProps
  extends Omit<React.SVGTextElementAttributes<SVGTextElement>, 'width' | 'ref'>,
    GetWordsByLinesParams {
  /**
   * Height of a text line (in `em`).
   */
  lineHeight?: number;
  dominantBaseline?: 'hanging' | 'middle' | 'auto';
  ownerState?: any;
}

function getWordsByLines({ style, width, text }: GetWordsByLinesParams) {
  return text.split('\n').map((subText) => ({ text: subText, width: 50 }));
}

function Text(props: TextProps) {
  const {
    x,
    y,
    textAnchor = 'start',
    dominantBaseline = 'middle',
    lineHeight = 1,
    style,
    width,
    text,
    ownerState,
    ...textProps
  } = props;

  const wordsByLines = React.useMemo(
    () => getWordsByLines({ style, width, text }),
    [style, width, text],
  );

  let startDy: number;
  switch (dominantBaseline) {
    case 'hanging':
      startDy = 0;
      break;
    case 'middle':
      startDy = ((wordsByLines.length - 1) / 2) * -lineHeight;
      break;
    default:
      startDy = wordsByLines.length - 1 * -lineHeight;
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
    <text {...textProps} x={x} y={y} textAnchor={textAnchor} dominantBaseline={dominantBaseline}>
      {wordsByLines.map((line, index) => (
        <tspan x={x} dy={`${index === 0 ? startDy : lineHeight}em`} key={index}>
          {line.text}
        </tspan>
      ))}
    </text>
  );
}

export { Text };
