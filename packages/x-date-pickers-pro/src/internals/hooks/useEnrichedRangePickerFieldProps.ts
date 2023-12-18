import * as React from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { resolveComponentProps, SlotComponentProps } from '@mui/base/utils';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import {
  BaseSingleInputFieldProps,
  FieldRef,
  FieldSelectedSections,
} from '@mui/x-date-pickers/models';
import { UseClearableFieldSlots, UseClearableFieldSlotProps } from '@mui/x-date-pickers/hooks';
import { DateOrTimeViewWithMeridiem } from '@mui/x-date-pickers/internals/models';
import { PickersInputLocaleText } from '@mui/x-date-pickers/locales';
import {
  BaseFieldProps,
  onSpaceOrEnter,
  useLocaleText,
  UsePickerResponse,
  WrapperVariant,
  UsePickerProps,
  SlotComponentPropsFromProps,
} from '@mui/x-date-pickers/internals';
import { DateRange, RangePosition, UseDateRangeFieldProps } from '../models';
import {
  BaseMultiInputFieldProps,
  MultiInputFieldSlotRootProps,
  MultiInputFieldSlotTextFieldProps,
  RangeFieldSection,
} from '../../models';
import { UseRangePositionResponse } from './useRangePosition';

export interface RangePickerFieldSlots extends UseClearableFieldSlots {
  field: React.ElementType;
  /**
   * Element rendered at the root.
   * Ignored if the field has only one input.
   */
  fieldRoot?: React.ElementType<StackProps>;
  /**
   * Element rendered between the two inputs.
   * Ignored if the field has only one input.
   */
  fieldSeparator?: React.ElementType<TypographyProps>;
  /**
   * Form control with an input to render a date or time inside the default field.
   * It is rendered twice: once for the start element and once for the end element.
   * @default PickersTextField, or TextField from '@mui/material' if shouldUseV6TextField is enabled.
   */
  textField?: React.ElementType;
}

export interface RangePickerFieldSlotProps<TDate, TUseV6TextField extends boolean>
  extends UseClearableFieldSlotProps {
  field?: SlotComponentPropsFromProps<
    BaseMultiInputFieldProps<DateRange<TDate>, TDate, RangeFieldSection, TUseV6TextField, unknown>,
    {},
    UsePickerProps<DateRange<TDate>, TDate, any, any, any, any>
  >;
  fieldRoot?: SlotComponentProps<typeof Stack, {}, Record<string, any>>;
  fieldSeparator?: SlotComponentProps<typeof Typography, {}, Record<string, any>>;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    UseDateRangeFieldProps<TDate, TUseV6TextField> & { position?: RangePosition }
  >;
}

export interface UseEnrichedRangePickerFieldPropsParams<
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TUseV6TextField extends boolean,
  TError,
  FieldProps extends BaseFieldProps<
    DateRange<TDate>,
    TDate,
    RangeFieldSection,
    TUseV6TextField,
    TError
  > = BaseFieldProps<DateRange<TDate>, TDate, RangeFieldSection, TUseV6TextField, TError>,
> extends Pick<
      UsePickerResponse<DateRange<TDate>, TView, RangeFieldSection, any>,
      'open' | 'actions'
    >,
    UseRangePositionResponse {
  wrapperVariant: WrapperVariant;
  fieldType: 'single-input' | 'multi-input';
  readOnly?: boolean;
  labelId?: string;
  disableOpenPicker?: boolean;
  onBlur?: () => void;
  label?: React.ReactNode;
  localeText: PickersInputLocaleText<TDate> | undefined;
  pickerSlotProps: RangePickerFieldSlotProps<TDate, TUseV6TextField> | undefined;
  pickerSlots: RangePickerFieldSlots | undefined;
  fieldProps: FieldProps;
  anchorRef?: React.Ref<HTMLDivElement>;
  startFieldRef: React.RefObject<FieldRef<RangeFieldSection>>;
  endFieldRef: React.RefObject<FieldRef<RangeFieldSection>>;
}

const useMultiInputFieldSlotProps = <
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TUseV6TextField extends boolean,
  TError,
