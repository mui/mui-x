import * as React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { generateUtilityClasses } from '@mui/material';
import {
  PickersToolbar,
  PickersToolbarButton,
  useUtils,
  BaseToolbarProps,
} from '@mui/x-date-pickers/internals';
import { DateRange, CurrentlySelectingRangeEndProps } from '../internal/models';

const classes = generateUtilityClasses('PrivateDateRangePickerToolbar', ['penIcon']);

interface DateRangePickerToolbarProps<TDate>
  extends CurrentlySelectingRangeEndProps,
    Pick<
      BaseToolbarProps<TDate, DateRange<TDate>>,
      | 'isMobileKeyboardViewOpen'
      | 'toggleMobileKeyboardView'
      | 'toolbarTitle'
      | 'toolbarFormat'
      | 'date'
    > {
  startText: React.ReactNode;
  endText: React.ReactNode;
}

const DateRangePickerToolbarRoot = styled(PickersToolbar)({
  [`& .${classes.penIcon}`]: {
    position: 'relative',
    top: 4,
  },
});

const DateRangePickerToolbarContainer = styled('div')({
  display: 'flex',
});

/**
 * @ignore - internal component.
 */
export const DateRangePickerToolbar = <TDate extends unknown>({
  currentlySelectingRangeEnd,
  date: [start, end],
  endText,
  isMobileKeyboardViewOpen,
  setCurrentlySelectingRangeEnd,
  startText,
  toggleMobileKeyboardView,
  toolbarFormat,
  toolbarTitle = 'Select date range',
}: DateRangePickerToolbarProps<TDate>) => {
  const utils = useUtils<TDate>();

  const startDateValue = start
    ? utils.formatByString(start, toolbarFormat || utils.formats.shortDate)
    : startText;

  const endDateValue = end
    ? utils.formatByString(end, toolbarFormat || utils.formats.shortDate)
    : endText;

  return (
    <DateRangePickerToolbarRoot
      toolbarTitle={toolbarTitle}
      isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
      toggleMobileKeyboardView={toggleMobileKeyboardView}
      isLandscape={false}
      penIconClassName={classes.penIcon}
    >
      <DateRangePickerToolbarContainer>
        <PickersToolbarButton
          variant={start !== null ? 'h5' : 'h6'}
          value={startDateValue}
          selected={currentlySelectingRangeEnd === 'start'}
          onClick={() => setCurrentlySelectingRangeEnd('start')}
        />
        <Typography variant="h5">&nbsp;{'–'}&nbsp;</Typography>
        <PickersToolbarButton
          variant={end !== null ? 'h5' : 'h6'}
          value={endDateValue}
          selected={currentlySelectingRangeEnd === 'end'}
          onClick={() => setCurrentlySelectingRangeEnd('end')}
        />
      </DateRangePickerToolbarContainer>
    </DateRangePickerToolbarRoot>
  );
};
