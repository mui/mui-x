import { CalendarOrClockPickerView } from '../../models';
import { usePickerValue } from './usePickerValue';
import { UsePickerParams, UsePickerResponse } from './usePicker.types';
import { usePickerViews } from './usePickerViews';

export const usePicker = <TValue, TDate, TView extends CalendarOrClockPickerView>({
  props,
  valueManager,
  wrapperVariant,
  sectionModeLookup,
  renderViews: renderViewsParam,
}: UsePickerParams<TValue, TDate, TView>): UsePickerResponse<TValue> => {
  const { field, views, actions, open } = usePickerValue(props, valueManager, wrapperVariant);

  const { renderViews, hasFieldView, hasPopperView } = usePickerViews({
    props: { ...props, ...views },
    renderViews: renderViewsParam,
    sectionModeLookup,
    open,
    onClose: actions.onClose,
    onSelectedSectionsChange: field.onSelectedSectionsChange,
  });

  return { field, actions, renderViews, open, hasFieldView, hasPopperView };
};
