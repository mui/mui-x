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
import {
  useClearableField,
  UseClearableFieldResponse,
} from '@mui/x-date-pickers/hooks';
import {
  BaseSingleInputPickersTextFieldProps,
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
} from '@mui/x-date-pickers-pro';
import { Unstable_PickersSectionList as PickersSectionList } from '@mui/x-date-pickers/PickersSectionList';

interface HeadlessFieldResponse
  extends BaseSingleInputPickersTextFieldProps<false>,
    Omit<
      BoxProps<'div'>,
      keyof BaseSingleInputPickersTextFieldProps<false> | 'ref'
    > {
  ref?: React.Ref<HTMLDivElement>;
}

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
    width: '20ch',
  },
);

const BrowserTextField = React.forwardRef(
  (
    props: UseClearableFieldResponse<HeadlessFieldResponse>,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const {
      disabled,
      label,
      InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
      // extracting `error`, 'focused', and `ownerState` as `input` does not support those props
      error,
      focused,
      textField,
      elements,
      onClick,
      onInput,
      sectionListRef,
      contentEditable,
      areAllSectionsEmpty,
      onFocus,
      onBlur,
      tabIndex,
      ...other
    } = props;

    const handleRef = useForkRef(containerRef, ref);

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
          />
        </BrowserFieldContent>
        {endAdornment}
      </BrowserFieldRoot>
    );
  },
);

interface BrowserDateFieldProps
  extends UseDateFieldProps<Dayjs, false>,
    BaseSingleInputFieldProps<
      Dayjs | null,
      Dayjs,
      FieldSection,
      false,
      DateValidationError
    > {}

const BrowserDateField = React.forwardRef(
  (props: BrowserDateFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const { slots, slotProps, ...textFieldProps } = props;

    const fieldResponse: HeadlessFieldResponse = useDateField<
      Dayjs,
      false,
      typeof textFieldProps
    >({
      ...textFieldProps,
      shouldUseV6TextField: false,
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
