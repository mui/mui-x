'use client';
import * as React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { PickersToolbarText } from '../internals/components/PickersToolbarText';
import { PickersToolbarButton } from '../internals/components/PickersToolbarButton';
import { PickersToolbar } from '../internals/components/PickersToolbar';
import { arrayIncludes } from '../internals/utils/utils';
import { usePickerTranslations } from '../hooks/usePickerTranslations';
import { useNow, useUtils } from '../internals/hooks/useUtils';
import { useMeridiemMode } from '../internals/hooks/date-helpers-hooks';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../internals/models/props/toolbar';
import {
  getTimePickerToolbarUtilityClass,
  timePickerToolbarClasses,
  TimePickerToolbarClasses,
} from './timePickerToolbarClasses';
import { PickerValue, TimeViewWithMeridiem } from '../internals/models';
import { formatMeridiem } from '../internals/utils/date-utils';
import { AdapterFormats, PickerValidDate } from '../models';
import { usePickerContext } from '../hooks';
import {
  PickerToolbarOwnerState,
  useToolbarOwnerState,
} from '../internals/hooks/useToolbarOwnerState';
import { createIsAfterIgnoreDatePart } from '../internals/utils/time-utils';
import { singleItemValueManager } from '../internals/utils/valueManagers';
import { useClockReferenceDate } from '../internals/hooks/useClockReferenceDate';
import { useControlledValueWithTimezone } from '../internals/hooks/useValueWithTimezone';

export interface TimePickerToolbarProps
  extends BaseToolbarProps,
    ExportedTimePickerToolbarProps {
  ampm?: boolean;
  ampmInClock?: boolean;
  minTime?: PickerValidDate;
  maxTime?: PickerValidDate;
  disablePast?: boolean;
  disableFuture?: boolean;
  referenceDate?: PickerValidDate;
  defaultValue?: PickerValidDate;
  timezone: string;
  disableIgnoringDatePartForTimeValidation?: boolean;
}

export interface ExportedTimePickerToolbarProps extends ExportedBaseToolbarProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TimePickerToolbarClasses>;
}

const useUtilityClasses = (
  classes: Partial<TimePickerToolbarClasses> | undefined,
  ownerState: PickerToolbarOwnerState,
) => {
  const { pickerOrientation, toolbarDirection } = ownerState;

  const slots = {
    root: ['root'],
    separator: ['separator'],
    hourMinuteLabel: [
      'hourMinuteLabel',
      pickerOrientation === 'landscape' && 'hourMinuteLabelLandscape',
      toolbarDirection === 'rtl' && 'hourMinuteLabelReverse',
    ],
    ampmSelection: ['ampmSelection', pickerOrientation === 'landscape' && 'ampmLandscape'],
    ampmLabel: ['ampmLabel'],
  };

  return composeClasses(slots, getTimePickerToolbarUtilityClass, classes);
};

const TimePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiTimePickerToolbar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{
  ownerState: PickerToolbarOwnerState;
}>({});

const TimePickerToolbarSeparator = styled(PickersToolbarText, {
  name: 'MuiTimePickerToolbar',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})({
  outline: 0,
  margin: '0 4px 0 2px',
  cursor: 'default',
});

const TimePickerToolbarHourMinuteLabel = styled('div', {
  name: 'MuiTimePickerToolbar',
  slot: 'HourMinuteLabel',
  overridesResolver: (props, styles) => [
    {
      [`&.${timePickerToolbarClasses.hourMinuteLabelLandscape}`]: styles.hourMinuteLabelLandscape,
      [`&.${timePickerToolbarClasses.hourMinuteLabelReverse}`]: styles.hourMinuteLabelReverse,
    },
    styles.hourMinuteLabel,
  ],
})<{
  ownerState: PickerToolbarOwnerState;
}>({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  variants: [
    {
      props: { toolbarDirection: 'rtl' },
      style: {
        flexDirection: 'row-reverse',
      },
    },
    {
      props: { pickerOrientation: 'landscape' },
      style: {
        marginTop: 'auto',
      },
    },
  ],
});

const TimePickerToolbarAmPmSelection = styled('div', {
  name: 'MuiTimePickerToolbar',
  slot: 'AmPmSelection',
  overridesResolver: (props, styles) => [
    { [`.${timePickerToolbarClasses.ampmLabel}`]: styles.ampmLabel },
    { [`&.${timePickerToolbarClasses.ampmLandscape}`]: styles.ampmLandscape },
    styles.ampmSelection,
  ],
})<{
  ownerState: PickerToolbarOwnerState;
}>({
  display: 'flex',
  flexDirection: 'column',
  marginRight: 'auto',
  marginLeft: 12,
  [`& .${timePickerToolbarClasses.ampmLabel}`]: {
    fontSize: 17,
  },
  variants: [
    {
      props: { pickerOrientation: 'landscape' },
      style: {
        margin: '4px 0 auto',
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexBasis: '100%',
      },
    },
  ],
});

/**
 * Demos:
 *
 * - [TimePicker](https://mui.com/x/react-date-pickers/time-picker/)
 * - [Custom components](https://mui.com/x/react-date-pickers/custom-components/)
 *
 * API:
 *
 * - [TimePickerToolbar API](https://mui.com/x/api/date-pickers/time-picker-toolbar/)
 */
