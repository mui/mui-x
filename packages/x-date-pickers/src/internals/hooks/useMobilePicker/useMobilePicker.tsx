import * as React from 'react';
import { resolveComponentProps, useSlotProps } from '@mui/base/utils';
import useForkRef from '@mui/utils/useForkRef';
import { PickersModalDialog } from '../../components/PickersModalDialog';
import { DateOrTimeView } from '../../models';
import { UseMobilePickerParams, UseMobilePickerProps } from './useMobilePicker.types';
import { usePicker } from '../usePicker';
import { onSpaceOrEnter } from '../../utils/utils';
import { useUtils } from '../useUtils';
import { LocalizationProvider } from '../../../LocalizationProvider';
import { WrapperVariantContext } from '../../components/wrappers/WrapperVariantContext';
import { BaseFieldProps } from '../../models/fields';
import { PickersLayout } from '../../../PickersLayout';
import { InferError } from '../validation/useValidation';

/**
 * Hook managing all the single-date mobile pickers:
 * - MobileDatePicker
 * - MobileDateTimePicker
 * - MobileTimePicker
 */
export const useMobilePicker = <
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseMobilePickerProps<TDate, TView, any, TExternalProps>,
>({
  props,
  valueManager,
  getOpenDialogAriaText,
  validator,
}: UseMobilePickerParams<TDate, TView, TExternalProps>) => {
  const { slots, slotsProps, className, format, readOnly, disabled, localeText } = props;

  const utils = useUtils<TDate>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const {
    open,
    actions,
    layoutProps,
    renderCurrentView,
    fieldProps: pickerFieldProps,
  } = usePicker<TDate | null, TDate, TView, TExternalProps, {}>({
    props,
    inputRef,
    valueManager,
    validator,
    autoFocusView: true,
    additionalViewProps: {},
    wrapperVariant: 'mobile',
  });

  const Field = slots.field;
  const fieldProps: BaseFieldProps<TDate | null, InferError<TExternalProps>> = useSlotProps({
    elementType: Field,
    externalSlotProps: slotsProps?.field,
    additionalProps: {
      ...pickerFieldProps,
      readOnly: readOnly ?? true,
      disabled,
      className,
      format,
    },
    ownerState: props,
  });

  const slotsForField: BaseFieldProps<TDate, unknown>['slots'] = {
    textField: slots.textField,
    ...fieldProps.slots,
  };

  const slotsPropsForField: BaseFieldProps<TDate, unknown>['slotsProps'] = {
    ...fieldProps.slotsProps,
    textField: (ownerState) => {
      const externalInputProps = resolveComponentProps(slotsProps?.textField, ownerState);
      const inputPropsPassedByField = resolveComponentProps(
        fieldProps.slotsProps?.textField,
        ownerState,
      );

      return {
        ...inputPropsPassedByField,
        ...externalInputProps,
        disabled,
        ...(!(disabled || readOnly) && {
          onClick: actions.onOpen,
          onKeyDown: onSpaceOrEnter(actions.onOpen),
        }),
        inputProps: {
          'aria-label': getOpenDialogAriaText(pickerFieldProps.value, utils),
          ...inputPropsPassedByField?.inputProps,
          ...externalInputProps?.inputProps,
        },
      };
    },
  };

  const Layout = slots.layout ?? PickersLayout;

  const handleInputRef = useForkRef(inputRef, fieldProps.inputRef);

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="mobile">
        <Field
          {...fieldProps}
          slots={slotsForField}
          slotsProps={slotsPropsForField}
          inputRef={handleInputRef}
        />
        <PickersModalDialog
          {...actions}
          open={open}
          slots={{
            ...slots,
            // Avoids to render 2 action bar, will be removed once `PickersModalDialog` stop displaying the action bar.
            actionBar: () => null,
          }}
          slotsProps={{
            ...slotsProps,
            actionBar: undefined,
          }}
        >
          <Layout {...layoutProps} {...slotsProps?.layout} slots={slots} slotsProps={slotsProps}>
            {renderCurrentView()}
          </Layout>
        </PickersModalDialog>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return { renderPicker };
};
