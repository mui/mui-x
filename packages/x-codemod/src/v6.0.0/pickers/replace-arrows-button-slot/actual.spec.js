import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
