import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import type { FunnelElementProps } from './FunnelElement';

export interface FunnelElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if `highlighted={true}`. */
  highlighted: string;
  /** Styles applied to the root element if `faded={true}`. */
  faded: string;
  /** Styles applied to the label element. */
  label: string;
}

function getFunnelElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiFunnelElement', slot);
}

export const useUtilityClasses = (props: FunnelElementProps) => {
  const { classes, seriesId } = props;

  const slots = {
    root: ['root', `series-${seriesId}`],
    highlighted: ['highlighted'],
    faded: ['faded'],
    label: ['label'],
  };

  return composeClasses(slots, getFunnelElementUtilityClass, classes);
};

export const funnelElementClasses: FunnelElementClasses = generateUtilityClasses(
  'MuiFunnelElement',
  ['root', 'highlighted', 'faded', 'label'],
);
