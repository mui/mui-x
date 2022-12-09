import * as React from 'react';
import Typography from '@mui/material/Typography';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import {
  PickersToolbar,
  PickersToolbarButton,
  pickersToolbarClasses,
  useUtils,
  BaseToolbarProps,
  useLocaleText,
  ExportedBaseToolbarProps,
} from '@mui/x-date-pickers/internals';
import { DateRange, RangePositionProps } from '../internal/models';
import {
  DateRangePickerToolbarClasses,
  getDateRangePickerToolbarUtilityClass,
} from './dateRangePickerToolbarClasses';

const useUtilityClasses = (ownerState: DateRangePickerToolbarProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    container: ['container'],
  };

  return composeClasses(slots, getDateRangePickerToolbarUtilityClass, classes);
};

export interface DateRangePickerToolbarProps<TDate>
  extends Omit<
      BaseToolbarProps<DateRange<TDate>, 'day'>,
      'views' | 'view' | 'onViewChange' | 'onChange' | 'isLandscape'
    >,
    RangePositionProps {
  classes?: Partial<DateRangePickerToolbarClasses>;
}

export interface ExportedDateRangePickerToolbarProps extends ExportedBaseToolbarProps {}

const DateRangePickerToolbarRoot = styled(PickersToolbar, {
  name: 'MuiDateRangePickerToolbar',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{
  ownerState: DateRangePickerToolbarProps<any>;
}>({
  [`& .${pickersToolbarClasses.penIconButton}`]: {
    position: 'relative',
    top: 4,
  },
});

const DateRangePickerToolbarContainer = styled('div', {
  name: 'MuiDateRangePickerToolbar',
  slot: 'Container',
  overridesResolver: (_, styles) => styles.container,
})({
  display: 'flex',
});

/**
 * @ignore - internal component.
 */
export const DateRangePickerToolbar = React.forwardRef(function DateRangePickerToolbar<
  TDate extends unknown,
>(inProps: DateRangePickerToolbarProps<TDate>, ref: React.Ref<HTMLDivElement>) {
  const utils = useUtils<TDate>();
  const props = useThemeProps({ props: inProps, name: 'MuiDateRangePickerToolbar' });

  const {
    value: [start, end],
    isMobileKeyboardViewOpen,
    toggleMobileKeyboardView,
    rangePosition,
    onRangePositionChange,
    toolbarFormat,
  } = props;

  const localeText = useLocaleText<TDate>();

  const startDateValue = start
    ? utils.formatByString(start, toolbarFormat || utils.formats.shortDate)
    : localeText.start;

  const endDateValue = end
    ? utils.formatByString(end, toolbarFormat || utils.formats.shortDate)
    : localeText.end;

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  return (
    <DateRangePickerToolbarRoot
      toolbarTitle={localeText.dateRangePickerToolbarTitle}
      isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
      toggleMobileKeyboardView={toggleMobileKeyboardView}
      isLandscape={false}
      className={classes.root}
      ownerState={ownerState}
      ref={ref}
    >
      <DateRangePickerToolbarContainer className={classes.container}>
        <PickersToolbarButton
          variant={start !== null ? 'h5' : 'h6'}
          value={startDateValue}
          selected={rangePosition === 'start'}
          onClick={() => onRangePositionChange('start')}
        />
        <Typography variant="h5">&nbsp;{'–'}&nbsp;</Typography>
        <PickersToolbarButton
          variant={end !== null ? 'h5' : 'h6'}
          value={endDateValue}
          selected={rangePosition === 'end'}
          onClick={() => onRangePositionChange('end')}
        />
      </DateRangePickerToolbarContainer>
    </DateRangePickerToolbarRoot>
  );
});
