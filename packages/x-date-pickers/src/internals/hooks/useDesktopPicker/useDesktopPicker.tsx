import * as React from 'react';
import { resolveComponentProps, useSlotProps } from '@mui/base/utils';
import MuiInputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import useForkRef from '@mui/utils/useForkRef';
import { PickersPopper } from '../../components/PickersPopper';
import { CalendarOrClockPickerView } from '../../models/views';
import { UseDesktopPickerParams } from './useDesktopPicker.types';
import { useUtils } from '../useUtils';
import { usePicker } from '../usePicker';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { WrapperVariantContext } from '../../components/wrappers/WrapperVariantContext';
import { BaseFieldProps } from '../../models/fields';
import { PickerViewLayout } from '../../components/PickerViewLayout';

/**
 * Hook managing all the single-date desktop pickers:
 * - DesktopDatePicker
 * - DesktopDateTimePicker
 * - DesktopTimePicker
 */
export const useDesktopPicker = <TDate, TView extends CalendarOrClockPickerView>({
  props,
  valueManager,
  renderViews: renderViewsParam,
  getOpenDialogAriaText,
  sectionModeLookup,
}: UseDesktopPickerParams<TDate, TView>) => {
  const { components, componentsProps, className, inputFormat, readOnly, disabled, localeText } =
    props;

  const utils = useUtils<TDate>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const {
    fieldProps: pickerFieldProps,
    layoutProps,
    renderViews,
    actions,
    open,
    hasPopperView,
    shouldRestoreFocus,
  } = usePicker({
    props,
    valueManager,
    wrapperVariant: 'desktop',
    renderViews: renderViewsParam,
    sectionModeLookup,
    inputRef,
    additionalViewProps: {},
  });

  const Field = components.Field;
  const fieldProps: BaseFieldProps<TDate | null, unknown> = useSlotProps({
    elementType: Field,
    externalSlotProps: componentsProps?.field,
    additionalProps: {
      ...pickerFieldProps,
      readOnly,
      disabled,
      className,
      format: inputFormat,
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const InputAdornment = components.InputAdornment ?? MuiInputAdornment;
  const inputAdornmentProps = useSlotProps({
    elementType: InputAdornment,
    externalSlotProps: componentsProps?.inputAdornment,
    additionalProps: {
      position: 'end',
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const OpenPickerButton = components.OpenPickerButton ?? IconButton;
  const { ownerState: openPickerButtonOwnerState, ...openPickerButtonProps } = useSlotProps({
    elementType: OpenPickerButton,
    externalSlotProps: componentsProps?.openPickerButton,
    additionalProps: {
      disabled: disabled || readOnly,
      onClick: actions.onOpen,
      'aria-label': getOpenDialogAriaText(pickerFieldProps.value, utils),
      edge: inputAdornmentProps.position,
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const OpenPickerIcon = components.OpenPickerIcon;
  const { ownerState: openPickerIconOwnerState, ...openPickerIconProps } = useSlotProps({
    elementType: OpenPickerIcon,
    externalSlotProps: componentsProps?.openPickerIcon,
    // TODO: Pass owner state
    ownerState: {},
  });

  const componentsForField: BaseFieldProps<TDate | null, unknown>['components'] = {
    ...fieldProps.components,
    Input: components.Input,
  };

  const componentsPropsForField: BaseFieldProps<TDate | null, unknown>['componentsProps'] = {
    ...fieldProps.componentsProps,
    input: (ownerState) => {
      const externalInputProps = resolveComponentProps(componentsProps?.input, ownerState);
      const inputPropsPassedByField = resolveComponentProps(
        fieldProps.componentsProps?.input,
        ownerState,
      );

      return {
        ...inputPropsPassedByField,
        ...externalInputProps,
        InputProps: {
          [`${inputAdornmentProps.position}Adornment`]: hasPopperView ? (
            <InputAdornment {...inputAdornmentProps}>
              <OpenPickerButton {...openPickerButtonProps}>
                <OpenPickerIcon {...openPickerIconProps} />
              </OpenPickerButton>
            </InputAdornment>
          ) : undefined,
          ...inputPropsPassedByField?.InputProps,
          ...externalInputProps?.InputProps,
        },
      };
    },
  };

  const handleInputRef = useForkRef(inputRef, fieldProps.inputRef);

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="desktop">
        <Field
          {...fieldProps}
          components={componentsForField}
          componentsProps={componentsPropsForField}
          inputRef={handleInputRef}
        />
        <PickersPopper
          role="dialog"
          anchorEl={inputRef.current}
          {...actions}
          open={open}
          // TODO v6: Pass all slots once `PickersPopper` does not handle the layouting parts
          components={{
            DesktopPaper: components.DesktopPaper,
            DesktopTransition: components.DesktopTransition,
            DesktopTrapFocus: components.DesktopTrapFocus,
            Popper: components.Popper,
            PaperContent: components.PaperContent,
          }}
          // TODO v6: Pass all slots once `PickersPopper` does not handle the layouting parts
          componentsProps={{
            desktopPaper: componentsProps?.desktopPaper,
            desktopTransition: componentsProps?.desktopTransition,
            desktopTrapFocus: componentsProps?.desktopTrapFocus,
            popper: componentsProps?.popper,
            paperContent: componentsProps?.paperContent,
          }}
          shouldRestoreFocus={shouldRestoreFocus}
        >
          <PickerViewLayout
            {...layoutProps}
            components={components}
            componentsProps={componentsProps}
          >
            {renderViews()}
          </PickerViewLayout>
        </PickersPopper>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return { renderPicker };
};
