import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function DesktopDateTimePickerNoTimeRenderers() {
  const [searchParams] = useSearchParams();
  const enableAccessibleFieldDOMStructureParam = searchParams.get(
    'enableAccessibleFieldDOMStructure',
  );
  const enableAccessibleFieldDOMStructure = enableAccessibleFieldDOMStructureParam
    ? enableAccessibleFieldDOMStructureParam !== 'false'
    : true;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDateTimePicker
        enableAccessibleFieldDOMStructure={enableAccessibleFieldDOMStructure}
        label="Desktop Date Time Picker"
        viewRenderers={{
          hours: null,
          minutes: null,
          seconds: null,
        }}
      />
    </LocalizationProvider>
  );
}
