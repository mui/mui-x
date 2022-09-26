import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import { CalendarPicker, CalendarPickerView } from '../CalendarPicker';
import { PickerViewsRendererProps } from '../internals/components/PickerViewManager';
import { useUtils } from '../internals/hooks/useUtils';
import { isYearAndMonthViews, isYearOnlyView } from '../DatePicker/shared';
import { ExportedDesktopPickerProps } from '../internals/components/DesktopPicker';
import { ValidationCommonPropsOptionalValue } from '../internals/hooks/validation/useValidation';
import { DateValidationError } from '../internals/hooks/validation/useDateValidation';

type DesktopPickerDefaultizedKeys = 'inputFormat' | 'views' | 'openTo';

export interface BaseDatePicker2Props<TDate>
  extends MakeOptional<
      ExportedDesktopPickerProps<TDate | null, TDate, CalendarPickerView>,
      DesktopPickerDefaultizedKeys
    >,
    ValidationCommonPropsOptionalValue<DateValidationError, TDate | null> {
  /**
   * The label content.
   */
  label?: React.ReactNode;
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
  props: PickerViewsRendererProps<TDate | null, TDate, CalendarPickerView>,
) => <CalendarPicker<TDate> {...props} />;
