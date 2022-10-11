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
  const { fieldProps, viewProps, actions, open } = usePickerValue({
    props,
    valueManager,
    wrapperVariant,
  });

  const { renderViews, hasPopperView, shouldRestoreFocus } = usePickerViews({
    props: { ...props, ...viewProps },
    additionalViewProps,
    renderViews: renderViewsParam,
    sectionModeLookup,
    inputRef,
    wrapperVariant,
    open,
    onClose: actions.onClose,
    onSelectedSectionsChange: fieldProps.onSelectedSectionsChange,
    actions,
  });

  return { fieldProps, actions, renderViews, open, hasPopperView, shouldRestoreFocus };
};
