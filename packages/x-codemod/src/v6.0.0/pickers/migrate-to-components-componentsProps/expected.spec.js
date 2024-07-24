import { DatePicker } from '@mui/x-date-pickers/DatePicker';

<DatePicker
  componentsProps={{
    popper: { onClick: handleClick },
  }} />;

<DatePicker
  components={{
    DesktopTransition: Fade,
  }} />;

<DatePicker
  componentsProps={{
    dialog: { backgroundColor: 'red' },
  }} />;

<DatePicker
  componentsProps={{
    desktopPaper: { backgroundColor: 'red' },
  }} />;

<DatePicker
  componentsProps={{
    desktopTrapFocus: { isEnabled: () => false },
  }} />;

<DatePicker
  componentsProps={{
    textField: {
      InputProps: { color: 'primary' },
    },
  }} />;

<DatePicker
  componentsProps={{
    textField: {
      InputProps: { color: 'secondary' },
    },
  }} />;

<DatePicker
  componentsProps={{
    inputAdornment: { position: 'start' },
  }} />;

<DatePicker
  componentsProps={{
    openPickerButton: { ref: buttonRef },
  }} />;
