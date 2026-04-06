import * as React from 'react';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

 
const MyCustomTextField = () => <input />;
const someVar = true;

function App() {
  return (
    <div>
      {/* DateField with false */}
      <DateField />
      {/* DatePicker with false */}
      <DatePicker slots={{ textField: MyCustomTextField }} />
      {/* DateField with true (should also be removed) */}
      <DateField />
      {/* DateField without the prop (should be unchanged) */}
      <DateField />
      {/* Multi-prop component */}
      <DateField format="MM/DD/YYYY" />
      {/* DateField with variable expression */}
      <DateField format="MM/DD/YYYY" />
      {/* DateField with shorthand boolean */}
      <DateField />
    </div>
  );
}
