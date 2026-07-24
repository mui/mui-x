import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { RadarChart, RadarSeries, radarClasses } from '@mui/x-charts/RadarChart';
import ChartDemoWrapper from '../ChartDemoWrapper';
import { overviewPokemonPalette } from '../theme/colors';

// Taken from https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_base_stats_in_Generation_I
const series = [
  { label: 'Bulbasaur', data: [45, 49, 49, 45, 65], hideMark: true },
  { label: 'Charmander', data: [39, 52, 43, 65, 50], hideMark: true },
  { label: 'Squirtle', data: [44, 48, 65, 43, 50], hideMark: true },
] satisfies RadarSeries[];

function Radar() {
  const theme = useTheme();

  return (
    <Stack sx={{ height: '100%' }}>
      <Typography align="center">Pokémon base stats</Typography>
      <RadarChart
        colors={overviewPokemonPalette(theme.palette.mode)}
        series={series}
        radar={{
          metrics: ['HP', 'Attack', 'Defense', 'Speed', 'Special'],
        }}
        sx={{ [`& .${radarClasses.seriesArea}`]: { strokeWidth: 2 } }}
      />
    </Stack>
  );
}

export default function RadarDemo() {
  return (
    <ChartDemoWrapper link="/x/react-charts/radar/">
      <Radar />
    </ChartDemoWrapper>
  );
}
