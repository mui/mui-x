import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

interface TitanicDatum {
  Class: '1st' | '2nd' | '3rd' | 'Crew';
  Survived: 'Yes' | 'No';
  Count: number;
}

interface ChartDatum {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
}

type ClassType = '1st' | '2nd' | '3rd' | 'Crew';

// Convert hex color to rgba with opacity
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// https://en.wikipedia.org/wiki/Passengers_of_the_Titanic#/media/File:Titanic_casualties.svg
const titanicData: TitanicDatum[] = [
  { Class: '1st', Survived: 'No', Count: 123 },
  { Class: '1st', Survived: 'Yes', Count: 202 },
  { Class: '2nd', Survived: 'No', Count: 167 },
  { Class: '2nd', Survived: 'Yes', Count: 118 },
  { Class: '3rd', Survived: 'No', Count: 528 },
  { Class: '3rd', Survived: 'Yes', Count: 178 },
  { Class: 'Crew', Survived: 'No', Count: 696 },
  { Class: 'Crew', Survived: 'Yes', Count: 212 },
];

const classes: ClassType[] = ['1st', '2nd', '3rd', 'Crew'];

const totalCount = titanicData.reduce(
  (acc: number, item: TitanicDatum) => acc + item.Count,
  0,
);

// Define colors for each class
const classColors: Record<ClassType, string> = {
  '1st': '#fa938e',
  '2nd': '#98bf45',
  '3rd': '#51cbcf',
  Crew: '#d397ff',
};

// Different opacity based on class
const opacityMap: Record<ClassType, number> = {
  '1st': 0.9,
  '2nd': 0.7,
  '3rd': 0.5,
  Crew: 0.3,
};

const classData: ChartDatum[] = classes.map((pClass: ClassType) => {
  const classTotal = titanicData
    .filter((item: TitanicDatum) => item.Class === pClass)
    .reduce((acc: number, item: TitanicDatum) => acc + item.Count, 0);
  return {
    id: pClass,
    label: `${pClass} Class:`,
    value: classTotal,
    percentage: (classTotal / totalCount) * 100,
    color: classColors[pClass],
  };
});

const classSurvivalData: ChartDatum[] = classes.flatMap((pClass: ClassType) => {
  const classTotal = classData.find((d: ChartDatum) => d.id === pClass)!.value ?? 0;
  const baseColor = classColors[pClass];
  return titanicData
    .filter((item: TitanicDatum) => item.Class === pClass)
    .sort((a: TitanicDatum, b: TitanicDatum) => (a.Survived > b.Survived ? 1 : -1))
    .map((item: TitanicDatum) => ({
      id: `${pClass}-${item.Survived}`,
      label: item.Survived,
      value: item.Count,
      percentage: (item.Count / classTotal) * 100,
      color: item.Survived === 'Yes' ? baseColor : `${baseColor}80`, // 80 is 50% opacity for 'No'
    }));
});

// Create a simplified dataset that groups all classes together for Yes/No
const survivalData: ChartDatum[] = [
  {
    id: 'Yes',
    label: 'Survived:',
    value: titanicData
      .filter((item: TitanicDatum) => item.Survived === 'Yes')
      .reduce((sum: number, item: TitanicDatum) => sum + item.Count, 0),
    percentage:
      (titanicData
        .filter((item: TitanicDatum) => item.Survived === 'Yes')
        .reduce((sum: number, item: TitanicDatum) => sum + item.Count, 0) /
        totalCount) *
      100,
    color: classColors['3rd'],
  },
  {
    id: 'No',
    label: 'Did not survive:',
    value: titanicData
      .filter((item: TitanicDatum) => item.Survived === 'No')
      .reduce((sum: number, item: TitanicDatum) => sum + item.Count, 0),
    percentage:
      (titanicData
        .filter((item: TitanicDatum) => item.Survived === 'No')
        .reduce((sum: number, item: TitanicDatum) => sum + item.Count, 0) /
        totalCount) *
      100,
    color: classColors['1st'],
  },
];

