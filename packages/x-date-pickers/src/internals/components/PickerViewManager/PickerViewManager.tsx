import * as React from 'react';
import { CalendarOrClockPickerView } from '../../models/views';
import { useViews } from '../../hooks/useViews';
import { PickerViewManagerProps } from './PickerViewManager.types';

export function PickerViewManager<TValue, TDate, TView extends CalendarOrClockPickerView>(
  props: PickerViewManagerProps<TValue, TDate, TView>,
) {
  const { views, openTo, renderViews, onViewChange, onChange, value, ...other } = props;

  const { openView, setOpenView, handleChangeAndOpenNext } = useViews<TValue, TView>({
    view: undefined,
    views,
    openTo,
    onChange,
    onViewChange,
  });

  return renderViews({
    value,
    view: openView,
    onViewChange: setOpenView,
    onChange: handleChangeAndOpenNext,
    views,
    ...other,
  });
}
