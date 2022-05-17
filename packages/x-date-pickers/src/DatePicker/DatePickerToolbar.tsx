import * as React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { generateUtilityClasses } from '@mui/material';
import { PickersToolbar, pickersToolbarClasses } from '../internals/components/PickersToolbar';
import { useUtils } from '../internals/hooks/useUtils';
import { BaseToolbarProps } from '../internals/models/props/baseToolbarProps';
import { isYearAndMonthViews, isYearOnlyView } from './shared';
import { CalendarPickerView } from '../internals/models';

export const datePickerToolbarClasses = generateUtilityClasses('MuiDatePickerToolbar', [
  'root',
  'title',
]);

const DatePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiDatePickerToolbar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: BaseToolbarProps<any, any> }>({
  [`& .${pickersToolbarClasses.penIconButton}`]: {
    position: 'relative',
    top: 4,
  },
});

const DatePickerToolbarTitle = styled(Typography, {
  name: 'MuiDatePickerToolbar',
  slot: 'Title',
  overridesResolver: (props, styles) => styles.title,
})<{ ownerState: BaseToolbarProps<any, any> }>(({ ownerState }) => ({
  ...(ownerState.isLandscape && {
    margin: 'auto 16px auto auto',
  }),
}));

type DatePickerToolbarComponent = (<TDate>(
  props: BaseToolbarProps<TDate, TDate | null> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

/**
 * @ignore - internal component.
 */
export const DatePickerToolbar = React.forwardRef(function DatePickerToolbar<TDate>(
  props: BaseToolbarProps<TDate, TDate | null>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    parsedValue,
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
    if (!parsedValue) {
      return toolbarPlaceholder;
    }

    if (toolbarFormat) {
      return utils.formatByString(parsedValue, toolbarFormat);
    }

    if (isYearOnlyView(views as CalendarPickerView[])) {
      return utils.format(parsedValue, 'year');
    }

    if (isYearAndMonthViews(views as CalendarPickerView[])) {
      return utils.format(parsedValue, 'month');
    }

    // Little localization hack (Google is doing the same for android native pickers):
    // For english localization it is convenient to include weekday into the date "Mon, Jun 1".
    // For other locales using strings like "June 1", without weekday.
    return /en/.test(utils.getCurrentLocaleCode())
      ? utils.format(parsedValue, 'normalDateWithWeekday')
      : utils.format(parsedValue, 'normalDate');
  }, [parsedValue, toolbarFormat, toolbarPlaceholder, utils, views]);

  const ownerState = props;

  return (
    <DatePickerToolbarRoot
      ref={ref}
      toolbarTitle={toolbarTitle}
      isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
      toggleMobileKeyboardView={toggleMobileKeyboardView}
      isLandscape={isLandscape}
      ownerState={ownerState}
      className={datePickerToolbarClasses.root}
      {...other}
    >
      <DatePickerToolbarTitle
        variant="h4"
        data-mui-test="datepicker-toolbar-date"
        align={isLandscape ? 'left' : 'center'}
        ownerState={ownerState}
        className={datePickerToolbarClasses.title}
      >
        {dateText}
      </DatePickerToolbarTitle>
    </DatePickerToolbarRoot>
  );
}) as DatePickerToolbarComponent;
