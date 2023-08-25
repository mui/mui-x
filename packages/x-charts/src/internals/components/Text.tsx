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
   * The max width per lineu.
   */
  width?: number;
}
export interface TextProps
  extends Omit<React.SVGTextElementAttributes<SVGTextElement>, 'width'>,
    GetWordsByLinesParams {
  lineHeight?: string;
}

function getWordsByLines({ style, width, text }: GetWordsByLinesParams) {
  return [{ text, width: 50 }];
}
function Text(props: TextProps) {
  const {
    x,
    y,
    textAnchor = 'start',
    // verticalAnchor= 'end',
    // scaleToFit,
    // angle,
    lineHeight = '1em',
    capHeight,
    className,
    // breakAll,
    style,
    width,
    text,
    ...textProps
  } = props;

  const wordsByLines = React.useMemo(
    () => getWordsByLines({ style, width, text }),
    [style, width, text],
  );

  let startDy: number = 0;
  // switch (verticalAnchor) {
  //   case 'start':
  //     startDy = reduceCSSCalc(`calc(${capHeight})`);
  //     break;
  //   case 'middle':
  //     startDy = reduceCSSCalc(`calc(${(wordsByLines.length - 1) / 2} * -${lineHeight} + (${capHeight} / 2))`);
  //     break;
  //   default:
  //     startDy = reduceCSSCalc(`calc(${wordsByLines.length - 1} * -${lineHeight})`);
  //     break;
  // }

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
    <text {...textProps} x={x} y={y} textAnchor={textAnchor}>
      {wordsByLines.map((line, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <tspan x={x} dy={index === 0 ? startDy : lineHeight} key={index}>
          {line.text}
        </tspan>
      ))}
    </text>
  );
}

export { Text };
