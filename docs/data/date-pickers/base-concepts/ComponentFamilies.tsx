import * as React from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { MultiInputDateTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputDateTimeRangeField';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

const ProSpan = styled('span')({
  display: 'inline-block',
  height: '1em',
  width: '1em',
  verticalAlign: 'middle',
  marginLeft: '0.3em',
  marginBottom: '0.08em',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundImage: 'url(https://mui.com/static/x/pro.svg)',
});

function ProLabel({ children }: { children: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={0.5} component="span">
      <Tooltip title="Included in Pro package">
        <a
          href="https://mui.com/x/introduction/licensing/#pro-plan"
          aria-label="Included in Pro package"
        >
          <ProSpan />
        </a>
      </Tooltip>
      <span>{children}</span>
    </Stack>
  );
}

export default function ComponentFamilies() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateField',
          'TimeField',
          'DateTimeField',
          'MultiInputDateRangeField',
          'MultiInputTimeRangeField',
          'MultiInputDateTimeRangeField',
        ]}
      >
        <DemoItem label="Date">
          <DateField defaultValue={dayjs('2022-04-17')} />
        </DemoItem>
        <DemoItem label="Time">
          <TimeField defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem label="Date Time">
          <DateTimeField defaultValue={dayjs('2022-04-17T15:30')} />
        </DemoItem>
        <DemoItem
          label={<ProLabel>Date Range</ProLabel>}
          component="MultiInputDateRangeField"
        >
          <MultiInputDateRangeField
            defaultValue={[dayjs('2022-04-17'), dayjs('2022-04-21')]}
          />
        </DemoItem>
        <DemoItem
          label={<ProLabel>Time Range</ProLabel>}
          component="MultiInputTimeRangeField"
        >
          <MultiInputTimeRangeField
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-17T18:30')]}
          />
        </DemoItem>
        <DemoItem
          label={<ProLabel>Date Time Range</ProLabel>}
          component="MultiInputDateTimeRangeField"
        >
          <MultiInputDateTimeRangeField
            defaultValue={[dayjs('2022-04-17T15:30'), dayjs('2022-04-21T18:30')]}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
