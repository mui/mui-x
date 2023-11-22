import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

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
