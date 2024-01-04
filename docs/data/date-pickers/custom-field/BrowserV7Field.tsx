import * as React from 'react';
import { Dayjs } from 'dayjs';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import Box, { BoxProps } from '@mui/system/Box';
import styled from '@mui/system/styled';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import {
  unstable_useDateField as useDateField,
  UseDateFieldProps,
} from '@mui/x-date-pickers/DateField';
import { useClearableField } from '@mui/x-date-pickers/hooks';
import {
  BaseSingleInputPickersTextFieldProps,
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
} from '@mui/x-date-pickers/models';
import { Unstable_PickersSectionList as PickersSectionList } from '@mui/x-date-pickers/PickersSectionList';

const BrowserFieldRoot = styled(Box, { name: 'BrowserField', slot: 'Root' })({
  display: 'flex',
  alignItems: 'center',
});

const BrowserFieldContent = styled('div', { name: 'BrowserField', slot: 'Content' })(
  {
    border: '1px solid grey',
    fontSize: 13.33333,
    lineHeight: 'normal',
    padding: '1px 2px',
    whiteSpace: 'nowrap',
  },
);

interface BrowserTextFieldProps
  extends BaseSingleInputPickersTextFieldProps<'v7'>,
    Omit<BoxProps, keyof BaseSingleInputPickersTextFieldProps<'v7'>> {}

const BrowserTextField = React.forwardRef(
  (props: BrowserTextFieldProps, ref: React.Ref<unknown>) => {
    const {
      // Should be ignored
      textField,

      // Should be passed to the PickersSectionList component
      elements,
      sectionListRef,
      contentEditable,
      onFocus,
      onBlur,
      tabIndex,
      onInput,
      onPaste,
      onKeyDown,

      // Can be passed to a hidden <input /> element
      onChange,
      value,

      // Can be used to render a custom label
      label,

      // Can be used to style the component
      areAllSectionsEmpty,
      disabled,
      readOnly,

      InputProps: { ref: InputPropsRef, startAdornment, endAdornment } = {},

      // The rest can be passed to the root element
      ...other
    } = props;

    const handleRef = useForkRef(InputPropsRef, ref);

    return (
      <BrowserFieldRoot ref={handleRef} {...other}>
        {startAdornment}
        <BrowserFieldContent>
          <PickersSectionList
            elements={elements}
            sectionListRef={sectionListRef}
            contentEditable={contentEditable}
            onFocus={onFocus}
            onBlur={onBlur}
            tabIndex={tabIndex}
            onInput={onInput}
            onPaste={onPaste}
            onKeyDown={onKeyDown}
          />
        </BrowserFieldContent>
        {endAdornment}
      </BrowserFieldRoot>
    );
  },
);

interface BrowserDateFieldProps
  extends UseDateFieldProps<Dayjs, 'v7'>,
    BaseSingleInputFieldProps<
      Dayjs | null,
      Dayjs,
      FieldSection,
      'v7',
      DateValidationError
    > {}

const BrowserDateField = React.forwardRef(
  (props: BrowserDateFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const { slots, slotProps, ...textFieldProps } = props;

    const fieldResponse = useDateField<Dayjs, 'v7', typeof textFieldProps>({
      ...textFieldProps,
      textFieldVersion: 'v7',
    });

    /* If you don't need a clear button, you can skip the use of this hook */
    const processedFieldProps = useClearableField({
      ...fieldResponse,
      slots,
      slotProps,
    });

    return <BrowserTextField ref={ref} {...processedFieldProps} />;
  },
);

const BrowserDatePicker = React.forwardRef(
  (props: DatePickerProps<Dayjs>, ref: React.Ref<HTMLDivElement>) => {
    return (
      <DatePicker
        ref={ref}
        {...props}
        slots={{ field: BrowserDateField, ...props.slots }}
      />
    );
  },
);

export default function BrowserV7Field() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserDatePicker
        slotProps={{
          field: { clearable: true },
        }}
      />
    </LocalizationProvider>
  );
}
