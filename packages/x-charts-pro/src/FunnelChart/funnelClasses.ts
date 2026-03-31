import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface FunnelClasses {
  /** Styles applied to the funnel plot element. */
  root: string;
  /** Styles applied to an individual funnel section element. */
  section: string;
  /** Styles applied to a funnel section element if `variant="filled"`. */
  sectionFilled: string;
  /** Styles applied to a funnel section element if `variant="outlined"`. */
  sectionOutlined: string;
  /** Styles applied to a funnel section label element. */
  sectionLabel: string;
}

export type FunnelClassKey = keyof FunnelClasses;

function getFunnelUtilityClass(slot: string) {
  return generateUtilityClass('MuiFunnelChart', slot);
}

export const funnelClasses: FunnelClasses = generateUtilityClasses('MuiFunnelChart', [
  'root',
  'section',
  'sectionFilled',
  'sectionOutlined',
  'sectionLabel',
  'sectionLabelFilled',
  'sectionLabelOutlined',
]);

interface UseUtilityClassesOptions {
  variant?: 'filled' | 'outlined';
  classes?: Partial<FunnelClasses>;
}

export const useUtilityClasses = (options?: UseUtilityClassesOptions) => {
  const { variant = 'filled', classes } = options ?? {};
  const slots = {
    root: ['root'],
    section: [
      'section',
      variant === 'filled' && 'sectionFilled',
      variant === 'outlined' && 'sectionOutlined',
    ],
    sectionLabel: [
      'sectionLabel',
      variant === 'filled' && 'sectionLabelFilled',
      variant === 'outlined' && 'sectionLabelOutlined',
    ],
  };

  return composeClasses(slots, getFunnelUtilityClass, classes);
};
