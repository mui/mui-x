'use client';
import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import useEventCallback from '@mui/utils/useEventCallback';
import { TimeIcon, DateRangeIcon, ArrowLeftIcon, ArrowRightIcon } from '@mui/x-date-pickers/icons';
import {
  DateOrTimeViewWithMeridiem,
  ExportedBaseTabsProps,
  isDatePickerView,
  usePickerPrivateContext,
} from '@mui/x-date-pickers/internals';
import { PickerOwnerState } from '@mui/x-date-pickers/models';
import { usePickerContext, usePickerTranslations } from '@mui/x-date-pickers/hooks';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {
  DateTimeRangePickerTabsClasses,
  getDateTimeRangePickerTabsUtilityClass,
} from './dateTimeRangePickerTabsClasses';
import { RangePosition } from '../models';
import { usePickerRangePositionContext } from '../hooks';

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
  dateIcon?: React.ReactElement<any>;
  /**
   * Time tab icon.
   * @default TimeIcon
   */
  timeIcon?: React.ReactElement<any>;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateTimeRangePickerTabsClasses>;
}

export interface DateTimeRangePickerTabsProps extends ExportedDateTimeRangePickerTabsProps {}

const useUtilityClasses = (classes: Partial<DateTimeRangePickerTabsClasses> | undefined) => {
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
})<{ ownerState: PickerOwnerState }>(({ theme }) => ({
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

const DateTimeRangePickerTabs = function DateTimeRangePickerTabs(
  inProps: DateTimeRangePickerTabsProps,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateTimeRangePickerTabs' });
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
  const { view, onViewChange } = usePickerContext();
  const classes = useUtilityClasses(classesProp);
  const { rangePosition, onRangePositionChange } = usePickerRangePositionContext();

  const value = React.useMemo(
    () => (view == null ? null : viewToTab(view, rangePosition)),
    [view, rangePosition],
  );
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
    const previousTab = value == null ? tabOptions[0] : tabOptions[tabOptions.indexOf(value) - 1];
    onViewChange(tabToView(previousTab));
    handleRangePositionChange(previousTab);
  });

  const changeToNextTab = useEventCallback(() => {
    const nextTab = value == null ? tabOptions[0] : tabOptions[tabOptions.indexOf(value) + 1];
    onViewChange(tabToView(nextTab));
    handleRangePositionChange(nextTab);
  });

  if (hidden) {
    return null;
  }

  let startIcon: React.ReactNode;
  if (view == null) {
    startIcon = null;
  } else if (isDatePickerView(view)) {
    startIcon = dateIcon;
  } else {
    startIcon = timeIcon;
  }

  return (
    <DateTimeRangePickerTabsRoot
      ownerState={ownerState}
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

      <DateTimeRangePickerTab startIcon={startIcon} className={classes.tabButton} size="large">
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
} as any;

export { DateTimeRangePickerTabs };
