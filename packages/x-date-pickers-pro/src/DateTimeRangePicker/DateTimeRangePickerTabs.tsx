import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import useEventCallback from '@mui/utils/useEventCallback';
import { TimeIcon, DateRangeIcon, ArrowLeftIcon, ArrowRightIcon } from '@mui/x-date-pickers/icons';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  DateOrTimeViewWithMeridiem,
  BaseTabsProps,
  ExportedBaseTabsProps,
  isDatePickerView,
} from '@mui/x-date-pickers/internals';
import { usePickersTranslations } from '@mui/x-date-pickers/hooks';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {
  DateTimeRangePickerTabsClasses,
  getDateTimeRangePickerTabsUtilityClass,
} from './dateTimeRangePickerTabsClasses';
import { UseRangePositionResponse } from '../internals/hooks/useRangePosition';
import { RangePosition } from '../models';

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
   * @default `window.innerHeight < 667` for `DesktopDateTimeRangePicker` and `MobileDateTimeRangePicker`
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
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateTimeRangePickerTabsClasses>;
}

export interface DateTimeRangePickerTabsProps
  extends ExportedDateTimeRangePickerTabsProps,
    BaseTabsProps<DateOrTimeViewWithMeridiem>,
    Pick<UseRangePositionResponse, 'rangePosition' | 'onRangePositionChange'> {}

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
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  minHeight: 48,
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

const DateTimeRangePickerTabs = function DateTimeRangePickerTabs<TDate extends PickerValidDate>(
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
    className,
    sx,
  } = props;

  const translations = usePickersTranslations<TDate>();
  const classes = useUtilityClasses(props);
  const value = React.useMemo(() => viewToTab(view, rangePosition), [view, rangePosition]);
  const isPreviousHidden = value === 'start-date';
  const isNextHidden = value === 'end-time';
  const tabLabel = React.useMemo(() => {
    switch (value) {
      case 'start-date':
        return translations.startDate;
      case 'start-time':
        return translations.startTime;
      case 'end-date':
        return translations.endDate;
      case 'end-time':
        return translations.endTime;
      default:
        return '';
    }
  }, [
    translations.endDate,
    translations.endTime,
    translations.startDate,
    translations.startTime,
    value,
  ]);

  const handleRangePositionChange = useEventCallback((newTab: TabValue) => {
    if (newTab.includes('start')) {
      onRangePositionChange('start');
    } else {
      onRangePositionChange('end');
    }
  });

  const changeToPreviousTab = useEventCallback(() => {
    const previousTab = tabOptions[tabOptions.indexOf(value) - 1];
    onViewChange(tabToView(previousTab));
    handleRangePositionChange(previousTab);
  });

  const changeToNextTab = useEventCallback(() => {
    const nextTab = tabOptions[tabOptions.indexOf(value) + 1];
    onViewChange(tabToView(nextTab));
    handleRangePositionChange(nextTab);
  });

  if (hidden) {
    return null;
  }

  return (
    <DateTimeRangePickerTabsRoot
      ownerState={props}
      className={clsx(classes.root, className)}
      sx={sx}
    >
      {!isPreviousHidden ? (
        <IconButton
          onClick={changeToPreviousTab}
          className={classes.navigationButton}
          title={translations.openPreviousView}
        >
          <ArrowLeftIcon />
        </IconButton>
      ) : (
        <DateTimeRangePickerTabFiller className={classes.filler} />
      )}

      <DateTimeRangePickerTab
        startIcon={isDatePickerView(view) ? dateIcon : timeIcon}
        className={classes.tabButton}
        size="large"
      >
        {tabLabel}
      </DateTimeRangePickerTab>
      {!isNextHidden ? (
        <IconButton
          onClick={changeToNextTab}
          className={classes.navigationButton}
          title={translations.openNextView}
        >
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
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Date tab icon.
   * @default DateRangeIcon
   */
  dateIcon: PropTypes.element,
  /**
   * Toggles visibility of the tabs allowing view switching.
   * @default `window.innerHeight < 667` for `DesktopDateTimeRangePicker` and `MobileDateTimeRangePicker`
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
   * @default TimeIcon
   */
  timeIcon: PropTypes.element,
  /**
   * Currently visible picker view.
   */
  view: PropTypes.oneOf(['day', 'hours', 'meridiem', 'minutes', 'month', 'seconds', 'year'])
    .isRequired,
} as any;

export { DateTimeRangePickerTabs };
