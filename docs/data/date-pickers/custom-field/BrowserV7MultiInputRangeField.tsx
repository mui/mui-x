import * as React from 'react';
import { Dayjs } from 'dayjs';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { useSlotProps } from '@mui/base/utils';
import Box from '@mui/material/Box';
import styled from '@mui/system/styled';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateRangePicker,
  DateRangePickerProps,
} from '@mui/x-date-pickers-pro/DateRangePicker';
import { unstable_useMultiInputDateRangeField as useMultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import {
  BaseMultiInputFieldProps,
  DateRange,
  DateRangeValidationError,
  UseDateRangeFieldProps,
  MultiInputFieldSlotTextFieldProps,
  RangeFieldSection,
} from '@mui/x-date-pickers-pro';
import {
  PickersSectionListProps,
  Unstable_PickersSectionList as PickersSectionList,
} from '@mui/x-date-pickers/PickersSectionList';

interface BrowserFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'contentEditable'>,
    Pick<
      PickersSectionListProps,
      'elements' | 'sectionListRef' | 'contentEditable' | 'tabIndex'
    > {
  label?: React.ReactNode;
  inputRef?: React.Ref<any>;
  InputProps?: {
    ref?: React.Ref<any>;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
  error?: boolean;
  focused?: boolean;
  ownerState?: any;
  sx?: any;
  textField: 'v6' | 'v7';
}

type BrowserFieldComponent = ((
  props: BrowserFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const BrowserFieldContent = styled('div', { name: 'BrowserField', slot: 'Content' })(
  {
    border: '1px solid grey',
    fontSize: 13.33333,
    lineHeight: 'normal',
    padding: '1px 2px',
    width: '20ch',
  },
);

const BrowserField = React.forwardRef(
  (props: BrowserFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const {
      disabled,
      id,
      label,
      inputRef,
      InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
      // extracting `error`, 'focused', and `ownerState` as `input` does not support those props
      error,
      focused,
      ownerState,
      sx,
      textField,
      elements,
      onClick,
      onInput,
      sectionListRef,

      contentEditable,
      onFocus,
      onBlur,
      tabIndex,
      ...other
    } = props;

    const handleRef = useForkRef(containerRef, ref);

    return (
      <Box
        sx={{ ...(sx || {}), display: 'flex', alignItems: 'center' }}
        id={id}
        ref={handleRef}
        {...other}
      >
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
      </Box>
    );
  },
) as BrowserFieldComponent;

interface BrowserMultiInputDateRangeFieldProps
  extends UseDateRangeFieldProps<Dayjs, true>,
    BaseMultiInputFieldProps<
      DateRange<Dayjs>,
      Dayjs,
      RangeFieldSection,
      true,
      DateRangeValidationError
    > {}

type BrowserMultiInputDateRangeFieldComponent = ((
  props: BrowserMultiInputDateRangeFieldProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const BrowserMultiInputDateRangeField = React.forwardRef(
  (props: BrowserMultiInputDateRangeFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const {
      slotProps,
      value,
      defaultValue,
      format,
      onChange,
      readOnly,
      disabled,
      onError,
      shouldDisableDate,
      minDate,
      maxDate,
      disableFuture,
      disablePast,
      selectedSections,
      onSelectedSectionsChange,
      className,
      unstableStartFieldRef,
      unstableEndFieldRef,
    } = props;

    const startTextFieldProps = useSlotProps({
      elementType: 'input',
      externalSlotProps: slotProps?.textField,
      ownerState: { ...props, position: 'start' },
    }) as MultiInputFieldSlotTextFieldProps;

    const endTextFieldProps = useSlotProps({
      elementType: 'input',
      externalSlotProps: slotProps?.textField,
      ownerState: { ...props, position: 'end' },
    }) as MultiInputFieldSlotTextFieldProps;

    const fieldResponse = useMultiInputDateRangeField<
      Dayjs,
      false,
      MultiInputFieldSlotTextFieldProps
    >({
      sharedProps: {
        value,
        defaultValue,
        format,
        onChange,
        readOnly,
        disabled,
        onError,
        shouldDisableDate,
        minDate,
        maxDate,
        disableFuture,
        disablePast,
        selectedSections,
        onSelectedSectionsChange,
        shouldUseV6TextField: false,
      },
      startTextFieldProps,
      endTextFieldProps,
      unstableStartFieldRef,
      unstableEndFieldRef,
    });

    return (
      <Stack
        ref={ref}
        spacing={2}
        direction="row"
        overflow="auto"
        className={className}
      >
        <BrowserField {...fieldResponse.startDate} />
        <span> — </span>
        <BrowserField {...fieldResponse.endDate} />
      </Stack>
    );
  },
) as BrowserMultiInputDateRangeFieldComponent;

const BrowserDateRangePicker = React.forwardRef(
  (props: DateRangePickerProps<Dayjs, true>, ref: React.Ref<HTMLDivElement>) => {
    return (
      <DateRangePicker
        ref={ref}
        {...props}
        slots={{ ...props.slots, field: BrowserMultiInputDateRangeField }}
      />
    );
  },
);

export default function BrowserV7MultiInputRangeField() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserDateRangePicker />
    </LocalizationProvider>
  );
}
