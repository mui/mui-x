import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { lineClasses } from '@mui/x-charts/LineChart';
import { overviewChartPalette } from '../theme/colors';

export type StatCardProps = {
  title: string;
  value: string;
  data: number[];
};

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function StatCard({ title, value, data }: StatCardProps) {
  const theme = useTheme();
  const chartColor = overviewChartPalette(theme.palette.mode)[4];

  return (
    <Card variant="outlined" sx={{ height: 'fit-content', flexBasis: '33.3%' }}>
      <CardContent
        sx={{ padding: { xs: 1, md: 1.5 }, '&:last-child': { paddingBottom: { xs: 1, md: 1.5 } } }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {title}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-end' }}>
          <Typography variant="h4" component="p" sx={{ fontSize: '1.5rem', fontWeight: 500 }}>
            {value}
          </Typography>
          <Box sx={{ width: '100%', height: 50 }}>
            <SparkLineChart
              data={data}
              area
              color={chartColor}
              showHighlight
              showTooltip
              sx={{
                [`& .${lineClasses.area}`]: {
                  fill: `url(#area-gradient-${value})`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={`area-gradient-${value}`} />
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
