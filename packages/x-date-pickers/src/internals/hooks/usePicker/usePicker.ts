import { CalendarOrClockPickerView } from '../../models';
import { usePickerValue } from './usePickerValue';
import { UsePickerParams, UsePickerResponse } from './usePicker.types';
import { usePickerViews } from './usePickerViews';
import { useIsLandscape } from '../useIsLandscape';

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
}: UsePickerParams<TValue, TDate, TView, TViewProps>): UsePickerResponse<TValue, TView> => {
  const pickerValueResponse = usePickerValue({
    props,
    valueManager,
    wrapperVariant,
  });

  const pickerViewsResponse = usePickerViews({
    props: { ...props, ...pickerValueResponse.viewProps },
    additionalViewProps,
    renderViews: renderViewsParam,
    sectionModeLookup,
    inputRef,
    wrapperVariant,
    open: pickerValueResponse.open,
    onSelectedSectionsChange: pickerValueResponse.fieldProps.onSelectedSectionsChange,
    actions: pickerValueResponse.actions,
  });

  const isLandscape = useIsLandscape(props.views, props.orientation);

  return {
    isLandscape,
    actions: pickerValueResponse.actions,
    fieldProps: pickerValueResponse.fieldProps,
    renderViews: pickerViewsResponse.renderViews,
    open: pickerValueResponse.open,
    hasPopperView: pickerViewsResponse.hasPopperView,
    shouldRestoreFocus: pickerViewsResponse.shouldRestoreFocus,
    layoutProps: {
      isLandscape,
      wrapperVariant,
      disabled: props.disabled,
      readOnly: props.readOnly,
      ...pickerValueResponse.layoutProps,
      ...pickerViewsResponse.layoutProps,
    },
  };
};
