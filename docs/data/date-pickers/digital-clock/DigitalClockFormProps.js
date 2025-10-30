import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

export default function DigitalClockFormProps() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DigitalClock',
          'DigitalClock',
          'MultiSectionDigitalClock',
          'MultiSectionDigitalClock',
        ]}
      >
        <DemoContainer components={['DigitalClock', 'DigitalClock']}>
          <DemoItem label="Digital clock disabled">
            <DigitalClock defaultValue={dayjs('2022-04-17T15:30')} disabled />
          </DemoItem>
          <DemoItem label="Digital clock readOnly">
            <DigitalClock defaultValue={dayjs('2022-04-17T15:30')} readOnly />
          </DemoItem>
        </DemoContainer>
        <DemoContainer
          components={['MultiSectionDigitalClock', 'MultiSectionDigitalClock']}
        >
          <DemoItem label="Multi section digital clock disabled">
            <MultiSectionDigitalClock
              defaultValue={dayjs('2022-04-17T15:30')}
              disabled
            />
          </DemoItem>
          <DemoItem label="Multi section digital clock readOnly">
            <MultiSectionDigitalClock
              defaultValue={dayjs('2022-04-17T15:30')}
              readOnly
            />
          </DemoItem>
        </DemoContainer>
      </DemoContainer>
    </LocalizationProvider>
  );
}
