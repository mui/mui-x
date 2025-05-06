import * as React from 'react';
import NoSsr from '@mui/material/NoSsr';
import { styled } from '@mui/material/styles';
import Popper, { PopperProps } from '@mui/material/Popper';
import { ChartsTooltipPaper } from '@mui/x-charts/ChartsTooltip';
import Typography from '@mui/material/Typography';

const ChartsTooltipRoot = styled(Popper, {
  name: 'MuiChartsTooltip',
  slot: 'Root',
})(({ theme }) => ({
  pointerEvents: 'none',
  zIndex: theme.zIndex.modal,
}));

const MODIFIERS = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

interface ChartsZoomValueTooltipProps
  extends Pick<PopperProps, 'anchorEl' | 'open' | 'modifiers' | 'placement'>,
    React.PropsWithChildren {}

export function ChartsZoomValueTooltip({
  anchorEl,
  open,
  placement,
  modifiers = MODIFIERS,
  children,
}: ChartsZoomValueTooltipProps) {
  return (
    <NoSsr>
      {open ? (
        <ChartsTooltipRoot
          open={open}
          anchorEl={anchorEl}
          placement={placement}
          modifiers={modifiers}
        >
          <ChartsTooltipPaper sx={{ paddingX: 0.5 }}>
            <Typography variant="caption">{children}</Typography>
          </ChartsTooltipPaper>
        </ChartsTooltipRoot>
      ) : null}
    </NoSsr>
  );
}
