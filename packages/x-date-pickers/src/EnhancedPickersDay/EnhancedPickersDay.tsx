import * as React from 'react';

type EnhancedPickersDayComponent = ((
  props: {} & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element) & { propTypes?: any };

const EnhancedPickersDayRaw = React.forwardRef(function EnhancedPickersDay() {
  return <div>EnhancedPickersDay</div>;
});

export const EnhancedPickersDay = React.memo(EnhancedPickersDayRaw) as EnhancedPickersDayComponent;
