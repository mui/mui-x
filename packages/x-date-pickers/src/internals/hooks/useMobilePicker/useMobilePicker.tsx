import * as React from 'react';
import { useSlotProps } from '@mui/base/utils';
import { TextFieldProps } from '@mui/material/TextField';
import useForkRef from '@mui/utils/useForkRef';
import { PickersModalDialog } from '../../components/PickersModalDialog';
import { CalendarOrClockPickerView } from '../../models';
import { UseMobilePickerParams } from './useMobilePicker.types';
import { usePicker } from '../usePicker';
import { onSpaceOrEnter } from '../../utils/utils';
import { useUtils } from '../useUtils';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { WrapperVariantContext } from '../../components/wrappers/WrapperVariantContext';

/**
 * Hook managing all the single-date mobile pickers:
 * - MobileDatePicker
 * - MobileDateTimePicker
 * - MobileTimePicker
 */
export const useMobilePicker = <TDate, TView extends CalendarOrClockPickerView>({
  props,
  valueManager,
  renderViews: renderViewsParam,
  getOpenDialogAriaText,
  sectionModeLookup,
}: UseMobilePickerParams<TDate, TView>) => {
  const { components, componentsProps = {}, className, inputFormat, disabled, localeText } = props;

  const utils = useUtils<TDate>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const {
    field: headlessPickerFieldResponse,
    renderViews,
    actions,
    open,
  } = usePicker({
    props,
    valueManager,
    wrapperVariant: 'mobile',
    renderViews: renderViewsParam,
    sectionModeLookup,
    inputRef,
  });

  const Field = components.Field;
  const fieldProps = useSlotProps({
    elementType: Field,
    externalSlotProps: componentsProps.field,
    additionalProps: {
      ...headlessPickerFieldResponse,
      readOnly: true,
      disabled,
      className,
      format: inputFormat,
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const Input = components.Input!;
  const inputProps: TextFieldProps = useSlotProps({
    elementType: Input,
    externalSlotProps: componentsProps.input,
    additionalProps: {
      onClick: props.readOnly ? undefined : actions.onOpen,
      onKeyDown: onSpaceOrEnter(actions.onOpen),
    },
    // TODO: Pass owner state
    ownerState: {},
  });

  const htmlInputProps = {
    ...inputProps.inputProps,
    // TODO: Correctly support date range
    'aria-label': getOpenDialogAriaText(fieldProps.value as any as TDate, utils),
  };

  // TODO: Correctly type the field slot
  const handleInputRef = useForkRef(inputRef, (fieldProps as any).inputRef);

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="desktop">
        <Field
          {...fieldProps}
          components={{
            ...(fieldProps as any).components,
            Input: components.Input,
          }}
          componentsProps={{
            input: {
              ...(fieldProps as any).componentsProps,
              ...inputProps,
              inputProps: htmlInputProps,
            },
          }}
          inputRef={handleInputRef}
        />
        <PickersModalDialog
          {...actions}
          open={open}
          components={components}
          componentsProps={componentsProps}
        >
          {renderViews()}
        </PickersModalDialog>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return { renderPicker };
};
