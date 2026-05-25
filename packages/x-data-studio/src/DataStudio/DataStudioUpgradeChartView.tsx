'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createSvgIcon } from '@mui/material/utils';
import type { DataStudioChartViewProps } from './DataStudio.types';

const ChartIcon = createSvgIcon(
  <path d="M3 13h2v8H3v-8zm4-7h2v15H7V6zm4 4h2v11h-2V10zm4-7h2v18h-2V3zm4 9h2v9h-2v-9z" />,
  'BarChart',
);

const PRICING_URL = 'https://mui.com/pricing/';

/**
 * Default chart workspace for non-premium plans. Renders a teaser CTA that
 * opens a small upgrade modal linking to the MUI X pricing page. The real
 * chart workspace ships with `plan="premium"`.
 */
export function DataStudioUpgradeChartView(_props: DataStudioChartViewProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'action.hover',
          color: 'primary.main',
        }}
      >
        <ChartIcon fontSize="medium" />
      </Box>
      <Typography variant="h6">Charts require the Premium plan</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
        Build interactive charts straight from your datasets with column-aware
        configuration, exports, and live pivots.
      </Typography>
      <Button variant="contained" onClick={() => setDialogOpen(true)}>
        Upgrade to Premium
      </Button>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Upgrade to MUI X Premium</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Charts in Data Studio are part of the MUI X Premium plan. The
            Premium plan also unlocks pivoting, Excel/CSV exports, and the full
            charts integration.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Not now</Button>
          <Button
            component={Link}
            href={PRICING_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
          >
            See pricing
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
