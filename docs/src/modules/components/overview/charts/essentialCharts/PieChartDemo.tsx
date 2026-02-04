import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ChartDemoWrapper from '../ChartDemoWrapper';

// Data derived from https://gs.statcounter.com/os-market-share/desktop/worldwide/2023
// And https://gs.statcounter.com/os-market-share/mobile/worldwide/2023
// And https://gs.statcounter.com/platform-market-share/desktop-mobile-tablet/worldwide/2023
// For the month of December 2023

const desktopOS = [
  {
    label: 'Windows',
    value: 72.72,
  },
  {
    label: 'OS X',
    value: 16.38,
  },
  {
    label: 'Linux',
    value: 3.83,
  },
  {
    label: 'Chrome OS',
    value: 2.42,
  },
  {
    label: 'Other',
    value: 4.65,
  },
];

const valueFormatter = (item: { value: number }) => `${item.value}%`;

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontWeight: 500,
  fontSize: 18,
}));

function PieCenterLabel({ children }: { children: string }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

function Pie() {
  return (
    <Stack height="100%">
      <Typography align="center">Desktop OS market share</Typography>
      <PieChart
        series={[
          {
            data: desktopOS,
            valueFormatter,
            arcLabelMinAngle: 35,
            outerRadius: '90%',
            innerRadius: '60%',
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: 'bold',
          },
        }}
      >
        <PieCenterLabel>1.9 Bn Desktops</PieCenterLabel> {/* source: ChatGPT */}
      </PieChart>
    </Stack>
  );
}

export default function PieChartDemo() {
  return (
    <ChartDemoWrapper link="/x/react-charts/pie/">
      <Pie />
    </ChartDemoWrapper>
  );
}
