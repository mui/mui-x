import * as React from 'react';
import Stack from '@mui/material/Stack';
import FigmaTreeView from './FigmaTreeView';
import FigmaCard from './FigmaCard';
import { IdType } from './items';

export default function FigmaExample() {
  const [selectedItem, setSelectedItem] = React.useState<IdType | null>(null);
  return (
    <Stack sx={{ width: '100%', height: '100%' }} direction="row">
      <Stack
        pl={1}
        py={1}
        sx={(theme) => ({ borderRight: `1px solid ${theme.palette.divider}`, height: '100%' })}
      >
        <FigmaTreeView selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </Stack>
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={(theme) => ({
          flexGrow: 1,
          backgroundImage: `linear-gradient(${theme.palette.divider} 1px, transparent 1px), linear-gradient(to right,${theme.palette.divider} 1px, ${theme.palette.background.paper} 1px)`,
          backgroundSize: '20px 20px',
        })}
      >
        <FigmaCard selectedItem={selectedItem} />
      </Stack>
    </Stack>
  );
}
