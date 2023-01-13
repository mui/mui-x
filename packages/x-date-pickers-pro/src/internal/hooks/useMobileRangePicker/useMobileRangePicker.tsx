import * as React from 'react';
import { resolveComponentProps, useSlotProps } from '@mui/base/utils';
import { useLicenseVerifier } from '@mui/x-license-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  PickersLayout,
  PickersLayoutSlotsComponentsProps,
} from '@mui/x-date-pickers/PickersLayout';
import {
  DateOrTimeView,
  usePicker,
  WrapperVariantContext,
  PickersModalDialog,
  InferError,
  ExportedBaseToolbarProps,
} from '@mui/x-date-pickers/internals';
import {
  MobileRangePickerAdditionalViewProps,
  UseMobileRangePickerParams,
  UseMobileRangePickerProps,
} from './useMobileRangePicker.types';
import { useRangePickerInputProps } from '../useRangePickerInputProps';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { DateRange, RangePosition } from '../../models/range';
import { BaseMultiInputFieldProps } from '../../models/fields';

const releaseInfo = getReleaseInfo();

export const useMobileRangePicker = <
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseMobileRangePickerProps<TDate, TView, any, TExternalProps>,
>({
  props,
  valueManager,
  validator,
}: UseMobileRangePickerParams<TDate, TView, TExternalProps>) => {
  useLicenseVerifier('x-date-pickers-pro', releaseInfo);

  const {
    slots,
    slotProps,
    className,
    format,
    readOnly,
    disabled,
    disableOpenPicker,
    localeText,
  } = props;

  const fieldRef = React.useRef<HTMLDivElement>(null);
  const [rangePosition, setRangePosition] = React.useState<RangePosition>('start');

  const {
    open,
    actions,
    layoutProps,
    renderCurrentView,
    fieldProps: pickerFieldProps,
  } = usePicker<
    DateRange<TDate>,
    TDate,
    TView,
    TExternalProps,
    MobileRangePickerAdditionalViewProps
  >({
    props,
    valueManager,
    wrapperVariant: 'mobile',
    validator,
    autoFocusView: true,
    additionalViewProps: {
      rangePosition,
      onRangePositionChange: setRangePosition,
    },
  });

  const fieldslotProps = useRangePickerInputProps({
    wrapperVariant: 'mobile',
    open,
    actions,
    readOnly,
    disabled,
    disableOpenPicker,
    localeText,
    rangePosition,
    onRangePositionChange: setRangePosition,
  });

  const Field = slots.field;
  const fieldProps: BaseMultiInputFieldProps<
    DateRange<TDate>,
    InferError<TExternalProps>
  > = useSlotProps({
    elementType: Field,
    externalSlotProps: slotProps?.field,
    additionalProps: {
      ...pickerFieldProps,
      readOnly: readOnly ?? true,
      disabled,
      className,
      format,
      ref: fieldRef,
    },
    ownerState: props,
  });

  const slotsForField: BaseMultiInputFieldProps<DateRange<TDate>, unknown>['slots'] = {
    textField: slots.textField,
    ...fieldProps.slots,
  };

  const slotPropsForField: BaseMultiInputFieldProps<DateRange<TDate>, unknown>['slotProps'] = {
    ...fieldProps.slotProps,
    textField: (ownerState) => {
      const externalInputProps = resolveComponentProps(slotProps?.textField, ownerState);
      const inputPropsPassedByField = resolveComponentProps(
        fieldProps.slotProps?.textField,
        ownerState,
      );
      const inputPropsPassedByPicker =
        ownerState.position === 'start' ? fieldslotProps.startInput : fieldslotProps.endInput;

      return {
        ...externalInputProps,
        ...inputPropsPassedByField,
        ...inputPropsPassedByPicker,
        inputProps: {
          ...externalInputProps?.inputProps,
          ...inputPropsPassedByField?.inputProps,
        },
      };
    },
    root: (ownerState) => {
      const externalRootProps = resolveComponentProps(slotProps?.fieldRoot, ownerState);
      const rootPropsPassedByField = resolveComponentProps(fieldProps.slotProps?.root, ownerState);
      return {
        ...externalRootProps,
        ...rootPropsPassedByField,
        ...fieldslotProps.root,
      };
    },
    separator: (ownerState) => {
      const externalSeparatorProps = resolveComponentProps(slotProps?.fieldSeparator, ownerState);
      const separatorPropsPassedByField = resolveComponentProps(
        fieldProps.slotProps?.separator,
        ownerState,
      );
      return {
        ...externalSeparatorProps,
        ...separatorPropsPassedByField,
        ...fieldslotProps.root,
      };
    },
  };

  const slotPropsForLayout: PickersLayoutSlotsComponentsProps<DateRange<TDate>, TView> = {
    ...slotProps,
    toolbar: {
      ...slotProps?.toolbar,
      rangePosition,
      onRangePositionChange: setRangePosition,
    } as ExportedBaseToolbarProps,
  };

  const Layout = slots?.layout ?? PickersLayout;

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="mobile">
        <Field {...fieldProps} slots={slotsForField} slotProps={slotPropsForField} />
        <PickersModalDialog
          {...actions}
          open={open}
          slots={{
            ...slots,
            // Avoids to render 2 action bar, will be removed once `PickersModalDialog` stop displaying the action bar.
            actionBar: () => null,
          }}
          slotProps={{
            ...slotProps,
            actionBar: undefined,
          }}
        >
          <Layout
            {...layoutProps}
            {...slotProps?.layout}
            slots={slots}
            slotProps={slotPropsForLayout}
          >
            {renderCurrentView()}
          </Layout>
        </PickersModalDialog>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return {
    renderPicker,
  };
};
