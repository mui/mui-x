import composeClasses from '@mui/utils/composeClasses';
import { getRadialAxisUtilityClass } from './sharedRadialAxisClasses';
import type { ChartsRadialAxisClasses } from './sharedRadialAxisClasses';

export const useUtilityClasses = (props: {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsRadialAxisClasses>;
  isCentered?: boolean;
}) => {
  const { classes, isCentered } = props;
  const slots = {
    root: ['root', 'radius'],
    line: ['line'],
    tickContainer: ['tickContainer'],
    tick: ['tick'],
    tickLabel: ['tickLabel', isCentered && 'centered'],
  };

  return composeClasses(slots, getRadialAxisUtilityClass, classes);
};

export {
  type ChartsRadialAxisClasses,
  type ChartsRadialAxisClassKey,
  chartsRadialAxisClasses,
} from './sharedRadialAxisClasses';
