import * as React from 'react';
import { styled } from '@mui/material/styles';
import { generateUtilityClasses } from '@mui/material';
import { PickersToolbarText } from '../internals/components/PickersToolbarText';
import { PickersToolbar } from '../internals/components/PickersToolbar';
import { PickersToolbarButton } from '../internals/components/PickersToolbarButton';
import { DateTimePickerTabs } from './DateTimePickerTabs';
import { useUtils } from '../internals/hooks/useUtils';
import { WrapperVariantContext } from '../internals/components/wrappers/WrapperVariantContext';
import { BaseToolbarProps } from '../internals/models/props/baseToolbarProps';

const classes = generateUtilityClasses('PrivateDateTimePickerToolbar', ['penIcon']);

const DateTimePickerToolbarRoot = styled(PickersToolbar)({
  paddingLeft: 16,
  paddingRight: 16,
  justifyContent: 'space-around',
  [`& .${classes.penIcon}`]: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

const DateTimePickerToolbarDateContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

const DateTimePickerToolbarTimeContainer = styled('div')({
  display: 'flex',
});

const DateTimePickerToolbarSeparator = styled(PickersToolbarText)({
  margin: '0 4px 0 2px',
  cursor: 'default',
});

/**
 * @ignore - internal component.
 */
export const DateTimePickerToolbar = <TDate extends unknown>(props: BaseToolbarProps<TDate>) => {
  const {
    ampm,
    date,
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
    if (!date) {
      return toolbarPlaceholder;
    }

    if (toolbarFormat) {
      return utils.formatByString(date, toolbarFormat);
    }

    return utils.format(date, 'shortDate');
  }, [date, toolbarFormat, toolbarPlaceholder, utils]);

  return (
    <React.Fragment>
      {wrapperVariant !== 'desktop' && (
        <DateTimePickerToolbarRoot
          toolbarTitle={toolbarTitle}
          penIconClassName={classes.penIcon}
          isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
          toggleMobileKeyboardView={toggleMobileKeyboardView}
          {...other}
          isLandscape={false}
        >
          <DateTimePickerToolbarDateContainer>
            {views.includes('year') && (
              <PickersToolbarButton
                tabIndex={-1}
                variant="subtitle1"
                data-mui-test="datetimepicker-toolbar-year"
                onClick={() => setOpenView('year')}
                selected={openView === 'year'}
                value={date ? utils.format(date, 'year') : '–'}
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
          <DateTimePickerToolbarTimeContainer>
            {views.includes('hours') && (
              <PickersToolbarButton
                variant="h3"
                data-mui-test="hours"
                onClick={() => setOpenView('hours')}
                selected={openView === 'hours'}
                value={date ? formatHours(date) : '--'}
              />
            )}
            {views.includes('minutes') && (
              <React.Fragment>
                <DateTimePickerToolbarSeparator variant="h3" value=":" />
                <PickersToolbarButton
                  variant="h3"
                  data-mui-test="minutes"
                  onClick={() => setOpenView('minutes')}
                  selected={openView === 'minutes'}
                  value={date ? utils.format(date, 'minutes') : '--'}
                />
              </React.Fragment>
            )}
            {views.includes('seconds') && (
              <React.Fragment>
                <DateTimePickerToolbarSeparator variant="h3" value=":" />
                <PickersToolbarButton
                  variant="h3"
                  data-mui-test="seconds"
                  onClick={() => setOpenView('seconds')}
                  selected={openView === 'seconds'}
                  value={date ? utils.format(date, 'seconds') : '--'}
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
