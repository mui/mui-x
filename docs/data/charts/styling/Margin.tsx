import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';
import { useDrawingArea, useXAxis, useYAxis } from '@mui/x-charts/hooks';

const defaultMargin = {
  knob: 'number',
  defaultValue: 40,
  step: 1,
  min: 0,
  max: 200,
} as const;

const defaultAxisSize = {
  knob: 'number',
  defaultValue: 30,
  step: 1,
  min: 0,
  max: 200,
} as const;

export default function Margin() {
  return (
    <ChartsUsageDemo
      componentName="Margin demos"
      data={
        {
          left: defaultMargin,
          right: defaultMargin,
          top: defaultMargin,
          bottom: defaultMargin,
          xAxisHeight: defaultAxisSize,
          yAxisWidth: defaultAxisSize,
          hideXAxis: {
            knob: 'switch',
            defaultValue: false,
          },
          hideYAxis: {
            knob: 'switch',
            defaultValue: false,
          },
        } as const
      }
      renderDemo={(props) => (
        <div style={{ width: '100%', margin: 4 }}>
          <BarChart
            series={[{ data: [6, 18, 12] }]}
            height={300}
            margin={{
              left: props.left,
              right: props.right,
              top: props.top,
              bottom: props.bottom,
            }}
            xAxis={[
              {
                id: 'x-axis',
                scaleType: 'band',
                data: ['Page 1', 'Page 2', 'Page 3'],
                position: props.hideXAxis ? 'none' : 'top',
                height: props.xAxisHeight,
              },
            ]}
            yAxis={[
              {
                id: 'y-axis',
                position: props.hideYAxis ? 'none' : 'right',
                width: props.yAxisWidth,
              },
            ]}
          >
            <MarginVisualization />
            <AxisSizeVisualization />
            <DrawingAreaVisualization />
          </BarChart>
        </div>
      )}
      getCode={({ props }) =>
        `import { BarChart } from '@mui/x-charts/BarChart';

<BarChart
  // ...
  margin={{
    left: ${props.left},
    right: ${props.right},
    top: ${props.top},
    bottom: ${props.bottom},
  }}
  xAxis={[{
    height: ${props.xAxisHeight},
    position: ${props.hideXAxis ? "'none'" : "'top'"}
  }]}
  yAxis={[{
    width: ${props.yAxisWidth}
    position: ${props.hideYAxis ? "'none'" : "'right'"}
  }]}
/>`
      }
    />
  );
}

function MarginVisualization() {
  const { bottom, left, right, top, height, width } = useDrawingArea();
  const xAxis = useXAxis('x-axis');
  const yAxis = useYAxis('y-axis');

  const xSize = (xAxis.position !== 'none' ? xAxis.height : 0) ?? 0;
  const ySize = (yAxis.position !== 'none' ? yAxis.width : 0) ?? 0;

  return (
    <React.Fragment>
      <rect
        x={0}
        y={0}
        width={'100%'}
        height={top - xSize}
        fill="#008080"
        opacity={0.5}
      />
      <rect
        x={0}
        y={height + top}
        width={'100%'}
        height={bottom}
        fill="#008080"
        opacity={0.5}
      />
      <rect
        x={0}
        y={top - xSize}
        width={left}
        height={height + xSize}
        fill="#008080"
        opacity={0.5}
      />
      <rect
        x={width + left + ySize}
        y={top - xSize}
        width={right - ySize}
        height={height + xSize}
        fill="#008080"
        opacity={0.5}
      />
    </React.Fragment>
  );
}

function AxisSizeVisualization() {
  const { left, top, height, width } = useDrawingArea();
  const xAxis = useXAxis('x-axis');
  const yAxis = useYAxis('y-axis');

  return (
    <React.Fragment>
      {xAxis.position !== 'none' && (
        <rect
          x={left}
          y={top - (xAxis.height ?? 0)}
          width={width}
          height={xAxis.height ?? 0}
          fill="#EC407A"
          opacity={0.5}
        />
      )}
      {yAxis.position !== 'none' && (
        <rect
          x={width + left}
          y={top}
          width={yAxis.width ?? 0}
          height={height}
          fill="#EC407A"
          opacity={0.5}
        />
      )}
    </React.Fragment>
  );
}

function DrawingAreaVisualization() {
  const { left, top, height, width } = useDrawingArea();

  return (
    <rect
      x={left}
      y={top}
      width={width}
      height={height}
      fill="#006BD6"
      opacity={0.2}
    />
  );
}
