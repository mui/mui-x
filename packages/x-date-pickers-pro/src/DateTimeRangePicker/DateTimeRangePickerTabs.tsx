import * as React from 'react';
import PropTypes from 'prop-types';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { styled, useThemeProps } from '@mui/material/styles';
import {
  unstable_composeClasses as composeClasses,
  unstable_useEventCallback as useEventCallback,
} from '@mui/utils';
import { TimeIcon, DateRangeIcon } from '@mui/x-date-pickers/icons';
import { DateOrTimeViewWithMeridiem } from '@mui/x-date-pickers/internals/models';
import { useLocaleText } from '@mui/x-date-pickers/internals/hooks/useUtils';
import {
  BaseTabsProps,
  ExportedBaseTabsProps,
} from '@mui/x-date-pickers/internals/models/props/tabs';
import { isDatePickerView } from '@mui/x-date-pickers/internals/utils/date-utils';
import {
  DateTimeRangePickerTabsClasses,
  getDateTimeRangePickerTabsUtilityClass,
} from './dateTimeRangePickerTabsClasses';
import { UseRangePositionResponse } from '../internals/hooks/useRangePosition';
import { RangePosition } from '../internals/models';

type TabValue = 'date' | 'start-time' | 'end-time';

const viewToTab = (view: DateOrTimeViewWithMeridiem, rangePosition: RangePosition): TabValue => {
  if (isDatePickerView(view)) {
    return 'date';
  }

  return rangePosition === 'start' ? 'start-time' : 'end-time';
};

const tabToView = (tab: TabValue): DateOrTimeViewWithMeridiem => {
  if (tab === 'date') {
    return 'day';
  }

  return 'hours';
};

export interface ExportedDateTimeRangePickerTabsProps extends ExportedBaseTabsProps {
  /**
   * Toggles visibility of the tabs allowing view switching.
   * @default `window.innerHeight < 667` for `DesktopDateTimePicker` and `MobileDateTimePicker`, `displayStaticWrapperAs === 'desktop'` for `StaticDateTimePicker`
   */
  hidden?: boolean;
  /**
   * Date tab icon.
   * @default DateRange
   */
  dateIcon?: React.ReactElement;
  /**
   * Time tab icon.
   * @default Time
   */
  timeIcon?: React.ReactElement;
}

export interface DateTimeRangePickerTabsProps
  extends ExportedDateTimeRangePickerTabsProps,
    BaseTabsProps<DateOrTimeViewWithMeridiem>,
    Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateTimeRangePickerTabsClasses>;
}

const useUtilityClasses = (ownerState: DateTimeRangePickerTabsProps) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    tab: ['tab'],
  };

  return composeClasses(slots, getDateTimeRangePickerTabsUtilityClass, classes);
};

const DateTimeRangePickerTabsRoot = styled(Tabs, {
  name: 'MuiDateTimeRangePickerTabs',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: DateTimeRangePickerTabsProps }>(({ theme }) => ({
  boxShadow: `0 -1px 0 0 inset ${(theme.vars || theme).palette.divider}`,
  '&:last-child': {
    boxShadow: `0 1px 0 0 inset ${(theme.vars || theme).palette.divider}`,
    [`& .${tabsClasses.indicator}`]: {
      bottom: 'auto',
      top: 0,
    },
  },
}));

const DateTimeRangePickerTab = styled(Tab, {
  name: 'MuiDateTimeRangePickerTabs',
  slot: 'Tab',
  overridesResolver: (_, styles) => styles.tab,
})({
  minHeight: 'auto',
});

const DateTimeRangePickerTabs = function DateTimeRangePickerTabs(
  inProps: DateTimeRangePickerTabsProps,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateTimeRangePickerTabs' });
  const {
    dateIcon = <DateRangeIcon />,
    onViewChange,
    timeIcon = <TimeIcon />,
    view,
    hidden = typeof window === 'undefined' || window.innerHeight < 667,
    rangePosition,
    onRangePositionChange,
  } = props;

  const localeText = useLocaleText();
  const classes = useUtilityClasses(props);

  const handleChange = useEventCallback((event: React.SyntheticEvent, value: TabValue) => {
    onViewChange(tabToView(value));
    if (value === 'start-time') {
      onRangePositionChange('start');
    } else if (value === 'end-time') {
      onRangePositionChange('end');
    }
  });

  if (hidden) {
    return null;
  }

  return (
    <DateTimeRangePickerTabsRoot
      ownerState={props}
      variant="fullWidth"
      value={viewToTab(view, rangePosition)}
      onChange={handleChange}
      className={classes.root}
    >
      <DateTimeRangePickerTab
        value="date"
        aria-label={localeText.dateTableLabel}
        icon={dateIcon}
        className={classes.tab}
      />
      <DateTimeRangePickerTab
        value="start-time"
        label={localeText.start}
        aria-label={localeText.timeTableLabel}
        icon={timeIcon}
        iconPosition="start"
        className={classes.tab}
      />
      <DateTimeRangePickerTab
        value="end-time"
        label={localeText.end}
        aria-label={localeText.timeTableLabel}
        icon={timeIcon}
        iconPosition="start"
        className={classes.tab}
      />
    </DateTimeRangePickerTabsRoot>
  );
};

DateTimeRangePickerTabs.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
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
   * Callback called when a tab is clicked
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: PropTypes.func.isRequired,
  /**
   * Time tab icon.
   * @default Time
   */
  timeIcon: PropTypes.node,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'year'])
    .isRequired,
} as any;

export { DateTimeRangePickerTabs };
