import * as React from 'react';

import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';

import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLayerContainer, ChartsSvgLayer, ChartsWrapper } from '@mui/x-charts';

// London borough population data (in thousands)
const londonBoroughs = [
  'Westminster',
  'Camden',
  'Hackney',
  'Tower Hamlets',
  'Southwark',
  'Lambeth',
  'Lewisham',
  'Greenwich',
  'Newham',
  'Barnet',
];

const populationData = [261, 270, 281, 331, 318, 326, 305, 287, 355, 395];

const data = [
  { name: 'Barking and Dagenham', value: 232747 },
  { name: 'Barnet', value: 405050 },
  { name: 'Bexley', value: 256434 },
  { name: 'Brent', value: 352976 },
  { name: 'Bromley', value: 335319 },
  { name: 'Camden', value: 216943 },
  { name: 'City of London', value: 15111 },
  { name: 'City of Westminster', value: 209996 },
  { name: 'Croydon', value: 409342 },
  { name: 'Ealing', value: 385985 },
  { name: 'Enfield', value: 327434 },
  { name: 'Greenwich', value: 299528 },
  { name: 'Hackney', value: 266758 },
  { name: 'Hammersmith and Fulham', value: 188687 },
  { name: 'Haringey', value: 263850 },
  { name: 'Harrow', value: 270724 },
  { name: 'Havering', value: 276274 },
  { name: 'Hillingdon', value: 329185 },
  { name: 'Hounslow', value: 299424 },
  { name: 'Islington', value: 223024 },
  { name: 'Kensington and Chelsea', value: 144518 },
  { name: 'Kingston upon Thames', value: 172692 },
  { name: 'Lambeth', value: 316920 },
  { name: 'Lewisham', value: 301255 },
  { name: 'Merton', value: 218539 },
  { name: 'Newham', value: 374523 },
  { name: 'Redbridge', value: 321231 },
  { name: 'Richmond upon Thames', value: 196678 },
  { name: 'Southwark', value: 314786 },
  { name: 'Sutton', value: 214525 },
  { name: 'Tower Hamlets', value: 331886 },
  { name: 'Waltham Forest', value: 279737 },
  { name: 'Wandsworth', value: 337655 },
];

export default function Layering() {
  return (
    <ChartDataProvider
      height={600}
      series={[
        {
          type: 'bar',
          data: data.map((d) => d.value),
          label: 'Population (thousands)',
        },
      ]}
      xAxis={[
        {
          scaleType: 'band',
          height: 100,
          data: data.map((d) => d.name),
          tickLabelStyle: {
            angle: -45,
          },
        },
      ]}
      yAxis={[{ label: 'Population (thousands)', width: 80, max: 1_000_000 }]}
    >
      <ChartsWrapper>
        <ChartsLegend />
        <ChartsLayerContainer>
          <Background />
          <ChartsSvgLayer>
            <ChartsGrid horizontal />
            <ChartsXAxis />
            <ChartsYAxis />
            <BarPlot />
            <ChartsAxisHighlight x="band" />
            <ChartsTooltip />
          </ChartsSvgLayer>
        </ChartsLayerContainer>
      </ChartsWrapper>
    </ChartDataProvider>
  );
}

function Background() {
  return (
    <img
      src={'./london-skyline.jpg'}
      alt="London"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  );
}
