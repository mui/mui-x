import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import MuiInputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import useForkRef from '@mui/utils/useForkRef';
import useId from '@mui/utils/useId';
import { PickersPopper } from '../../components/PickersPopper';
import { UseDesktopPickerParams, UseDesktopPickerProps } from './useDesktopPicker.types';
import { usePicker } from '../usePicker';
import { PickersLayout } from '../../../PickersLayout';
import { FieldRef, InferError } from '../../../models';
import { DateOrTimeViewWithMeridiem, BaseSingleInputFieldProps, PickerValue } from '../../models';
import { PickerProvider } from '../../components/PickerProvider';

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
  getOpenDialogAriaText,
  ...pickerParams
}: UseDesktopPickerParams<TView, TEnableAccessibleFieldDOMStructure, TExternalProps>) => {
  const {
    slots,
    slotProps: innerSlotProps,
    className,
    sx,
    format,
    formatDensity,
    enableAccessibleFieldDOMStructure,
    selectedSections,
    onSelectedSectionsChange,
    timezone,
    name,
    label,
    inputRef,
    readOnly,
    disabled,
    autoFocus,
    localeText,
    reduceAnimations,
  } = props;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const fieldRef = React.useRef<FieldRef<PickerValue>>(null);

  const labelId = useId();
  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const {
    hasUIView,
    providerProps,
    renderCurrentView,
    shouldRestoreFocus,
    fieldProps: pickerFieldProps,
    ownerState,
  } = usePicker<PickerValue, TView, TExternalProps, {}>({
    ...pickerParams,
    props,
    fieldRef,
    localeText,
    autoFocusView: true,
    additionalViewProps: {},
    variant: 'desktop',
  });

  const InputAdornment = slots.inputAdornment ?? MuiInputAdornment;
  const { ownerState: inputAdornmentOwnerState, ...inputAdornmentProps } = useSlotProps({
    elementType: InputAdornment,
    externalSlotProps: innerSlotProps?.inputAdornment,
    additionalProps: {
      position: 'end' as const,
    },
    ownerState,
  });

  const OpenPickerButton = slots.openPickerButton ?? IconButton;
  const { ownerState: openPickerButtonOwnerState, ...openPickerButtonProps } = useSlotProps({
    elementType: OpenPickerButton,
    externalSlotProps: innerSlotProps?.openPickerButton,
    additionalProps: {
      disabled: disabled || readOnly,
      // This direct access to `providerProps` will go away in https://github.com/mui/mui-x/pull/15671
      onClick: (event: React.UIEvent) => {
        event.preventDefault();
        providerProps.contextValue.setOpen((prevOpen) => !prevOpen);
      },
      'aria-label': getOpenDialogAriaText(pickerFieldProps.value),
      edge: inputAdornmentProps.position,
    },
    ownerState,
  });

  const OpenPickerIcon = slots.openPickerIcon;
  const openPickerIconProps = useSlotProps({
    elementType: OpenPickerIcon,
    externalSlotProps: innerSlotProps?.openPickerIcon,
    ownerState,
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
      disabled,
      format,
      formatDensity,
      enableAccessibleFieldDOMStructure,
      selectedSections,
      onSelectedSectionsChange,
      timezone,
      autoFocus: autoFocus && !props.open,
      ...pickerFieldProps, // onChange and value

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

  // TODO: Move to `useSlotProps` when https://github.com/mui/material-ui/pull/35088 will be merged
  if (hasUIView) {
    fieldProps.InputProps = {
      ...fieldProps.InputProps,
      ref: containerRef,
      ...(!props.disableOpenPicker && {
        [`${inputAdornmentProps.position}Adornment`]: (
          <InputAdornment {...inputAdornmentProps}>
            <OpenPickerButton {...openPickerButtonProps}>
              <OpenPickerIcon {...openPickerIconProps} />
            </OpenPickerButton>
          </InputAdornment>
        ),
      }),
    } as typeof fieldProps.InputProps;
  }

  const slotsForField = {
    textField: slots.textField,
    clearIcon: slots.clearIcon,
    clearButton: slots.clearButton,
    ...fieldProps.slots,
  };

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
      <Field
        {...fieldProps}
        slots={slotsForField}
        slotProps={slotProps}
        unstableFieldRef={handleFieldRef}
      />
      <PickersPopper
        role="dialog"
        placement="bottom-start"
        anchorEl={containerRef.current}
        slots={slots}
        slotProps={slotProps}
        shouldRestoreFocus={shouldRestoreFocus}
        reduceAnimations={reduceAnimations}
      >
        <Layout {...slotProps?.layout} slots={slots} slotProps={slotProps}>
          {renderCurrentView()}
        </Layout>
      </PickersPopper>
    </PickerProvider>
  );

  return { renderPicker };
};
