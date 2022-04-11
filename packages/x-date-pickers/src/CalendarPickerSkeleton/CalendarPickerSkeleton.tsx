import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Skeleton from '@mui/material/Skeleton';
import { styled, useThemeProps, Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { DAY_SIZE, DAY_MARGIN } from '../internals/constants/dimensions';
import {
  CalendarPickerSkeletonClasses,
  getCalendarPickerSkeletonUtilityClass,
} from './calendarPickerSkeletonClasses';

type HTMLDivProps = JSX.IntrinsicElements['div'];

export interface CalendarPickerSkeletonProps extends HTMLDivProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<CalendarPickerSkeletonClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  ref?: React.Ref<HTMLDivElement>;
}

const useUtilityClasses = (ownerState: CalendarPickerSkeletonProps) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    week: ['week'],
    daySkeleton: ['daySkeleton'],
  };

  return composeClasses(slots, getCalendarPickerSkeletonUtilityClass, classes);
};

const CalendarPickerSkeletonRoot = styled('div', {
  name: 'MuiCalendarPickerSkeleton',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  alignSelf: 'start',
});

const CalendarPickerSkeletonWeek = styled('div', {
  name: 'MuiCalendarPickerSkeleton',
  slot: 'Week',
  overridesResolver: (props, styles) => styles.week,
})({
  margin: `${DAY_MARGIN}px 0`,
  display: 'flex',
  justifyContent: 'center',
});

const CalendarPickerSkeletonDay = styled(Skeleton, {
  name: 'MuiCalendarPickerSkeleton',
  slot: 'Day',
  overridesResolver: (props, styles) => styles.daySkeleton,
})<{ ownerState: { day: number } }>(({ ownerState }) => ({
  margin: `0 ${DAY_MARGIN}px`,
  ...(ownerState.day === 0 && {
    visibility: 'hidden',
  }),
}));

CalendarPickerSkeletonDay.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  ownerState: PropTypes.shape({
    day: PropTypes.number.isRequired,
  }).isRequired,
} as any;

const monthMap = [
  [0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0],
];

/**
 *
 * Demos:
 *
 * - [Date Picker](https://mui.com/x/react-date-pickers/date-picker/)
 *
 * API:
 *
 * - [CalendarPickerSkeleton API](https://mui.com/x/api/date-pickers/calendar-picker-skeleton/)
 */
function CalendarPickerSkeleton(props: CalendarPickerSkeletonProps) {
  const { className, ...other } = useThemeProps<
    Theme,
    Omit<JSX.IntrinsicElements['div'], 'ref'> & { ref?: React.Ref<HTMLDivElement> },
    'MuiCalendarPickerSkeleton'
  >({
    props,
    name: 'MuiCalendarPickerSkeleton',
  });

  const classes = useUtilityClasses(props);

  return (
    <CalendarPickerSkeletonRoot className={clsx(classes.root, className)} {...other}>
      {monthMap.map((week, index) => (
        <CalendarPickerSkeletonWeek key={index} className={classes.week}>
          {week.map((day, index2) => (
            <CalendarPickerSkeletonDay
              key={index2}
              variant="circular"
              width={DAY_SIZE}
              height={DAY_SIZE}
              className={classes.daySkeleton}
              ownerState={{ day }}
            />
          ))}
        </CalendarPickerSkeletonWeek>
      ))}
    </CalendarPickerSkeletonRoot>
  );
}

CalendarPickerSkeleton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
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

export { CalendarPickerSkeleton };
