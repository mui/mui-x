import { useIsLandscape } from '../useIsLandscape';
import { UsePickerValueLayoutResponse } from './usePickerValue';
import { UsePickerViewsLayoutResponse } from './usePickerViews';
import { DateOrTimeView } from '../../models/views';
import { WrapperVariant } from '../../components/wrappers/WrapperVariantContext';

/**
 * Props used to create the layout of the views.
 * Those props are exposed on all the pickers.
 */
export interface UsePickerLayoutPropsProps {
  disabled?: boolean;
  readOnly?: boolean;
  showToolbar?: boolean;
  /**
   * Force rendering in particular orientation.
   */
  orientation?: 'portrait' | 'landscape';
}

export interface UsePickerLayoutPropsResponseLayoutProps<TValue, TView extends DateOrTimeView>
  extends UsePickerValueLayoutResponse<TValue>,
    UsePickerViewsLayoutResponse<TView>,
    UsePickerLayoutPropsProps {
  isLandscape: boolean;
  wrapperVariant: WrapperVariant;
  isValid: (value: TValue) => boolean;
}

export interface UsePickerLayoutPropsResponse<TValue, TView extends DateOrTimeView> {
  layoutProps: UsePickerLayoutPropsResponseLayoutProps<TValue, TView>;
}

export interface UsePickerLayoutPropsParams<TValue, TView extends DateOrTimeView> {
  props: UsePickerLayoutPropsProps;
  propsFromPickerValue: UsePickerValueLayoutResponse<TValue>;
  propsFromPickerViews: UsePickerViewsLayoutResponse<TView>;
  wrapperVariant: WrapperVariant;
}

/**
 * Prepare the props for the view layout (managed by `PickersLayout`)
 */
export const usePickerLayoutProps = <TValue, TView extends DateOrTimeView>({
  props,
  propsFromPickerValue,
  propsFromPickerViews,
  wrapperVariant,
}: UsePickerLayoutPropsParams<TValue, TView>): UsePickerLayoutPropsResponse<TValue, TView> => {
  const { orientation } = props;
  const isLandscape = useIsLandscape(propsFromPickerViews.views, orientation);

  const layoutProps: UsePickerLayoutPropsResponseLayoutProps<TValue, TView> = {
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
