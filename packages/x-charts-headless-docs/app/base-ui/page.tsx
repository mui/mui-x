'use client';
import * as React from 'react';
import { Popover } from '@base-ui/react/popover';
import { PieChart, type PieRootProps } from '@mui/x-charts-headless';
import { useItemTooltip, useLegend, useTooltipAnchor } from '@mui/x-charts';
import './page.css';

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
        { value: 35, label: 'Product A', color: '#3b82f6' },
        { value: 25, label: 'Product B', color: '#8b5cf6' },
        { value: 20, label: 'Product C', color: '#ec4899' },
        { value: 15, label: 'Product D', color: '#f59e0b' },
        { value: 5, label: 'Product E', color: '#10b981' },
      ],
    },
  ],
};

export default function BaseUIIntegration() {
  return (
    <div className="page-container">
      <header className="header">
        <h1>Base UI Integration</h1>
        <p className="subtitle">
          Headless Charts with{' '}
          <a
            href="https://base-ui.com/react/overview/quick-start"
            target="_blank"
            rel="noopener noreferrer"
          >
            Base UI
          </a>{' '}
          components
        </p>
      </header>

      <section className="section">
        <h2>Interactive Pie Chart</h2>
        <p>
          Hover over the chart segments to see the tooltip powered by Base UI&apos;s Popover
          component.
        </p>

        <div className="chart-container">
          <PieChart.Root {...chartProps}>
            <BaseUILegend />
            <div className="chart-wrapper">
              <PieChart.Surface>
                <PieChart.Plot>
                  {(item, index) => <PieChart.Arc key={index} className="pie-arc" {...item} />}
                </PieChart.Plot>
                <PieChart.LabelPlot>
                  {(item, index) => (
                    <PieChart.ArcLabel key={index} className="pie-arc-label" {...item} />
                  )}
                </PieChart.LabelPlot>
              </PieChart.Surface>
              <BaseUITooltip />
            </div>
          </PieChart.Root>
        </div>
      </section>
    </div>
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
          <Popover.Popup className="tooltip-popup" initialFocus={false} finalFocus={false}>
            {data && (
              <React.Fragment>
                <span className="tooltip-color" style={{ backgroundColor: data.color }} />
                <span className="tooltip-label">{data.label}</span>
                <span className="tooltip-value">{data.formattedValue}</span>
              </React.Fragment>
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
        <li key={index} className="legend-item">
          <span className="legend-color" style={{ backgroundColor: item.color }} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
