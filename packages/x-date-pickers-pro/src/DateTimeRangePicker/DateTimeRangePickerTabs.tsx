import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import useEventCallback from '@mui/utils/useEventCallback';
import { TimeIcon, DateRangeIcon, ArrowLeftIcon, ArrowRightIcon } from '@mui/x-date-pickers/icons';
import { DateOrTimeViewWithMeridiem } from '@mui/x-date-pickers/internals/models';
import { useLocaleText } from '@mui/x-date-pickers/internals/hooks/useUtils';
import {
  BaseTabsProps,
  ExportedBaseTabsProps,
} from '@mui/x-date-pickers/internals/models/props/tabs';
import { isDatePickerView } from '@mui/x-date-pickers/internals/utils/date-utils';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {
  DateTimeRangePickerTabsClasses,
  getDateTimeRangePickerTabsUtilityClass,
} from './dateTimeRangePickerTabsClasses';
import { UseRangePositionResponse } from '../internals/hooks/useRangePosition';
import { RangePosition } from '../internals/models';

type TabValue = 'start-date' | 'start-time' | 'end-date' | 'end-time';

const viewToTab = (view: DateOrTimeViewWithMeridiem, rangePosition: RangePosition): TabValue => {
  if (isDatePickerView(view)) {
    return rangePosition === 'start' ? 'start-date' : 'end-date';
  }

  return rangePosition === 'start' ? 'start-time' : 'end-time';
};

const tabToView = (tab: TabValue): DateOrTimeViewWithMeridiem => {
  if (tab === 'start-date' || tab === 'end-date') {
    return 'day';
  }

  return 'hours';
};

export interface ExportedDateTimeRangePickerTabsProps extends ExportedBaseTabsProps {
  /**
   * Toggles visibility of the tabs allowing view switching.
   * @default `window.innerHeight < 667` for `DesktopDateTimeRangePicker` and `MobileDateTimeRangePicker`, `displayStaticWrapperAs === 'desktop'` for `StaticDateTimeRangePicker`
   */
  hidden?: boolean;
  /**
   * Date tab icon.
   * @default DateRangeIcon
   */
  dateIcon?: React.ReactElement;
  /**
   * Time tab icon.
   * @default TimeIcon
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
    tabButton: ['tabButton'],
    navigationButton: ['navigationButton'],
    filler: ['filler'],
  };

  return composeClasses(slots, getDateTimeRangePickerTabsUtilityClass, classes);
};

const DateTimeRangePickerTabsRoot = styled('div', {
  name: 'MuiDateTimeRangePickerTabs',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: DateTimeRangePickerTabsProps }>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: `0 -1px 0 0 inset ${(theme.vars || theme).palette.divider}`,
}));

const DateTimeRangePickerTab = styled(Button, {
  name: 'MuiDateTimeRangePickerTabs',
  slot: 'TabButton',
  overridesResolver: (_, styles) => styles.tabButton,
})({
  textTransform: 'none',
});

const DateTimeRangePickerTabFiller = styled('div', {
  name: 'MuiDateTimeRangePickerTabs',
  slot: 'Filler',
  overridesResolver: (_, styles) => styles.filler,
})({ width: 40 });

const tabOptions: TabValue[] = ['start-date', 'start-time', 'end-date', 'end-time'];

const resolveTabLabel = (tab: TabValue) => {
  switch (tab) {
    case 'start-date':
      return 'Start date';
    case 'start-time':
      return 'Start time';
    case 'end-date':
      return 'End date';
    case 'end-time':
      return 'End time';
    default:
      return '';
  }
};

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
  const value = React.useMemo(() => viewToTab(view, rangePosition), [view, rangePosition]);
  const isPreviousHidden = React.useMemo(() => value === 'start-date', [value]);
  const isNextHidden = React.useMemo(() => value === 'end-time', [value]);

  const handleRangePositionChange = useEventCallback((newTab: TabValue) => {
    if (newTab.includes('start')) {
      onRangePositionChange('start');
    } else {
      onRangePositionChange('end');
    }
  });

  const changeToPreviousTab = useEventCallback(() => {
    const previousTab = tabOptions[tabOptions.findIndex((option) => option === value) - 1];
    onViewChange(tabToView(previousTab));
    handleRangePositionChange(previousTab);
  });

  const changeToNextTab = useEventCallback(() => {
    const nextTab = tabOptions[tabOptions.findIndex((option) => option === value) + 1];
    onViewChange(tabToView(nextTab));
    handleRangePositionChange(nextTab);
  });

  if (hidden) {
    return null;
  }

  return (
    <DateTimeRangePickerTabsRoot ownerState={props} className={classes.root}>
      {!isPreviousHidden ? (
        <IconButton onClick={changeToPreviousTab} className={classes.navigationButton}>
          <ArrowLeftIcon />
        </IconButton>
      ) : (
        <DateTimeRangePickerTabFiller className={classes.filler} />
      )}
      <DateTimeRangePickerTab
        aria-label={localeText.dateTableLabel}
        startIcon={value === 'start-date' || value === 'end-date' ? dateIcon : timeIcon}
        className={classes.tabButton}
        size="large"
      >
        {resolveTabLabel(value)}
      </DateTimeRangePickerTab>
      {!isNextHidden ? (
        <IconButton onClick={changeToNextTab} className={classes.navigationButton}>
          <ArrowRightIcon />
        </IconButton>
      ) : (
        <DateTimeRangePickerTabFiller className={classes.filler} />
      )}
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
