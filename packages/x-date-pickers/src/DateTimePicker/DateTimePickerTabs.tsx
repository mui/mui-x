'use client';
import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { TimeIcon, DateRangeIcon } from '../icons';
import { DateOrTimeViewWithMeridiem } from '../internals/models';
import { usePickerTranslations } from '../hooks/usePickerTranslations';
import {
  DateTimePickerTabsClasses,
  getDateTimePickerTabsUtilityClass,
} from './dateTimePickerTabsClasses';
import { ExportedBaseTabsProps } from '../internals/models/props/tabs';
import { isDatePickerView } from '../internals/utils/date-utils';
import { usePickerPrivateContext } from '../internals/hooks/usePickerPrivateContext';
import { PickerOwnerState } from '../models/pickers';
import { usePickerContext } from '../hooks';

type TabValue = 'date' | 'time';

const viewToTab = (view: DateOrTimeViewWithMeridiem): TabValue => {
  if (isDatePickerView(view)) {
    return 'date';
  }

  return 'time';
};

const tabToView = (tab: TabValue): DateOrTimeViewWithMeridiem => {
  if (tab === 'date') {
    return 'day';
  }

  return 'hours';
};

export interface DateTimePickerTabsProps extends ExportedBaseTabsProps {
  /**
   * Toggles visibility of the tabs allowing view switching.
   * @default `window.innerHeight < 667` for `DesktopDateTimePicker` and `MobileDateTimePicker`, `displayStaticWrapperAs === 'desktop'` for `StaticDateTimePicker`
   */
  hidden?: boolean;
  /**
   * Date tab icon.
   * @default DateRange
   */
  dateIcon?: React.ReactNode;
  /**
   * Time tab icon.
   * @default Time
   */
  timeIcon?: React.ReactNode;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateTimePickerTabsClasses>;
}

const useUtilityClasses = (classes: Partial<DateTimePickerTabsClasses> | undefined) => {
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getDateTimePickerTabsUtilityClass, classes);
};

const DateTimePickerTabsRoot = styled(Tabs, {
  name: 'MuiDateTimePickerTabs',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: PickerOwnerState }>(({ theme }) => ({
  boxShadow: `0 -1px 0 0 inset ${(theme.vars || theme).palette.divider}`,
  '&:last-child': {
    boxShadow: `0 1px 0 0 inset ${(theme.vars || theme).palette.divider}`,
    [`& .${tabsClasses.indicator}`]: {
      bottom: 'auto',
      top: 0,
    },
  },
}));

/**
 * Demos:
 *
 * - [DateTimePicker](https://mui.com/x/react-date-pickers/date-time-picker/)
 * - [Custom slots and subcomponents](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [DateTimePickerTabs API](https://mui.com/x/api/date-pickers/date-time-picker-tabs/)
 */
const DateTimePickerTabs = function DateTimePickerTabs(inProps: DateTimePickerTabsProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateTimePickerTabs' });
  const {
    dateIcon = <DateRangeIcon />,
    timeIcon = <TimeIcon />,
    hidden = typeof window === 'undefined' || window.innerHeight < 667,
    className,
    classes: classesProp,
    sx,
  } = props;

  const translations = usePickerTranslations();
  const { ownerState } = usePickerPrivateContext();
  const { view, setView } = usePickerContext();
  const classes = useUtilityClasses(classesProp);

  const handleChange = (event: React.SyntheticEvent, value: TabValue) => {
    setView(tabToView(value));
  };

  if (hidden) {
    return null;
  }

  return (
    <DateTimePickerTabsRoot
      ownerState={ownerState}
      variant="fullWidth"
      value={viewToTab(view!)}
      onChange={handleChange}
      className={clsx(className, classes.root)}
      sx={sx}
    >
      <Tab
        value="date"
        aria-label={translations.dateTableLabel}
        icon={<React.Fragment>{dateIcon}</React.Fragment>}
      />
      <Tab
        value="time"
        aria-label={translations.timeTableLabel}
        icon={<React.Fragment>{timeIcon}</React.Fragment>}
      />
    </DateTimePickerTabsRoot>
  );
};

DateTimePickerTabs.propTypes = {
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
   * Date tab icon.
   * @default DateRange
   */
  dateIcon: PropTypes.node,
  /**
   * Toggles visibility of the tabs allowing view switching.
   * @default `window.innerHeight < 667` for `DesktopDateTimePicker` and `MobileDateTimePicker`, `displayStaticWrapperAs === 'desktop'` for `StaticDateTimePicker`
   */
  hidden: PropTypes.bool,
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
} as any;

export { DateTimePickerTabs };
