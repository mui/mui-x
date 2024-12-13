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
>(parameters: UsePickerProviderParameters<TValue, TView>): UsePickerProviderReturnValue {
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

  const contextValue = React.useMemo<PickerContextValue>(
    () => ({
      ...paramsFromUsePickerValue.contextValue,
      disabled: props.disabled ?? false,
      readOnly: props.readOnly ?? false,
      variant,
      orientation,
    }),
    [paramsFromUsePickerValue.contextValue, variant, orientation, props.disabled, props.readOnly],
  );

  const privateContextValue = React.useMemo<PickerPrivateContextValue>(
    () => ({ ownerState }),
    [ownerState],
  );

  return {
    localeText,
    contextValue,
    privateContextValue,
  };
}

export interface UsePickerProviderParameters<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
> extends Pick<PickerProviderProps, 'localeText'> {
  props: UsePickerProps<TValue, any, any, any, any>;
  valueManager: PickerValueManager<TValue, any>;
  variant: PickerVariant;
  paramsFromUsePickerValue: UsePickerValueProviderParams<TValue>;
  paramsFromUsePickerViews: UsePickerViewsProviderParams<TView>;
}

export interface UsePickerProviderReturnValue extends Omit<PickerProviderProps, 'children'> {}

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
export interface UsePickerProviderNonStaticProps {
  /**
   * If `true`, the open picker button will not be rendered (renders only the field).
   * @default false
   */
  disableOpenPicker?: boolean;
}
