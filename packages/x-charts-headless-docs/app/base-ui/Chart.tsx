'use client';
import * as React from 'react';
import { Popover } from '@base-ui/react/popover';
import { PieChart, type PieRootProps } from '@mui/x-charts-headless';
import { useItemTooltip, useLegend, useTooltipAnchor } from '@mui/x-charts';
import './chart.css';

const chartProps: PieRootProps = {
  height: 300,
  width: 400,
  series: [
    {
      arcLabel: 'value',
      arcLabelMinAngle: 15,
      innerRadius: '30%',
      id: 'series-1',
      data: [
        { value: 35, label: 'Product A' },
        { value: 25, label: 'Product B' },
        { value: 20, label: 'Product C' },
        { value: 15, label: 'Product D' },
        { value: 5, label: 'Product E' },
      ],
    },
  ],
};

export function Chart() {
  return (
    <PieChart.Root {...chartProps}>
      <BaseUILegend />
      <div className="chart-wrapper">
        <PieChart.Surface>
          <PieChart.Plot>
            {(item, index) => <PieChart.Arc key={index} className="pie-arc" {...item} />}
          </PieChart.Plot>
          <PieChart.LabelPlot>
            {(item, index) => <PieChart.ArcLabel key={index} className="pie-arc-label" {...item} />}
          </PieChart.LabelPlot>
        </PieChart.Surface>
        <BaseUITooltip />
      </div>
    </PieChart.Root>
  );
}

function BaseUITooltip() {
  const data = useItemTooltip();
  const anchor = useTooltipAnchor();

  const showTooltip = data && anchor;

  return (
    <Popover.Root open={!!showTooltip}>
      <Popover.Portal>
        <Popover.Positioner
          side="top"
          sideOffset={5}
          className="tooltip-positioner"
          anchor={anchor}
        >
          <Popover.Popup initialFocus={false} finalFocus={false}>
            {data && (
              <div className="tooltip-popup" data-index={data.identifier.dataIndex}>
                <span className="tooltip-color" />
                <span className="tooltip-label">{data.label}</span>
                <span className="tooltip-value">{data.formattedValue}</span>
              </div>
            )}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function BaseUILegend() {
  const legendData = useLegend();

  if (legendData.items.length === 0) {
    return null;
  }

  return (
    <ul className="legend">
      {legendData.items.map((item, index) => (
        <li key={index} className="legend-item" data-index={index}>
          <span className="legend-color" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
