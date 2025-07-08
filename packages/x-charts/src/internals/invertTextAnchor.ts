import { ChartsTextStyle } from '../ChartsText';

export function invertTextAnchor(
  textAnchor: ChartsTextStyle['textAnchor'],
): ChartsTextStyle['textAnchor'] {
  switch (textAnchor) {
    case 'start':
      return 'end';
    case 'end':
      return 'start';
    default:
      return textAnchor;
  }
}
