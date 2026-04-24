import composeClasses from '@mui/utils/composeClasses';
import { type ChartsRadialAxisClasses, getRadialAxisUtilityClass } from './sharedRadialAxisClasses';

export const useUtilityClasses = (props: {
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
  getRadialAxisUtilityClass,
  chartsRadialAxisClasses,
} from './sharedRadialAxisClasses';
