import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import type { FunnelSectionProps } from './FunnelSection';

export interface FunnelSectionClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if `highlighted={true}`. */
  highlighted: string;
  /** Styles applied to the root element if `faded={true}`. */
  faded: string;
  /** Styles applied to the label element. */
  label: string;
  /**
   * Styles applied to the root element for a specified series.
   * Needs to be suffixed with the series ID: `.${funnelSectionClasses.series}-${seriesId}`.
   */
  series: string;
}

function getFunnelSectionUtilityClass(slot: string) {
  return generateUtilityClass('MuiFunnelSection', slot);
}

export const useUtilityClasses = (props: FunnelSectionProps) => {
  const { classes, seriesId } = props;

  const slots = {
    root: ['root', `series-${seriesId}`],
    highlighted: ['highlighted'],
    faded: ['faded'],
    label: ['label'],
  };

  return composeClasses(slots, getFunnelSectionUtilityClass, classes);
};

export const funnelSectionClasses: FunnelSectionClasses = generateUtilityClasses(
  'MuiFunnelSection',
  ['root', 'highlighted', 'faded', 'label', 'series'],
);
