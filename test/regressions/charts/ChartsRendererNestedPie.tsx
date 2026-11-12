import * as React from 'react';
import { ChartsRenderer } from '@mui/x-charts-premium/ChartsRenderer';

const dimensions = [
  {
    id: 'team',
    label: 'Team',
    data: ['Design', 'Design', 'Engineering', 'Engineering', 'Engineering', 'Sales'],
  },
  { id: 'member', label: 'Member', data: ['Ana', 'Bea', 'Carl', 'Dan', 'Eva', 'Fay'] },
];

const hours = { id: 'hours', label: 'Hours', data: [2, 3, 5, 1, 4, 6] };
const tasks = { id: 'tasks', label: 'Tasks', data: [4, 1, 2, 2, 3, 1] };

const configuration = { width: 500, height: 300, skipAnimation: true, itemLabel: 'value' };

export default function ChartsRendererNestedPie(): React.JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ChartsRenderer
        chartType="pie"
        dimensions={dimensions}
        values={[hours]}
        configuration={configuration}
      />
      <ChartsRenderer
        chartType="pie"
        dimensions={dimensions}
        values={[hours, tasks]}
        configuration={configuration}
      />
    </div>
  );
}
