import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  useDateManager,
  UseDateManagerReturnValue,
  useDateTimeManager,
  UseDateTimeManagerReturnValue,
  useTimeManager,
  UseTimeManagerReturnValue,
} from '@mui/x-date-pickers/managers';
import { useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { PickerValueType } from '@mui/x-date-pickers/models';
import {
  PickerAnyManager,
  PickerManagerEnableAccessibleFieldDOMStructure,
  PickerManagerFieldInternalProps,
  PickerValue,
  RangePosition,
  useField,
  useFieldInternalPropsWithDefaults,
  UseFieldResponse,
  useNullableFieldPrivateContext,
  useNullablePickerContext,
  usePickerPrivateContext,
} from '@mui/x-date-pickers/internals';
import { PickerAnyRangeManager } from '../../internals/models/managers';
import { useNullablePickerRangePositionContext } from '../../internals/hooks/useNullablePickerRangePositionContext';
import {
  UseDateRangeManagerReturnValue,
  UseDateTimeRangeManagerReturnValue,
  UseTimeRangeManagerReturnValue,
} from '../../managers';

/**
 * @ignore - internal hook.
 */
export function useMultiInputRangeFieldTextFieldProps<
  TManager extends PickerAnyRangeManager,
  TForwardedProps extends UseMultiInputRangeFieldTextFieldBaseForwardedProps,
>(
  parameters: UseMultiInputRangeFieldTextFieldPropsParameters<TManager, TForwardedProps>,
): UseMultiInputRangeFieldTextFieldPropsReturnValue<TManager, TForwardedProps> {
  type TEnableAccessibleFieldDOMStructure =
    PickerManagerEnableAccessibleFieldDOMStructure<TManager>;

  const pickerContext = useNullablePickerContext();
  const fieldPrivateContext = useNullableFieldPrivateContext();
  const pickerPrivateContext = usePickerPrivateContext();
  const rangePositionContext = useNullablePickerRangePositionContext();

  const rangePosition = rangePositionContext?.rangePosition ?? 'start';
  const setRangePosition = rangePositionContext?.setRangePosition;
  const previousRangePosition = React.useRef<RangePosition>(rangePosition);

  const { props, valueType, position } = parameters;

  let useManager: ({
    enableAccessibleFieldDOMStructure,
  }: {
    enableAccessibleFieldDOMStructure: boolean | undefined;
  }) => PickerAnyManager;
  switch (valueType) {
    case 'date': {
      useManager = useDateManager;
      break;
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
    enableAccessibleFieldDOMStructure: props.enableAccessibleFieldDOMStructure,
  });

  const openPickerIfPossible = (event: React.UIEvent) => {
    if (!pickerContext) {
      return;
    }

    event.stopPropagation();
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
    props.onFocus?.(event);
    if (pickerContext?.open) {
      setRangePosition?.(position);
      if (previousRangePosition.current !== position && pickerContext.initialView) {
        pickerContext.setView?.(pickerContext.initialView);
      }
    }
  });

  const allProps = {
    ...props,
    onClick: handleClick,
    onFocus: handleFocus,
    onKeyDown: handleKeyDown,
    id: `${pickerPrivateContext.labelId}-${position}`,
  };

  const { forwardedProps, internalProps } = useSplitFieldProps(allProps, 'date');
  const internalPropsWithDefaults = useFieldInternalPropsWithDefaults({
    manager,
    internalProps,
    skipContextFieldRefAssignment: rangePosition !== position,
  });

  const { clearable, onClear, ...fieldResponse } = useField<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    typeof forwardedProps,
    typeof internalPropsWithDefaults
  >({
    forwardedProps,
    internalProps: internalPropsWithDefaults,
    valueManager: manager.internal_valueManager,
    fieldValueManager: manager.internal_fieldValueManager,
    validator: manager.validator,
    valueType: manager.valueType,
    // TODO v8: Add a real aria label before moving the opening logic to the field on range pickers.
    getOpenPickerButtonAriaLabel: () => '',
  }) as UseFieldResponse<TEnableAccessibleFieldDOMStructure, typeof allProps>;

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

interface UseMultiInputRangeFieldTextFieldPropsParameters<
  TManager extends PickerAnyRangeManager,
  TForwardedProps extends UseMultiInputRangeFieldTextFieldBaseForwardedProps,
> {
  valueType: PickerValueType;
  props: PickerManagerFieldInternalProps<GetDerivedManager<TManager>> & TForwardedProps;
  position: RangePosition;
}

type UseMultiInputRangeFieldTextFieldPropsReturnValue<
  TManager extends PickerAnyRangeManager,
  TForwardedProps extends UseMultiInputRangeFieldTextFieldBaseForwardedProps,
> = Omit<
  UseFieldResponse<
    PickerManagerEnableAccessibleFieldDOMStructure<TManager>,
    TForwardedProps & {
      onKeyDown: React.KeyboardEventHandler;
      onClick: React.MouseEventHandler;
      onFocus: React.FocusEventHandler;
      id: string;
    }
  >,
  'onClear' | 'clearable'
>;

export interface UseMultiInputRangeFieldTextFieldBaseForwardedProps {
  onKeyDown?: React.KeyboardEventHandler;
  onClick?: React.MouseEventHandler;
  onFocus?: React.FocusEventHandler;
  [key: string]: any;
}

type GetDerivedManager<TManager extends PickerAnyRangeManager> =
  TManager extends UseDateRangeManagerReturnValue<infer TEnableAccessibleFieldDOMStructure>
    ? UseDateManagerReturnValue<TEnableAccessibleFieldDOMStructure>
    : TManager extends UseTimeRangeManagerReturnValue<infer TEnableAccessibleFieldDOMStructure>
      ? UseTimeManagerReturnValue<TEnableAccessibleFieldDOMStructure>
      : TManager extends UseDateTimeRangeManagerReturnValue<
            infer TEnableAccessibleFieldDOMStructure
          >
        ? UseDateTimeManagerReturnValue<TEnableAccessibleFieldDOMStructure>
        : never;
