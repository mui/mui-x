import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { PickerOwnerState } from '../../../models';
import { PickerValueManager, UsePickerValueResponse } from './usePickerValue.types';
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

export function usePickerProvider<TValue extends PickerValidValue>(
  parameters: UsePickerProviderParameters<TValue>,
): UsePickerProviderReturnValue {
  const { props, pickerValueResponse, valueManager, localeText, variant, views, hasUIView } =
    parameters;

  const utils = useUtils();
  const orientation = usePickerOrientation(views, props.orientation);
  const triggerRef = React.useRef<HTMLElement>(null);

  const ownerState = React.useMemo<PickerOwnerState>(
    () => ({
      isPickerValueEmpty: valueManager.areValuesEqual(
        utils,
        pickerValueResponse.viewProps.value,
        valueManager.emptyValue,
      ),
      isPickerOpen: pickerValueResponse.open,
      isPickerDisabled: props.disabled ?? false,
      isPickerReadOnly: props.readOnly ?? false,
      pickerOrientation: orientation,
      pickerVariant: variant,
    }),
    [
      utils,
      valueManager,
      pickerValueResponse.viewProps.value,
      pickerValueResponse.open,
      orientation,
      variant,
      props.disabled,
      props.readOnly,
    ],
  );

  const contextValue = React.useMemo<PickerContextValue>(
    () => ({
      onOpen: pickerValueResponse.actions.onOpen,
      onClose: pickerValueResponse.actions.onClose,
      open: pickerValueResponse.open,
      disabled: props.disabled ?? false,
      readOnly: props.readOnly ?? false,
      variant,
      orientation,
      triggerRef,
    }),
    [
      pickerValueResponse.actions.onOpen,
      pickerValueResponse.actions.onClose,
      pickerValueResponse.open,
      variant,
      orientation,
      props.disabled,
      props.readOnly,
    ],
  );

  const openingUIStatus = React.useMemo(() => {
    if (props.disableOpenPicker || !hasUIView) {
      return 'hidden';
    }

    if (props.disabled || props.readOnly) {
      return 'disabled';
    }

    return 'enabled';
  }, [props.disableOpenPicker, hasUIView, props.disabled, props.readOnly]);

  const privateContextValue = React.useMemo<PickerPrivateContextValue>(
    () => ({ ownerState, openingUIStatus }),
    [ownerState, openingUIStatus],
  );

  return {
    localeText,
    contextValue,
    privateContextValue,
  };
}

export interface UsePickerProviderParameters<TValue extends PickerValidValue>
  extends Pick<PickerProviderProps, 'localeText'> {
  props: UsePickerProps<TValue, any, any, any, any> & UsePickerProviderNonStaticProps;
  pickerValueResponse: UsePickerValueResponse<TValue, any>;
  valueManager: PickerValueManager<TValue, any>;
  variant: PickerVariant;
  views: readonly DateOrTimeViewWithMeridiem[];
  hasUIView: boolean;
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
