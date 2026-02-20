'use client';
import * as React from 'react';
import Link from 'next/link';
import { PieChart } from 'packages/x-charts-headless/src';
import { PieChart as PieChartMaterial } from '@mui/x-charts-material';
import type { PieChartProps } from '@mui/x-charts/PieChart';
import './page.css';

import { useDrawingArea, useItemTooltip, useSvgRef } from '@mui/x-charts';

const data: PieChartProps = {
  height: 200,
  width: 400,
  series: [
    {
      arcLabel: 'value',
      arcLabelMinAngle: 10,
      innerRadius: '70%',
      id: 'series-1',
      data: [
        { value: 15, label: 'A' },
        { value: 20, label: 'B' },
      ],
    },
    {
      outerRadius: '70%',
      innerRadius: '40%',
      cx: '100%',
      startAngle: 180,
      arcLabel: 'value',
      data: [
        { value: 15, label: 'D', color: 'rgb(135, 120, 255)' },
        { value: 25, label: 'E', color: 'rgb(160, 143, 255)' },
        { value: 35, label: 'F', color: 'rgb(185, 166, 255)' },
      ],
    },
    {
      outerRadius: '70%',
      innerRadius: '40%',
      cx: '0%',
      endAngle: 180,
      arcLabel: 'value',
      data: [
        { value: 15, label: 'D', color: 'rgb(255, 194, 163)' },
        { value: 25, label: 'E', color: 'rgb(255, 186, 138)' },
        { value: 35, label: 'F', color: 'rgb(255, 177, 112)' },
      ],
    },
  ],
};

export default function Home() {
  return (
    <div>
      <h2>POC: Base and Material UI packages</h2>
      <p>
        This example demonstrates the proposed architecture where charts functionality is split into
        two packages:
      </p>
      <ul>
        <li>
          <strong>@mui/x-charts-headless</strong>: Framework-agnostic core with inline styles and a
          custom theme system
        </li>
        <li>
          <strong>@mui/x-charts-material</strong>: Material UI integration layer using material
          components and theming
        </li>
      </ul>

      <nav
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <strong>Examples:</strong>
        <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
          <li>
            <Link href="/base-ui" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Base UI Integration
            </Link>{' '}
            - Headless charts with Base UI tooltip and legend components
          </li>
        </ul>
      </nav>

      <div>
        <h2>Headless Pie Chart</h2>
        <PieChart.Root {...data}>
          <PieChart.Surface>
            <PieChart.Plot>{(item, index) => <PieChart.Arc key={index} {...item} />}</PieChart.Plot>
            <PieChart.LabelPlot>
              {(item, index) => <PieChart.ArcLabel key={index} {...item} />}
            </PieChart.LabelPlot>
          </PieChart.Surface>
        </PieChart.Root>
      </div>
      <div>
        <h2>Material UI Pie Chart</h2>
        <PieChartMaterial {...data} />
      </div>
      <div>
        <h2>Headless + CSS</h2>
        <PieChart.Root {...data}>
          <PieChart.Surface className="surface">
            <PieChart.Plot>
              {(item, index) => <PieChart.Arc key={index} className="arc" {...item} />}
            </PieChart.Plot>
            <PieChart.LabelPlot>
              {(item, index) => <PieChart.ArcLabel key={index} className="arc-label" {...item} />}
            </PieChart.LabelPlot>
          </PieChart.Surface>
          <PieTooltip />
        </PieChart.Root>
      </div>
    </div>
  );
}

function PieTooltip() {
  const tooltipData = useItemTooltip();
  const svgRef = useSvgRef();
  const [position, setPosition] = React.useState<{ x: number; y: number } | null>(null);
  const drawingArea = useDrawingArea();

  React.useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) {
      return undefined;
    }

    function handleMove(event: MouseEvent) {
      if (!svgElement) {
        return;
      }

      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    }

    function handleLeave() {
      setPosition(null);
    }

    svgElement.addEventListener('pointermove', handleMove);
    svgElement.addEventListener('pointerleave', handleLeave);
    return () => {
      svgElement.removeEventListener('pointermove', handleMove);
      svgElement.removeEventListener('pointerleave', handleLeave);
    };
  }, [svgRef, drawingArea]);

  return position && tooltipData ? (
    <div
      className="tooltip-container"
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
      }}
      data-index={tooltipData.identifier.dataIndex}
      data-series={tooltipData.identifier.seriesId}
    >
      <div className="tooltip-color-box"></div>
      <div className="tooltip-data">
        {tooltipData.label}: {tooltipData.formattedValue}
      </div>
    </div>
  ) : null;
}

export { PieTooltip };
