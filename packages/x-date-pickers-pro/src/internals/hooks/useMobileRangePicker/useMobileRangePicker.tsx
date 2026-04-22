import useSlotProps from '@mui/utils/useSlotProps';
import useEventCallback from '@mui/utils/useEventCallback';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import { useLicenseVerifier } from '@mui/x-license/internals';
import { PickersLayout } from '@mui/x-date-pickers/PickersLayout';
import {
  usePicker,
  PickersModalDialog,
  ExportedBaseToolbarProps,
  DateOrTimeViewWithMeridiem,
  PickerProvider,
  PickerRangeValue,
  extractRootForwardedProps,
} from '@mui/x-date-pickers/internals';
import { usePickerTranslations } from '@mui/x-date-pickers/hooks';
import { FieldOwnerState } from '@mui/x-date-pickers/models';
import {
  UseMobileRangePickerParams,
  UseMobileRangePickerProps,
} from './useMobileRangePicker.types';
import { useRangePosition } from '../useRangePosition';
import { PickerRangePositionContext } from '../../../hooks/usePickerRangePositionContext';
import { getRangeFieldType } from '../../utils/date-fields-utils';
import { createRangePickerStepNavigation } from '../../utils/createRangePickerStepNavigation';

export const useMobileRangePicker = <
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseMobileRangePickerProps<TView, any, TExternalProps>,
>({
  props,
  steps,
  ...pickerParams
}: UseMobileRangePickerParams<TView, TExternalProps>) => {
  useLicenseVerifier({
    releaseDate: '__RELEASE_INFO__',
    version: process.env.MUI_VERSION!,
    name: 'x-date-pickers-pro',
  });

  const { slots, slotProps: innerSlotProps, label, inputRef, localeText } = props;

  const fieldType = getRangeFieldType(slots.field);
  const isSingleInput = fieldType === 'single-input';
  const rangePositionResponse = useRangePosition(props);
  const contextTranslations = usePickerTranslations();

  const getStepNavigation = createRangePickerStepNavigation({
    steps,
    rangePositionResponse,
  });

  const { providerProps, renderCurrentView, ownerState } = usePicker<
    PickerRangeValue,
    TView,
    TExternalProps
  >({
    ...pickerParams,
    props,
    variant: 'mobile',
    autoFocusView: true,
    viewContainerRole: 'dialog',
    localeText,
    getStepNavigation,
    onPopperExited: useEventCallback(() =>
      rangePositionResponse.setRangePosition(props.defaultRangePosition ?? 'start'),
    ),
  });

  const labelId = providerProps.privateContextValue.labelId;
  const isToolbarHidden = innerSlotProps?.toolbar?.hidden ?? false;

  const Field = slots.field;
  const { ownerState: fieldOwnerState, ...fieldProps } = useSlotProps({
    elementType: Field,
    externalSlotProps: innerSlotProps?.field,
    // Forward `data-*` and `aria-*` attributes set on the Picker to the field
    // so they land on the rendered text field root, matching standard HTML
    // element behavior.
    externalForwardedProps: extractRootForwardedProps(props),
    additionalProps: {
      ...(isSingleInput &&
        isToolbarHidden && {
          id: labelId,
        }),
    },
    ownerState,
  });

  const Layout = slots?.layout ?? PickersLayout;

  const finalLocaleText = {
    ...contextTranslations,
    ...localeText,
  };
  let labelledById =
    pickerParams.valueType === 'date-time'
      ? `${labelId}-start-toolbar ${labelId}-end-toolbar`
      : labelId;
  if (isToolbarHidden) {
    const labels: string[] = [];
    if (fieldType === 'multi-input') {
      if (finalLocaleText.start) {
        labels.push(`${labelId}-start-label`);
      }
      if (finalLocaleText.end) {
        labels.push(`${labelId}-end-label`);
      }
    } else if (label != null) {
      labels.push(`${labelId}-label`);
    }

    labelledById = labels.length > 0 ? labels.join(' ') : undefined;
  }
  const slotProps = {
    ...innerSlotProps,
    toolbar: {
      ...innerSlotProps?.toolbar,
      titleId: labelId,
    } as ExportedBaseToolbarProps,
    mobilePaper: {
      'aria-labelledby': labelledById,
      ...innerSlotProps?.mobilePaper,
    },
    ...((fieldType === 'multi-input' && {
      textField: (slotOwnerState: FieldOwnerState & { position: 'start' | 'end' }) => {
        return {
          ...resolveComponentProps(innerSlotProps?.textField, slotOwnerState),
          id: `${labelId}-${slotOwnerState.position}`,
        };
      },
    }) as any),
  };

  const renderPicker = () => (
    <PickerProvider {...providerProps}>
      <PickerRangePositionContext.Provider value={rangePositionResponse}>
        <Field
          {...fieldProps}
          slots={{ ...slots, ...(fieldProps as any).slots }}
          slotProps={{ ...slotProps, ...(fieldProps as any).slotProps }}
          {...(isSingleInput && {
            inputRef,
          })}
        />
        <PickersModalDialog slots={slots} slotProps={slotProps}>
          <Layout {...slotProps?.layout} slots={slots} slotProps={slotProps}>
            {renderCurrentView()}
          </Layout>
        </PickersModalDialog>
      </PickerRangePositionContext.Provider>
    </PickerProvider>
  );

  return {
    renderPicker,
  };
};
