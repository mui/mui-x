import composeClasses from '@mui/utils/composeClasses';
import { type ChartsRadialAxisClasses, getRadialAxisUtilityClass } from './sharedRadialAxisClasses';

export const useUtilityClasses = (props: {
  classes?: Partial<ChartsRadialAxisClasses>;
  center?: boolean;
}) => {
  const { classes, center } = props;
  const slots = {
    root: ['root', 'radiusAxis'],
    line: ['line'],
    tickContainer: ['tickContainer'],
    tick: ['tick'],
    tickLabel: ['tickLabel', center && 'centered'],
  };

  return composeClasses(slots, getRadialAxisUtilityClass, classes);
};

export {
  type ChartsRadialAxisClasses,
  type ChartsRadialAxisClassKey,
  getRadialAxisUtilityClass,
  chartsRadialAxisClasses,
} from './sharedRadialAxisClasses';
