import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import { CalendarPicker, CalendarPickerProps, CalendarPickerView } from '../CalendarPicker';
import { useDefaultDates, useUtils } from '../internals/hooks/useUtils';
import { isYearAndMonthViews, isYearOnlyView } from '../internals/utils/views';
import { ValidationCommonPropsOptionalValue } from '../internals/hooks/validation/useValidation';
import { DateValidationError } from '../internals/hooks/validation/useDateValidation';
import { ExportedCalendarPickerProps } from '../CalendarPicker/CalendarPicker';
import { PickerViewContainer } from '../internals/components/PickerViewContainer';
import { BasePickerProps2 } from '../internals/models/props/basePickerProps';
import { applyDefaultDate } from '../internals/utils/date-utils';
import { BaseDateValidationProps } from '../internals';

export interface BaseDatePicker2Props<TDate>
  extends MakeOptional<
      BasePickerProps2<TDate | null, TDate, CalendarPickerView>,
      'views' | 'openTo'
    >,
    ExportedCalendarPickerProps<TDate>,
    ValidationCommonPropsOptionalValue<DateValidationError, TDate | null> {
  /**
   * The label content.
   */
  label?: React.ReactNode;
  /**
   * Pass a ref to the `input` element.
   */
  inputRef?: React.Ref<HTMLInputElement>;
  components?: {
    Field?: React.ElementType;
  };
}

export function useDatePicker2DefaultizedProps<TDate, Props extends BaseDatePicker2Props<TDate>>(
  props: Props,
  name: string,
): DefaultizedProps<Props, 'views' | 'openTo' | keyof BaseDateValidationProps<TDate>> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const views = themeProps.views ?? ['year', 'day'];

  let inputFormat: string | undefined;
  if (themeProps.inputFormat != null) {
    inputFormat = themeProps.inputFormat;
  } else if (isYearOnlyView(views)) {
    inputFormat = utils.formats.year;
  } else if (isYearAndMonthViews(views)) {
    inputFormat = utils.formats.monthAndYear;
  } else {
    inputFormat = undefined;
  }

  return {
    ...themeProps,
    inputFormat,
    views,
    openTo: themeProps.openTo ?? 'day',
    disableFuture: themeProps.disableFuture ?? false,
    disablePast: themeProps.disablePast ?? false,
    minDate: applyDefaultDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: applyDefaultDate(utils, themeProps.maxDate, defaultDates.maxDate),
  };
}

export const renderDateViews = <TDate extends unknown>(
  props: CalendarPickerProps<TDate> & { isLandscape: boolean },
) => (
  <PickerViewContainer isLandscape={props.isLandscape}>
    <CalendarPicker<TDate> {...props} />
  </PickerViewContainer>
);
