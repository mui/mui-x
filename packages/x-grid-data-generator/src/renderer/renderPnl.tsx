import * as React from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { CellParams } from '@material-ui/x-grid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      fontVariantNumeric: 'tabular-nums',
    },
    positive: {
      color:
        theme.palette.type === 'light' ? theme.palette.success.dark : theme.palette.success.light,
    },
    negative: {
      color: theme.palette.type === 'light' ? theme.palette.error.dark : theme.palette.error.light,
    },
  }),
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

export function renderPnl(params: CellParams) {
  return <Pnl value={params.value as any} />;
}
