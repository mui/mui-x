import { CalendarOrClockPickerView } from '../../models';
import { usePickerValue } from './usePickerValue';
import { UsePickerParams, UsePickerResponse } from './usePicker.types';
import { usePickerViews } from './usePickerViews';
import { useIsLandscape } from '../useIsLandscape';
import { usePickerLayout } from './usePickerLayout';

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

  const pickerLayoutResponse = usePickerLayout({
    props: { ...props, ...pickerValueResponse.layoutProps, ...pickerViewsResponse.layoutProps },
    actions: pickerValueResponse.actions,
    wrapperVariant,
    isLandscape,
  });

  return {
    isLandscape,
    open: pickerValueResponse.open,
    actions: pickerValueResponse.actions,
    fieldProps: pickerValueResponse.fieldProps,
    layoutProps: pickerLayoutResponse,
    renderViews: pickerViewsResponse.renderViews,
    hasPopperView: pickerViewsResponse.hasPopperView,
    shouldRestoreFocus: pickerViewsResponse.shouldRestoreFocus,
  };
};
