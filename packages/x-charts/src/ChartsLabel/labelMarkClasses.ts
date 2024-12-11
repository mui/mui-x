import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import type { ChartsLabelMarkProps } from './ChartsLabelMark';

export interface ChartsLabelMarkClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the "mask" that gives shape to the marks. */
  mask: string;
  /** Styles applied to the mark type "line". */
  line: string;
  /** Styles applied to the mark type "square". */
  square: string;
  /** Styles applied to the mark type "circle". */
  circle: string;
}

export type ChartsLabelMarkClassKey = keyof ChartsLabelMarkClasses;

export function getLabelMarkUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsLabelMark', slot);
}

export const labelMarkClasses: ChartsLabelMarkClasses = generateUtilityClasses(
  'MuiChartsLabelMark',
  ['root', 'line', 'square', 'circle', 'mask'],
);

export const useUtilityClasses = (props: ChartsLabelMarkProps) => {
  const { type } = props;
  const slots = {
    root: ['root', type],
    mask: ['mask'],
  };

  return composeClasses(slots, getLabelMarkUtilityClass, props.classes);
};