>({
  wrapperVariant,
  open,
  actions,
  readOnly,
  labelId,
  disableOpenPicker,
  onBlur,
  rangePosition,
  onRangePositionChange,
  localeText: inLocaleText,
  pickerSlotProps,
  pickerSlots,
  fieldProps,
  anchorRef,
  startFieldRef,
  endFieldRef,
}: UseEnrichedRangePickerFieldPropsParams<
  TDate,
  TView,
  TUseV6TextField,
  TError,
  BaseMultiInputFieldProps<DateRange<TDate>, TDate, RangeFieldSection, TUseV6TextField, TError>
>) => {
  type ReturnType = BaseMultiInputFieldProps<
    DateRange<TDate>,
    TDate,
    RangeFieldSection,
    TUseV6TextField,
    TError
  >;

  const localeText = useLocaleText<TDate>();
  const handleStartFieldRef = useForkRef(fieldProps.unstableStartFieldRef, startFieldRef);
  const handleEndFieldRef = useForkRef(fieldProps.unstableEndFieldRef, endFieldRef);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    if (rangePosition === 'start') {
      startFieldRef.current?.focusField();
    } else if (rangePosition === 'end') {
      endFieldRef.current?.focusField();
    }
  }, [rangePosition, open, startFieldRef, endFieldRef]);

  const openRangeStartSelection: React.UIEventHandler = (event) => {
    event.stopPropagation();
    onRangePositionChange('start');
    if (!readOnly && !disableOpenPicker) {
      actions.onOpen();
    }
  };

  const openRangeEndSelection: React.UIEventHandler = (event) => {
    event.stopPropagation();
    onRangePositionChange('end');
    if (!readOnly && !disableOpenPicker) {
      actions.onOpen();
    }
  };

  const handleFocusStart = () => {
    if (open) {
      onRangePositionChange('start');
    }
  };

  const handleFocusEnd = () => {
    if (open) {
      onRangePositionChange('end');
    }
  };

  const slots: ReturnType['slots'] = {
    textField: pickerSlots?.textField,
    root: pickerSlots?.fieldRoot,
    separator: pickerSlots?.fieldSeparator,
    ...fieldProps.slots,
  };

  const slotProps: ReturnType['slotProps'] & {
    separator?: any;
  } = {
    ...fieldProps.slotProps,
    textField: (ownerState) => {
      const resolvedComponentProps = resolveComponentProps(pickerSlotProps?.textField, ownerState);
      let textFieldProps: MultiInputFieldSlotTextFieldProps;
      let InputProps: MultiInputFieldSlotTextFieldProps['InputProps'];
      if (ownerState.position === 'start') {
        textFieldProps = {
          label: inLocaleText?.start ?? localeText.start,
          onKeyDown: onSpaceOrEnter(openRangeStartSelection),
          onFocus: handleFocusStart,
          focused: open ? rangePosition === 'start' : undefined,
          // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
          // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
          ...(!readOnly && !fieldProps.disabled && { onClick: openRangeStartSelection }),
          ...(wrapperVariant === 'mobile' && { readOnly: true }),
        };
        if (anchorRef) {
          InputProps = {
            ...resolvedComponentProps?.InputProps,
            ref: anchorRef,
          };
        }
      } else {
        textFieldProps = {
          label: inLocaleText?.end ?? localeText.end,
          onKeyDown: onSpaceOrEnter(openRangeEndSelection),
          onFocus: handleFocusEnd,
          focused: open ? rangePosition === 'end' : undefined,
          // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
          // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
          ...(!readOnly && !fieldProps.disabled && { onClick: openRangeEndSelection }),
          ...(wrapperVariant === 'mobile' && { readOnly: true }),
        };
        InputProps = resolvedComponentProps?.InputProps;
      }

      return {
        ...(labelId != null && { id: `${labelId}-${ownerState.position!}` }),
        ...textFieldProps,
        ...resolveComponentProps(pickerSlotProps?.textField, ownerState),
        InputProps,
      };
    },
    root: (ownerState) => {
      const rootProps: MultiInputFieldSlotRootProps = {
        onBlur,
      };

      return {
        ...rootProps,
        ...resolveComponentProps(pickerSlotProps?.fieldRoot, ownerState),
      };
    },
    separator: pickerSlotProps?.fieldSeparator,
  };

  /* TODO: remove this when a clearable behavior for multiple input range fields is implemented */
  const { clearable, onClear, ...restFieldProps } = fieldProps as any;

  const enrichedFieldProps: ReturnType = {
    ...restFieldProps,
    unstableStartFieldRef: handleStartFieldRef,
    unstableEndFieldRef: handleEndFieldRef,
    slots,
    slotProps,
  };

  return enrichedFieldProps;
};

