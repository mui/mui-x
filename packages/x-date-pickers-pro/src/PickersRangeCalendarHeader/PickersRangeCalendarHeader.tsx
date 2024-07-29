import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { PickersCalendarHeader } from '@mui/x-date-pickers/PickersCalendarHeader';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import {
  PickersArrowSwitcher,
  useNextMonthDisabled,
  usePreviousMonthDisabled,
  useUtils,
} from '@mui/x-date-pickers/internals';
import { usePickersTranslations } from '@mui/x-date-pickers/hooks';
import { PickersRangeCalendarHeaderProps } from './PickersRangeCalendarHeader.types';

type PickersRangeCalendarHeaderComponent = (<TDate extends PickerValidDate>(
  props: PickersRangeCalendarHeaderProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const PickersRangeCalendarHeaderContentMultipleCalendars = styled(PickersArrowSwitcher)({
  padding: '12px 16px 4px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const PickersRangeCalendarHeader = React.forwardRef(function PickersRangeCalendarHeader<
  TDate extends PickerValidDate,
>(props: PickersRangeCalendarHeaderProps<TDate>, ref: React.Ref<HTMLDivElement>) {
  const utils = useUtils<TDate>();
  const translations = usePickersTranslations<TDate>();

  const { calendars, month, monthIndex, labelId, ...other } = props;
  const {
    format,
    slots,
    slotProps,
    currentMonth,
    onMonthChange,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    timezone,
    // omit props that are not used in the PickersArrowSwitcher
    reduceAnimations,
    views,
    view,
    ...otherRangeProps
  } = other;

  const isNextMonthDisabled = useNextMonthDisabled(currentMonth, {
    disableFuture,
    maxDate,
    timezone,
  });

  const isPreviousMonthDisabled = usePreviousMonthDisabled(currentMonth, {
    disablePast,
    minDate,
    timezone,
  });

  if (calendars === 1) {
    return <PickersCalendarHeader {...other} labelId={labelId} ref={ref} />;
  }

  const selectNextMonth = () => onMonthChange(utils.addMonths(currentMonth, 1), 'left');

  const selectPreviousMonth = () => onMonthChange(utils.addMonths(currentMonth, -1), 'right');

  return (
    <PickersRangeCalendarHeaderContentMultipleCalendars
      {...otherRangeProps}
      ref={ref}
      onGoToPrevious={selectPreviousMonth}
      onGoToNext={selectNextMonth}
      isPreviousHidden={monthIndex !== 0}
      isPreviousDisabled={isPreviousMonthDisabled}
      previousLabel={translations.previousMonth}
      isNextHidden={monthIndex !== calendars - 1}
      isNextDisabled={isNextMonthDisabled}
      nextLabel={translations.nextMonth}
      slots={slots}
      slotProps={slotProps}
      labelId={labelId}
    >
      {utils.formatByString(month, format ?? `${utils.formats.month} ${utils.formats.year}`)}
    </PickersRangeCalendarHeaderContentMultipleCalendars>
  );
}) as PickersRangeCalendarHeaderComponent;

PickersRangeCalendarHeader.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The number of calendars rendered.
   */
  calendars: PropTypes.oneOf([1, 2, 3]).isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  currentMonth: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  /**
   * Format used to display the date.
   * @default `${adapter.formats.month} ${adapter.formats.year}`
   */
  format: PropTypes.string,
  /**
   * Id of the calendar text element.
   * It is used to establish an `aria-labelledby` relationship with the calendar `grid` element.
   */
  labelId: PropTypes.string,
  maxDate: PropTypes.object.isRequired,
  minDate: PropTypes.object.isRequired,
  /**
   * Month used for this header.
   */
  month: PropTypes.object.isRequired,
  /**
   * Index of the month used for this header.
   */
  monthIndex: PropTypes.number.isRequired,
  onMonthChange: PropTypes.func.isRequired,
  onViewChange: PropTypes.func,
  reduceAnimations: PropTypes.bool.isRequired,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  timezone: PropTypes.string.isRequired,
  view: PropTypes.oneOf(['day', 'month', 'year']).isRequired,
  views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'month', 'year']).isRequired).isRequired,
} as any;

export { PickersRangeCalendarHeader };
