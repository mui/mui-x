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
  const { field, views, actions, open } = usePickerValue(props, valueManager, wrapperVariant);

  const renderViews = usePickerViews({
    props: { ...props, ...views },
    renderViews: renderViewsParam,
  });

  return { field, actions, renderViews, open };
};
