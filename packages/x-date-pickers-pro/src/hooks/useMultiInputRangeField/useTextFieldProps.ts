import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useDateManager, useDateTimeManager, useTimeManager } from '@mui/x-date-pickers/managers';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { UseValidationReturnValue } from '@mui/x-date-pickers/validation';
import { PickerValueType } from '@mui/x-date-pickers/models';
import {
  FieldChangeHandler,
  FieldChangeHandlerContext,
  PickerAnyManager,
  PickerManagerEnableAccessibleFieldDOMStructure,
  PickerManagerError,
  PickerRangeValue,
  PickerValue,
  RangePosition,
  useField,
  UseFieldInternalProps,
  UseFieldReturnValue,
  useNullableFieldPrivateContext,
  useNullablePickerContext,
  usePickerPrivateContext,
} from '@mui/x-date-pickers/internals';
import { PickerAnyRangeManager } from '../../internals/models/managers';
import { useNullablePickerRangePositionContext } from '../../internals/hooks/useNullablePickerRangePositionContext';
import { UseMultiInputFieldSelectedSectionsResponseItem } from './useMultiInputRangeFieldSelectedSections';
import type { UseMultiInputRangeFieldTextFieldProps } from './useMultiInputRangeField';

/**
 * @ignore - internal hook.
 */
export function useTextFieldProps<
  TManager extends PickerAnyRangeManager,
  TForwardedProps extends UseTextFieldBaseForwardedProps,
>(
  parameters: UseTextFieldPropsParameters<TManager, TForwardedProps>,
): UseMultiInputRangeFieldTextFieldProps<
  PickerManagerEnableAccessibleFieldDOMStructure<TManager>,
  TForwardedProps
