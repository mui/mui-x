import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { PieItemIdentifier, DefaultizedPieValueType } from '@mui/x-charts/models';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const items = [
  { value: 10, label: 'Series A ( no Id )' },
  { id: 'id_B', value: 15, label: 'Series B' },
  { id: 'id_C', value: 20, label: 'Series C' },
];

const formatObject = (obj: null | PieItemIdentifier) => {
  if (obj === null) {
    return '  undefined';
  }
  return JSON.stringify(obj, null, 2)
    .split('\n')
    .map((l) => `  ${l}`)
    .join('\n');
};
export default function OnSeriesItemClick() {
  const [identifier, setIdentifier] = React.useState<null | PieItemIdentifier>(null);
  const [id, setId] = React.useState<undefined | string | number>(undefined);

  const handleClick = (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    itemIdentifier: PieItemIdentifier,
    item: DefaultizedPieValueType,
  ) => {
    setId(item.id);
    setIdentifier(itemIdentifier);
  };

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-start', md: 'center' }}
      justifyContent="space-between"
      sx={{ width: '100%' }}
    >
      <Typography
        component="pre"
        sx={{ maxWidth: { xs: '100%', md: '50%', flexShrink: 1 }, overflow: 'auto' }}
      >
        {`item id: ${id ?? 'undefined'}

item identifier:
${formatObject(identifier)}`}
      </Typography>

      <PieChart
        series={[
          {
            data: items,
          },
        ]}
        onItemClick={handleClick}
        width={400}
        height={200}
        margin={{ right: 200 }}
      />
    </Stack>
  );
}
