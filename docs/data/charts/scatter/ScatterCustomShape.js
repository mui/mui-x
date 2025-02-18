import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { useScatterSeries } from '@mui/x-charts/hooks';

const data = [
  {
    id: 'data-0',
    x1: 329.39,
    y1: 443.28,
    y2: 153.9,
  },
  {
    id: 'data-1',
    x1: 96.94,
    y1: 110.5,
    y2: 217.8,
  },
  {
    id: 'data-2',
    x1: 336.35,
    y1: 175.23,
    y2: 286.32,
  },
  {
    id: 'data-3',
    x1: 159.44,
    y1: 195.97,
    y2: 325.12,
  },
  {
    id: 'data-4',
    x1: 188.86,
    y1: 351.77,
    y2: 144.58,
  },
  {
    id: 'data-5',
    x1: 143.86,
    y1: 43.253,
    y2: 146.51,
  },
  {
    id: 'data-6',
    x1: 202.02,
    y1: 376.34,
    y2: 309.69,
  },
  {
    id: 'data-7',
    x1: 384.41,
    y1: 31.514,
    y2: 236.38,
  },
  {
    id: 'data-8',
    x1: 256.76,
    y1: 231.31,
    y2: 440.72,
  },
  {
    id: 'data-9',
    x1: 143.79,
    y1: 108.04,
    y2: 20.29,
  },
  {
    id: 'data-10',
    x1: 103.48,
    y1: 321.77,
    y2: 484.17,
  },
  {
    id: 'data-11',
    x1: 272.39,
    y1: 120.18,
    y2: 54.962,
  },
  {
    id: 'data-12',
    x1: 23.57,
    y1: 366.2,
    y2: 418.5,
  },
  {
    id: 'data-13',
    x1: 219.73,
    y1: 451.45,
    y2: 181.32,
  },
  {
    id: 'data-14',
    x1: 54.99,
    y1: 294.8,
    y2: 440.9,
  },
  {
    id: 'data-15',
    x1: 134.13,
    y1: 121.83,
    y2: 273.52,
  },
  {
    id: 'data-16',
    x1: 12.7,
    y1: 287.7,
    y2: 346.7,
  },
  {
    id: 'data-17',
    x1: 176.51,
    y1: 134.06,
    y2: 74.528,
  },
  {
    id: 'data-18',
    x1: 65.05,
    y1: 104.5,
    y2: 150.9,
  },
  {
    id: 'data-19',
    x1: 162.25,
    y1: 413.07,
    y2: 26.483,
  },
  {
    id: 'data-20',
    x1: 68.88,
    y1: 74.68,
    y2: 333.2,
  },
  {
    id: 'data-21',
    x1: 95.29,
    y1: 360.6,
    y2: 422.0,
  },
  {
    id: 'data-22',
    x1: 390.62,
    y1: 330.72,
    y2: 488.06,
  },
];

export default function ScatterCustomSize() {
  return (
    <ScatterChart
      width={600}
      height={300}
      series={[
        {
          id: '1',
          label: 'Series A',
          data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
          markerSize: 8,
          labelMarkType: 'square',
        },
        {
          id: '2',
          label: 'Series B',
          data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
          markerSize: 4,
          labelMarkType: 'line',
        },
      ]}
      slots={{ marker: CustomMarker }}
    />
  );
}

function CustomMarker({ ownerState, ...other }) {
  const series = useScatterSeries(ownerState.id);

  if (!series) {
    return null;
  }

  const commonProps = {
    x: 0,
    y: 0,
    width: (ownerState.isHighlighted ? 1.2 : 1) * series.markerSize,
    height: (ownerState.isHighlighted ? 1.2 : 1) * series.markerSize,
    transform: `translate(${ownerState.x}, ${ownerState.y})`,
    fill: ownerState.color,
    opacity: ownerState.isFaded ? 0.3 : 1,
    ...other,
  };

  if (series.id === '1') {
    return (
      <path
        d="M11.524 3.464a.5.5 0 0 1 .952 0l1.657 5.1a.5.5 0 0 0 .475.346h5.364a.5.5 0 0 1 .294.904l-4.34 3.153a.5.5 0 0 0-.181.559l1.657 5.1a.5.5 0 0 1-.77.56l-4.338-3.153a.5.5 0 0 0-.588 0l-4.339 3.153a.5.5 0 0 1-.77-.56l1.658-5.1a.5.5 0 0 0-.182-.56L3.734 9.815a.5.5 0 0 1 .294-.904h5.364a.5.5 0 0 0 .475-.346l1.657-5.1Z"
        {...commonProps}
      />
    );
  }

  return <rect {...commonProps} />;
}
