import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { useRtl } from '@mui/system/RtlProvider';
import { FieldSection, PickerOwnerState } from '../../../models';
import { PickerValueManager, UsePickerValueResponse } from './usePickerValue.types';
import {
  PickersProviderProps,
  PickersContextValue,
  PickersPrivateContextValue,
} from '../../components/PickersProvider';
import type { UsePickerProps } from './usePicker.types';
import { DateOrTimeViewWithMeridiem, PickerOrientation, PickerVariant } from '../../models';
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

export function usePickerProvider<TValue>(
  parameters: UsePickerProviderParameters<TValue>,
): UsePickerProviderReturnValue {
  const { props, pickerValueResponse, valueManager, localeText, variant, views } = parameters;

  const isRtl = useRtl();
  const utils = useUtils();
  const orientation = usePickerOrientation(views, props.orientation);

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
      isRtl,
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
      isRtl,
    ],
  );

  const contextValue = React.useMemo<PickersContextValue>(
    () => ({
      onOpen: pickerValueResponse.actions.onOpen,
      onClose: pickerValueResponse.actions.onClose,
      open: pickerValueResponse.open,
    }),
    [
      pickerValueResponse.actions.onOpen,
      pickerValueResponse.actions.onClose,
      pickerValueResponse.open,
    ],
  );

  const privateContextValue = React.useMemo<PickersPrivateContextValue>(
    () => ({
      ownerState,
      variant,
      orientation,
    }),
    [ownerState, variant, orientation],
  );

  return {
    localeText,
    contextValue,
    privateContextValue,
  };
}

export interface UsePickerProviderParameters<TValue>
  extends Pick<PickersProviderProps, 'localeText'> {
  props: UsePickerProps<TValue, any, any, any, any>;
  pickerValueResponse: UsePickerValueResponse<TValue, FieldSection, any>;
  valueManager: PickerValueManager<TValue, any>;
  variant: PickerVariant;
  views: readonly DateOrTimeViewWithMeridiem[];
}

export interface UsePickerProviderReturnValue extends Omit<PickersProviderProps, 'children'> {}

/**
 * Props used to create the private context.
 * Those props are exposed on all the pickers.
 */
export interface UsePickerProviderProps {
  /**
   * Force rendering in particular orientation.
   */
  orientation?: PickerOrientation;
}
