import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateView } from '@mui/x-date-pickers';
import {
  pickersLayoutClasses,
  PickersLayoutContentWrapper,
  PickersLayoutRoot,
  PickersLayoutProps,
  usePickerLayout,
} from '@mui/x-date-pickers/PickersLayout';
import { Unstable_MobileNextDatePicker as MobileNextDatePicker } from '@mui/x-date-pickers/MobileNextDatePicker';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';

function LayoutWithKeyboardView(props: PickersLayoutProps<any, DateView>) {
  const { value, onChange, wrapperVariant } = props;
  const { toolbar, tabs, content, actionBar } = usePickerLayout(props);
  const [showKeyboardView, setShowKeyboardView] = React.useState(false);

  return (
    <PickersLayoutRoot ownerState={props}>
      {toolbar}
      {wrapperVariant === 'mobile' && (
        <Box
          sx={{
            // Place the element in the grid layout
            gridColumn: 3,
            gridRow: 1,
            display: 'flex',
            alignItems: 'end',
            pb: 2,
          }}
        >
          <IconButton
            color="inherit"
            onClick={() => setShowKeyboardView((prev) => !prev)}
          >
            {showKeyboardView ? <CalendarMonthIcon /> : <ModeEditIcon />}
          </IconButton>
        </Box>
      )}
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
export default function MobileKeyboardView() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileNextDatePicker components={{ Layout: LayoutWithKeyboardView }} />
    </LocalizationProvider>
  );
}
