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
  const { fieldProps, actions, onChange, value, open } = usePickerValue(
    props,
    valueManager,
    wrapperVariant,
  );

  const renderViews = usePickerViews({
    props: { ...props, value, onChange },
    renderViews: renderViewsParam,
  });

  return { fieldProps, actions, renderViews, open };
};
