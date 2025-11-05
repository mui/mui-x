import * as React from 'react';
import Box from '@mui/material/Box';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import AppleIcon from '@mui/icons-material/Apple';
import Typography from '@mui/material/Typography';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';

interface CustomTickProps {
  x: number;
  y: number;
  text: string;
}

const iconMap: Record<string, React.ElementType> = {
  Apple: AppleIcon,
  Alphabet: GoogleIcon,
  Microsoft: MicrosoftIcon,
};

function CustomTick(props: CustomTickProps) {
  const { x, y, text } = props;
  const IconComponent = iconMap[text];

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-20} y={0} width={60} height={50}>
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
              gap: 0.3,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', lineHeight: 1 }}
            >
              {text}
            </Typography>
            {IconComponent ? <IconComponent sx={{ fontSize: 18 }} /> : null}
          </Box>
        </div>
      </foreignObject>
    </g>
  );
}

export default function TickLabelSVG() {
  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <ChartContainer
        xAxis={[
          {
            scaleType: 'band',
            data: ['Apple', 'Alphabet', 'Microsoft'],
            id: 'companies',
          },
        ]}
        yAxis={[{ id: 'revenue', position: 'left', width: 60 }]}
        series={[
          {
            type: 'bar',
            yAxisId: 'revenue',
            data: [391, 350, 245.1],
          },
        ]}
        height={300}
      >
        <BarPlot />
        <ChartsXAxis
          axisId="companies"
          slots={{ axisTickLabel: CustomTick }}
          height={80}
        />
        <ChartsYAxis
          axisId="revenue"
          label="FY 2024 revenue in USD Billions"
        />
      </ChartContainer>
    </Box>
  );
}
