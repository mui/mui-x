import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

<LocalizationProvider>
  <DatePicker
    components={{
      PreviousIconButton: CustomButtonLeft,
    }}
    componentsProps={{
      previousIconButton: { size: 'small' },
    }}
  />

  <DatePicker
    components={{
      NextIconButton: CustomButton,
    }}
    componentsProps={{
      nextIconButton: { size: 'big' },
    }}
  />
</LocalizationProvider>;
