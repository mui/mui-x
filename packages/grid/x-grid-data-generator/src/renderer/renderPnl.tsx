import * as React from 'react';
import clsx from 'clsx';
import { Theme } from '@material-ui/core/styles';
import { createStyles, makeStyles } from '@material-ui/styles';
import { GridCellParams, getThemePaletteMode } from '../../../_modules_/grid';
import { createTheme } from '../../../_modules_/grid/utils/utils';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        width: '100%',
        fontVariantNumeric: 'tabular-nums',
      },
      positive: {
        color:
          getThemePaletteMode(theme.palette) === 'light'
            ? theme.palette.success.dark
            : theme.palette.success.light,
      },
      negative: {
        color:
          getThemePaletteMode(theme.palette) === 'light'
            ? theme.palette.error.dark
            : theme.palette.error.light,
      },
    }),
  { defaultTheme },
);

function pnlFormatter(value: number) {
  return value < 0 ? `(${Math.abs(value).toLocaleString()})` : value.toLocaleString();
}

interface PnlProps {
  value: number;
}

const Pnl = React.memo(function Pnl(props: PnlProps) {
  const { value } = props;
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, {
        [classes.positive]: value > 0,
        [classes.negative]: value < 0,
      })}
    >
      {pnlFormatter(value)}
    </div>
  );
});

export function renderPnl(params: GridCellParams) {
  return <Pnl value={params.value as any} />;
}
