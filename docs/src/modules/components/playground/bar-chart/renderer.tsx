import { BarChartPro, BarChartProProps } from '@mui/x-charts-pro/BarChartPro';
import { ConfigSection } from '../configuration.type';

const initialState: BarChartProProps = {
  height: 400,
  series: [
    {
      layout: 'vertical',
      data: [2, 3, 4, 5, 6, 5, 7, 4],
    },
    {
      layout: 'vertical',
      data: [4, 5, 6, 5, 7, 4, 2, 3],
    },
  ],
  xAxis: [
    {
      position: 'bottom',
      tickNumber: 5,
      scaleType: 'band',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    },
  ],
  yAxis: [
    {
      position: 'left',
      tickNumber: 5,
    },
  ],
};
export default function BarChartPlaygroundRendered(props: {
  config: ConfigSection<BarChartProProps>[];
  state: Record<string, unknown>;
}) {
  const { config, state } = props;

  const parametters = config
    .flatMap((section) => section.properties)
    .reduce((acc, property) => {
      const resolvedKey = typeof property.key === 'function' ? property.key(state) : property.key;

      const resolvedValue =
        typeof property.value === 'function' ? property.value(state) : property.value;
      const currentValue = state[resolvedKey] ?? resolvedValue.default;

      return property.setProperty ? property.setProperty(acc, currentValue, state) : acc;
    }, initialState);

  return <BarChartPro {...parametters} />;
}
