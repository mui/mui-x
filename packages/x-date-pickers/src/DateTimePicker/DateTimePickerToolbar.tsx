import * as React from 'react';
import { styled, useThemeProps, useTheme, Theme } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { PickersToolbarText } from '../internals/components/PickersToolbarText';
import { PickersToolbar } from '../internals/components/PickersToolbar';
import { pickersToolbarClasses } from '../internals/components/pickersToolbarClasses';
import { PickersToolbarButton } from '../internals/components/PickersToolbarButton';
import { useLocaleText, useUtils } from '../internals/hooks/useUtils';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../internals/models/props/toolbar';
import {
  DateTimePickerToolbarClasses,
  getDateTimePickerToolbarUtilityClass,
} from './dateTimePickerToolbarClasses';
import { DateOrTimeView } from '../internals/models';

export interface ExportedDateTimePickerToolbarProps extends ExportedBaseToolbarProps {
  ampm?: boolean;
  ampmInClock?: boolean;
}

export interface DateTimePickerToolbarProps<TDate>
  extends ExportedDateTimePickerToolbarProps,
    BaseToolbarProps<TDate | null, DateOrTimeView> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateTimePickerToolbarClasses>;
}

const useUtilityClasses = (ownerState: DateTimePickerToolbarProps<any> & { theme: Theme }) => {
  const { classes, theme } = ownerState;
  const slots = {
    root: ['root'],
    dateContainer: ['dateContainer'],
    timeContainer: ['timeContainer', theme.direction === 'rtl' && 'timeLabelReverse'],
    separator: ['separator'],
  };

  return composeClasses(slots, getDateTimePickerToolbarUtilityClass, classes);
};

const DateTimePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiDateTimePickerToolbar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: DateTimePickerToolbarProps<any> }>(({ theme }) => ({
  paddingLeft: 16,
  paddingRight: 16,
  justifyContent: 'space-around',
  position: 'relative',
  [`& .${pickersToolbarClasses.penIconButton}`]: {
    position: 'absolute',
    top: 8,
    ...(theme.direction === 'rtl' ? { left: 8 } : { right: 8 }),
  },
}));

const DateTimePickerToolbarDateContainer = styled('div', {
  name: 'MuiDateTimePickerToolbar',
  slot: 'DateContainer',
  overridesResolver: (props, styles) => styles.dateContainer,
})<{ ownerState: DateTimePickerToolbarProps<any> }>({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

const DateTimePickerToolbarTimeContainer = styled('div', {
  name: 'MuiDateTimePickerToolbar',
  slot: 'TimeContainer',
  overridesResolver: (props, styles) => styles.timeContainer,
})<{ ownerState: DateTimePickerToolbarProps<any> }>(({ theme }) => ({
  display: 'flex',
  ...(theme.direction === 'rtl' && {
    flexDirection: 'row-reverse',
  }),
}));

const DateTimePickerToolbarSeparator = styled(PickersToolbarText, {
  name: 'MuiDateTimePickerToolbar',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})<{
  ownerState: DateTimePickerToolbarProps<any>;
}>({
  margin: '0 4px 0 2px',
  cursor: 'default',
});

/**
 * @ignore - internal component.
 */
export function DateTimePickerToolbar<TDate extends unknown>(
  inProps: DateTimePickerToolbarProps<TDate>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateTimePickerToolbar' });
  const {
    ampm,
    value,
    isMobileKeyboardViewOpen,
    onChange,
    view,
    onViewChange,
    toggleMobileKeyboardView,
    toolbarFormat,
    toolbarPlaceholder = '––',
    views,
    ...other
  } = props;
  const ownerState = props;
  const utils = useUtils<TDate>();
  const localeText = useLocaleText<TDate>();
  const theme = useTheme();
  const classes = useUtilityClasses({ ...ownerState, theme });

  const formatHours = (time: TDate) =>
    ampm ? utils.format(time, 'hours12h') : utils.format(time, 'hours24h');

  const dateText = React.useMemo(() => {
    if (!value) {
      return toolbarPlaceholder;
    }

    if (toolbarFormat) {
      return utils.formatByString(value, toolbarFormat);
    }

    return utils.format(value, 'shortDate');
  }, [value, toolbarFormat, toolbarPlaceholder, utils]);

  return (
    <DateTimePickerToolbarRoot
      toolbarTitle={localeText.dateTimePickerToolbarTitle}
      isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
      toggleMobileKeyboardView={toggleMobileKeyboardView}
      className={classes.root}
      {...other}
      ownerState={ownerState}
    >
      <DateTimePickerToolbarDateContainer className={classes.dateContainer} ownerState={ownerState}>
        {views.includes('year') && (
          <PickersToolbarButton
            tabIndex={-1}
            variant="subtitle1"
            data-mui-test="datetimepicker-toolbar-year"
            onClick={() => onViewChange('year')}
            selected={view === 'year'}
            value={value ? utils.format(value, 'year') : '–'}
          />
        )}
        {views.includes('day') && (
          <PickersToolbarButton
            tabIndex={-1}
            variant="h4"
            data-mui-test="datetimepicker-toolbar-day"
            onClick={() => onViewChange('day')}
            selected={view === 'day'}
            value={dateText}
          />
        )}
      </DateTimePickerToolbarDateContainer>
      <DateTimePickerToolbarTimeContainer className={classes.timeContainer} ownerState={ownerState}>
        {views.includes('hours') && (
          <PickersToolbarButton
            variant="h3"
            data-mui-test="hours"
            onClick={() => onViewChange('hours')}
            selected={view === 'hours'}
            value={value ? formatHours(value) : '--'}
          />
        )}
        {views.includes('minutes') && (
          <React.Fragment>
            <DateTimePickerToolbarSeparator
              variant="h3"
              value=":"
              className={classes.separator}
              ownerState={ownerState}
            />
            <PickersToolbarButton
              variant="h3"
              data-mui-test="minutes"
              onClick={() => onViewChange('minutes')}
              selected={view === 'minutes'}
              value={value ? utils.format(value, 'minutes') : '--'}
            />
          </React.Fragment>
        )}
        {views.includes('seconds') && (
          <React.Fragment>
            <DateTimePickerToolbarSeparator
              variant="h3"
              value=":"
              className={classes.separator}
              ownerState={ownerState}
            />
            <PickersToolbarButton
              variant="h3"
              data-mui-test="seconds"
              onClick={() => onViewChange('seconds')}
              selected={view === 'seconds'}
              value={value ? utils.format(value, 'seconds') : '--'}
            />
          </React.Fragment>
        )}
      </DateTimePickerToolbarTimeContainer>
    </DateTimePickerToolbarRoot>
  );
}
