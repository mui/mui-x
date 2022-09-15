import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps } from '../internals/models/helpers';
import { CalendarPicker, CalendarPickerView } from '../CalendarPicker';
import { PickerViewsRendererProps } from '../internals/components/PickerViewManager';
import { useUtils } from '../internals/hooks/useUtils';
import { isYearAndMonthViews, isYearOnlyView } from '../DatePicker/shared';

// TODO: Avoid redefined here
interface BaseDatePicker2Props {
  inputFormat?: string;
  openTo?: CalendarPickerView;
  views?: readonly CalendarPickerView[];
}

export function useDatePicker2DefaultizedProps<
  TDate,
  // TODO: Reduce the extension scope.
  Props extends BaseDatePicker2Props,
>(props: Props, name: string): DefaultizedProps<Props, 'openTo' | 'views' | 'inputFormat'> {
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
