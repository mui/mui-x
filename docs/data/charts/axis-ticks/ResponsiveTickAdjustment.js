import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { Chance } from 'chance';
import { BarChart } from '@mui/x-charts/BarChart';

const chance = new Chance(42);

const produce = [
  'Apple',
  'Apricot',
  'Artichoke',
  'Arugula',
  'Asparagus',
  'Avocado',
  'Banana',
  'Beet',
  'Bell pepper',
  'Blackberry',
  'Blueberry',
  'Bok choy',
  'Broccoli',
  'Brussels sprout',
  'Cabbage',
  'Cantaloupe',
  'Carrot',
  'Cauliflower',
  'Celery',
  'Cherry',
  'Chickpea',
  'Chili pepper',
  'Clementine',
  'Coconut',
  'Collard greens',
  'Corn',
  'Cranberry',
  'Cucumber',
  'Currant',
  'Daikon',
  'Date',
  'Dragonfruit',
  'Durian',
  'Edamame',
  'Eggplant',
  'Elderberry',
  'Endive (red)',
  'Endive',
  'Fennel',
  'Fig',
  'Garlic',
  'Ginger',
  'Gooseberry',
  'Grape',
  'Grapefruit',
  'Green bean',
  'Guava',
  'Honeydew',
  'Jackfruit',
  'Jalapeño',
  'Jicama',
  'Kale',
  'Kiwi',
  'Kohlrabi',
  'Kumquat',
  'Leek',
  'Lemon',
  'Lentil',
  'Lettuce',
  'Lime',
  'Lychee',
  'Mandarin',
  'Mango',
  'Mizuna',
  'Mulberry',
  'Mushroom',
  'Mustard greens',
  'Nectarine',
  'Okra',
  'Olive',
  'Onion',
  'Orange',
  'Papaya',
  'Parsnip',
  'Passionfruit',
  'Pea',
  'Peach',
  'Pear',
  'Persian lime',
  'Persimmon',
  'Pineapple',
  'Plantain',
  'Plum',
  'Pomegranate',
  'Pomelo',
  'Potato',
  'Pumpkin',
  'Quince',
  'Radicchio',
  'Radish',
  'Raisin',
  'Rambutan',
  'Raspberry',
  'Redcurrant',
  'Rhubarb',
  'Rutabaga',
  'Salak',
  'Salsify',
  'Scallion',
  'Shallot',
  'Snow pea',
  'Soursop',
  'Spinach',
  'Squash',
  'Starfruit',
  'Strawberry',
  'Sweet potato',
  'Swiss chard',
  'Tamarind',
  'Tangerine',
  'Taro',
  'Tatsoi',
  'Tomato',
  'Turnip',
  'Ugli',
  'Watercress',
  'Watermelon',
  'Yam',
  'Yuzu',
  'Zucchini',
];

const dataset = produce.map((name) => ({
  item: name,
  sales: chance.integer({ min: 100, max: 1000 }),
}));

export default function ResponsiveTickAdjustment() {
  const [widthPct, setWidthPct] = React.useState(40);
  const [enabled, setEnabled] = React.useState(true);

  return (
    <Stack direction="column" sx={{ gap: 2, width: '100%', alignItems: 'center' }}>
      <Stack direction="column" spacing={1} sx={{ width: '100%', maxWidth: 400 }}>
        <Typography gutterBottom id="chart-width">
          Chart width: {widthPct}%
        </Typography>
        <Slider
          value={widthPct}
          onChange={(_, value) => setWidthPct(value)}
          valueLabelDisplay="auto"
          min={20}
          max={100}
          step={5}
          aria-labelledby="chart-width"
        />
        <FormControlLabel
          control={
            <Switch
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
            />
          }
          label="experimentalFeatures.useNewDefaultTickSpacing"
        />
      </Stack>
      <Box sx={{ width: `${widthPct}%`, transition: 'width 120ms ease-out' }}>
        <BarChart
          dataset={dataset}
          xAxis={[{ dataKey: 'item', scaleType: 'band' }]}
          series={[{ dataKey: 'sales', label: 'Units sold' }]}
          height={300}
          experimentalFeatures={{ useNewDefaultTickSpacing: enabled }}
        />
      </Box>
    </Stack>
  );
}
