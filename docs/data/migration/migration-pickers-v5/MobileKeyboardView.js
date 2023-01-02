import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersToolbarSlotPropsOverride } from '@mui/x-date-pickers';
import {
  pickersLayoutClasses,
  PickersLayoutContentWrapper,
  PickersLayoutRoot,
  usePickerLayout,
} from '@mui/x-date-pickers/PickersLayout';
import { Unstable_MobileNextDatePicker as MobileNextDatePicker } from '@mui/x-date-pickers/MobileNextDatePicker';
import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
import { DatePickerToolbar } from '@mui/x-date-pickers/DatePicker';

function LayoutWithKeyboardView(props) {
  const { value, onChange, showKeyboardView } = props;
  const { toolbar, tabs, content, actionBar } = usePickerLayout(props);

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

LayoutWithKeyboardView.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
};

function ToolbarWithKeyboardViewSwitch(props) {
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
          onClick={() => setShowKeyboardView((prev) => !prev)}
        >
          {showKeyboardView ? <CalendarMonthIcon /> : <ModeEditIcon />}
        </IconButton>
      </Stack>
    );
  }

  return <DatePickerToolbar {...other} />;
}

ToolbarWithKeyboardViewSwitch.propTypes = {
  isLandscape: PropTypes.bool.isRequired,
  setShowKeyboardView: PropTypes.func,
  showKeyboardView: PropTypes.bool,
  showKeyboardViewSwitch: PropTypes.bool,
};

export default function MobileKeyboardView() {
  const [showKeyboardView, setShowKeyboardView] = React.useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileNextDatePicker
        orientation="landscape"
        components={{
          Layout: LayoutWithKeyboardView,
          Toolbar: ToolbarWithKeyboardViewSwitch,
        }}
        componentsProps={{
          layout: { showKeyboardView },
          toolbar: (ownerState) => ({
            showKeyboardViewSwitch: ownerState.wrapperVariant === 'mobile',
            showKeyboardView,
            setShowKeyboardView,
          }),
        }}
      />
    </LocalizationProvider>
  );
}
