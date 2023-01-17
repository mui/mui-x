import * as React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
import { Unstable_NextTimePicker as NextTimePicker } from '@mui/x-date-pickers/NextTimePicker';
import { Unstable_NextDateTimePicker as NextDateTimePicker } from '@mui/x-date-pickers/NextDateTimePicker';
import { Unstable_NextDateRangePicker as NextDateRangePicker } from '@mui/x-date-pickers-pro/NextDateRangePicker';

function Label({ componentName, valueType, isProOnly }) {
  const content = (
    <span>
      <strong>{componentName}</strong> for {valueType} editing
    </span>
  );

  if (isProOnly) {
    return (
      <Stack direction="row" spacing={0.5}>
        <Tooltip title="Included on Pro package">
          <a href="/x/introduction/licensing/#pro-plan">
            <span className="plan-pro" />
          </a>
        </Tooltip>
        {content}
      </Stack>
    );
  }

  return content;
}

Label.propTypes = {
  componentName: PropTypes.string.isRequired,
  isProOnly: PropTypes.bool,
  valueType: PropTypes.string.isRequired,
};

export default function CommonlyUsedComponents() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer>
        <DemoItem label={<Label componentName="DatePicker" valueType="date" />}>
          <NextDatePicker />
        </DemoItem>
        <DemoItem label={<Label componentName="TimePicker" valueType="time" />}>
          <NextTimePicker />
        </DemoItem>
        <DemoItem
          label={<Label componentName="DateTimePicker" valueType="date time" />}
        >
          <NextDateTimePicker />
        </DemoItem>
        <DemoItem
          label={
            <Label
              componentName="DateRangePicker"
              valueType="date range"
              isProOnly
            />
          }
        >
          <NextDateRangePicker />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
