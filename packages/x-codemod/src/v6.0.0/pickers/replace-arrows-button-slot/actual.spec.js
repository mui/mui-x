import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

<LocalizationProvider>
  <DatePicker
    components={{
      LeftArrowButton: CustomButtonLeft,
    }}
    componentsProps={{
      leftArrowButton: { size: 'small' },
    }}
  />

  <DatePicker
    components={{
      RightArrowButton: CustomButton,
    }}
    componentsProps={{
      rightArrowButton: { size: 'big' },
    }}
  />
</LocalizationProvider>;