function TimePickerToolbar(inProps: TimePickerToolbarProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiTimePickerToolbar' });
  const {
    ampm,
    ampmInClock,
    className,
    classes: classesProp,
    maxTime,
    minTime,
    disablePast,
    disableFuture,
    referenceDate: referenceDateProp,
    defaultValue,
    timezone,
    disableIgnoringDatePartForTimeValidation = false,
    ...other
  } = props;
  const utils = useUtils();
  const translations = usePickerTranslations();
  const ownerState = useToolbarOwnerState();
  const classes = useUtilityClasses(classesProp, ownerState);
  const { value, setValue, disabled, readOnly, view, setView, views } = usePickerContext<
    PickerValue,
    TimeViewWithMeridiem
  >();

  const showAmPmControl = Boolean(ampm && !ampmInClock && views.includes('hours'));

  const valueOrReferenceDate = useClockReferenceDate({
    value,
    referenceDate: referenceDateProp,
    utils,
    props,
    timezone,
  });
  const now = useNow(timezone);
  const isDisableTime = (time: number) => {
    const isAfter = createIsAfterIgnoreDatePart(disableIgnoringDatePartForTimeValidation, utils);
    const start = utils.setSeconds(
      utils.setMinutes(utils.setHours(utils.startOfDay(valueOrReferenceDate), time), 0),
      0,
    );
    const end = utils.addSeconds(utils.addMinutes(utils.addHours(start, 11), 59), 59);
    if (minTime && isAfter(minTime, end)) {
      return false;
    }

    if (maxTime && isAfter(start, maxTime)) {
      return false;
    }

    if (disableFuture && isAfter(start, now)) {
      return false;
    }

    if (disablePast && isAfter(now, end)) {
      return false;
    }

    return true;
  };
  const { meridiemMode, handleMeridiemChange } = useMeridiemMode(value, ampm, (newValue) =>
    setValue(newValue, { changeImportance: 'set' }),
  );

  const formatSection = (format: keyof AdapterFormats) => {
    if (!utils.isValid(value)) {
      return '--';
    }

    return utils.format(value, format);
  };

  const separator = (
    <TimePickerToolbarSeparator
      tabIndex={-1}
      value=":"
      variant="h3"
      selected={false}
      className={classes.separator}
    />
  );

  return (
    <TimePickerToolbarRoot
      landscapeDirection="row"
      toolbarTitle={translations.timePickerToolbarTitle}
      ownerState={ownerState}
      className={clsx(classes.root, className)}
      {...other}
    >
      <TimePickerToolbarHourMinuteLabel className={classes.hourMinuteLabel} ownerState={ownerState}>
        {arrayIncludes(views, 'hours') && (
          <PickersToolbarButton
            data-testid="hours"
            tabIndex={-1}
            variant="h3"
            onClick={() => setView('hours')}
            selected={view === 'hours'}
            value={formatSection(ampm ? 'hours12h' : 'hours24h')}
          />
        )}

        {arrayIncludes(views, ['hours', 'minutes']) && separator}
        {arrayIncludes(views, 'minutes') && (
          <PickersToolbarButton
            data-testid="minutes"
            tabIndex={-1}
            variant="h3"
            onClick={() => setView('minutes')}
            selected={view === 'minutes'}
            value={formatSection('minutes')}
          />
        )}

        {arrayIncludes(views, ['minutes', 'seconds']) && separator}
        {arrayIncludes(views, 'seconds') && (
          <PickersToolbarButton
            data-testid="seconds"
            variant="h3"
            onClick={() => setView('seconds')}
            selected={view === 'seconds'}
            value={formatSection('seconds')}
          />
        )}
      </TimePickerToolbarHourMinuteLabel>
      {showAmPmControl && (
        <TimePickerToolbarAmPmSelection className={classes.ampmSelection} ownerState={ownerState}>
          <PickersToolbarButton
            disableRipple
            variant="subtitle2"
            data-testid="toolbar-am-btn"
            selected={meridiemMode === 'am'}
            typographyClassName={classes.ampmLabel}
            value={formatMeridiem(utils, 'am')}
            onClick={readOnly ? undefined : () => handleMeridiemChange('am')}
            disabled={disabled || !isDisableTime(0)}
          />
          <PickersToolbarButton
            disableRipple
            variant="subtitle2"
            data-testid="toolbar-pm-btn"
            selected={meridiemMode === 'pm'}
            typographyClassName={classes.ampmLabel}
            value={formatMeridiem(utils, 'pm')}
            onClick={readOnly ? undefined : () => handleMeridiemChange('pm')}
            disabled={disabled || !isDisableTime(12)}
          />
        </TimePickerToolbarAmPmSelection>
      )}
    </TimePickerToolbarRoot>
  );
}

TimePickerToolbar.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  ampm: PropTypes.bool,
  ampmInClock: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  defaultValue: PropTypes.object,
  disableFuture: PropTypes.bool,
  disableIgnoringDatePartForTimeValidation: PropTypes.bool,
  disablePast: PropTypes.bool,
  /**
   * If `true`, show the toolbar even in desktop mode.
   * @default `true` for Desktop, `false` for Mobile.
   */
  hidden: PropTypes.bool,
  maxTime: PropTypes.object,
  minTime: PropTypes.object,
  referenceDate: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  timezone: PropTypes.string,
  titleId: PropTypes.string,
  /**
   * Toolbar date format.
   */
  toolbarFormat: PropTypes.string,
  /**
   * Toolbar value placeholder—it is displayed when the value is empty.
   * @default "––"
   */
  toolbarPlaceholder: PropTypes.node,
} as any;

export { TimePickerToolbar };
