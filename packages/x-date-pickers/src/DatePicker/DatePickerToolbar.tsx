import * as React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { generateUtilityClasses } from '@mui/material';
import { PickersToolbar } from '../internals/components/PickersToolbar';
import { useUtils } from '../internals/hooks/useUtils';
import { BaseToolbarProps } from '../internals/models/props/baseToolbarProps';
import { isYearAndMonthViews, isYearOnlyView } from './shared';
import { CalendarPickerView } from '../internals/models';

const classes = generateUtilityClasses('PrivateDatePickerToolbar', ['penIcon']);

const DatePickerToolbarRoot = styled(PickersToolbar)<{ ownerState: any }>({
  [`& .${classes.penIcon}`]: {
    position: 'relative',
    top: 4,
  },
});

const DatePickerToolbarTitle = styled(Typography)<{ ownerState: any }>(({ ownerState }) => ({
  ...(ownerState.isLandscape && {
    margin: 'auto 16px auto auto',
  }),
}));

type DatePickerToolbarComponent = (<TDate>(
  props: BaseToolbarProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

/**
 * @ignore - internal component.
 */
export const DatePickerToolbar = React.forwardRef(function DatePickerToolbar<TDate>(
  props: BaseToolbarProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    date,
    isLandscape,
    isMobileKeyboardViewOpen,
    onChange,
    toggleMobileKeyboardView,
    toolbarFormat,
    toolbarPlaceholder = '––',
    toolbarTitle = 'Select date',
    views,
    ...other
  } = props;
  const utils = useUtils<TDate>();

  const dateText = React.useMemo(() => {
    if (!date) {
      return toolbarPlaceholder;
    }

    if (toolbarFormat) {
      return utils.formatByString(date, toolbarFormat);
    }

    if (isYearOnlyView(views as CalendarPickerView[])) {
      return utils.format(date, 'year');
    }

    if (isYearAndMonthViews(views as CalendarPickerView[])) {
      return utils.format(date, 'month');
    }

    // Little localization hack (Google is doing the same for android native pickers):
    // For english localization it is convenient to include weekday into the date "Mon, Jun 1".
    // For other locales using strings like "June 1", without weekday.
    return /en/.test(utils.getCurrentLocaleCode())
      ? utils.format(date, 'normalDateWithWeekday')
      : utils.format(date, 'normalDate');
  }, [date, toolbarFormat, toolbarPlaceholder, utils, views]);

  const ownerState = props;

  return (
    <DatePickerToolbarRoot
      ref={ref}
      toolbarTitle={toolbarTitle}
      isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
      toggleMobileKeyboardView={toggleMobileKeyboardView}
      isLandscape={isLandscape}
      penIconClassName={classes.penIcon}
      ownerState={ownerState}
      {...other}
    >
      <DatePickerToolbarTitle
        variant="h4"
        data-mui-test="datepicker-toolbar-date"
        align={isLandscape ? 'left' : 'center'}
        ownerState={ownerState}
      >
        {dateText}
      </DatePickerToolbarTitle>
    </DatePickerToolbarRoot>
  );
}) as DatePickerToolbarComponent;
