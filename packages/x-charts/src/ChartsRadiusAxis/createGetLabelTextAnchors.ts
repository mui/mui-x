/**
 * Higher order function that transform a `getLabelTransform` to the <text /> anchor props.
 */
export const createGetLabelTextAnchors =
  (
    getLabelTransform: (
      px: number,
      py: number,
      tickLabelPosition: 'center' | 'after' | 'before',
    ) => {
      verticalAlign: 'start' | 'middle' | 'end';
      horizontalAlign: 'start' | 'middle' | 'end';
    },
  ) =>
  (
    px: number,
    py: number,
    tickLabelPosition: 'center' | 'after' | 'before',
  ): {
    textAnchor: 'start' | 'middle' | 'end';
    dominantBaseline: 'hanging' | 'middle' | 'auto';
  } => {
    const { verticalAlign, horizontalAlign } = getLabelTransform(px, py, tickLabelPosition);

    let textAnchor: 'start' | 'middle' | 'end';
    let dominantBaseline: 'hanging' | 'middle' | 'auto';

    switch (verticalAlign) {
      case 'start':
        dominantBaseline = 'hanging';
        break;
      case 'middle':
        dominantBaseline = 'middle';
        break;
      case 'end':
      default:
        dominantBaseline = 'auto';
        break;
    }

    switch (horizontalAlign) {
      case 'start':
        textAnchor = 'start';
        break;
      case 'middle':
        textAnchor = 'middle';
        break;
      case 'end':
      default:
        textAnchor = 'end';
        break;
    }

    return { textAnchor, dominantBaseline };
  };
