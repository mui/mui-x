import { CalendarOrClockPickerView } from '../../models';
import { usePickerValue } from './usePickerValue';
import { UsePickerParams, UsePickerResponse } from './usePicker.types';
import { usePickerViews } from './usePickerViews';

export const usePicker = <
  TValue,
  TDate,
  TView extends CalendarOrClockPickerView,
  TViewProps extends {},
>({
  props,
  valueManager,
  wrapperVariant,
  sectionModeLookup,
  inputRef,
  renderViews: renderViewsParam,
  additionalViewProps,
}: UsePickerParams<TValue, TDate, TView, TViewProps>): UsePickerResponse<TValue> => {
  const { field, views, actions, open } = usePickerValue(props, valueManager, wrapperVariant);

  const { renderViews, hasFieldView, hasPopperView, shouldRestoreFocus } = usePickerViews({
    props: { ...props, ...views },
    renderViews: renderViewsParam,
    sectionModeLookup,
    inputRef,
    open,
    onClose: actions.onClose,
    onSelectedSectionsChange: field.onSelectedSectionsChange,
    additionalViewProps,
  });

  return { field, actions, renderViews, open, hasFieldView, hasPopperView, shouldRestoreFocus };
};
