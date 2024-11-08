import * as React from 'react';
import { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateView } from '@mui/x-date-pickers/models';
import {
  pickersLayoutClasses,
  PickersLayoutContentWrapper,
  PickersLayoutRoot,
  PickersLayoutProps,
  usePickerLayout,
} from '@mui/x-date-pickers/PickersLayout';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
import {
  DatePickerToolbar,
  DatePickerToolbarProps,
} from '@mui/x-date-pickers/DatePicker';

function LayoutWithKeyboardView(props: PickersLayoutProps<Dayjs | null, DateView>) {
  const { value, onChange } = props;
  const [showKeyboardView, setShowKeyboardView] = React.useState(false);

  const { toolbar, tabs, content, actionBar } = usePickerLayout({
    ...props,
    slotProps: {
      ...props.slotProps,
      toolbar: {
        ...props.slotProps?.toolbar,
        // @ts-ignore
        showKeyboardViewSwitch: props.wrapperVariant === 'mobile',
        showKeyboardView,
        setShowKeyboardView,
      },
    },
  });

  return (
    <PickersLayoutRoot ownerState={props}>
      {toolbar}
      {actionBar}
      <PickersLayoutContentWrapper className={pickersLayoutClasses.contentWrapper}>
        {tabs}
        {showKeyboardView ? (
          <Box sx={{ mx: 3, my: 2, width: 272 }}>
            <DateField value={value} onChange={onChange} sx={{ width: '100%' }} />
          </Box>
        ) : (
          content
        )}
      </PickersLayoutContentWrapper>
    </PickersLayoutRoot>
  );
}

function ToolbarWithKeyboardViewSwitch(
  props: DatePickerToolbarProps & {
    showKeyboardViewSwitch?: boolean;
    showKeyboardView?: boolean;
    setShowKeyboardView?: React.Dispatch<React.SetStateAction<boolean>>;
  },
) {
  const { showKeyboardViewSwitch, showKeyboardView, setShowKeyboardView, ...other } =
    props;

  if (showKeyboardViewSwitch) {
    return (
      <Stack
        spacing={2}
        direction={other.isLandscape ? 'column' : 'row'}
        alignItems="center"
        sx={
          other.isLandscape
            ? {
                gridColumn: 1,
                gridRow: '1 / 3',
              }
            : { gridColumn: '1 / 4', gridRow: 1, mr: 1 }
        }
      >
        <DatePickerToolbar {...other} sx={{ flex: '1 1 100%' }} />
        <IconButton
          color="inherit"
          onClick={() => setShowKeyboardView!((prev) => !prev)}
        >
          {showKeyboardView ? <CalendarMonthIcon /> : <ModeEditIcon />}
        </IconButton>
      </Stack>
    );
  }

  return <DatePickerToolbar {...other} />;
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
