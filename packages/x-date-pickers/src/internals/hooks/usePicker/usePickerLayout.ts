import { useIsLandscape } from '../useIsLandscape';
import { UsePickerValueActions, UsePickerValueLayoutResponse } from './usePickerValue';
import { UsePickerViewsLayoutResponse } from './usePickerViews';
import { CalendarOrClockPickerView } from '../../models/views';
import { WrapperVariant } from '../../components/wrappers/WrapperVariantContext';

/**
 * Props used to create the layout of the views.
 * Those props are exposed on all the pickers.
 */
export interface UsePickerLayoutProps {
  disabled?: boolean;
  readOnly?: boolean;
  showToolbar?: boolean;
  /**
   * Force rendering in particular orientation.
   */
  orientation?: 'portrait' | 'landscape';
}

export interface UsePickerLayoutResponseLayoutProps<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerValueLayoutResponse<TValue>,
    UsePickerViewsLayoutResponse<TView>,
    UsePickerLayoutProps,
    UsePickerValueActions {
  isLandscape: boolean;
  wrapperVariant: WrapperVariant;
}

export interface UsePickerLayoutResponse<TValue, TView extends CalendarOrClockPickerView> {
  layoutProps: UsePickerLayoutResponseLayoutProps<TValue, TView>;
}

export interface UsePickerLayoutParams<TValue, TView extends CalendarOrClockPickerView> {
  props: UsePickerLayoutProps;
  propsFromPickerValue: UsePickerValueLayoutResponse<TValue>;
  propsFromPickerViews: UsePickerViewsLayoutResponse<TView>;
  wrapperVariant: WrapperVariant;
  actions: UsePickerValueActions;
}

export const usePickerLayout = <TValue, TView extends CalendarOrClockPickerView>({
  props,
  propsFromPickerValue,
  propsFromPickerViews,
  wrapperVariant,
  actions,
}: UsePickerLayoutParams<TValue, TView>): UsePickerLayoutResponse<TValue, TView> => {
  const { orientation } = props;
  const { onChange, value } = propsFromPickerValue;
  const { views, view, onViewChange } = propsFromPickerViews;
  const isLandscape = useIsLandscape(views, orientation);

  const layoutProps: UsePickerLayoutResponseLayoutProps<TValue, TView> = {
    ...actions,
    isLandscape,
    wrapperVariant,
    disabled: props.disabled,
    readOnly: props.readOnly,
    showToolbar: props.showToolbar,
    onChange,
    value,
    view,
    onViewChange,
    views,
  };

  return {
    layoutProps,
  };
};
