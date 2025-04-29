import { DatePicker } from '@mui/x-date-pickers/DatePicker';

<DatePicker PopperProps={{ onClick: handleClick }} />;

<DatePicker TransitionComponent={Fade} />;

<DatePicker DialogProps={{ backgroundColor: 'red' }} />;

<DatePicker PaperProps={{ backgroundColor: 'red' }} />;

<DatePicker TrapFocusProps={{ isEnabled: () => false }} />;

<DatePicker InputProps={{ color: 'primary' }} />;

<DatePicker
  componentsProps={{
    textField: {
      InputProps: { color: 'secondary' },
    },
  }} />;

<DatePicker InputAdornmentProps={{ position: 'start' }} />;

<DatePicker OpenPickerButtonProps={{ ref: buttonRef }} />;
