import * as React from 'react';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import Slider from '@mui/material/Slider';
import { globalGdpPerCapita } from '../dataset/globalGdpPerCapita';
import { globalBirthPerWoman } from '../dataset/globalBirthsPerWoman';
import {
  continents,
  countriesInContinent,
  countryData,
} from '../dataset/countryData';

const gdpPerCapitaFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
});

const scatterXAxis = {
  valueFormatter: (v) => gdpPerCapitaFormatter.format(v),
};

const dataPerContinent = continents.map((continent) =>
  countriesInContinent[continent]
    .map((code) => ({
      id: code,
      x: globalGdpPerCapita.find((d) => d.code === code)?.gdpPerCapita,
      y: globalBirthPerWoman.find((d) => d.code === code)?.rate,
    }))
    .filter((d) => d.x !== undefined && d.y !== undefined),
);

const scatterSettings = {
  yAxis: [{ id: 'y', width: 16, min: 0 }],
  height: 300,
};

export default function ZoomSliderPreviewCustomMarkerSize() {
  const [markerSize, setMarkerSize] = React.useState(2);
  const series = continents.map((continent, continentIndex) => ({
    label: continent,
    data: dataPerContinent[continentIndex],
    preview: { markerSize },
    valueFormatter: (value) =>
      `${countryData[value.id].country} - Birth rate: ${value.y} - GDP per capita: ${gdpPerCapitaFormatter.format(value.x)}`,
  }));

  return (
    <Stack
      width="100%"
      gap={2}
      direction="row"
      justifyContent="center"
      flexWrap={{ xs: 'wrap-reverse', sm: 'nowrap' }}
    >
      <Stack width="100%" gap={2}>
        <Typography variant="h6" sx={{ alignSelf: 'center' }}>
          Births per woman vs GDP per capita (USD, 2023)
        </Typography>
        <ScatterChartPro
          {...scatterSettings}
          xAxis={[
            { ...scatterXAxis, zoom: { slider: { enabled: true, preview: true } } },
          ]}
          series={series}
        />
        <Typography variant="caption">
          GDP per capita is expressed in international dollars at 2021 prices. <br />
          Source: Our World in Data. Updated: 2023.
        </Typography>
      </Stack>

      <Stack
        minWidth="120px"
        justifyContent="center"
        alignItems="center"
        alignSelf="center"
      >
        <Typography id="marker-size-slider" gutterBottom>
          Marker Size: {markerSize}
        </Typography>
        <Slider
          size="small"
          min={1}
          max={10}
          aria-labelledby="marker-size-slider"
          onChange={(event, value) => setMarkerSize(value)}
          value={markerSize}
        />
      </Stack>
    </Stack>
  );
}
