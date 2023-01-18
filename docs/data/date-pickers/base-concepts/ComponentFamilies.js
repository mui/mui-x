import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
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

function ProLabel({ children }) {
  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="Included on Pro package">
        <a href="/x/introduction/licensing/#pro-plan">
          <span className="plan-pro" />
        </a>
      </Tooltip>
      <span>{children}</span>
    </Stack>
  );
}

ProLabel.propTypes = {
  children: PropTypes.node,
};

export default function ComponentFamilies() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label="Date">
          <DateField defaultValue={dayjs('2022-04-07')} />
        </DemoItem>
        <DemoItem label="Time">
          <TimeField defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem label="Date Time">
          <DateTimeField defaultValue={dayjs('2022-04-07T15:30')} />
        </DemoItem>
        <DemoItem label={<ProLabel>Date Range</ProLabel>}>
          <MultiInputDateRangeField
            defaultValue={[dayjs('2022-04-07'), dayjs('2022-04-10')]}
          />
        </DemoItem>
        <DemoItem label={<ProLabel>Time Range</ProLabel>}>
          <MultiInputTimeRangeField
            defaultValue={[dayjs('2022-04-07T15:30'), dayjs('2022-04-07T18:30')]}
          />
        </DemoItem>
        <DemoItem label={<ProLabel>Date Time Range</ProLabel>}>
          <MultiInputDateTimeRangeField
            defaultValue={[dayjs('2022-04-07T15:30'), dayjs('2022-04-10T18:30')]}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
