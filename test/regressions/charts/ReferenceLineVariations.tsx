import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const lineData = [2, 5, 3, 8, 4];
const xAxisData = [1, 2, 3, 4, 5];

const chartProps = {
  series: [
    {
      type: 'line' as const,
      data: lineData,
    },
  ],
  xAxis: [
    {
      data: xAxisData,
      min: 0,
      max: 6,
    },
  ],
  yAxis: [
    {
      min: 0,
      max: 10,
    },
  ],
  width: 300,
  height: 200,
};

function MiniChart({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Typography variant="caption" sx={{ textAlign: 'center' }}>
        {title}
      </Typography>
      <ChartContainer {...chartProps}>
        <LinePlot />
        {children}
        <ChartsXAxis />
        <ChartsYAxis />
      </ChartContainer>
    </Box>
  );
}

export default function ReferenceLineVariations() {
  return (
    <div>
      <div>
        <Typography variant="h6" sx={{ mb: 1 }}>
          X Reference Lines - labelAlign
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <MiniChart title="x=3, labelAlign='start'">
            <ChartsReferenceLine x={3} label="Start" labelAlign="start" />
          </MiniChart>
          <MiniChart title="x=3, labelAlign='middle'">
            <ChartsReferenceLine x={3} label="Middle" labelAlign="middle" />
          </MiniChart>
          <MiniChart title="x=3, labelAlign='end'">
            <ChartsReferenceLine x={3} label="End" labelAlign="end" />
          </MiniChart>
        </Box>
      </div>

      <div>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Y Reference Lines - labelAlign
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <MiniChart title="y=5, labelAlign='start'">
            <ChartsReferenceLine y={5} label="Start" labelAlign="start" />
          </MiniChart>
          <MiniChart title="y=5, labelAlign='middle'">
            <ChartsReferenceLine y={5} label="Middle" labelAlign="middle" />
          </MiniChart>
          <MiniChart title="y=5, labelAlign='end'">
            <ChartsReferenceLine y={5} label="End" labelAlign="end" />
          </MiniChart>
        </Box>
      </div>

      <div>
        <Typography variant="h6" sx={{ mb: 1 }}>
          X Reference Lines - spacing (number)
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <MiniChart title="x=3, spacing=0, labelAlign='start'">
            <ChartsReferenceLine x={3} label="0" spacing={0} labelAlign="start" />
          </MiniChart>
          <MiniChart title="x=3, spacing=10, labelAlign='start'">
            <ChartsReferenceLine x={3} label="10" spacing={10} labelAlign="start" />
          </MiniChart>
          <MiniChart title="x=3, spacing=20, labelAlign='start'">
            <ChartsReferenceLine x={3} label="20" spacing={20} labelAlign="start" />
          </MiniChart>
        </Box>
      </div>

      <div>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Y Reference Lines - spacing (number)
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <MiniChart title="y=5, spacing=0, labelAlign='start'">
            <ChartsReferenceLine y={5} label="0" spacing={0} labelAlign="start" />
          </MiniChart>
          <MiniChart title="y=5, spacing=10, labelAlign='start'">
            <ChartsReferenceLine y={5} label="10" spacing={10} labelAlign="start" />
          </MiniChart>
          <MiniChart title="y=5, spacing=20, labelAlign='start'">
            <ChartsReferenceLine y={5} label="20" spacing={20} labelAlign="start" />
          </MiniChart>
        </Box>
      </div>

      <div>
        <Typography variant="h6" sx={{ mb: 1 }}>
          X Reference Lines - spacing (object)
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <MiniChart title="x=3, spacing={{x:0,y:0}}, start">
            <ChartsReferenceLine
              x={3}
              label="x:0,y:0"
              spacing={{ x: 0, y: 0 }}
              labelAlign="start"
            />
          </MiniChart>
          <MiniChart title="x=3, spacing={{x:15,y:5}}, start">
            <ChartsReferenceLine
              x={3}
              label="x:15,y:5"
              spacing={{ x: 15, y: 5 }}
              labelAlign="start"
            />
          </MiniChart>
          <MiniChart title="x=3, spacing={{x:5,y:15}}, start">
            <ChartsReferenceLine
              x={3}
              label="x:5,y:15"
              spacing={{ x: 5, y: 15 }}
              labelAlign="start"
            />
          </MiniChart>
        </Box>
      </div>

      <div>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Y Reference Lines - spacing (object)
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <MiniChart title="y=5, spacing={{x:0,y:0}}, start">
            <ChartsReferenceLine
              y={5}
              label="x:0,y:0"
              spacing={{ x: 0, y: 0 }}
              labelAlign="start"
            />
          </MiniChart>
          <MiniChart title="y=5, spacing={{x:15,y:5}}, start">
            <ChartsReferenceLine
              y={5}
              label="x:15,y:5"
              spacing={{ x: 15, y: 5 }}
              labelAlign="start"
            />
          </MiniChart>
          <MiniChart title="y=5, spacing={{x:5,y:15}}, start">
            <ChartsReferenceLine
              y={5}
              label="x:5,y:15"
              spacing={{ x: 5, y: 15 }}
              labelAlign="start"
            />
          </MiniChart>
        </Box>
      </div>

      <div>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Middle labelAlign - spacing variations
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <MiniChart title="x=3, middle, default spacing">
            <ChartsReferenceLine x={3} label="Default" labelAlign="middle" />
          </MiniChart>
          <MiniChart title="x=3, middle, spacing=10">
            <ChartsReferenceLine x={3} label="10" spacing={10} labelAlign="middle" />
          </MiniChart>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <MiniChart title="y=5, middle, default spacing">
            <ChartsReferenceLine y={5} label="Default" labelAlign="middle" />
          </MiniChart>
          <MiniChart title="y=5, middle, spacing=10">
            <ChartsReferenceLine y={5} label="10" spacing={10} labelAlign="middle" />
          </MiniChart>
        </Box>
      </div>

      <div>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Combined X and Y Reference Lines
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <MiniChart title="Both axes, start align">
            <ChartsReferenceLine x={3} label="X=3" labelAlign="start" />
            <ChartsReferenceLine y={5} label="Y=5" labelAlign="start" />
          </MiniChart>
          <MiniChart title="Both axes, mixed align">
            <ChartsReferenceLine x={3} label="X=3" labelAlign="end" />
            <ChartsReferenceLine y={5} label="Y=5" labelAlign="middle" />
          </MiniChart>
        </Box>
      </div>

      <div>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Multiple Reference Lines
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <MiniChart title="Multiple X lines">
            <ChartsReferenceLine x={2} label="X=2" labelAlign="start" />
            <ChartsReferenceLine x={4} label="X=4" labelAlign="end" />
          </MiniChart>
          <MiniChart title="Multiple Y lines">
            <ChartsReferenceLine y={3} label="Y=3" labelAlign="start" />
            <ChartsReferenceLine y={7} label="Y=7" labelAlign="end" />
          </MiniChart>
        </Box>
      </div>
    </div>
  );
}
