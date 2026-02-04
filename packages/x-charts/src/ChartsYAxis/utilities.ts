import composeClasses from '@mui/utils/composeClasses';
import { type AxisConfig, type ChartsYAxisProps } from '../models/axis';
import { getAxisUtilityClass } from '../ChartsAxis/axisClasses';

export const useUtilityClasses = (ownerState: AxisConfig<any, any, ChartsYAxisProps>) => {
  const { classes, position } = ownerState;
  const slots = {
    root: ['root', 'directionY', position],
    line: ['line'],
    tickContainer: ['tickContainer'],
    tick: ['tick'],
    tickLabel: ['tickLabel'],
    label: ['label'],
  };

  return composeClasses(slots, getAxisUtilityClass, classes);
};

/* Gap between a tick and its label. */
export const TICK_LABEL_GAP = 2;
/* Gap between the axis label and tick labels. */
export const AXIS_LABEL_TICK_LABEL_GAP = 2;

export const defaultProps = {
  disableLine: false,
  disableTicks: false,
  tickSize: 6,
};
