import * as React from 'react';
import { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
import {
  PickersLayoutProps,
  PickersLayoutRoot,
  PickersLayoutContentWrapper,
  pickersLayoutClasses,
  usePickerLayout,
} from '@mui/x-date-pickers/PickersLayout';
import {
  DatePickerToolbar,
  DatePickerToolbarProps,
} from '@mui/x-date-pickers/DatePicker';
import { usePickerContext } from '@mui/x-date-pickers/hooks';

interface KeyboardViewToolbarProps extends DatePickerToolbarProps {
  showKeyboardViewSwitch?: boolean;
  showKeyboardView?: boolean;
  setShowKeyboardView?: React.Dispatch<React.SetStateAction<boolean>>;
}

function ToolbarWithKeyboardViewSwitch(props: KeyboardViewToolbarProps) {
  const {
    showKeyboardViewSwitch,
    showKeyboardView,
    setShowKeyboardView,
    className,
    sx,
    ...other
  } = props;
  const { orientation } = usePickerContext();

  if (!showKeyboardViewSwitch) {
    return <DatePickerToolbar className={className} sx={sx} {...other} />;
  }

  const isLandscape = orientation === 'landscape';

  return (
    <Stack
      className={className}
      spacing={2}
      direction={isLandscape ? 'column' : 'row'}
      sx={{ alignItems: 'center' }}
    >
      <DatePickerToolbar
        {...other}
        sx={[{ flex: '1 1 100%' }, ...(Array.isArray(sx) ? sx : [sx])]}
      />
      <IconButton
        color="inherit"
        aria-label={
          showKeyboardView ? 'Switch to calendar view' : 'Switch to keyboard view'
        }
        onClick={() => setShowKeyboardView?.((prev) => !prev)}
      >
        {showKeyboardView ? <CalendarMonthIcon /> : <ModeEditIcon />}
      </IconButton>
    </Stack>
  );
}

function LayoutWithKeyboardView(props: PickersLayoutProps<Dayjs | null>) {
  const [showKeyboardView, setShowKeyboardView] = React.useState(false);
  const { value, setValue, variant } = usePickerContext<Dayjs | null>();

  const { toolbar, tabs, content, actionBar, ownerState } = usePickerLayout({
    ...props,
    slotProps: {
      ...props.slotProps,
      toolbar: {
        ...props.slotProps?.toolbar,
        showKeyboardViewSwitch: variant === 'mobile',
        showKeyboardView,
        setShowKeyboardView,
      } as KeyboardViewToolbarProps,
    },
  });

  return (
    <PickersLayoutRoot ownerState={ownerState}>
      {toolbar}

      <PickersLayoutContentWrapper
        className={pickersLayoutClasses.contentWrapper}
        ownerState={ownerState}
      >
        {tabs}
        {showKeyboardView ? (
          <Box sx={{ mx: 3, my: 2, width: 272 }}>
            <DateField
              value={value}
              onChange={(newValue) =>
                setValue(newValue, { changeImportance: 'set' })
              }
              slots={{
                // Date Field rendered within a Picker context gets injected an open Picker button.
                // Passing empty adornment to the slot to prevent it from being rendered.
                inputAdornment: EmptyElement,
              }}
              sx={{ width: '100%' }}
            />
          </Box>
        ) : (
          content
        )}
      </PickersLayoutContentWrapper>
      {actionBar}
    </PickersLayoutRoot>
  );
}

export default function MobileKeyboardView() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        slots={{
          layout: LayoutWithKeyboardView,
          toolbar: ToolbarWithKeyboardViewSwitch,
        }}
      />
    </LocalizationProvider>
  );
}

function EmptyElement() {
  return null;
}
