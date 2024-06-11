import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Skeleton from '@mui/material/Skeleton';
import { styled, useThemeProps, Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import composeClasses from '@mui/utils/composeClasses';
import { DAY_SIZE, DAY_MARGIN } from '../internals/constants/dimensions';
import {
  DayCalendarSkeletonClasses,
  getDayCalendarSkeletonUtilityClass,
} from './dayCalendarSkeletonClasses';

type HTMLDivProps = React.JSX.IntrinsicElements['div'];

export interface DayCalendarSkeletonProps extends HTMLDivProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DayCalendarSkeletonClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  ref?: React.Ref<HTMLDivElement>;
}

const useUtilityClasses = (ownerState: DayCalendarSkeletonProps) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    week: ['week'],
    daySkeleton: ['daySkeleton'],
  };

  return composeClasses(slots, getDayCalendarSkeletonUtilityClass, classes);
};

const DayCalendarSkeletonRoot = styled('div', {
  name: 'MuiDayCalendarSkeleton',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  alignSelf: 'start',
});

const DayCalendarSkeletonWeek = styled('div', {
  name: 'MuiDayCalendarSkeleton',
  slot: 'Week',
  overridesResolver: (props, styles) => styles.week,
})({
  margin: `${DAY_MARGIN}px 0`,
  display: 'flex',
  justifyContent: 'center',
});

const DayCalendarSkeletonDay = styled(Skeleton, {
  name: 'MuiDayCalendarSkeleton',
  slot: 'DaySkeleton',
  overridesResolver: (props, styles) => styles.daySkeleton,
})<{ ownerState: { day: number } }>({
  margin: `0 ${DAY_MARGIN}px`,
  variants: [
    {
      props: { day: 0 },
      style: { visibility: 'hidden' },
    },
  ],
});

const monthMap = [
  [0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0],
];

/**
 * Demos:
 *
 * - [DateCalendar](https://mui.com/x/react-date-pickers/date-calendar/)
 *
 * API:
 *
 * - [CalendarPickerSkeleton API](https://mui.com/x/api/date-pickers/calendar-picker-skeleton/)
 */
function DayCalendarSkeleton(inProps: DayCalendarSkeletonProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiDayCalendarSkeleton',
  });

  const { className, ...other } = props;

  const classes = useUtilityClasses(other);

  return (
    <DayCalendarSkeletonRoot className={clsx(classes.root, className)} {...other}>
      {monthMap.map((week, index) => (
        <DayCalendarSkeletonWeek key={index} className={classes.week}>
          {week.map((day, index2) => (
            <DayCalendarSkeletonDay
              key={index2}
              variant="circular"
              width={DAY_SIZE}
              height={DAY_SIZE}
              className={classes.daySkeleton}
              ownerState={{ day }}
            />
          ))}
        </DayCalendarSkeletonWeek>
      ))}
    </DayCalendarSkeletonRoot>
  );
}

DayCalendarSkeleton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { DayCalendarSkeleton };
