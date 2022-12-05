import { useIsLandscape } from '../useIsLandscape';
import { UsePickerValueLayoutResponse } from './usePickerValue';
import { UsePickerViewsLayoutResponse } from './usePickerViews';
import { DateOrTimeView } from '../../models/views';
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

export interface UsePickerLayoutResponseLayoutProps<TValue, TView extends DateOrTimeView>
  extends UsePickerValueLayoutResponse<TValue>,
    UsePickerViewsLayoutResponse<TView>,
    UsePickerLayoutProps {
  isLandscape: boolean;
  wrapperVariant: WrapperVariant;
}

export interface UsePickerLayoutResponse<TValue, TView extends DateOrTimeView> {
  layoutProps: UsePickerLayoutResponseLayoutProps<TValue, TView>;
}

export interface UsePickerLayoutParams<TValue, TView extends DateOrTimeView> {
  props: UsePickerLayoutProps;
  propsFromPickerValue: UsePickerValueLayoutResponse<TValue>;
  propsFromPickerViews: UsePickerViewsLayoutResponse<TView>;
  wrapperVariant: WrapperVariant;
}

/**
 * Prepare the props for the view layout (managed by `PickersViewLayout`)
 */
export const usePickerLayout = <TValue, TView extends DateOrTimeView>({
  props,
  propsFromPickerValue,
  propsFromPickerViews,
  wrapperVariant,
}: UsePickerLayoutParams<TValue, TView>): UsePickerLayoutResponse<TValue, TView> => {
  const { orientation } = props;
  const isLandscape = useIsLandscape(propsFromPickerViews.views, orientation);

  const layoutProps: UsePickerLayoutResponseLayoutProps<TValue, TView> = {
    ...propsFromPickerViews,
    ...propsFromPickerValue,
    isLandscape,
    wrapperVariant,
    disabled: props.disabled,
    readOnly: props.readOnly,
    showToolbar: props.showToolbar,
  };

  return { layoutProps };
};
