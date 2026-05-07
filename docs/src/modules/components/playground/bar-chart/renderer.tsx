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

  const parameters = config
    .flatMap((section) => section.properties)
    .reduce((acc, property) => {
      const currentValue = state[property.key] ?? property.default;

      const setProperty = property.setProperty as
        | ((
            props: BarChartProProps,
            value: unknown,
            state: Record<string, unknown>,
          ) => BarChartProProps)
        | undefined;
      return setProperty ? setProperty(acc, currentValue, state) : acc;
    }, initialState);

  return <BarChartPro {...parameters} />;
}