const useSingleInputFieldSlotProps = <
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TUseV6TextField extends boolean,
  TError,
>({
  wrapperVariant,
  open,
  actions,
  readOnly,
  labelId,
  disableOpenPicker,
  label,
  onBlur,
  rangePosition,
  onRangePositionChange,
  startFieldRef,
  endFieldRef,
  pickerSlots,
  pickerSlotProps,
  fieldProps,
  anchorRef,
}: UseEnrichedRangePickerFieldPropsParams<
  TDate,
  TView,
  TUseV6TextField,
  TError,
  BaseSingleInputFieldProps<DateRange<TDate>, TDate, RangeFieldSection, TUseV6TextField, TError>
>) => {
  type ReturnType = BaseSingleInputFieldProps<
    DateRange<TDate>,
    TDate,
    RangeFieldSection,
    TUseV6TextField,
    TError
  >;

  const handleFieldRef = useForkRef(fieldProps.unstableFieldRef, startFieldRef, endFieldRef);

  React.useEffect(() => {
    if (!open || !startFieldRef.current) {
      return;
    }

    if (startFieldRef.current.isFieldFocused()) {
      return;
    }

    const newSelectedSection =
      rangePosition === 'start' ? 0 : startFieldRef.current.getSections().length / 2;
    startFieldRef.current?.focusField(newSelectedSection);
  }, [rangePosition, open, startFieldRef]);

  const updateRangePosition = () => {
    if (!startFieldRef.current?.isFieldFocused()) {
      return;
    }

    const sections = startFieldRef.current.getSections();
    const activeSectionIndex = startFieldRef.current?.getActiveSectionIndex();
    const domRangePosition =
      activeSectionIndex == null || activeSectionIndex < sections.length / 2 ? 'start' : 'end';

    if (domRangePosition != null && domRangePosition !== rangePosition) {
      onRangePositionChange(domRangePosition);
    }
  };

  const handleSelectedSectionsChange = useEventCallback(
    (selectedSection: FieldSelectedSections) => {
      setTimeout(updateRangePosition);
      fieldProps.onSelectedSectionsChange?.(selectedSection);
    },
  );

  const openPicker = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    event.stopPropagation();

    if (!readOnly && !disableOpenPicker) {
      actions.onOpen();
    }
  };

  const slots = {
    ...fieldProps.slots,
    textField: pickerSlots?.textField,
    clearButton: pickerSlots?.clearButton,
    clearIcon: pickerSlots?.clearIcon,
  };

  const slotProps = {
    ...fieldProps.slotProps,
    textField: pickerSlotProps?.textField,
    clearButton: pickerSlots?.clearButton,
    clearIcon: pickerSlots?.clearIcon,
  };

  const enrichedFieldProps: ReturnType = {
    ...fieldProps,
    slots,
    slotProps,
    label,
    unstableFieldRef: handleFieldRef,
    onKeyDown: onSpaceOrEnter(openPicker, fieldProps.onKeyDown),
    onSelectedSectionsChange: handleSelectedSectionsChange,
    onBlur,
    InputProps: {
      ref: anchorRef,
      ...fieldProps?.InputProps,
    },
    focused: open,
    ...(labelId != null && { id: labelId }),
    ...(wrapperVariant === 'mobile' && { readOnly: true }),
    // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
    // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
    ...(!readOnly && !fieldProps.disabled && { onClick: openPicker }),
  };

  return enrichedFieldProps;
};

export const useEnrichedRangePickerFieldProps = <
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TUseV6TextField extends boolean,
  TError,
>(
  params: UseEnrichedRangePickerFieldPropsParams<TDate, TView, TUseV6TextField, TError>,
) => {
  /* eslint-disable react-hooks/rules-of-hooks */
  if (process.env.NODE_ENV !== 'production') {
    const fieldTypeRef = React.useRef(params.fieldType);
    if (params.fieldType !== fieldTypeRef.current) {
      console.error(
        'Should not switch between a multi input field and a single input field on a range picker.',
      );
    }
  }

  if (params.fieldType === 'multi-input') {
    return useMultiInputFieldSlotProps(params);
  }

  return useSingleInputFieldSlotProps(params);
  /* eslint-enable react-hooks/rules-of-hooks */
};
