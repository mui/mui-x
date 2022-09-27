import { CalendarOrClockPickerView } from '../../models';
import { usePickerValue } from './usePickerValue';
import { UsePickerParams } from './usePicker.types';
import { usePickerViews } from './usePickerViews';

export const usePicker = <TValue, TDate, TView extends CalendarOrClockPickerView>({
  props,
  valueManager,
  wrapperVariant,
  renderViews: renderViewsParam,
}: UsePickerParams<TValue, TDate, TView>) => {
  const { fieldProps, viewProps, wrapperProps, openPicker } = usePickerValue(
    props,
    valueManager,
    wrapperVariant,
  );

  const renderViews = usePickerViews({
    props: { ...props, ...viewProps },
    renderViews: renderViewsParam,
  });

  return { fieldProps, wrapperProps, openPicker, renderViews };
};
