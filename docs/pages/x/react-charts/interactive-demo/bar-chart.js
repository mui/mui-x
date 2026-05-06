import * as React from 'react';
import PlaygroundForm from 'docs/src/modules/components/playground/PlaygroundForm';
import BarChartRenderer from 'docs/src/modules/components/playground/bar-chart/renderer';
import { config as barchartConfig } from 'docs/src/modules/components/playground/bar-chart/config';

export default function Page() {
  const [state, setState] = React.useState({});
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <PlaygroundForm config={barchartConfig} state={state} onStateChange={setState} />
      <BarChartRenderer config={barchartConfig} state={state} />
    </div>
  );
}
