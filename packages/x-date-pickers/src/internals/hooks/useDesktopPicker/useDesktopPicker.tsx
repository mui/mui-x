import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import MuiInputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import useForkRef from '@mui/utils/useForkRef';
import useId from '@mui/utils/useId';
import { PickersPopper } from '../../components/PickersPopper';
import { UseDesktopPickerParams, UseDesktopPickerProps } from './useDesktopPicker.types';
import { useUtils } from '../useUtils';
import { usePicker } from '../usePicker';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { PickersLayout } from '../../../PickersLayout';
import { InferError } from '../validation/useValidation';
import { FieldSection, BaseSingleInputFieldProps, DateOrTimeView } from '../../../models';

/**
 * Hook managing all the single-date desktop pickers:
 * - DesktopDatePicker
 * - DesktopDateTimePicker
 * - DesktopTimePicker
 */
export const useDesktopPicker = <
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseDesktopPickerProps<TDate, TView, any, TExternalProps>,
>({
  props,
  valueManager,
  getOpenDialogAriaText,
  validator,
}: UseDesktopPickerParams<TDate, TView, TExternalProps>) => {
  const {
    slots,
    slotProps: innerSlotProps,
    className,
    sx,
    format,
    formatDensity,
    label,
    inputRef,
    readOnly,
    disabled,
    autoFocus,
    localeText,
  } = props;

  const utils = useUtils<TDate>();
  const internalInputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const labelId = useId();
  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const {
    open,
    actions,
    hasUIView,
    layoutProps,
    renderCurrentView,
    shouldRestoreFocus,
    fieldProps: pickerFieldProps,
  } = usePicker<TDate | null, TDate, TView, FieldSection, TExternalProps, {}>({
    props,
    inputRef: internalInputRef,
    valueManager,
    validator,
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
    ownerState: props,
  });

  const OpenPickerButton = slots.openPickerButton ?? IconButton;
  const { ownerState: openPickerButtonOwnerState, ...openPickerButtonProps } = useSlotProps({
    elementType: OpenPickerButton,
    externalSlotProps: innerSlotProps?.openPickerButton,
    additionalProps: {
      disabled: disabled || readOnly,
      onClick: actions.onOpen,
      'aria-label': getOpenDialogAriaText(pickerFieldProps.value, utils),
      edge: inputAdornmentProps.position,
    },
    ownerState: props,
  });

  const OpenPickerIcon = slots.openPickerIcon;

  const Field = slots.field;
  const fieldProps: BaseSingleInputFieldProps<
    TDate | null,
    FieldSection,
    InferError<TExternalProps>
  > = useSlotProps({
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
      label,
      autoFocus: autoFocus && !props.open,
    },
    ownerState: props,
  });

  // TODO: Move to `useSlotProps` when https://github.com/mui/material-ui/pull/35088 will be merged
  if (hasUIView) {
    fieldProps.InputProps = {
      ...fieldProps.InputProps,
      ref: containerRef,
      [`${inputAdornmentProps.position}Adornment`]: (
        <InputAdornment {...inputAdornmentProps}>
          <OpenPickerButton {...openPickerButtonProps}>
            <OpenPickerIcon {...innerSlotProps?.openPickerIcon} />
          </OpenPickerButton>
        </InputAdornment>
      ),
    };
  }

  const slotsForField: BaseSingleInputFieldProps<TDate | null, FieldSection, unknown>['slots'] = {
    textField: slots.textField,
    ...fieldProps.slots,
  };

  const Layout = slots.layout ?? PickersLayout;

  const handleInputRef = useForkRef(internalInputRef, fieldProps.inputRef, inputRef);

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

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <Field
        {...fieldProps}
        slots={slotsForField}
        slotProps={slotProps}
        inputRef={handleInputRef}
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
      >
        <Layout {...layoutProps} {...slotProps?.layout} slots={slots} slotProps={slotProps}>
          {renderCurrentView()}
        </Layout>
      </PickersPopper>
    </LocalizationProvider>
  );

  return { renderPicker };
};
