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

export interface UseMultiInputFieldSlotsComponent {
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

export interface UseMultiInputFieldSlotsComponentsProps<TDate> {
  field?: SlotComponentProps<
    React.ElementType<BaseMultiInputFieldProps<DateRange<TDate>, unknown>>,
    {},
    unknown
  >;
  fieldRoot?: SlotComponentProps<typeof Stack, {}, unknown>;
  fieldSeparator?: SlotComponentProps<typeof Typography, {}, unknown>;
  textField?: SlotComponentProps<typeof TextField, {}, unknown>;
}

export interface UseMultiInputFieldSlotPropsParams<TDate, TView extends DateOrTimeView>
  extends Pick<UsePickerResponse<DateRange<TDate>, TView, any>, 'open' | 'actions'> {
  wrapperVariant: WrapperVariant;
  fieldType: 'single-input' | 'multi-input';
  readOnly?: boolean;
  disabled?: boolean;
  labelId?: string;
  disableOpenPicker?: boolean;
  onBlur?: () => void;
  rangePosition: RangePosition;
  onRangePositionChange: (newPosition: RangePosition) => void;
  localeText: PickersInputLocaleText<TDate> | undefined;
  pickerSlotProps: UseMultiInputFieldSlotsComponentsProps<TDate> | undefined;
  fieldSlotProps: BaseMultiInputFieldProps<DateRange<TDate>, unknown>['slotProps'];
}

const useMultiInputFieldSlotProps = <TDate, TView extends DateOrTimeView>({
  wrapperVariant,
  open,
  actions,
  readOnly,
  disabled,
  labelId,
  disableOpenPicker,
  onBlur,
  rangePosition,
  onRangePositionChange,
  localeText: inLocaleText,
  pickerSlotProps,
  fieldSlotProps: inFieldSlotProps,
}: UseMultiInputFieldSlotPropsParams<TDate, TView>): typeof inFieldSlotProps & {
  separator?: any;
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

  const readOnlyInput = readOnly ?? wrapperVariant === 'mobile';

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

  return {
    ...inFieldSlotProps,
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
        ...(labelId != null && { id: `${labelId}-${ownerState.position!}` }),
        ...resolveComponentProps(pickerSlotProps?.textField, ownerState),
        ...inputProps,
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

const useSingleInputFieldSlotProps = <TDate, TView extends DateOrTimeView>({
  wrapperVariant,
  open,
  actions,
  readOnly,
  disabled,
  labelId,
  disableOpenPicker,
  onBlur,
  rangePosition,
  onRangePositionChange,
  pickerSlotProps,
  fieldSlotProps: inFieldSlotProps,
}: UseMultiInputFieldSlotPropsParams<TDate, TView>): typeof inFieldSlotProps => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    inputRef.current?.focus();
  }, [rangePosition, open]);

  const readOnlyInput = readOnly ?? wrapperVariant === 'mobile';

  return {
    ...inFieldSlotProps,
    textField: (ownerState) => {
      return {
        ...(labelId != null && { id: labelId }),
        ...resolveComponentProps(pickerSlotProps?.textField, ownerState),
        inputRef,
        // label: inLocaleText?.start ?? localeText.start,
        // onKeyDown: onSpaceOrEnter(openRangeStartSelection),
        // onFocus: focusOnRangeStart,
        focused: open,
        // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
        // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
        // ...(!readOnly && !disabled && { onClick: openRangeStartSelection }),
        readOnly: readOnlyInput,
        disabled,
      };
    },
  };
};

export const useRangePickerFieldSlotProps = <TDate, TView extends DateOrTimeView>(
  params: UseMultiInputFieldSlotPropsParams<TDate, TView>,
) => {
  if (params.fieldType === 'multi-input') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMultiInputFieldSlotProps(params);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSingleInputFieldSlotProps(params);
};
