import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import type { MultiInputDateRangeFieldProps } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { FieldRef } from '@mui/x-date-pickers/models';
import { PickerRangeValue, PickerValue } from '@mui/x-date-pickers/internals';

export default function ImperativeClear() {
  const fieldRef = React.useRef<FieldRef<PickerValue>>(null);
  const rangeFieldRef = React.useRef<FieldRef<PickerRangeValue>>(null);
  const startFieldRef = React.useRef<FieldRef<PickerValue>>(null);
  const endFieldRef = React.useRef<FieldRef<PickerValue>>(null);

  const CustomMultiInputDateRangeField = React.useCallback(
    (props: MultiInputDateRangeFieldProps) => (
      <MultiInputDateRangeField
        {...props}
        startFieldRef={startFieldRef}
        endFieldRef={endFieldRef}
      />
    ),
    [],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={4} sx={{ width: '100%', maxWidth: 600 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Single Picker (DateField)</Typography>
          <Typography variant="body2">
            Using <code>fieldRef</code> to clear the value and focus the field.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <DatePicker
              slotProps={{ field: { fieldRef }, textField: { fullWidth: true } }}
            />
            <Button
              variant="outlined"
              onClick={() => fieldRef.current?.clearValue()}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Clear
            </Button>
            <Button
              variant="outlined"
              onClick={() => fieldRef.current?.focusField()}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Focus
            </Button>
          </Stack>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <Typography variant="h6">
            Single Input Range Picker (DateRangeField)
          </Typography>
          <Typography variant="body2">
            Using <code>fieldRef</code> to clear the value of a single-input range
            picker.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <DateRangePicker
              slotProps={{
                field: { fieldRef: rangeFieldRef },
                textField: { fullWidth: true },
              }}
            />
            <Button
              variant="outlined"
              onClick={() => rangeFieldRef.current?.clearValue()}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Clear
            </Button>
          </Stack>
        </Stack>

        <Divider />

        <Stack spacing={2}>
          <Typography variant="h6">
            Multi Input Range Picker (DateRangeField)
          </Typography>
          <Typography variant="body2">
            Using <code>startFieldRef</code> and <code>endFieldRef</code> to clear
            specific fields programmatically in a multi-input range picker.
          </Typography>
          <DateRangePicker
            slots={{ field: CustomMultiInputDateRangeField }}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Stack>

        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => startFieldRef.current?.clearValue()}
              fullWidth
            >
              Clear Start
            </Button>
            <Button
              variant="outlined"
              onClick={() => endFieldRef.current?.clearValue()}
              fullWidth
            >
              Clear End
            </Button>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => startFieldRef.current?.focusField()}
              fullWidth
            >
              Focus Start
            </Button>
            <Button
              variant="outlined"
              onClick={() => endFieldRef.current?.focusField()}
              fullWidth
            >
              Focus End
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </LocalizationProvider>
  );
}
