import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import FigmaTreeView from './FigmaTreeView';
import FigmaCard from './FigmaCard';
import { IdType } from './items';

export default function FigmaExample() {
  const [selectedItem, setSelectedItem] = React.useState<IdType | null>(null);
  const docsTheme = useTheme();
  const isMd = useMediaQuery(docsTheme.breakpoints.up('md'), { defaultMatches: true });

  return (
    <Stack sx={{ width: '100%', height: '100%' }} direction="row">
      <Stack
        pl={1}
        py={1}
        sx={(theme) => ({
          borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
          height: '100%',
          minWidth: { xs: '100%', md: 'fit-content' },
          alignItems: 'center',
        })}
      >
        <FigmaTreeView selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </Stack>
      {isMd && (
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundImage: `linear-gradient(${theme.palette.divider} 1px, transparent 1px), linear-gradient(to right,${theme.palette.divider} 1px, ${theme.palette.background.paper} 1px)`,
            backgroundSize: '20px 20px',
            display: { xs: 'none', md: 'flex' },
          })}
        >
          <FigmaCard selectedItem={selectedItem} />
        </Stack>
      )}
    </Stack>
  );
}
