import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { useLicenseVerifier } from '@mui/x-license';
import { PickersLayout } from '@mui/x-date-pickers/PickersLayout';
import {
  executeInTheNextEventLoopTick,
  getActiveElement,
  usePicker,
  PickersPopper,
  DateOrTimeViewWithMeridiem,
  PickerProvider,
  PickerValue,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import { FieldRef, InferError } from '@mui/x-date-pickers/models';
import {
  UseDesktopRangePickerParams,
  UseDesktopRangePickerProps,
} from './useDesktopRangePicker.types';
import {
  RangePickerPropsForFieldSlot,
  useEnrichedRangePickerFieldProps,
} from '../useEnrichedRangePickerFieldProps';
import { getReleaseInfo } from '../../utils/releaseInfo';
import { useRangePosition } from '../useRangePosition';
import { PickerRangePositionContext } from '../../../hooks/usePickerRangePositionContext';

const releaseInfo = getReleaseInfo();

export const useDesktopRangePicker = <
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TExternalProps extends UseDesktopRangePickerProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    any,
    TExternalProps
  >,
>({
  props,
  ...pickerParams
}: UseDesktopRangePickerParams<TView, TEnableAccessibleFieldDOMStructure, TExternalProps>) => {
  useLicenseVerifier('x-date-pickers-pro', releaseInfo);

  const {
    slots,
    slotProps,
    className,
    sx,
    format,
    formatDensity,
    enableAccessibleFieldDOMStructure,
    selectedSections,
    onSelectedSectionsChange,
    timezone,
    label,
    inputRef,
    name,
    readOnly,
    disabled,
    autoFocus,
    disableOpenPicker,
    localeText,
    reduceAnimations,
  } = props;

  const fieldContainerRef = React.useRef<HTMLDivElement>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const popperRef = React.useRef<HTMLDivElement>(null);
  const startFieldRef = React.useRef<FieldRef<PickerValue>>(null);
  const endFieldRef = React.useRef<FieldRef<PickerValue>>(null);
  const singleInputFieldRef = React.useRef<FieldRef<PickerRangeValue>>(null);
  const initialView = React.useRef<TView | null>(props.openTo ?? null);

  const fieldType = (slots.field as any).fieldType ?? 'multi-input';
  const rangePositionResponse = useRangePosition(
    props,
    fieldType === 'single-input' ? singleInputFieldRef : undefined,
  );

  let fieldRef: React.RefObject<FieldRef<PickerValue> | FieldRef<PickerRangeValue>>;
  if (fieldType === 'single-input') {
    fieldRef = singleInputFieldRef;
  } else if (rangePositionResponse.rangePosition === 'start') {
    fieldRef = startFieldRef;
  } else {
    fieldRef = endFieldRef;
  }

  const {
    open,
    actions,
    layoutProps,
    providerProps,
    renderCurrentView,
    shouldRestoreFocus,
    fieldProps: pickerFieldProps,
    ownerState,
  } = usePicker<PickerRangeValue, TView, TExternalProps>({
    ...pickerParams,
    props,
    variant: 'desktop',
    autoFocusView: false,
    fieldRef,
    localeText,
  });

  React.useEffect(() => {
    if (layoutProps.view) {
      initialView.current = layoutProps.view;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBlur = () => {
    executeInTheNextEventLoopTick(() => {
      if (
        fieldContainerRef.current?.contains(getActiveElement(document)) ||
        popperRef.current?.contains(getActiveElement(document))
      ) {
        return;
      }

      actions.onDismiss();
    });
  };

  const Field = slots.field;

  const fieldProps: RangePickerPropsForFieldSlot<
    boolean,
    TEnableAccessibleFieldDOMStructure,
    InferError<TExternalProps>
  > = useSlotProps({
    elementType: Field,
    externalSlotProps: slotProps?.field,
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
      ref: fieldContainerRef,
      ...(fieldType === 'single-input' && !!inputRef && { inputRef }),
      ...(fieldType === 'single-input' && { name }),
    },
    ownerState,
  });

  const enrichedFieldProps = useEnrichedRangePickerFieldProps<
    TView,
    TEnableAccessibleFieldDOMStructure,
    InferError<TExternalProps>
  >({
    variant: 'desktop',
    fieldType,
    open,
    actions,
    readOnly,
    disableOpenPicker,
    label,
    localeText,
    onBlur: handleBlur,
    pickerSlotProps: slotProps,
    pickerSlots: slots,
    fieldProps,
    anchorRef,
    startFieldRef,
    endFieldRef,
    singleInputFieldRef,
    currentView: layoutProps.view !== props.openTo ? layoutProps.view : undefined,
    initialView: initialView.current ?? undefined,
    onViewChange: layoutProps.onViewChange,
    ...rangePositionResponse,
  });

  const Layout = slots?.layout ?? PickersLayout;

  const renderPicker = () => (
    <PickerProvider {...providerProps}>
      <PickerRangePositionContext.Provider value={rangePositionResponse}>
        <Field {...enrichedFieldProps} />
        <PickersPopper
          role="tooltip"
          placement="bottom-start"
          containerRef={popperRef}
          anchorEl={anchorRef.current}
          onBlur={handleBlur}
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
      </PickerRangePositionContext.Provider>
    </PickerProvider>
  );

  return {
    renderPicker,
  };
};
