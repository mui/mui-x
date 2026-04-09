import * as React from 'react';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const MyCustomTextField = () => <input />;
const someVar = true;

function App() {
  return (
    <div>
      {/* DateField with false */}
      <DateField enableAccessibleFieldDOMStructure={false} />
      {/* DatePicker with false */}
      {/* prettier-ignore */}
      <DatePicker enableAccessibleFieldDOMStructure={false} slots={{ textField: MyCustomTextField }} />
      {/* DateField with true (should also be removed) */}
      <DateField enableAccessibleFieldDOMStructure={true} />
      {/* DateField without the prop (should be unchanged) */}
      <DateField />
      {/* Multi-prop component */}
      <DateField enableAccessibleFieldDOMStructure={false} format="MM/DD/YYYY" />
      {/* DateField with variable expression */}
      <DateField enableAccessibleFieldDOMStructure={someVar} format="MM/DD/YYYY" />
      {/* DateField with shorthand boolean */}
      <DateField enableAccessibleFieldDOMStructure />
      {/* slotProps.field with only enableAccessibleFieldDOMStructure */}
      <DatePicker slotProps={{ field: { enableAccessibleFieldDOMStructure: false } }} />
      {/* slotProps.field with other props */}
      <DatePicker
        slotProps={{
          field: { enableAccessibleFieldDOMStructure: false, readOnly: true },
        }}
      />
      {/* slotProps with other siblings */}
      <DatePicker
        slotProps={{
          field: { enableAccessibleFieldDOMStructure: true },
          toolbar: { hidden: true },
        }}
      />
    </div>
  );
}
