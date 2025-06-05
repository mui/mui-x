import * as React from 'react';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';

import { inflationData } from './inflationData';
import {
  continents,
  populationGdpPerCapitaData,
} from './populationGdpPerCapitaData';

const populationFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
});
const gdpPerCapitaFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
});

const series = continents.map((continent) => ({
  label: continent,
  data: populationGdpPerCapitaData[continent].map((p) => ({
    x: p.population,
    y: p.gdpPerCapita,
    id: p.country,
  })),
  valueFormatter: (value) =>
    `${value.id}: ${populationFormatter.format(value.x)} people, ${gdpPerCapitaFormatter.format(value.y)} GDP per capita`,
  highlightScope: {
    highlight: 'item',
    fade: 'global',
  },
}));

const fileName = 'Population_vs_GDP_Per_Capita_USD_2019';

export default function ExportChartToolbarCustomization() {
  const apiRef = React.useRef(undefined);
  const [formats, setFormats] = React.useState({
    print: true,
    'image/png': true,
    'image/jpeg': false,
    'image/webp': false,
  });

  const imageExportOptions = Object.entries(formats)
    .filter(([key, value]) => key.startsWith('image/') && value)
    .map(([key]) => ({ type: key, fileName }));

  const handleChange = (event) => {
    setFormats((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  return (
    <Stack width="100%">
      <FormControl fullWidth>
        <FormLabel>Export Options</FormLabel>
        <FormGroup row>
          <FormControlLabel
            label="Print"
            control={
              <Checkbox
                name="print"
                checked={formats.print}
                onChange={handleChange}
              />
            }
          />
          <FormControlLabel
            label="image/png"
            control={
              <Checkbox
                name="image/png"
                checked={formats['image/png']}
                onChange={handleChange}
              />
            }
          />
          <FormControlLabel
            label="image/jpeg"
            control={
              <Checkbox
                name="image/jpeg"
                checked={formats['image/jpeg']}
                onChange={handleChange}
              />
            }
          />
          <FormControlLabel
            label="image/webp"
            control={
              <Checkbox
                name="image/webp"
                checked={formats['image/webp']}
                onChange={handleChange}
              />
            }
          />
        </FormGroup>
      </FormControl>
      <Typography sx={{ alignSelf: 'center', my: 1 }}>
        Population vs GDP Per Capita (USD), 2019
      </Typography>
      <ScatterChartPro
        apiRef={apiRef}
        height={300}
        xAxis={[
          {
            scaleType: 'log',
            data: inflationData.map((p) => p.year),
            valueFormatter: (value) => populationFormatter.format(value),
            zoom: true,
            label: 'Population',
          },
        ]}
        series={series}
        yAxis={[
          {
            scaleType: 'log',
            valueFormatter: (value) => gdpPerCapitaFormatter.format(value),
            label: 'GDP per Capita',
          },
        ]}
        showToolbar
        grid={{ horizontal: true }}
        slotProps={{
          toolbar: {
            // TODO: Fix toolbar props not being typed with charts toolbar pro props
            printOptions: { disableToolbarButton: !formats.print, fileName },
            imageExportOptions,
          },
        }}
      />
      <Typography variant="caption">Source: World Bank</Typography>
    </Stack>
  );
}
