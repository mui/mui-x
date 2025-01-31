import * as React from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { SlotComponentProps } from '@mui/utils';
import resolveComponentProps from '@mui/utils/resolveComponentProps';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import {
  FieldSelectedSections,
  FieldRef,
  PickerOwnerState,
  FieldOwnerState,
} from '@mui/x-date-pickers/models';
import {
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
  usePickerTranslations,
} from '@mui/x-date-pickers/hooks';
import { PickersInputLocaleText } from '@mui/x-date-pickers/locales';
import {
  onSpaceOrEnter,
  PickerVariant,
  DateOrTimeViewWithMeridiem,
  BaseSingleInputFieldProps,
  PickerRangeValue,
  PickerValue,
  PickerContextValue,
  PickerFieldPrivateContextValue,
} from '@mui/x-date-pickers/internals';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import {
  MultiInputFieldSlotRootProps,
  MultiInputFieldSlotTextFieldProps,
  RangePosition,
  FieldType,
  PickerRangeFieldSlotProps,
} from '../../models';
import { UseRangePositionResponse } from './useRangePosition';
import { BaseMultiInputFieldProps } from '../models/fields';

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
    PickerRangeFieldSlotProps<TEnableAccessibleFieldDOMStructure>,
    {},
    PickerOwnerState
  >;
  fieldRoot?: SlotComponentProps<typeof Stack, {}, FieldOwnerState>;
  fieldSeparator?: SlotComponentProps<typeof Typography, {}, FieldOwnerState>;
  textField?: SlotComponentProps<
    typeof PickersTextField,
    {},
    FieldOwnerState & { position?: RangePosition }
  >;
}

export type RangePickerPropsForFieldSlot<TIsSingleInput extends boolean> =
  | (TIsSingleInput extends true ? BaseSingleInputFieldProps<PickerRangeValue> : never)
  | (TIsSingleInput extends false ? BaseMultiInputFieldProps : never);

export interface UseEnrichedRangePickerFieldPropsParams<
  TIsSingleInput extends boolean,
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
> extends UseRangePositionResponse {
  contextValue: PickerContextValue<PickerRangeValue, TView, TError>;
  fieldPrivateContextValue: PickerFieldPrivateContextValue;
  variant: PickerVariant;
  fieldType: FieldType;
  readOnly?: boolean;
  labelId?: string;
  disableOpenPicker?: boolean;
  onBlur?: () => void;
  localeText: PickersInputLocaleText | undefined;
  pickerSlotProps: RangePickerFieldSlotProps<TEnableAccessibleFieldDOMStructure> | undefined;
  pickerSlots: RangePickerFieldSlots | undefined;
  fieldProps: RangePickerPropsForFieldSlot<TIsSingleInput>;
  anchorRef?: React.Ref<HTMLElement>;
  currentView?: TView | null;
  initialView?: TView;
  startFieldRef: React.RefObject<FieldRef<PickerValue> | null>;
  endFieldRef: React.RefObject<FieldRef<PickerValue> | null>;
  singleInputFieldRef: React.RefObject<FieldRef<PickerRangeValue> | null>;
}

