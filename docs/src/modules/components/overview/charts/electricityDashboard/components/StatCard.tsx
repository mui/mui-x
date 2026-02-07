import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';

function AreaGradient({ id, color }: { id: string; color: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  data: number[];
  xAxisData?: Date[];
  valueFormatter?: (value: number | null) => string;
  color?: string;
}

export function StatCard({ title, value, subtitle, data, xAxisData, valueFormatter, color = '#4254FB' }: StatCardProps) {
  const gradientId = React.useId();

  return (
    <Card variant="outlined" sx={{ height: 'fit-content', flex: 1 }}>
      <CardContent
        sx={{ padding: { xs: 1, md: 1.5 }, '&:last-child': { paddingBottom: { xs: 1, md: 1.5 } } }}
      >
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Stack direction="row" alignItems="flex-end" spacing={2}>
            <div>
              <Typography variant="h5" component="p" fontWeight={600}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </div>
            <Box sx={{ width: '100%', height: 50, minWidth: 80 }}>
              <SparkLineChart
                data={data}
                xAxis={{
                  scaleType: 'time',
                  data: xAxisData,
                  valueFormatter: (date: Date) =>
                    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                }}
                valueFormatter={valueFormatter}
                area
                showHighlight
                showTooltip
                color={color}
                sx={{
                  [`& .${areaElementClasses.root}`]: {
                    fill: `url(#${gradientId})`,
                  },
                }}
              >
                <AreaGradient id={gradientId} color={color} />
              </SparkLineChart>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
