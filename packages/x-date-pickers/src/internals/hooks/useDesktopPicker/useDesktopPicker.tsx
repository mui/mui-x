import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import MuiInputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import useForkRef from '@mui/utils/useForkRef';
import useId from '@mui/utils/useId';
import { PickersPopper } from '../../components/PickersPopper';
import {
  UseDesktopPickerParams,
  UseDesktopPickerProps,
  UseDesktopPickerSlotProps,
} from './useDesktopPicker.types';
import { usePicker } from '../usePicker';
import { PickersLayout } from '../../../PickersLayout';
import {
  FieldSection,
  PickerValidDate,
  FieldRef,
  BaseSingleInputFieldProps,
  InferError,
  PickerOwnerState,
} from '../../../models';
import { DateOrTimeViewWithMeridiem } from '../../models';
import { PickersProvider } from '../../components/PickersProvider';

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
  const fieldRef = React.useRef<FieldRef<FieldSection>>(null);

  const labelId = useId();
  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const {
    open,
    actions,
    hasUIView,
    layoutProps,
    providerProps,
    renderCurrentView,
    shouldRestoreFocus,
    fieldProps: pickerFieldProps,
    ownerState,
  } = usePicker<PickerValidDate | null, TView, FieldSection, TExternalProps, {}>({
    ...pickerParams,
    props,
    fieldRef,
    localeText,
    autoFocusView: true,
    additionalViewProps: {},
    wrapperVariant: 'desktop',
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
      onClick: open ? actions.onClose : actions.onOpen,
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
  const fieldProps = useSlotProps<
    typeof Field,
    UseDesktopPickerSlotProps<TView, TEnableAccessibleFieldDOMStructure>['field'],
    Partial<
      BaseSingleInputFieldProps<
        PickerValidDate | null,
        FieldSection,
        TEnableAccessibleFieldDOMStructure,
        InferError<TExternalProps>
      >
    >,
    PickerOwnerState
  >({
    elementType: Field,
    externalSlotProps: innerSlotProps?.field,
    additionalProps: {
      ...pickerFieldProps,
      ...(isToolbarHidden && { id: labelId }),
      readOnly,
      disabled,
      className,
      sx,
      format,
      formatDensity,
      enableAccessibleFieldDOMStructure,
      selectedSections,
      onSelectedSectionsChange,
      timezone,
      label,
      name,
      autoFocus: autoFocus && !props.open,
      focused: open ? true : undefined,
      ...(inputRef ? { inputRef } : {}),
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
    <PickersProvider {...providerProps}>
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
        {...actions}
        open={open}
        slots={slots}
        slotProps={slotProps}
        shouldRestoreFocus={shouldRestoreFocus}
        reduceAnimations={reduceAnimations}
      >
        <Layout {...layoutProps} {...slotProps?.layout} slots={slots} slotProps={slotProps}>
          {renderCurrentView()}
        </Layout>
      </PickersPopper>
    </PickersProvider>
  );

  return { renderPicker };
};
