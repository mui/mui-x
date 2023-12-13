import * as React from 'react';
import { Dayjs } from 'dayjs';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { useSlotProps } from '@mui/base/utils';
import styled from '@mui/system/styled';
import Box, { BoxProps } from '@mui/system/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DateRangeIcon } from '@mui/x-date-pickers/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateRangePicker,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import {
  unstable_useSingleInputDateRangeField as useSingleInputDateRangeField,
  SingleInputDateRangeFieldProps,
} from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import {
  useClearableField,
  UseClearableFieldResponse,
} from '@mui/x-date-pickers/hooks';
import { Unstable_PickersSectionList as PickersSectionList } from '@mui/x-date-pickers/PickersSectionList';
import { BasePickersTextFieldProps } from '@mui/x-date-pickers';

interface HeadlessFieldResponse
  extends BasePickersTextFieldProps,
    Omit<BoxProps<'div'>, keyof BasePickersTextFieldProps | 'ref'> {
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

interface BrowserSingleInputDateRangeFieldProps
  extends SingleInputDateRangeFieldProps<
    Dayjs,
    true,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>
  > {
  onAdornmentClick?: () => void;
}

type BrowserSingleInputDateRangeFieldComponent = ((
  props: BrowserSingleInputDateRangeFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { fieldType?: string };

const BrowserSingleInputDateRangeField = React.forwardRef(
  (props: BrowserSingleInputDateRangeFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const { slots, slotProps, onAdornmentClick, ...other } = props;

    const textFieldProps: SingleInputDateRangeFieldProps<Dayjs, false> =
      useSlotProps({
        elementType: 'input',
        externalSlotProps: slotProps?.textField,
        externalForwardedProps: other,
        ownerState: props as any,
      });

    textFieldProps.InputProps = {
      ...textFieldProps.InputProps,
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={onAdornmentClick}>
            <DateRangeIcon />
          </IconButton>
        </InputAdornment>
      ),
    };

    const fieldResponse = useSingleInputDateRangeField<
      Dayjs,
      false,
      typeof textFieldProps
    >({ ...textFieldProps, shouldUseV6TextField: false });

    /* If you don't need a clear button, you can skip the use of this hook */
    const processedFieldProps = useClearableField({
      ...fieldResponse,
      slots,
      slotProps,
    });

    return (
      <BrowserTextField
        {...processedFieldProps}
        ref={ref}
        style={{
          minWidth: 300,
        }}
      />
    );
  },
) as BrowserSingleInputDateRangeFieldComponent;

BrowserSingleInputDateRangeField.fieldType = 'single-input';

const BrowserSingleInputDateRangePicker = React.forwardRef(
  (props: DateRangePickerProps<Dayjs>, ref: React.Ref<HTMLDivElement>) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleOpen = () => setIsOpen((currentOpen) => !currentOpen);

    const handleOpen = () => setIsOpen(true);

    const handleClose = () => setIsOpen(false);

    return (
      <DateRangePicker
        ref={ref}
        {...props}
        open={isOpen}
        onClose={handleClose}
        onOpen={handleOpen}
        slots={{ ...props.slots, field: BrowserSingleInputDateRangeField }}
        slotProps={{
          ...props.slotProps,
          field: {
            onAdornmentClick: toggleOpen,
            ...props.slotProps?.field,
          } as any,
        }}
      />
    );
  },
);

export default function BrowserV7SingleInputRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserSingleInputDateRangePicker
        slotProps={{
          field: { clearable: true },
        }}
      />
    </LocalizationProvider>
  );
}
