import * as React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { generateUtilityClasses } from '@mui/material';
import {
  PickersToolbar,
  PickersToolbarButton,
  pickersToolbarClasses,
  useUtils,
  BaseToolbarProps,
} from '@mui/x-date-pickers/internals';
import { DateRange, CurrentlySelectingRangeEndProps } from '../internal/models';

export const dateRangePickerToolbarClasses = generateUtilityClasses('MuiDateRangePickerToolbar', [
  'root',
]);

interface DateRangePickerToolbarProps<TDate>
  extends CurrentlySelectingRangeEndProps,
    Pick<
      BaseToolbarProps<TDate, DateRange<TDate>>,
      | 'isMobileKeyboardViewOpen'
      | 'toggleMobileKeyboardView'
      | 'toolbarTitle'
      | 'toolbarFormat'
      | 'parsedValue'
    > {
  startText: React.ReactNode;
  endText: React.ReactNode;
}

const DateRangePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiDateRangePickerToolbar',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{
  ownerState: DateRangePickerToolbarProps<any>;
}>({
  [`& .${pickersToolbarClasses.penIconButton}`]: {
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
export const DateRangePickerToolbar = <TDate extends unknown>(
  props: DateRangePickerToolbarProps<TDate>,
) => {
  const utils = useUtils<TDate>();

  const {
    currentlySelectingRangeEnd,
    parsedValue: [start, end],
    endText,
    isMobileKeyboardViewOpen,
    setCurrentlySelectingRangeEnd,
    startText,
    toggleMobileKeyboardView,
    toolbarFormat,
    toolbarTitle = 'Select date range',
  } = props;

  const startDateValue = start
    ? utils.formatByString(start, toolbarFormat || utils.formats.shortDate)
    : startText;

  const endDateValue = end
    ? utils.formatByString(end, toolbarFormat || utils.formats.shortDate)
    : endText;

  const ownerState = props;

  return (
    <DateRangePickerToolbarRoot
      toolbarTitle={toolbarTitle}
      isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
      toggleMobileKeyboardView={toggleMobileKeyboardView}
      isLandscape={false}
      className={dateRangePickerToolbarClasses.root}
      ownerState={ownerState}
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
