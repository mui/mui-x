import * as React from 'react';
import { resolveComponentProps, useSlotProps } from '@mui/base/utils';
import useForkRef from '@mui/utils/useForkRef';
import useId from '@mui/utils/useId';
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
import { buildWarning } from '../../utils/warning';

const ariaLabelledByCantBeResolvedWarning = buildWarning([
  'MUI: `aria-labelledby` can not be resolved.',
  'Make sure that the picker has a `label` or the toolbar is not hidden.',
  'Alternatively you can provide a custom `aria-labelledby` to the `mobilePaper` slot props.',
]);

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
  const {
    slots,
    slotProps: innerSlotProps,
    className,
    sx,
    format,
    label,
    inputRef,
    readOnly,
    disabled,
    localeText,
  } = props;

  const utils = useUtils<TDate>();
  const internalInputRef = React.useRef<HTMLInputElement>(null);
  const labelId = useId();

  const {
    open,
    actions,
    layoutProps,
    renderCurrentView,
    fieldProps: pickerFieldProps,
  } = usePicker<TDate | null, TDate, TView, TExternalProps, {}>({
    props,
    inputRef: internalInputRef,
    valueManager,
    validator,
    autoFocusView: true,
    additionalViewProps: {},
    wrapperVariant: 'mobile',
  });

  const Field = slots.field;
  const fieldProps: BaseFieldProps<TDate | null, InferError<TExternalProps>> = useSlotProps({
    elementType: Field,
    externalSlotProps: innerSlotProps?.field,
    additionalProps: {
      ...pickerFieldProps,
      readOnly: readOnly ?? true,
      disabled,
      className,
      sx,
      format,
      label,
    },
    ownerState: props,
  });

  const slotsForField: BaseFieldProps<TDate, unknown>['slots'] = {
    textField: slots.textField,
    ...fieldProps.slots,
  };

  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const slotPropsForField: BaseFieldProps<TDate, unknown>['slotProps'] = {
    ...fieldProps.slotProps,
    textField: (ownerState) => {
      const externalInputProps = resolveComponentProps(innerSlotProps?.textField, ownerState);
      const inputPropsPassedByField = resolveComponentProps(
        fieldProps.slotProps?.textField,
        ownerState,
      );

      return {
        ...(isToolbarHidden && { id: labelId }),
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

  const handleInputRef = useForkRef(internalInputRef, fieldProps.inputRef, inputRef);

  let labelledById = labelId;
  if (isToolbarHidden) {
    if (label) {
      labelledById = `${labelId}-label`;
    } else {
      labelledById = undefined;
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    if (!labelledById && !innerSlotProps?.mobilePaper?.['aria-labelledby']) {
      ariaLabelledByCantBeResolvedWarning();
    }
  }
  const slotProps = {
    ...innerSlotProps,
    toolbar: {
      ...innerSlotProps?.toolbar,
      titleId: labelId,
    },
    mobilePaper: {
      'aria-labelledby': labelledById,
      ...innerSlotProps?.mobilePaper,
    },
  };

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="mobile">
        <Field
          {...fieldProps}
          slots={slotsForField}
          slotProps={slotPropsForField}
          inputRef={handleInputRef}
        />
        <PickersModalDialog {...actions} open={open} slots={slots} slotProps={slotProps}>
          <Layout {...layoutProps} {...slotProps?.layout} slots={slots} slotProps={slotProps}>
            {renderCurrentView()}
          </Layout>
        </PickersModalDialog>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return { renderPicker };
};
