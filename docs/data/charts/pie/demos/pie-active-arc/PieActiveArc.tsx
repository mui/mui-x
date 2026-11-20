import { PieChart } from '@mui/x-charts/PieChart';
import { desktopOS, valueFormatter } from '../../webUsageStats';

export default function PieActiveArc() {
  return (
    // @focus-start @padding 2
    <PieChart
      series={[
        {
          data: desktopOS,
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          valueFormatter,
        },
      ]}
      height={200}
      width={200}
    />
    // @focus-end
  );
}
