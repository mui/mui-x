import * as React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

function Label({ componentName, valueType, isProOnly }) {
  const content = (
    <span>
      <strong>{componentName}</strong> for {valueType} editing
    </span>
  );

  if (isProOnly) {
    return (
      <Stack direction="row" spacing={0.5} component="span">
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
      <DemoContainer
        components={[
          'DatePicker',
          'TimePicker',
          'DateTimePicker',
          'DateRangePicker',
        ]}
      >
        <DemoItem
          label={<Label componentName="DatePicker" valueType="date" />}
          component="DatePicker"
        >
          <DatePicker />
        </DemoItem>
        <DemoItem
          label={<Label componentName="TimePicker" valueType="time" />}
          component="TimePicker"
        >
          <TimePicker />
        </DemoItem>
        <DemoItem
          label={<Label componentName="DateTimePicker" valueType="date time" />}
          component="DateTimePicker"
        >
          <DateTimePicker />
        </DemoItem>
        <DemoItem
          label={
            <Label
              componentName="DateRangePicker"
              valueType="date range"
              isProOnly
            />
          }
          component="DateRangePicker"
        >
          <DateRangePicker />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
