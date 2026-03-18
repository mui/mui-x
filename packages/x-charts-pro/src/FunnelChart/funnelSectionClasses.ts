import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
import type { FunnelSectionProps } from './FunnelSection';
import type { FunnelSectionLabelProps } from './FunnelSectionLabel';

/**
 * @deprecated Use `FunnelClasses` from `funnelClasses` instead.
 */
export interface FunnelSectionClasses {
  /** Styles applied to the root element. */
  root: string;
  /**
   * Styles applied to the root element if `highlighted={true}`.
   * @deprecated Use `[data-highlighted]` selector instead.
   */
  highlighted: string;
  /**
   * Styles applied to the root element if `faded={true}`.
   * @deprecated Use `[data-faded]` selector instead.
   */
  faded: string;
  /** Styles applied to the root element if `variant="filled"`. */
  filled: string;
  /** Styles applied to the root element if `variant="outlined"`. */
  outlined: string;
  /** Styles applied to the label element. */
  label: string;
  /**
   * Styles applied to the root element for a specified series.
   * Needs to be suffixed with the series ID: `.${funnelSectionClasses.series}-${seriesId}`.
   * @deprecated Use `[data-series]` selector instead.
   */
  series: string;
}

/**
 * @deprecated Use `getFunnelUtilityClass` from `funnelClasses` instead.
 */
function getFunnelSectionUtilityClass(slot: string) {
  return generateUtilityClass('MuiFunnelSection', slot);
}

/**
 * @deprecated Use `useUtilityClasses` from `funnelClasses` instead.
 */
export const useUtilityClasses = (props: FunnelSectionProps) => {
  const { classes, seriesId, variant, dataIndex } = props;

  const slots = {
    root: ['root', `series-${seriesId}`, `data-index-${dataIndex}`],
    highlighted: ['highlighted'],
    faded: ['faded'],
    outlined: variant === 'outlined' ? ['outlined'] : [],
    filled: variant === 'filled' ? ['filled'] : [],
    label: ['label'],
  };

  return composeClasses(slots, getFunnelSectionUtilityClass, classes);
};

/**
 * @deprecated Use `useUtilityClasses` from `funnelClasses` instead.
 */
export const useLabelUtilityClasses = (props: FunnelSectionLabelProps) => {
  const { classes, seriesId, dataIndex } = props;

  const slots = {
    label: ['label', `series-${seriesId}`, `data-index-${dataIndex}`],
  };

  return composeClasses(slots, getFunnelSectionUtilityClass, classes);
};

/**
 * @deprecated Use `funnelClasses` from `funnelClasses` instead.
 */
export const funnelSectionClasses: FunnelSectionClasses = generateUtilityClasses(
  'MuiFunnelSection',
  ['root', 'highlighted', 'faded', 'filled', 'outlined', 'label', 'series', 'data-index'],
);
