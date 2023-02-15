import * as React from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { resolveComponentProps, SlotComponentProps } from '@mui/base/utils';
import { PickersInputLocaleText } from '@mui/x-date-pickers';
import {
  DateOrTimeView,
  onSpaceOrEnter,
  useLocaleText,
  UsePickerResponse,
  WrapperVariant,
} from '@mui/x-date-pickers/internals';
import {
  BaseMultiInputFieldProps,
  DateRange,
  MultiInputFieldSlotRootProps,
  MultiInputFieldSlotTextFieldProps,
  RangePosition,
} from '../models';

export interface UseRangePickerFieldSlotsComponent {
  Field: React.ElementType;
  FieldRoot?: React.ElementType<StackProps>;
  FieldSeparator?: React.ElementType<TypographyProps>;
  /**
   * Form control with an input to render a date or time inside the default field.
   * It is rendered twice: once for the start element and once for the end element.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  TextField?: React.ElementType<TextFieldProps>;
}

export interface UseRangePickerFieldSlotsComponentsProps<TDate> {
  field?: SlotComponentProps<
    React.ElementType<BaseMultiInputFieldProps<DateRange<TDate>, unknown>>,
    {},
    unknown
  >;
  fieldRoot?: SlotComponentProps<typeof Stack, {}, unknown>;
  fieldSeparator?: SlotComponentProps<typeof Typography, {}, unknown>;
  textField?: SlotComponentProps<typeof TextField, {}, unknown>;
}

export interface UseRangePickerFieldParams<TDate, TView extends DateOrTimeView>
  extends Pick<UsePickerResponse<DateRange<TDate>, TView, any>, 'open' | 'actions'> {
  wrapperVariant: WrapperVariant;
  readOnly?: boolean;
  disabled?: boolean;
  disableOpenPicker?: boolean;
  onBlur?: () => void;
  rangePosition: RangePosition;
  onRangePositionChange: (newPosition: RangePosition) => void;
  localeText: PickersInputLocaleText<TDate> | undefined;
  pickerSlotProps: UseRangePickerFieldSlotsComponentsProps<TDate> | undefined;
  fieldSlotProps: BaseMultiInputFieldProps<DateRange<TDate>, unknown>['slotProps'];
  getTextFieldId?: (position: RangePosition) => string;
}

export const useRangePickerMultiInputFieldSlotProps = <TDate, TView extends DateOrTimeView>({
  wrapperVariant,
  open,
  actions,
  readOnly,
  disabled,
  disableOpenPicker,
  onBlur,
  rangePosition,
  onRangePositionChange,
  localeText: inLocaleText,
  pickerSlotProps,
  fieldSlotProps,
  getTextFieldId,
}: UseRangePickerFieldParams<TDate, TView>): typeof fieldSlotProps & {
  separator: any;
} => {
  const localeText = useLocaleText<TDate>();
  const startRef = React.useRef<HTMLInputElement>(null);
  const endRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    if (rangePosition === 'start') {
      startRef.current?.focus();
    } else if (rangePosition === 'end') {
      endRef.current?.focus();
    }
  }, [rangePosition, open]);

  const openRangeStartSelection = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => {
    event.stopPropagation();
    onRangePositionChange('start');
    if (!readOnly && !disableOpenPicker) {
      actions.onOpen();
    }
  };

  const openRangeEndSelection = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => {
    event.stopPropagation();
    onRangePositionChange('end');
    if (!readOnly && !disableOpenPicker) {
      actions.onOpen();
    }
  };

  const focusOnRangeStart = () => {
    if (open) {
      onRangePositionChange('start');
    }
  };

  const focusOnRangeEnd = () => {
    if (open) {
      onRangePositionChange('end');
    }
  };

  const readOnlyInput = readOnly ?? wrapperVariant === 'mobile';

  return {
    ...fieldSlotProps,
    textField: (ownerState) => {
      let inputProps: MultiInputFieldSlotTextFieldProps;
      if (ownerState.position === 'start') {
        inputProps = {
          inputRef: startRef,
          label: inLocaleText?.start ?? localeText.start,
          onKeyDown: onSpaceOrEnter(openRangeStartSelection),
          onFocus: focusOnRangeStart,
          focused: open ? rangePosition === 'start' : undefined,
          // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
          // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
          ...(!readOnly && !disabled && { onClick: openRangeStartSelection }),
          readOnly: readOnlyInput,
          disabled,
        };
      } else {
        inputProps = {
          inputRef: endRef,
          label: inLocaleText?.end ?? localeText.end,
          onKeyDown: onSpaceOrEnter(openRangeEndSelection),
          onFocus: focusOnRangeEnd,
          focused: open ? rangePosition === 'end' : undefined,
          // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
          // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
          ...(!readOnly && !disabled && { onClick: openRangeEndSelection }),
          readOnly: readOnlyInput,
          disabled,
        };
      }

      return {
        ...resolveComponentProps(pickerSlotProps?.textField, ownerState),
        ...inputProps,
        ...(getTextFieldId ? { id: getTextFieldId(ownerState.position!) } : {}),
      };
    },
    root: (ownerState) => {
      const rootProps: MultiInputFieldSlotRootProps = {
        onBlur,
      };

      return {
        ...resolveComponentProps(pickerSlotProps?.fieldRoot, ownerState),
        ...rootProps,
      };
    },
    separator: pickerSlotProps?.fieldSeparator,
  };
};