const useMultiInputFieldSlotProps = <
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
>({
  contextValue,
  variant,
  readOnly,
  labelId,
  disableOpenPicker,
  onBlur,
  rangePosition,
  setRangePosition,
  localeText: inLocaleText,
  pickerSlotProps,
  pickerSlots,
  fieldProps,
  anchorRef,
  currentView,
  initialView,
  startFieldRef,
  endFieldRef,
}: UseEnrichedRangePickerFieldPropsParams<
  false,
  TView,
  TEnableAccessibleFieldDOMStructure,
  TError
>) => {
  const translations = usePickerTranslations();
  const handleStartFieldRef = useForkRef(fieldProps.unstableStartFieldRef, startFieldRef);
  const handleEndFieldRef = useForkRef(fieldProps.unstableEndFieldRef, endFieldRef);

  const previousRangePosition = React.useRef<RangePosition>(rangePosition);

  React.useEffect(() => {
    if (!contextValue.open || variant === 'mobile') {
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
  }, [rangePosition, contextValue.open, currentView, startFieldRef, endFieldRef, variant]);

  const openRangeStartSelection: React.UIEventHandler = (event) => {
    event.stopPropagation();
    setRangePosition('start');
    if (!readOnly && !disableOpenPicker) {
      event.preventDefault();
      contextValue.setOpen(true);
    }
  };

  const openRangeEndSelection: React.UIEventHandler = (event) => {
    event.stopPropagation();
    setRangePosition('end');
    if (!readOnly && !disableOpenPicker) {
      event.preventDefault();
      contextValue.setOpen(true);
    }
  };

  const handleFocusStart = () => {
    if (contextValue.open) {
      setRangePosition('start');
      if (previousRangePosition.current !== 'start' && initialView) {
        contextValue.setView?.(initialView);
      }
    }
  };

  const handleFocusEnd = () => {
    if (contextValue.open) {
      setRangePosition('end');
      if (previousRangePosition.current !== 'end' && initialView) {
        contextValue.setView?.(initialView);
      }
    }
  };

  const slots: BaseMultiInputFieldProps['slots'] = {
    textField: pickerSlots?.textField,
    root: pickerSlots?.fieldRoot,
    separator: pickerSlots?.fieldSeparator,
    ...fieldProps.slots,
  };

  const slotProps: BaseMultiInputFieldProps['slotProps'] & {
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
          focused: contextValue.open ? rangePosition === 'start' : undefined,
          // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
          // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
          ...(!readOnly && !contextValue.disabled && { onClick: openRangeStartSelection }),
          ...(variant === 'mobile' && { readOnly: true }),
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
          focused: contextValue.open ? rangePosition === 'end' : undefined,
          // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
          // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
          ...(!readOnly && !contextValue.disabled && { onClick: openRangeEndSelection }),
          ...(variant === 'mobile' && { readOnly: true }),
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

  const enrichedFieldProps: BaseMultiInputFieldProps = {
    ...restFieldProps,
    unstableStartFieldRef: handleStartFieldRef,
    unstableEndFieldRef: handleEndFieldRef,
    slots,
    slotProps,
  };

  return {
    fieldProps: enrichedFieldProps,
    fieldPrivateContextValue: {},
  };
};

const useSingleInputFieldSlotProps = <
  TView extends DateOrTimeViewWithMeridiem,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
>({
  contextValue,
  fieldPrivateContextValue,
  variant,
  readOnly,
  labelId,
  disableOpenPicker,
  onBlur,
  rangePosition,
  setRangePosition,
  singleInputFieldRef,
  fieldProps,
  currentView,
}: UseEnrichedRangePickerFieldPropsParams<
  true,
  TView,
  TEnableAccessibleFieldDOMStructure,
  TError
>) => {
  const handleFieldRef = useForkRef(fieldProps.unstableFieldRef, singleInputFieldRef);

  React.useEffect(() => {
    if (!contextValue.open || !singleInputFieldRef.current || variant === 'mobile') {
      return;
    }

    if (singleInputFieldRef.current.isFieldFocused()) {
      return;
    }

    // bring back focus to the field with the current view section selected
    if (currentView) {
      const sections = singleInputFieldRef.current.getSections().map((section) => section.type);
      const newSelectedSection =
        rangePosition === 'start'
          ? sections.indexOf(currentView)
          : sections.lastIndexOf(currentView);
      singleInputFieldRef.current?.focusField(newSelectedSection);
    }
  }, [rangePosition, contextValue.open, currentView, singleInputFieldRef, variant]);

  const updateRangePosition = () => {
    if (!singleInputFieldRef.current?.isFieldFocused()) {
      return;
    }

    const sections = singleInputFieldRef.current.getSections();
    const activeSectionIndex = singleInputFieldRef.current?.getActiveSectionIndex();
    const domRangePosition =
      activeSectionIndex == null || activeSectionIndex < sections.length / 2 ? 'start' : 'end';

    if (domRangePosition != null && domRangePosition !== rangePosition) {
      setRangePosition(domRangePosition);
    }
  };

  const handleSelectedSectionsChange = useEventCallback(
    (selectedSection: FieldSelectedSections) => {
      setTimeout(updateRangePosition);
      fieldPrivateContextValue.onSelectedSectionsChange?.(selectedSection);
    },
  );

  const openPicker = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    event.stopPropagation();

    if (!readOnly && !disableOpenPicker) {
      event.preventDefault();
      contextValue.setOpen(true);
    }
  };

  const enrichedFieldProps: BaseSingleInputFieldProps<PickerRangeValue> = {
    ...fieldProps,
    unstableFieldRef: handleFieldRef,
    onKeyDown: onSpaceOrEnter(openPicker, fieldProps.onKeyDown),
    onBlur,
    focused: contextValue.open ? true : undefined,
    ...(labelId != null && { id: labelId }),
    ...(variant === 'mobile' && { readOnly: true }),
    // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
    // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
    ...(!readOnly && !contextValue.disabled && { onClick: openPicker }),
  };

  return {
    fieldProps: enrichedFieldProps,
    fieldPrivateContextValue: {
      onSelectedSectionsChange: handleSelectedSectionsChange,
    },
  };
};

export const useEnrichedRangePickerField = <
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
