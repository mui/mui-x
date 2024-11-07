import * as React from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { SlotComponentProps } from '@mui/utils';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import {
  BaseSingleInputFieldProps,
  FieldSelectedSections,
  FieldRef,
  PickerOwnerState,
} from '@mui/x-date-pickers/models';
import {
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
  usePickerTranslations,
} from '@mui/x-date-pickers/hooks';
import { PickersInputLocaleText } from '@mui/x-date-pickers/locales';
import {
  onSpaceOrEnter,
  UsePickerResponse,
  WrapperVariant,
  DateOrTimeViewWithMeridiem,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import {
  BaseMultiInputFieldProps,
  MultiInputFieldSlotRootProps,
  MultiInputFieldSlotTextFieldProps,
  RangeFieldSection,
  RangePosition,
  FieldType,
  UseDateRangeFieldProps,
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
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface RangePickerFieldSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends UseClearableFieldSlotProps {
  field?: SlotComponentPropsFromProps<
    BaseMultiInputFieldProps<
      PickerRangeValue,
      RangeFieldSection,
      TEnableAccessibleFieldDOMStructure,
      unknown
    >,
    {},
    PickerOwnerState
  >;
  fieldRoot?: SlotComponentProps<typeof Stack, {}, Record<string, any>>;
  fieldSeparator?: SlotComponentProps<typeof Typography, {}, Record<string, any>>;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    UseDateRangeFieldProps<TEnableAccessibleFieldDOMStructure> & { position?: RangePosition }
  >;
}

export type RangePickerPropsForFieldSlot<
  TIsSingleInput extends boolean,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
> =
  | (TIsSingleInput extends true
      ? BaseSingleInputFieldProps<
          PickerRangeValue,
          RangeFieldSection,
          TEnableAccessibleFieldDOMStructure,
          TError
        >
      : never)
  | (TIsSingleInput extends false
      ? BaseMultiInputFieldProps<
          PickerRangeValue,
          RangeFieldSection,
          TEnableAccessibleFieldDOMStructure,
          TError
        >
      : never);

export interface UseEnrichedRangePickerFieldPropsParams<
  TIsSingleInput extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
> extends Pick<
      UsePickerResponse<PickerRangeValue, TView, RangeFieldSection, any>,
      'open' | 'actions'
    >,
    UseRangePositionResponse {
  wrapperVariant: WrapperVariant;
  fieldType: FieldType;
  readOnly?: boolean;
  labelId?: string;
  disableOpenPicker?: boolean;
  onBlur?: () => void;
  label?: React.ReactNode;
  localeText: PickersInputLocaleText | undefined;
  pickerSlotProps: RangePickerFieldSlotProps<TEnableAccessibleFieldDOMStructure> | undefined;
  pickerSlots: RangePickerFieldSlots | undefined;
  fieldProps: RangePickerPropsForFieldSlot<
    TIsSingleInput,
    TEnableAccessibleFieldDOMStructure,
    TError
  >;
  anchorRef?: React.Ref<HTMLDivElement>;
  currentView?: TView | null;
  initialView?: TView;
  onViewChange?: (view: TView) => void;
  startFieldRef: React.RefObject<FieldRef<RangeFieldSection>>;
  endFieldRef: React.RefObject<FieldRef<RangeFieldSection>>;
}

const useMultiInputFieldSlotProps = <
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
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
  currentView,
  initialView,
  onViewChange,
  startFieldRef,
  endFieldRef,
}: UseEnrichedRangePickerFieldPropsParams<
  false,
  TView,
  TEnableAccessibleFieldDOMStructure,
  TError
>) => {
  type ReturnType = BaseMultiInputFieldProps<
    PickerRangeValue,
    RangeFieldSection,
    TEnableAccessibleFieldDOMStructure,
    TError
  >;

  const translations = usePickerTranslations();
  const handleStartFieldRef = useForkRef(fieldProps.unstableStartFieldRef, startFieldRef);
  const handleEndFieldRef = useForkRef(fieldProps.unstableEndFieldRef, endFieldRef);

  const previousRangePosition = React.useRef<RangePosition>(rangePosition);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const currentFieldRef = rangePosition === 'start' ? startFieldRef : endFieldRef;
    currentFieldRef.current?.focusField();
    if (!currentFieldRef.current || !currentView) {
      // could happen when the user is switching between the inputs
      previousRangePosition.current = rangePosition;
      return;
    }

    // bring back focus to the field
    currentFieldRef.current.setSelectedSections(
      // use the current view or `0` when the range position has just been swapped
      previousRangePosition.current === rangePosition ? currentView : 0,
    );
    previousRangePosition.current = rangePosition;
  }, [rangePosition, open, currentView, startFieldRef, endFieldRef]);

  const openRangeStartSelection: React.UIEventHandler = (event) => {
    event.stopPropagation();
    onRangePositionChange('start');
    if (!readOnly && !disableOpenPicker) {
      actions.onOpen(event);
    }
  };

  const openRangeEndSelection: React.UIEventHandler = (event) => {
    event.stopPropagation();
    onRangePositionChange('end');
    if (!readOnly && !disableOpenPicker) {
      actions.onOpen(event);
    }
  };

  const handleFocusStart = () => {
    if (open) {
      onRangePositionChange('start');
      if (previousRangePosition.current !== 'start' && initialView) {
        onViewChange?.(initialView);
      }
    }
  };

  const handleFocusEnd = () => {
    if (open) {
      onRangePositionChange('end');
      if (previousRangePosition.current !== 'end' && initialView) {
        onViewChange?.(initialView);
      }
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
          label: inLocaleText?.start ?? translations.start,
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
          label: inLocaleText?.end ?? translations.end,
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
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
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
  currentView,
}: UseEnrichedRangePickerFieldPropsParams<
  true,
  TView,
  TEnableAccessibleFieldDOMStructure,
  TError
>) => {
  type ReturnType = BaseSingleInputFieldProps<
    PickerRangeValue,
    RangeFieldSection,
    TEnableAccessibleFieldDOMStructure,
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

    // bring back focus to the field with the current view section selected
    if (currentView) {
      const sections = startFieldRef.current.getSections().map((section) => section.type);
      const newSelectedSection =
        rangePosition === 'start'
          ? sections.indexOf(currentView)
          : sections.lastIndexOf(currentView);
      startFieldRef.current?.focusField(newSelectedSection);
    }
  }, [rangePosition, open, currentView, startFieldRef]);

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
      actions.onOpen(event);
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
    focused: open ? true : undefined,
    ...(labelId != null && { id: labelId }),
    ...(wrapperVariant === 'mobile' && { readOnly: true }),
    // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
    // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
    ...(!readOnly && !fieldProps.disabled && { onClick: openPicker }),
  };

  return enrichedFieldProps;
};

export const useEnrichedRangePickerFieldProps = <
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
>(
  params: UseEnrichedRangePickerFieldPropsParams<
    boolean,
    TView,
    TEnableAccessibleFieldDOMStructure,
    TError
  >,
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
    return useMultiInputFieldSlotProps(
      params as UseEnrichedRangePickerFieldPropsParams<
        false,
        TView,
        TEnableAccessibleFieldDOMStructure,
        TError
      >,
    );
  }

  return useSingleInputFieldSlotProps(
    params as UseEnrichedRangePickerFieldPropsParams<
      true,
      TView,
      TEnableAccessibleFieldDOMStructure,
      TError
    >,
  );
  /* eslint-enable react-hooks/rules-of-hooks */
};
