import composeClasses from '@mui/utils/composeClasses';
import {
  type ChartsRadialAxisClasses,
  getRadialAxisUtilityClass,
} from '../ChartsRadiusAxis/sharedRadialAxisClasses';

export const useUtilityClasses = (props: {
  classes?: Partial<ChartsRadialAxisClasses>;
}) => {
  const { classes } = props;
  const slots = {
    root: ['root', 'rotation'],
    line: ['line'],
    tickContainer: ['tickContainer'],
    tick: ['tick'],
    tickLabel: ['tickLabel'],
  };

  return composeClasses(slots, getRadialAxisUtilityClass, classes);
};

export {
  type ChartsRadialAxisClasses,
  type ChartsRadialAxisClassKey,
  getRadialAxisUtilityClass,
  chartsRadialAxisClasses,
} from '../ChartsRadiusAxis/sharedRadialAxisClasses';
