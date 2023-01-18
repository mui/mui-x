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
  useLocaleText,
} from '@mui/x-date-pickers/internals';
import { unstable_useId as useId } from '@mui/utils';
import { buildWarning } from '@mui/x-date-pickers/internals/utils/warning';
import {
  MobileRangePickerAdditionalViewProps,
  UseMobileRangePickerParams,
  UseMobileRangePickerProps,
} from './useMobileRangePicker.types';
import { useRangePickerInputProps } from '../useRangePickerInputProps';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { DateRange, RangePosition } from '../../models/range';
import { BaseMultiInputFieldProps } from '../../models/fields';

const ariaLabelledByCantBeResolvedWarning = buildWarning([
  'MUI: `aria-labelledby` can not be resolved.',
  'Make sure that the picker has `start` or `end` fields  in `localeText` or the toolbar is not hidden.',
  'Alternatively you can provide a custom `aria-labelledby` to the `mobilePaper` slot props.',
]);

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
    slotProps: innerSlotProps,
    className,
    format,
    readOnly,
    disabled,
    disableOpenPicker,
    localeText,
  } = props;

  const fieldRef = React.useRef<HTMLDivElement>(null);
  const [rangePosition, setRangePosition] = React.useState<RangePosition>('start');
  const labelId = useId();
  const contextLocaleText = useLocaleText();

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
    externalSlotProps: innerSlotProps?.field,
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

  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const slotPropsForField: BaseMultiInputFieldProps<DateRange<TDate>, unknown>['slotProps'] = {
    ...fieldProps.slotProps,
    textField: (ownerState) => {
      const externalInputProps = resolveComponentProps(innerSlotProps?.textField, ownerState);
      const inputPropsPassedByField = resolveComponentProps(
        fieldProps.slotProps?.textField,
        ownerState,
      );
      const inputPropsPassedByPicker =
        ownerState.position === 'start' ? fieldslotProps.startInput : fieldslotProps.endInput;

      return {
        ...(isToolbarHidden && { id: `${labelId}-${ownerState.position}` }),
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
      const externalRootProps = resolveComponentProps(innerSlotProps?.fieldRoot, ownerState);
      const rootPropsPassedByField = resolveComponentProps(fieldProps.slotProps?.root, ownerState);
      return {
        ...externalRootProps,
        ...rootPropsPassedByField,
        ...fieldslotProps.root,
      };
    },
    separator: (ownerState) => {
      const externalSeparatorProps = resolveComponentProps(
        innerSlotProps?.fieldSeparator,
        ownerState,
      );
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
    ...innerSlotProps,
    toolbar: {
      ...innerSlotProps?.toolbar,
      titleId: labelId,
      rangePosition,
      onRangePositionChange: setRangePosition,
    } as ExportedBaseToolbarProps,
  };

  const Layout = slots?.layout ?? PickersLayout;

  const finalLocaleText = {
    ...contextLocaleText,
    ...localeText,
  };
  let labelledById = labelId;
  if (isToolbarHidden) {
    if (!finalLocaleText?.start && !finalLocaleText?.end) {
      labelledById = undefined;
    } else {
      if (finalLocaleText.start) {
        labelledById = `${labelId}-start-label`;
      }
      if (finalLocaleText.end) {
        labelledById += ` ${labelId}-end-label`;
      }
    }
  }
  if (
    !labelledById &&
    !innerSlotProps?.mobilePaper?.['aria-labelledby'] &&
    process.env.NODE_ENV !== 'production'
  ) {
    ariaLabelledByCantBeResolvedWarning();
  }
  const slotProps = {
    ...innerSlotProps,
    mobilePaper: {
      'aria-labelledby': labelledById,
      ...innerSlotProps?.mobilePaper,
    },
  };

  const renderPicker = () => (
    <LocalizationProvider localeText={localeText}>
      <WrapperVariantContext.Provider value="mobile">
        <Field {...fieldProps} slots={slotsForField} slotProps={slotPropsForField} />
        <PickersModalDialog {...actions} open={open} slots={slots} slotProps={slotProps}>
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
