import * as React from 'react';
import { BarChartPro, BarChartProProps } from '@mui/x-charts-pro/BarChartPro';
import { Position } from '@mui/x-charts/models';
import { Direction } from '@mui/x-charts/ChartsLegend';

const chartSettings = {
  margin: 2,
  series: [{ label: 'Test', type: 'bar', data: [1, 2] }],
  xAxis: [{ scaleType: 'band', data: ['A', 'B'] }],
} satisfies BarChartProProps;

const chartSettingsWithoutLabel = {
  margin: 2,
  series: [{ type: 'bar', data: [1, 2] }],
  xAxis: [{ scaleType: 'band', data: ['A', 'B'] }],
  hideLegend: true,
} satisfies BarChartProProps;

const toTest: {
  title: string;
  position: Position | undefined;
  direction: Direction | undefined;
}[] = [
  { title: 'default', position: undefined, direction: undefined },
  { title: 'left', position: { horizontal: 'start', vertical: 'middle' }, direction: 'vertical' },
  { title: 'right', position: { horizontal: 'end', vertical: 'middle' }, direction: 'vertical' },
  { title: 'top', position: { horizontal: 'center', vertical: 'top' }, direction: 'horizontal' },
  {
    title: 'bottom',
    position: { horizontal: 'center', vertical: 'bottom' },
    direction: 'horizontal',
  },
];

const COL_WIDTH = 150;
const ROW_HEIGHT = 200;

export default function BarBorderRadius() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'auto repeat(5, 1fr)',
      }}
    >
      <div>(toolbar, legend)</div>
      <div style={{ justifySelf: 'center' }}>(true, false)</div>
      <div style={{ justifySelf: 'center' }}>(true, true)</div>
      <div style={{ justifySelf: 'center' }}>(false, true)</div>
      <div style={{ justifySelf: 'center' }}>(false, false)</div>
      <div style={{ justifySelf: 'center' }}>(true, no label)</div>

      {toTest.map(({ title, position, direction }) => {
        const slotProps = { legend: { position, direction } };

        return (
          <React.Fragment key={title}>
            <p>{title}</p>
            <div style={{ height: ROW_HEIGHT, border: '1px solid black', width: COL_WIDTH }}>
              <BarChartPro {...chartSettings} slotProps={slotProps} showToolbar hideLegend />
            </div>
            <div style={{ height: ROW_HEIGHT, border: '1px solid black', width: COL_WIDTH }}>
              <BarChartPro {...chartSettings} slotProps={slotProps} showToolbar />
            </div>
            <div style={{ height: ROW_HEIGHT, border: '1px solid black', width: COL_WIDTH }}>
              <BarChartPro {...chartSettings} slotProps={slotProps} />
            </div>
            <div style={{ height: ROW_HEIGHT, border: '1px solid black', width: COL_WIDTH }}>
              <BarChartPro {...chartSettings} slotProps={slotProps} hideLegend />
            </div>
            <div style={{ height: ROW_HEIGHT, border: '1px solid black', width: COL_WIDTH }}>
              <BarChartPro {...chartSettingsWithoutLabel} slotProps={slotProps} showToolbar />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
