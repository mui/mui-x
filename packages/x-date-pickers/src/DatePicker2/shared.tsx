import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import { CalendarPicker, CalendarPickerView } from '../CalendarPicker';
import { useUtils } from '../internals/hooks/useUtils';
import { isYearAndMonthViews, isYearOnlyView } from '../DatePicker/shared';
import { UseDesktopPickerProps } from '../internals/hooks/useDesktopPicker';
import { ValidationCommonPropsOptionalValue } from '../internals/hooks/validation/useValidation';
import { DateValidationError } from '../internals/hooks/validation/useDateValidation';
import { ExportedCalendarPickerProps } from '../CalendarPicker/CalendarPicker';
import { PickerViewRenderer } from '../internals/hooks/usePicker';
import { PickerViewContainer } from '../internals/components/PickerViewContainer';
import { PickerViewsRendererProps } from '@mui/x-date-pickers/internals/hooks/usePicker/usePickerViews';

type DesktopPickerDefaultizedKeys = 'inputFormat' | 'views' | 'openTo';

export interface BaseDatePicker2Props<TDate>
  extends ExportedCalendarPickerProps<TDate>,
    ValidationCommonPropsOptionalValue<DateValidationError, TDate | null>,
    MakeOptional<
      Omit<
        UseDesktopPickerProps<TDate | null, TDate, CalendarPickerView>,
        'components' | 'componentsProps'
      >,
      DesktopPickerDefaultizedKeys
    > {
  /**
   * The label content.
   */
  label?: React.ReactNode;
  /**
   * Pass a ref to the `input` element.
   */
  inputRef?: React.Ref<HTMLInputElement>;
}

export function useDatePicker2DefaultizedProps<TDate, Props extends BaseDatePicker2Props<TDate>>(
  props: Props,
  name: string,
): DefaultizedProps<Props, DesktopPickerDefaultizedKeys> {
  const utils = useUtils<TDate>();
  const themeProps = useThemeProps({
    props,
    name,
  });

  const views = themeProps.views ?? ['year', 'day'];

  let inputFormat: string;
  if (themeProps.inputFormat != null) {
    inputFormat = themeProps.inputFormat;
  } else if (isYearOnlyView(views)) {
    inputFormat = utils.formats.year;
  } else if (isYearAndMonthViews(views)) {
    inputFormat = utils.formats.monthAndYear;
  } else {
    inputFormat = utils.formats.keyboardDate;
  }

  return {
    openTo: 'day',
    ...themeProps,
    inputFormat,
    views,
  };
}

export const renderDateViews = <TDate extends unknown>(
  props: PickerViewsRendererProps<TDate | null, CalendarPickerView>,
) => (
  <PickerViewContainer isLandscape={props.isLandscape}>
    <CalendarPicker<TDate> {...props} />
  </PickerViewContainer>
);
