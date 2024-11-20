'use client';
import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { TimeIcon } from '@mui/x-date-pickers/icons';
import {
  BaseTabsProps,
  ExportedBaseTabsProps,
  TimeViewWithMeridiem,
} from '@mui/x-date-pickers/internals';
import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import {
  TimeRangePickerTabsClasses,
  getTimeRangePickerTabsUtilityClass,
} from './timeRangePickerTabsClasses';
import { RangePosition } from '../models';
import { UseRangePositionResponse } from '../internals/hooks/useRangePosition';

export interface ExportedTimeRangePickerTabsProps extends ExportedBaseTabsProps {
  /**
   * Toggles visibility of the tabs allowing view switching.
   * @default `window.innerHeight < 667` for `DesktopTimeRangePicker` and `MobileTimeRangePicker`, `displayStaticWrapperAs === 'desktop'` for `StaticTimeRangePicker`
   */
  hidden?: boolean;
  /**
   * Time tab icon.
   * @default Time
   */
  timeIcon?: React.ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TimeRangePickerTabsClasses>;
}

export interface TimeRangePickerTabsProps
  extends ExportedTimeRangePickerTabsProps,
    BaseTabsProps<TimeViewWithMeridiem>,
    Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> {}

const useUtilityClasses = (ownerState: TimeRangePickerTabsProps) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    tab: ['tab'],
  };

  return composeClasses(slots, getTimeRangePickerTabsUtilityClass, classes);
};

const TimeRangePickerTabsRoot = styled(Tabs, {
  name: 'MuiTimeRangePickerTabs',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: TimeRangePickerTabsProps }>(({ theme }) => ({
  boxShadow: `0 -1px 0 0 inset ${(theme.vars || theme).palette.divider}`,
  '&:last-child': {
    boxShadow: `0 1px 0 0 inset ${(theme.vars || theme).palette.divider}`,
    [`& .${tabsClasses.indicator}`]: {
      bottom: 'auto',
      top: 0,
    },
  },
}));

const TimeRangePickerTab = styled(Tab, {
  name: 'MuiTimeRangePickerTabs',
  slot: 'Tab',
  overridesResolver: (_, styles) => styles.tab,
})(({ theme }) => ({
  minHeight: '48px',
  gap: theme.spacing(1),
}));

/**
 * Demos:
 *
 * - [TimeRangePicker](https://mui.com/x/react-date-pickers/time-range-picker/)
 * - [Custom slots and subcomponents](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [TimeRangePickerTabs API](https://mui.com/x/api/date-pickers/time-range-picker-tabs/)
 */
const TimeRangePickerTabs = function TimeRangePickerTabs(inProps: TimeRangePickerTabsProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiTimeRangePickerTabs' });
  const {
    view,
    onViewChange,
    timeIcon = <TimeIcon />,
    rangePosition,
    onRangePositionChange,
    hidden = typeof window === 'undefined' || window.innerHeight < 667,
    className,
    sx,
  } = props;

  const translations = usePickerTranslations();
  const classes = useUtilityClasses(props);

  const handleChange = (event: React.SyntheticEvent, value: RangePosition) => {
    if (rangePosition !== value) {
      onRangePositionChange(value);
    }
    if (view !== 'hours') {
      onViewChange('hours');
    }
  };

  if (hidden) {
    return null;
  }

  return (
    <TimeRangePickerTabsRoot
      ownerState={props}
      variant="fullWidth"
      value={rangePosition}
      onChange={handleChange}
      className={clsx(className, classes.root)}
      sx={sx}
    >
      <TimeRangePickerTab
        value="start"
        iconPosition="start"
        icon={<React.Fragment>{timeIcon}</React.Fragment>}
        label={translations.start}
        className={classes.tab}
      />
      <TimeRangePickerTab
        value="end"
        iconPosition="start"
        label={translations.end}
        icon={<React.Fragment>{timeIcon}</React.Fragment>}
        className={classes.tab}
      />
    </TimeRangePickerTabsRoot>
  );
};

TimeRangePickerTabs.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Toggles visibility of the tabs allowing view switching.
   * @default `window.innerHeight < 667` for `DesktopTimeRangePicker` and `MobileTimeRangePicker`, `displayStaticWrapperAs === 'desktop'` for `StaticTimeRangePicker`
   */
  hidden: PropTypes.bool,
  onRangePositionChange: PropTypes.func.isRequired,
  /**
   * Callback called when a tab is clicked.
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: PropTypes.func.isRequired,
  rangePosition: PropTypes.oneOf(['end', 'start']).isRequired,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Time tab icon.
   * @default Time
   */
  timeIcon: PropTypes.node,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['hours', 'meridiem', 'minutes', 'seconds']).isRequired,
} as any;

export { TimeRangePickerTabs };
