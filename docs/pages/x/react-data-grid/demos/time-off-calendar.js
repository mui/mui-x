import * as React from 'react';
import DataGridDemoFrame from '../../../../src/modules/components/demos/data-grid/DataGridDemoFrame';
import PTOCalendar from '../../../../src/modules/components/demos/data-grid/PTOCalendar/PTOCalendar';

export default function Page() {
  return (
    <DataGridDemoFrame demoName="time-off-calendar">
      <PTOCalendar />
    </DataGridDemoFrame>
  );
}
