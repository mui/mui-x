import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import useForkRef from '@mui/utils/useForkRef';
import useId from '@mui/utils/useId';
import { PickersPopper } from '../../components/PickersPopper';
import { UseDesktopPickerParams, UseDesktopPickerProps } from './useDesktopPicker.types';
import { usePicker } from '../usePicker';
import { PickersLayout } from '../../../PickersLayout';
import { FieldRef, InferError } from '../../../models';
import { DateOrTimeViewWithMeridiem, BaseSingleInputFieldProps, PickerValue } from '../../models';
import { PickerProvider } from '../../components/PickerProvider';
import { PickerFieldUIContextProvider } from '../../components/PickerFieldUI';

/**
 * Hook managing all the single-date desktop pickers:
 * - DesktopDatePicker
 * - DesktopDateTimePicker
 * - DesktopTimePicker
 */
export const useDesktopPicker = <
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TExternalProps extends UseDesktopPickerProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    any,
    TExternalProps
  >,
>({
  props,
  ...pickerParams
}: UseDesktopPickerParams<TView, TEnableAccessibleFieldDOMStructure, TExternalProps>) => {
  const {
    slots,
    slotProps: innerSlotProps,
    className,
    sx,
    name,
    label,
    inputRef,
    readOnly,
    autoFocus,
    localeText,
    reduceAnimations,
  } = props;

  const fieldRef = React.useRef<FieldRef<PickerValue>>(null);

  const labelId = useId();
  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const { providerProps, renderCurrentView, shouldRestoreFocus, ownerState } = usePicker<
    PickerValue,
    TView,
    TExternalProps
  >({
    ...pickerParams,
    props,
    fieldRef,
    localeText,
    autoFocusView: true,
    variant: 'desktop',
  });

  const Field = slots.field;
  const fieldProps: BaseSingleInputFieldProps<
    PickerValue,
    TEnableAccessibleFieldDOMStructure,
    InferError<TExternalProps>
  > = useSlotProps({
    elementType: Field,
    externalSlotProps: innerSlotProps?.field,
    additionalProps: {
      // Internal props
      readOnly,
      autoFocus: autoFocus && !props.open,

      // Forwarded props
      className,
      sx,
      label,
      name,
      focused: providerProps.contextValue.open ? true : undefined,
      ...(isToolbarHidden && { id: labelId }),
      ...(!!inputRef && { inputRef }),
    },
    ownerState,
  });

  const Layout = slots.layout ?? PickersLayout;

  let labelledById = labelId;
  if (isToolbarHidden) {
    if (label) {
      labelledById = `${labelId}-label`;
    } else {
      labelledById = undefined;
    }
  }
  const slotProps = {
    ...innerSlotProps,
    toolbar: {
      ...innerSlotProps?.toolbar,
      titleId: labelId,
    },
    popper: {
      'aria-labelledby': labelledById,
      ...innerSlotProps?.popper,
    },
  };

  const handleFieldRef = useForkRef(fieldRef, fieldProps.unstableFieldRef);

  const renderPicker = () => (
    <PickerProvider {...providerProps}>
      <PickerFieldUIContextProvider slots={slots} slotProps={slotProps}>
        <Field {...fieldProps} unstableFieldRef={handleFieldRef} />
        <PickersPopper
          role="dialog"
          placement="bottom-start"
          anchorEl={providerProps.contextValue.triggerRef!.current}
          slots={slots}
          slotProps={slotProps}
          shouldRestoreFocus={shouldRestoreFocus}
          reduceAnimations={reduceAnimations}
        >
          <Layout {...slotProps?.layout} slots={slots} slotProps={slotProps}>
            {renderCurrentView()}
          </Layout>
        </PickersPopper>
      </PickerFieldUIContextProvider>
    </PickerProvider>
  );

  return { renderPicker };
};
