import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import { GridCellParams, GridCellValue } from '@material-ui/x-grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  icon: {
    color: '#2196f3',
    alignSelf: 'center',
    marginLeft: 8,
  },
});

interface IncotermProps {
  value: GridCellValue;
}

const Incoterm = React.memo(function Incoterm(props: IncotermProps) {
  const { value } = props;
  const classes = useStyles();

  if (!value) {
    return null;
  }

  const valueStr = value.toString();
  const tooltip = valueStr.slice(valueStr.indexOf('(') + 1, valueStr.indexOf(')'));
  const code = valueStr.slice(0, valueStr.indexOf('(')).trim();

  return (
    <div className={classes.root}>
      <span>{code}</span>
      <Tooltip title={tooltip}>
        <InfoIcon className={classes.icon} />
      </Tooltip>
    </div>
  );
});

export function renderIncoterm(params: GridCellParams) {
  return <Incoterm value={params.value!} />;
}
