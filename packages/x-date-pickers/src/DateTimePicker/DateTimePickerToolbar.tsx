import * as React from 'react';
import { styled } from '@mui/material/styles';
import { generateUtilityClasses } from '@mui/material';
import { PickersToolbarText } from '../internals/components/PickersToolbarText';
import { PickersToolbar, pickersToolbarClasses } from '../internals/components/PickersToolbar';
import { PickersToolbarButton } from '../internals/components/PickersToolbarButton';
import { DateTimePickerTabs } from './DateTimePickerTabs';
import { useUtils } from '../internals/hooks/useUtils';
import { WrapperVariantContext } from '../internals/components/wrappers/WrapperVariantContext';
import { BaseToolbarProps } from '../internals/models/props/baseToolbarProps';

export const dateTimePickerToolbarClasses = generateUtilityClasses('MuiDateTimePickerToolbar', [
  'root',
  'dateContainer',
  'timeContainer',
  'separator',
]);

const DateTimePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiDateTimePickerToolbar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: BaseToolbarProps<any, any> }>({
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
})<{ ownerState: BaseToolbarProps<any, any> }>({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

const DateTimePickerToolbarTimeContainer = styled('div', {
  name: 'MuiDateTimePickerToolbar',
  slot: 'TimeContainer',
  overridesResolver: (props, styles) => styles.timeContainer,
})<{ ownerState: BaseToolbarProps<any, any> }>({
  display: 'flex',
});

const DateTimePickerToolbarSeparator = styled(PickersToolbarText, {
  name: 'MuiDateTimePickerToolbar',
  slot: 'Separator',
  overridesResolver: (props, styles) => styles.separator,
})<{
  ownerState: BaseToolbarProps<any, any>;
}>({
  margin: '0 4px 0 2px',
  cursor: 'default',
});

/**
 * @ignore - internal component.
 */
export const DateTimePickerToolbar = <TDate extends unknown>(
  props: BaseToolbarProps<TDate, TDate | null>,
) => {
  const {
    ampm,
    parsedValue,
    dateRangeIcon,
    hideTabs,
    isMobileKeyboardViewOpen,
    onChange,
    openView,
    setOpenView,
    timeIcon,
    toggleMobileKeyboardView,
    toolbarFormat,
    toolbarPlaceholder = '––',
    toolbarTitle = 'Select date & time',
    views,
    ...other
  } = props;
  const utils = useUtils<TDate>();
  const wrapperVariant = React.useContext(WrapperVariantContext);
  const showTabs =
    wrapperVariant === 'desktop'
      ? true
      : !hideTabs && typeof window !== 'undefined' && window.innerHeight > 667;

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

  const ownerState = props;

  return (
    <React.Fragment>
      {wrapperVariant !== 'desktop' && (
        <DateTimePickerToolbarRoot
          toolbarTitle={toolbarTitle}
          isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
          toggleMobileKeyboardView={toggleMobileKeyboardView}
          className={dateTimePickerToolbarClasses.root}
          {...other}
          isLandscape={false}
          ownerState={ownerState}
        >
          <DateTimePickerToolbarDateContainer
            className={dateTimePickerToolbarClasses.dateContainer}
            ownerState={ownerState}
          >
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
          <DateTimePickerToolbarTimeContainer
            className={dateTimePickerToolbarClasses.timeContainer}
            ownerState={ownerState}
          >
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
                  className={dateTimePickerToolbarClasses.separator}
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
                  className={dateTimePickerToolbarClasses.separator}
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
      )}
      {showTabs && (
        <DateTimePickerTabs
          dateRangeIcon={dateRangeIcon}
          timeIcon={timeIcon}
          view={openView}
          onChange={setOpenView}
        />
      )}
    </React.Fragment>
  );
};
