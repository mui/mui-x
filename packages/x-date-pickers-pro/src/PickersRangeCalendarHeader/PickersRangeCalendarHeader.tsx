'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { PickersCalendarHeader } from '@mui/x-date-pickers/PickersCalendarHeader';
import {
  PickersArrowSwitcher,
  useNextMonthDisabled,
  usePreviousMonthDisabled,
} from '@mui/x-date-pickers/internals';
import { usePickerAdapter, usePickerTranslations } from '@mui/x-date-pickers/hooks';
import type { PickersRangeCalendarHeaderProps } from './PickersRangeCalendarHeader.types';

type PickersRangeCalendarHeaderComponent = ((
  props: PickersRangeCalendarHeaderProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const PickersRangeCalendarHeaderContentMultipleCalendars = styled(PickersArrowSwitcher, {
  slot: 'internal',
})({
  padding: '12px 16px 4px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const PickersRangeCalendarHeader = React.forwardRef(function PickersRangeCalendarHeader(
  props: PickersRangeCalendarHeaderProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const adapter = usePickerAdapter();
  const translations = usePickerTranslations();

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

  const selectNextMonth = () => onMonthChange(adapter.addMonths(currentMonth, 1));

  const selectPreviousMonth = () => onMonthChange(adapter.addMonths(currentMonth, -1));

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
      {adapter.formatByString(month, format ?? `${adapter.formats.month} ${adapter.formats.year}`)}
    </PickersRangeCalendarHeaderContentMultipleCalendars>
  );
}) as PickersRangeCalendarHeaderComponent;

PickersRangeCalendarHeader.propTypes /* remove-proptypes */ = {
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
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The month currently displayed.
   */
  currentMonth: PropTypes.object.isRequired,
  /**
   * If `true`, the view switch button is hidden.
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, disable values after the current date.
   */
  disableFuture: PropTypes.bool,
  /**
   * If `true`, disable values before the current date.
   */
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
  /**
   * Maximal selectable date.
   */
  maxDate: PropTypes.object.isRequired,
  /**
   * Minimal selectable date.
   */
  minDate: PropTypes.object.isRequired,
  /**
   * Month used for this header.
   */
  month: PropTypes.object.isRequired,
  /**
   * Index of the month used for this header.
   */
  monthIndex: PropTypes.number.isRequired,
  /**
   * Callback fired when the displayed month changes.
   * @param {PickerValidDate} date The new displayed month.
   */
  onMonthChange: PropTypes.func.isRequired,
  /**
   * Callback fired when the view changes.
   * @param {DateView} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * If `true`, disable heavy animations.
   */
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
  /**
   * The timezone used to compare dates.
   */
  timezone: PropTypes.string.isRequired,
  /**
   * The visible view.
   */
  view: PropTypes.oneOf(['day', 'month', 'year']).isRequired,
  /**
   * Available views.
   */
  views: PropTypes.arrayOf(PropTypes.oneOf(['day', 'month', 'year']).isRequired).isRequired,
} as any;

export { PickersRangeCalendarHeader };
