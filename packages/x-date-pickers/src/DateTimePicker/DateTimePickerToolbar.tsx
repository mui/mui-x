import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { PickersToolbarText } from '../internals/components/PickersToolbarText';
import { PickersToolbar } from '../internals/components/PickersToolbar';
import { pickersToolbarClasses } from '../internals/components/pickersToolbarClasses';
import { PickersToolbarButton } from '../internals/components/PickersToolbarButton';
import { useLocaleText, useUtils } from '../internals/hooks/useUtils';
import { BaseToolbarProps } from '../internals/models/props/baseToolbarProps';
import {
  DateTimePickerToolbarClasses,
  getDateTimePickerToolbarUtilityClass,
} from './dateTimePickerToolbarClasses';

export interface DateTimePickerToolbarProps<TDate> extends BaseToolbarProps<TDate, TDate | null> {
  classes?: Partial<DateTimePickerToolbarClasses>;
}

const useUtilityClasses = (ownerState: DateTimePickerToolbarProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    dateContainer: ['dateContainer'],
    timeContainer: ['timeContainer'],
    separator: ['separator'],
  };

  return composeClasses(slots, getDateTimePickerToolbarUtilityClass, classes);
};

const DateTimePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiDateTimePickerToolbar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: DateTimePickerToolbarProps<any> }>({
  paddingLeft: 16,
  paddingRight: 16,
  justifyContent: 'space-around',
  [`& .${pickersToolbarClasses.penIconButton}`]: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

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
})<{ ownerState: DateTimePickerToolbarProps<any> }>({
  display: 'flex',
});

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
    parsedValue,
    isMobileKeyboardViewOpen,
    onChange,
    openView,
    setOpenView,
    toggleMobileKeyboardView,
    toolbarFormat,
    toolbarPlaceholder = '––',
    toolbarTitle: toolbarTitleProp,
    views,
    ...other
  } = props;
  const ownerState = props;
  const utils = useUtils<TDate>();
  const localeText = useLocaleText();
  const classes = useUtilityClasses(ownerState);

  const toolbarTitle = toolbarTitleProp ?? localeText.dateTimePickerDefaultToolbarTitle;

  const formatHours = (time: TDate) =>
    ampm ? utils.format(time, 'hours12h') : utils.format(time, 'hours24h');

  const dateText = React.useMemo(() => {
    if (!parsedValue) {
      return toolbarPlaceholder;
    }

    if (toolbarFormat) {
      return utils.formatByString(parsedValue, toolbarFormat);
    }

    return utils.format(parsedValue, 'shortDate');
  }, [parsedValue, toolbarFormat, toolbarPlaceholder, utils]);

  return (
    <DateTimePickerToolbarRoot
      toolbarTitle={toolbarTitle}
      isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
      toggleMobileKeyboardView={toggleMobileKeyboardView}
      className={classes.root}
      {...other}
      isLandscape={false}
      ownerState={ownerState}
    >
      <DateTimePickerToolbarDateContainer className={classes.dateContainer} ownerState={ownerState}>
        {views.includes('year') && (
          <PickersToolbarButton
            tabIndex={-1}
            variant="subtitle1"
            data-mui-test="datetimepicker-toolbar-year"
            onClick={() => setOpenView('year')}
            selected={openView === 'year'}
            value={parsedValue ? utils.format(parsedValue, 'year') : '–'}
          />
        )}
        {views.includes('day') && (
          <PickersToolbarButton
            tabIndex={-1}
            variant="h4"
            data-mui-test="datetimepicker-toolbar-day"
            onClick={() => setOpenView('day')}
            selected={openView === 'day'}
            value={dateText}
          />
        )}
      </DateTimePickerToolbarDateContainer>
      <DateTimePickerToolbarTimeContainer className={classes.timeContainer} ownerState={ownerState}>
        {views.includes('hours') && (
          <PickersToolbarButton
            variant="h3"
            data-mui-test="hours"
            onClick={() => setOpenView('hours')}
            selected={openView === 'hours'}
            value={parsedValue ? formatHours(parsedValue) : '--'}
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
              onClick={() => setOpenView('minutes')}
              selected={openView === 'minutes'}
              value={parsedValue ? utils.format(parsedValue, 'minutes') : '--'}
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
              onClick={() => setOpenView('seconds')}
              selected={openView === 'seconds'}
              value={parsedValue ? utils.format(parsedValue, 'seconds') : '--'}
            />
          </React.Fragment>
        )}
      </DateTimePickerToolbarTimeContainer>
    </DateTimePickerToolbarRoot>
  );
}