> {
  type TError = PickerManagerError<TManager>;
  type TEnableAccessibleFieldDOMStructure =
    PickerManagerEnableAccessibleFieldDOMStructure<TManager>;

  const pickerContext = useNullablePickerContext();
  const fieldPrivateContext = useNullableFieldPrivateContext();
  const pickerPrivateContext = usePickerPrivateContext();
  const rangePositionContext = useNullablePickerRangePositionContext();

  const rangePosition = rangePositionContext?.rangePosition ?? 'start';
  const setRangePosition = rangePositionContext?.setRangePosition;
  const previousRangePosition = React.useRef<RangePosition>(rangePosition);

  const {
    forwardedProps,
    sharedInternalProps,
    selectedSectionProps,
    valueType,
    position,
    value,
    onChange,
    autoFocus,
    validation,
  } = parameters;

  let useManager: ({
    enableAccessibleFieldDOMStructure,
  }: {
    enableAccessibleFieldDOMStructure: boolean | undefined;
  }) => PickerAnyManager;
  switch (valueType) {
    case 'date': {
      useManager = useDateManager;
      break;
    }
    case 'time': {
      useManager = useTimeManager;
      break;
    }
    case 'date-time': {
      useManager = useDateTimeManager;
      break;
    }
    default: {
      throw new Error(`Unknown valueType: ${valueType}`);
    }
  }

  const manager = useManager({
    enableAccessibleFieldDOMStructure: sharedInternalProps.enableAccessibleFieldDOMStructure,
  });

  const openPickerIfPossible = (event: React.UIEvent) => {
    if (!pickerContext) {
      return;
    }

    setRangePosition?.(position);
    if (pickerContext.triggerStatus === 'enabled') {
      event.preventDefault();
      pickerContext.setOpen(true);
    }
  };

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      openPickerIfPossible(event);
    }
  });

  // Registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
  // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
  const handleClick = useEventCallback((event: React.MouseEvent) => {
    openPickerIfPossible(event);
  });

  const handleFocus = useEventCallback((event: React.FocusEvent) => {
    forwardedProps.onFocus?.(event);
    if (pickerContext?.open) {
      setRangePosition?.(position);
      if (previousRangePosition.current !== position && pickerContext.initialView) {
        pickerContext.setView?.(pickerContext.initialView);
      }
    }
  });

  const handleChange: FieldChangeHandler<PickerValue, TError> = useEventCallback(
    (newSingleValue, rawContext) => {
      const newRange: PickerRangeValue =
        position === 'start' ? [newSingleValue, value[1]] : [value[0], newSingleValue];

      const context: FieldChangeHandlerContext<TError> = {
        ...rawContext,
        validationError: validation.getValidationErrorForNewValue(newRange),
      };

      onChange(newRange, context);
    },
  );

  const allProps = {
    value: position === 'start' ? value[0] : value[1],
    error: position === 'start' ? !!validation.validationError[0] : !!validation.validationError[1],
    id: `${pickerPrivateContext.labelId}-${position}`,
    autoFocus: position === 'start' ? autoFocus : undefined,
    ...forwardedProps,
    ...sharedInternalProps,
    ...selectedSectionProps,
    onClick: handleClick,
    onFocus: handleFocus,
    onKeyDown: handleKeyDown,
    onChange: handleChange,
  };

  const splittedProps = useSplitFieldProps(allProps, valueType);
  const { clearable, onClear, openPickerAriaLabel, ...fieldResponse } = useField({
    manager,
    forwardedProps: splittedProps.forwardedProps,
    internalProps: splittedProps.internalProps,
    skipContextFieldRefAssignment: rangePosition !== position,
  }) as UseFieldReturnValue<TEnableAccessibleFieldDOMStructure, typeof allProps>;

  React.useEffect(() => {
    if (!pickerContext?.open || pickerContext?.variant === 'mobile') {
      return;
    }

    fieldPrivateContext?.fieldRef.current?.focusField();
    if (
      !fieldPrivateContext?.fieldRef.current ||
      pickerContext.view === pickerContext.initialView
    ) {
      // could happen when the user is switching between the inputs
      previousRangePosition.current = rangePosition;
      return;
    }

    // bring back focus to the field
    // currentView is present on DateTimeRangePicker
    fieldPrivateContext?.fieldRef.current.setSelectedSections(
      // use the current view or `0` when the range position has just been swapped
      previousRangePosition.current === rangePosition ? pickerContext.view : 0,
    );
    previousRangePosition.current = rangePosition;
  }, [
    rangePosition,
    pickerContext?.open,
    pickerContext?.variant,
    pickerContext?.initialView,
    pickerContext?.view,
    fieldPrivateContext?.fieldRef,
  ]);

  return fieldResponse;
}

interface UseTextFieldPropsParameters<
  TManager extends PickerAnyRangeManager,
  TForwardedProps extends UseTextFieldBaseForwardedProps,
> {
  valueType: PickerValueType;
  value: PickerRangeValue;
  onChange: FieldChangeHandler<PickerRangeValue, PickerManagerError<TManager>>;
  autoFocus: boolean | undefined;
  forwardedProps: TForwardedProps;
  sharedInternalProps: UseTextFieldSharedInternalProps<TManager>;
  selectedSectionProps: UseMultiInputFieldSelectedSectionsResponseItem;
  position: RangePosition;
  validation: UseValidationReturnValue<PickerRangeValue, PickerManagerError<TManager>>;
}

export interface UseTextFieldBaseForwardedProps {
  onKeyDown?: React.KeyboardEventHandler;
  onClick?: React.MouseEventHandler;
  onFocus?: React.FocusEventHandler;
  [key: string]: any;
}

interface UseTextFieldSharedInternalProps<TManager extends PickerAnyRangeManager>
  extends Pick<
    UseFieldInternalProps<
      PickerValue,
      PickerManagerEnableAccessibleFieldDOMStructure<TManager>,
      PickerManagerError<TManager>
    >,
    | 'enableAccessibleFieldDOMStructure'
    | 'disabled'
    | 'readOnly'
    | 'timezone'
    | 'format'
    | 'formatDensity'
    | 'shouldRespectLeadingZeros'
  > {}