// Create dataset for class distribution by survival status (Yes first, then No)
const survivalClassData: ChartDatum[] = [...titanicData]
  .sort((a: TitanicDatum) => (a.Survived === 'Yes' ? -1 : 1))
  .map((item: TitanicDatum) => {
    const baseColor = survivalData.find(
      (d: ChartDatum) => d.id === item.Survived,
    )!.color;
    return {
      id: `${item.Class}-${item.Survived}`,
      label: `${item.Class} class:`,
      value: item.Count,
      percentage:
        (item.Count /
          (item.Survived === 'Yes'
            ? survivalData[0]!.value
            : survivalData[1]!.value)) *
        100,
      color: hexToRgba(baseColor, opacityMap[item.Class] || 1),
    };
  });

const StyledText = styled('text')(({ theme }: { theme: Theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

interface PieCenterLabelProps {
  children: React.ReactNode;
}

function PieCenterLabel({ children }: PieCenterLabelProps): React.ReactElement {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

type ViewType = 'class' | 'survival';

export default function TitanicPie(): React.ReactElement {
  const [view, setView] = React.useState<ViewType>('class');
  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: ViewType | null,
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const innerRadius = 50;
  const middleRadius = 120;

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Titanic survival statistics
      </Typography>
      <ToggleButtonGroup
        color="primary"
        size="small"
        value={view}
        exclusive
        onChange={handleViewChange}
      >
        <ToggleButton value="class">View by Class</ToggleButton>
        <ToggleButton value="survival">View by Survival</ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ display: 'flex', justifyContent: 'center', height: 400 }}>
        {view === 'class' ? (
          <PieChart
            series={[
              {
                innerRadius,
                outerRadius: middleRadius,
                data: classData,
                arcLabel: (item) =>
                  `${item.id} (${(item as any).percentage.toFixed(0)}%)`,
                valueFormatter: ({ value }) =>
                  `${value} out of ${totalCount} (${((value / totalCount) * 100).toFixed(0)}%)`,
                highlightScope: { fade: 'global', highlight: 'item' },
                highlighted: { additionalRadius: 2 },
                cornerRadius: 3,
              },
              {
                innerRadius: middleRadius,
                outerRadius: middleRadius + 20,
                data: classSurvivalData,
                arcLabel: (item) =>
                  `${item.label} (${(item as any).percentage.toFixed(0)}%)`,
                valueFormatter: ({ value }) =>
                  `${value} out of ${totalCount} (${((value / totalCount) * 100).toFixed(0)}%)`,
                arcLabelRadius: 160,
                highlightScope: { fade: 'global', highlight: 'item' },
                highlighted: { additionalRadius: 2 },
                cornerRadius: 3,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontSize: '12px',
              },
            }}
            hideLegend
          >
            <PieCenterLabel>Class</PieCenterLabel>
          </PieChart>
        ) : (
          <PieChart
            series={[
              {
                innerRadius,
                outerRadius: middleRadius,
                data: survivalData,
                arcLabel: (item) =>
                  `${item.id} (${(item as any).percentage.toFixed(0)}%)`,
                valueFormatter: ({ value }) =>
                  `${value} out of ${totalCount} (${((value / totalCount) * 100).toFixed(0)}%)`,
                highlightScope: { fade: 'global', highlight: 'item' },
                highlighted: { additionalRadius: 2 },
                cornerRadius: 3,
              },
              {
                innerRadius: middleRadius,
                outerRadius: middleRadius + 20,
                data: survivalClassData,
                arcLabel: (item) => {
                  const id = (item as any).id || '';
                  const percentage = (item as any).percentage || 0;
                  return `${id.split('-')[0]} (${percentage.toFixed(0)}%)`;
                },
                arcLabelRadius: 160,
                valueFormatter: ({ value }) =>
                  `${value} out of ${totalCount} (${((value / totalCount) * 100).toFixed(0)}%)`,
                highlightScope: { fade: 'global', highlight: 'item' },
                highlighted: { additionalRadius: 2 },
                cornerRadius: 3,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontSize: '12px',
              },
            }}
            hideLegend
          >
            <PieCenterLabel>Survived</PieCenterLabel>
          </PieChart>
        )}
      </Box>
    </Box>
  );
}
