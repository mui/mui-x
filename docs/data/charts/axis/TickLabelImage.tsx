import * as React from 'react';
import Box from '@mui/material/Box';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTextProps } from '@mui/x-charts/ChartsText';
import { iconMap } from '../dataset/company.icons';

function CustomTick(props: ChartsTextProps) {
  const { x, y, text } = props;
  const logo = iconMap[text];

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-20} y={-10} width={40} height={40}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {logo && (
              <img
                src={logo}
                alt={text}
                style={{
                  width: '40px',
                  height: '40px',
                  objectFit: 'contain',
                }}
              />
            )}
          </Box>
        </div>
      </foreignObject>
    </g>
  );
}

export default function TickLabelImage() {
  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <ChartContainer
        xAxis={[
          {
            scaleType: 'band',
            data: ['Netflix', 'Alphabet', 'Microsoft'],
            id: 'companies',
          },
        ]}
        yAxis={[{ id: 'revenue', position: 'left', width: 60 }]}
        series={[
          {
            type: 'bar',
            yAxisId: 'revenue',
            data: [39, 350, 245.1],
          },
        ]}
        height={300}
      >
        <BarPlot />
        <ChartsXAxis axisId="companies" slots={{ axisTickLabel: CustomTick }} />
        <ChartsYAxis axisId="revenue" label="FY 2024 revenue in USD Billions" />
      </ChartContainer>
    </Box>
  );
}
