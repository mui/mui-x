import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { TimeRangePicker } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { SingleInputTimeRangeField } from '@mui/x-date-pickers-pro/SingleInputTimeRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {
  DigitalClockItem,
  DigitalClockItemProps,
} from '@mui/x-date-pickers/DigitalClock';
import { DateTime } from 'luxon';
import { DateRange, RangePosition } from '@mui/x-date-pickers-pro/models';

function CustomDigitalClockItem(
  props: DigitalClockItemProps & {
    rangePosition: RangePosition;
    selectedValue: DateRange<DateTime>;
  },
) {
  const { rangePosition, selectedValue, formattedValue, itemValue, ...other } =
    props;
  const selectedStartTime = selectedValue[0];
  if (selectedStartTime && selectedStartTime.isValid && rangePosition === 'end') {
    const timeDifference = itemValue.diff(selectedStartTime, ['minutes']);
    const timeDifferenceLabel =
      timeDifference.minutes < 60
        ? timeDifference.toHuman()
        : timeDifference.shiftTo('hours').toHuman();
    return (
      <DigitalClockItem {...other}>
        {formattedValue} ({timeDifferenceLabel})
      </DigitalClockItem>
    );
  }
  return <DigitalClockItem {...other} />;
}

export default function CustomizedBehaviorTimeRangePicker() {
  const [rangePosition, setRangePosition] = React.useState<RangePosition>('start');
  const [value, setValue] = React.useState<DateRange<DateTime>>([null, null]);
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DemoContainer components={['SingleInputDateRangeField']}>
        <TimeRangePicker
          label="Event time"
          timeSteps={{ minutes: 15 }}
          value={value}
          onChange={setValue}
          minTime={rangePosition === 'end' && value[0] ? value[0] : undefined}
          rangePosition={rangePosition}
          skipDisabled
          onRangePositionChange={setRangePosition}
          thresholdToRenderTimeInASingleColumn={96}
          format="HH:mm"
          ampm={false}
          slots={{
            digitalClockItem: CustomDigitalClockItem as any,
            field: SingleInputTimeRangeField,
          }}
          slotProps={{
            digitalClockItem: {
              rangePosition,
              selectedValue: value,
            } as unknown as DigitalClockItemProps,
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
