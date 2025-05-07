import * as React from 'react';
import NoSsr from '@mui/material/NoSsr';
import { PopperProps } from '@mui/material/Popper';
import { ChartsTooltipPaper } from '@mui/x-charts/ChartsTooltip';
import { ChartsTooltipRoot } from '@mui/x-charts/internals';
import Typography from '@mui/material/Typography';

const MODIFIERS = [
  {
    name: 'offset',
    options: { offset: [0, 4] },
  },
];

interface ChartsTooltipZoomSliderValueProps
  extends Pick<PopperProps, 'anchorEl' | 'open' | 'modifiers' | 'placement'>,
    React.PropsWithChildren {}

export function ChartsTooltipZoomSliderValue({
  anchorEl,
  open,
  placement,
  modifiers = MODIFIERS,
  children,
}: ChartsTooltipZoomSliderValueProps) {
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
