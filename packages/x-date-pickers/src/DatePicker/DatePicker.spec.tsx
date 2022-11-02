import * as React from 'react';
import moment, { Moment } from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { expectType } from '@mui/types';

// Allows setting date type right with generic JSX syntax
<DatePicker<Date>
  value={new Date()}
  onChange={(date) => date?.getDate()}
  renderInput={() => <input />}
/>;

// Throws error if passed value is invalid
<DatePicker<Date>
  // @ts-expect-error Value is invalid
  value={moment()}
  onChange={(date) => date?.getDate()}
  renderInput={() => <input />}
/>;

// Inference from the state
function InferTest() {
  const [value, setValue] = React.useState<Moment | null>(moment());

  return (
    <DatePicker
      value={value}
      onChange={(newValue) => setValue(newValue)}
      renderInput={() => <input />}
    />
  );
}

// Allows inferring from side props
<DatePicker
  value={moment()}
  minDate={moment()}
  components={{
    Day: ({ day }) => <span> {day.format('D')} </span>,
  }}
  onChange={(date) => date?.set({ second: 0 })}
  renderInput={() => <input />}
/>;

// Allows inferring from side props
{
  <DatePicker
    value={null}
    onChange={(date) => {
      expectType<null, typeof date>(date);
    }}
    renderInput={() => <input />}
  />;
  // workaround
  <DatePicker<Date>
    value={null}
    onChange={(date) => {
      expectType<Date | null, typeof date>(date);
    }}
    renderInput={() => <input />}
  />;
}

{
  <DatePicker
    value={new Date()}
    onChange={(date) => date?.getDate()}
    renderInput={() => <input />}
    // @ts-expect-error
    displayStaticWrapperAs="desktop"
  />;
}
