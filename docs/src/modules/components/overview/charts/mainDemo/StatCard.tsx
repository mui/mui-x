import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';

export type StatCardProps = {
  title: string;
  value: string;
  data: number[];
};

function AreaGradient({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#4254FB" stopOpacity={0.3} />
        <stop offset="100%" stopColor="#4254FB" stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function StatCard({ title, value, data }: StatCardProps) {
  return (
    <Card variant="outlined" sx={{ height: 'fit-content', flexBasis: '33.3%' }}>
      <CardContent sx={{ padding: 1.5, '&:last-child': { paddingBottom: 1.5 } }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="flex-end" spacing={2}>
          <Typography variant="h4" component="p" fontSize={'1.5rem'} fontWeight={500}>
            {value}
          </Typography>
          <Box sx={{ width: '100%', height: 50 }}>
            <SparkLineChart
              data={data}
              area
              showHighlight
              showTooltip
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${value})`,
                },
              }}
            >
              <AreaGradient id={`area-gradient-${value}`} />
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
