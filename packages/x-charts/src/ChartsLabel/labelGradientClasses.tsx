import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import type { ChartsLabelGradientProps } from './ChartsLabelGradient';

export interface ChartsLabelGradientClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the "mask" that gives shape to the gradient. */
  mask: string;
  /** Styles applied when direction is "column". */
  vertical: string;
  /** Styles applied when direction is "row". */
  horizontal: string;
}

export function getLabelGradientUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsLabelGradient', slot);
}

export const labelGradientClasses: ChartsLabelGradientClasses = generateUtilityClasses(
  'MuiChartsLabelGradient',
  ['root', 'vertical', 'horizontal', 'mask'],
);

export const useUtilityClasses = (props: ChartsLabelGradientProps) => {
  const { direction } = props;

  const slots = {
    root: ['root', direction],
    mask: ['mask'],
  };

  return composeClasses(slots, getLabelGradientUtilityClass, props.classes);
};
