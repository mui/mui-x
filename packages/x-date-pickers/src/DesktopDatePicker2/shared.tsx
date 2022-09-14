import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps } from '@mui/x-date-pickers/internals';
import { DesktopDatePicker2Props } from './DesktopDatePicker2.types';
import { CalendarPicker, CalendarPickerView } from '@mui/x-date-pickers';
import { PickerViewsRendererProps } from '../internals/components/PickerViewManager';

export function useDatePicker2DefaultizedProps<
  TDate,
  // TODO: Reduce the extension scope.
  Props extends DesktopDatePicker2Props<TDate>,
>(props: Props, name: string): DefaultizedProps<Props, 'openTo' | 'views'> {
  const themeProps = useThemeProps({
    props,
    name,
  });

  const views = themeProps.views ?? ['year', 'day'];

  return {
    openTo: 'day',
    ...themeProps,
    views,
  };
}

export const renderDateViews = <TDate extends unknown>({
  value,
  ...other
}: PickerViewsRendererProps<TDate | null, TDate, CalendarPickerView>) => (
  <CalendarPicker<TDate> date={value} {...other} />
);
