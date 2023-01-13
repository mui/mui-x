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
  executeInTheNextEventLoopTick,
  getActiveElement,
  usePicker,
  WrapperVariantContext,
  PickersPopper,
  InferError,
  ExportedBaseToolbarProps,
  uncapitalizeObjectKeys,
} from '@mui/x-date-pickers/internals';
import {
  DesktopRangePickerAdditionalViewProps,
  UseDesktopRangePickerParams,
  UseDesktopRangePickerProps,
} from './useDesktopRangePicker.types';
import { useRangePickerInputProps } from '../useRangePickerInputProps';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { DateRange, RangePosition } from '../../models/range';
import { BaseMultiInputFieldProps } from '../../models/fields';

const releaseInfo = getReleaseInfo();

export const useDesktopRangePicker = <
  TDate,
  TView extends DateOrTimeView,
  TExternalProps extends UseDesktopRangePickerProps<TDate, TView, any, TExternalProps>,
>({
  props,
  valueManager,
  validator,
}: UseDesktopRangePickerParams<TDate, TView, TExternalProps>) => {
  useLicenseVerifier('x-date-pickers-pro', releaseInfo);

  const {
    slots: innerSlots,
    slotProps: innerSlotProps,
    components,
    componentsProps,
    className,
    format,
    readOnly,
    disabled,
    autoFocus,
    disableOpenPicker,
    localeText,
  } = props;
  const slots = innerSlots ?? uncapitalizeObjectKeys(components);
  const slotProps = innerSlotProps ?? componentsProps;

  const fieldRef = React.useRef<HTMLDivElement>(null);
  const popperRef = React.useRef<HTMLDivElement>(null);
  const [rangePosition, setRangePosition] = React.useState<RangePosition>('start');

  const {
    open,
    actions,
    layoutProps,
    renderCurrentView,
    shouldRestoreFocus,
    fieldProps: pickerFieldProps,
  } = usePicker<
    DateRange<TDate>,
    TDate,
    TView,
    TExternalProps,
    DesktopRangePickerAdditionalViewProps
  >({
    props,
    valueManager,
    wrapperVariant: 'desktop',
    validator,
    autoFocusView: true,
    additionalViewProps: {
      rangePosition,
      onRangePositionChange: setRangePosition,
    },
  });

  const handleBlur = () => {
    executeInTheNextEventLoopTick(() => {
      if (
        fieldRef.current?.contains(getActiveElement(document)) ||
        popperRef.current?.contains(getActiveElement(document))
      ) {
        return;
      }

      actions.onDismiss();
    });
  };

  const fieldslotProps = useRangePickerInputProps({
    wrapperVariant: 'desktop',
    open,
    actions,
    readOnly,
    disabled,
    disableOpenPicker,
    localeText,
    onBlur: handleBlur,
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
      readOnly,
      disabled,
      className,
      format,
      autoFocus: autoFocus && !props.open,
      ref: fieldRef,
    },
    ownerState: props,
  });

  const slotsForField: BaseMultiInputFieldProps<DateRange<TDate>, unknown>['slots'] = {
    textField: slots.textField,
    root: slots.fieldRoot,
    separator: slots.fieldSeparator,
    ...(fieldProps.slots ?? uncapitalizeObjectKeys(fieldProps?.components)),
  };

  const slotPropsFromFieldProps = fieldProps.slotProps ?? fieldProps.componentsProps;
  const slotPropsForField: BaseMultiInputFieldProps<DateRange<TDate>, unknown>['slotProps'] = {
    ...slotPropsFromFieldProps,
    textField: (ownerState) => {
      const externalInputProps = resolveComponentProps(slotProps?.textField, ownerState);
      const inputPropsPassedByField = resolveComponentProps(
        slotPropsFromFieldProps?.textField,
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
      const rootPropsPassedByField = resolveComponentProps(
        slotPropsFromFieldProps?.root,
        ownerState,
      );
      return {
        ...externalRootProps,
        ...rootPropsPassedByField,
        ...fieldslotProps.root,
      };
    },
    separator: (ownerState) => {
      const externalSeparatorProps = resolveComponentProps(slotProps?.fieldSeparator, ownerState);
      const separatorPropsPassedByField = resolveComponentProps(
        slotPropsFromFieldProps?.separator,
        ownerState,
      );
      return {
        ...externalSeparatorProps,
        ...separatorPropsPassedByField,
        ...fieldslotProps.root,
      };
    },
  };

  const slotPropsForLayout: PickersLayoutSlotsComponentsProps<DateRange<TDate>, TDate, TView> = {
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
      <WrapperVariantContext.Provider value="desktop">
        <Field {...fieldProps} slots={slotsForField} slotProps={slotPropsForField} />
        <PickersPopper
          role="tooltip"
          containerRef={popperRef}
          anchorEl={fieldRef.current}
          onBlur={handleBlur}
          {...actions}
          open={open}
          slots={{
            ...slots,
            // Avoids to render 2 action bar, will be removed once `PickersPopper` stop displaying the action bar.
            actionBar: () => null,
          }}
          slotProps={{
            ...slotProps,
            actionBar: undefined,
          }}
          shouldRestoreFocus={shouldRestoreFocus}
        >
          <Layout
            {...layoutProps}
            {...slotProps?.layout}
            slots={slots}
            slotProps={slotPropsForLayout}
          >
            {renderCurrentView()}
          </Layout>
        </PickersPopper>
      </WrapperVariantContext.Provider>
    </LocalizationProvider>
  );

  return {
    renderPicker,
  };
};
