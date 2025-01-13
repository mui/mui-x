import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { PickerOwnerState } from '../../../models';
import { PickerValueManager, UsePickerValueProviderParams } from './usePickerValue.types';
import {
  PickerProviderProps,
  PickerContextValue,
  PickerPrivateContextValue,
} from '../../components/PickerProvider';
import type { UsePickerProps } from './usePicker.types';
import {
  DateOrTimeViewWithMeridiem,
  FormProps,
  PickerOrientation,
  PickerValidValue,
  PickerVariant,
} from '../../models';
import { useUtils } from '../useUtils';
import { arrayIncludes } from '../../utils/utils';
import { UsePickerViewsProviderParams } from './usePickerViews';
import { PickerFieldPrivateContextValue } from '../useField/useFieldInternalPropsWithDefaults';

function getOrientation(): PickerOrientation {
  if (typeof window === 'undefined') {
    return 'portrait';
  }

  if (window.screen && window.screen.orientation && window.screen.orientation.angle) {
    return Math.abs(window.screen.orientation.angle) === 90 ? 'landscape' : 'portrait';
  }

  // Support IOS safari
  if (window.orientation) {
    return Math.abs(Number(window.orientation)) === 90 ? 'landscape' : 'portrait';
  }

  return 'portrait';
}

export const usePickerOrientation = (
  views: readonly DateOrTimeViewWithMeridiem[],
  customOrientation: PickerOrientation | undefined,
): PickerOrientation => {
  const [orientation, setOrientation] = React.useState(getOrientation);

  useEnhancedEffect(() => {
    const eventHandler = () => {
      setOrientation(getOrientation());
    };
    window.addEventListener('orientationchange', eventHandler);
    return () => {
      window.removeEventListener('orientationchange', eventHandler);
    };
  }, []);

  if (arrayIncludes(views, ['hours', 'minutes', 'seconds'])) {
    // could not display 13:34:44 in landscape mode
    return 'portrait';
  }

  return customOrientation ?? orientation;
};

export function usePickerProvider<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
>(
  parameters: UsePickerProviderParameters<TValue, TView, TError>,
): UsePickerProviderReturnValue<TValue> {
  const {
    props,
    valueManager,
    localeText,
    variant,
    paramsFromUsePickerValue,
    paramsFromUsePickerViews,
  } = parameters;

  const utils = useUtils();
  const orientation = usePickerOrientation(paramsFromUsePickerViews.views, props.orientation);

  const ownerState = React.useMemo<PickerOwnerState>(
    () => ({
      isPickerValueEmpty: valueManager.areValuesEqual(
        utils,
        paramsFromUsePickerValue.value,
        valueManager.emptyValue,
      ),
      isPickerOpen: paramsFromUsePickerValue.contextValue.open,
      isPickerDisabled: props.disabled ?? false,
      isPickerReadOnly: props.readOnly ?? false,
      pickerOrientation: orientation,
      pickerVariant: variant,
    }),
    [
      utils,
      valueManager,
      paramsFromUsePickerValue.value,
      paramsFromUsePickerValue.contextValue.open,
      orientation,
      variant,
      props.disabled,
      props.readOnly,
    ],
  );

  const contextValue = React.useMemo<PickerContextValue<TValue, TView, TError>>(
    () => ({
      ...paramsFromUsePickerValue.contextValue,
      ...paramsFromUsePickerViews.contextValue,
      disabled: props.disabled ?? false,
      readOnly: props.readOnly ?? false,
      variant,
      orientation,
      fieldFormat: props.format ?? '',
    }),
    [
      paramsFromUsePickerValue.contextValue,
      paramsFromUsePickerViews.contextValue,
      variant,
      orientation,
      props.disabled,
      props.readOnly,
      props.format,
    ],
  );

  const privateContextValue = React.useMemo<PickerPrivateContextValue>(
    () => ({ ...paramsFromUsePickerValue.privateContextValue, ownerState }),
    [paramsFromUsePickerValue, ownerState],
  );

  const actionsContextValue = React.useMemo(
    () => ({
      ...paramsFromUsePickerValue.actionsContextValue,
      ...paramsFromUsePickerViews.actionsContextValue,
    }),
    [paramsFromUsePickerValue.actionsContextValue, paramsFromUsePickerViews.actionsContextValue],
  );

  const fieldPrivateContextValue = React.useMemo(
    () => ({
      formatDensity: props.formatDensity,
      enableAccessibleFieldDOMStructure: props.enableAccessibleFieldDOMStructure,
      selectedSections: props.selectedSections,
      onSelectedSectionsChange: props.onSelectedSectionsChange,
    }),
    [
      props.formatDensity,
      props.enableAccessibleFieldDOMStructure,
      props.selectedSections,
      props.onSelectedSectionsChange,
    ],
  );

  return {
    localeText,
    contextValue,
    privateContextValue,
    actionsContextValue,
    fieldPrivateContextValue,
    isValidContextValue: paramsFromUsePickerValue.isValidContextValue,
  };
}

export interface UsePickerProviderParameters<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
> extends Pick<PickerProviderProps<TValue>, 'localeText'> {
  props: UsePickerProps<TValue, any, any, any> & UsePickerProviderNonStaticProps;
  valueManager: PickerValueManager<TValue, any>;
  variant: PickerVariant;
  paramsFromUsePickerValue: UsePickerValueProviderParams<TValue, TError>;
  paramsFromUsePickerViews: UsePickerViewsProviderParams<TView>;
}

export interface UsePickerProviderReturnValue<TValue extends PickerValidValue>
  extends Omit<PickerProviderProps<TValue>, 'children'> {}

/**
 * Props used to create the picker's contexts.
 * Those props are exposed on all the pickers.
 */
export interface UsePickerProviderProps extends FormProps {
  /**
   * Force rendering in particular orientation.
   */
  orientation?: PickerOrientation;
}

/**
 * Props used to create the picker's contexts and that are not available on static pickers.
 */
export interface UsePickerProviderNonStaticProps extends PickerFieldPrivateContextValue {
  // We don't take the `format` prop from `UseFieldInternalProps` to have a custom JSDoc description.
  /**
   * Format of the date when rendered in the input(s).
   * Defaults to localized format based on the used `views`.
   */
  format?: string;
  /**
   * If `true`, the open picker button will not be rendered (renders only the field).
   * @default false
   */
  disableOpenPicker?: boolean;
}
