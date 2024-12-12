import * as React from 'react';

type EnhancedPickersDayComponent = ((
  props: {} & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element) & { propTypes?: any };

const EnhancedPickersDayRaw = React.forwardRef(function EnhancedPickersDay() {
  return <div>EnhancedPickersDay</div>;
});

export const PickersDay = React.memo(EnhancedPickersDayRaw) as EnhancedPickersDayComponent;
