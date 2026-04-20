import composeClasses from '@mui/utils/composeClasses';
import { type AxisConfig, type ChartsXAxisProps } from '../models/axis';
import { getAxisUtilityClass } from '../ChartsAxis/axisClasses';

export const useUtilityClasses = (
  ownerState: Pick<AxisConfig<any, any, ChartsXAxisProps>, 'position' | 'classes'>,
) => {
  const { classes, position } = ownerState;
  const slots = {
    root: ['root', 'directionX', position],
    line: ['line'],
    tickContainer: ['tickContainer'],
    tick: ['tick'],
    tickLabel: ['tickLabel'],
    label: ['label'],
  };

  return composeClasses(slots, getAxisUtilityClass, classes);
};

/* Gap between a tick and its label. */
export const TICK_LABEL_GAP = 3;
/* Gap between the axis label and tick labels. */
export const AXIS_LABEL_TICK_LABEL_GAP = 4;

export const defaultProps = {
  disableLine: false,
  disableTicks: false,
  tickSize: 6,
  tickLabelMinGap: 4,
} as const;
