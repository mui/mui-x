import * as React from 'react';
import dayjs from 'dayjs';
import { ThemeOptions, createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { StatCard } from './components/StatCard';
import { DateRangeFilter } from './components/DateRangeFilter';
import { GenerationChart } from './components/GenerationChart';
import { EmissionsChart } from './components/EmissionsChart';
import { CountryGrid } from './components/CountryGrid';
import { useFilteredData } from './hooks/useFilteredData';
import { getTheme } from '../theme/getTheme';
import type { DateRange } from './types/electricity';

const DEFAULT_START = dayjs('2024-06-01');
const DEFAULT_END = dayjs('2024-06-30');

const formatNumber = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}k`;
  }
  return value.toFixed(0);
};

export default function ElectricityDashboard() {
  const currentTheme = useTheme();
  const [dateRange, setDateRange] = React.useState<DateRange>([DEFAULT_START, DEFAULT_END]);

  const customTheme = createTheme(
    currentTheme as ThemeOptions,
    getTheme(currentTheme.palette.mode),
  );

  const filteredData = useFilteredData(dateRange[0], dateRange[1]);
  const [selectedCountries, setSelectedCountries] = React.useState<Set<string>>(
    new Set(filteredData.countryStats.map((country) => country.code)),
  );

  return (
    <ThemeProvider theme={customTheme}>
      <Paper
        component="div"
        variant="outlined"
        sx={(theme) => ({
          my: 4,
          mx: 'auto',
          maxWidth: 1200,
          minHeight: 700,
          overflow: 'hidden',
          p: 2,
          background: theme.palette.gradients?.linearSubtle ?? theme.palette.background.paper,
        })}
      >
        <Stack spacing={2} sx={{ height: '100%' }}>
          {/* Header */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={2}
          >
            <div>
              <Typography variant="h6" fontWeight={600}>
                European Electricity Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generation and carbon emissions across 11 countries
              </Typography>
            </div>
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
          </Stack>

          {/* Stat Cards */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <StatCard
              title="Total Generation"
              value={`${formatNumber(filteredData.totals.totalGeneration)} MWh`}
              subtitle="Selected period"
              data={filteredData.totals.generationTrend}
              xAxisData={filteredData.totals.trendDates}
              valueFormatter={(v) => (v != null ? `${formatNumber(v)} MWh` : '')}
              color="#1976d2"
            />
            <StatCard
              title="Avg CO₂ Intensity"
              value={`${Math.round(filteredData.totals.avgEmissions)} gCO₂/kWh`}
              subtitle="Weighted average"
              data={filteredData.totals.emissionsTrend}
              xAxisData={filteredData.totals.trendDates}
              valueFormatter={(v) => (v != null ? `${Math.round(v)} gCO₂/kWh` : '')}
              color="#ff9800"
            />
            {filteredData.cleanestCountry && (
              <StatCard
                title="Cleanest Grid"
                value={filteredData.cleanestCountry.name}
                subtitle={`${Math.round(filteredData.cleanestCountry.avgEmissions)} gCO₂/kWh`}
                data={filteredData.cleanestCountry.emissionsTrend}
                xAxisData={filteredData.totals.trendDates}
                valueFormatter={(v) => (v != null ? `${Math.round(v)} gCO₂/kWh` : '')}
                color="#4caf50"
              />
            )}
          </Stack>

          {/* Charts */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ flex: 1, minHeight: 250 }}
          >
            <Paper variant="outlined" sx={{ flex: 1, p: 2, minWidth: 0 }}>
              <GenerationChart
                data={filteredData.chartData}
                selectedCountries={selectedCountries}
              />
            </Paper>
            <Paper variant="outlined" sx={{ flex: 1, p: 2, minWidth: 0 }}>
              <EmissionsChart data={filteredData.chartData} selectedCountries={selectedCountries} />
            </Paper>
          </Stack>

          {/* Data Grid */}
          <Paper variant="outlined" sx={{ p: 2, minHeight: 300 }}>
            <CountryGrid
              data={filteredData.countryStats}
              selectedCountries={selectedCountries}
              onSelectedCountriesChange={setSelectedCountries}
            />
          </Paper>
        </Stack>
      </Paper>
    </ThemeProvider>
  );
}
