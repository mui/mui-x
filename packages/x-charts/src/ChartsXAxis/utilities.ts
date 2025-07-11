import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import { AxisConfig, ChartsXAxisProps } from '../models/axis';
import { getAxisUtilityClass } from '../ChartsAxis/axisClasses';
import { AxisRoot } from '../internals/components/AxisSharedComponents';

export const useUtilityClasses = (ownerState: AxisConfig<any, any, ChartsXAxisProps>) => {
  const { classes, position, id } = ownerState;
  const slots = {
    root: ['root', 'directionX', position, `id-${id}`],
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

export const XAxisRoot = styled(AxisRoot, {
  name: 'MuiChartsXAxis',
  slot: 'Root',
})({});

export const defaultProps = {
  disableLine: false,
  disableTicks: false,
  tickSize: 6,
  tickLabelMinGap: 4,
} as const;
