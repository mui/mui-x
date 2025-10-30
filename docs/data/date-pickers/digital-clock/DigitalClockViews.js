import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

export default function DigitalClockViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'MultiSectionDigitalClock',
          'MultiSectionDigitalClock',
          'MultiSectionDigitalClock',
        ]}
      >
        <DemoItem label={'"hours", "minutes" and "seconds"'}>
          <MultiSectionDigitalClock views={['hours', 'minutes', 'seconds']} />
        </DemoItem>
        <DemoItem label={'"hours"'}>
          <MultiSectionDigitalClock views={['hours']} />
        </DemoItem>
        <DemoItem label={'"minutes" and "seconds"'}>
          <MultiSectionDigitalClock views={['minutes', 'seconds']} />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
