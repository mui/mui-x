import * as React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import { DataGrid } from '@material-ui/data-grid';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles(() => ({
  root: {
    padding: 10,
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    '& .status-container': {
      display: 'flex',
    },
  },
  connected: {
    color: '#4caf50',
  },
  disconnected: {
    color: '#d9182e',
  },
}));

export function CustomFooterStatusComponent(props: {
  status: 'connected' | 'disconnected';
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className="status-container">
        Status {props.status}
        <FiberManualRecordIcon fontSize="small" className={classes[props.status]} />
      </div>
    </div>
  );
}

export default function CustomFooter() {
  const [status, setStatus] = React.useState('connected');
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 4,
    maxColumns: 6,
  });
  return (
    <div
      style={{
        height: 400,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ alignSelf: 'center' }}>
        <Button
          color="primary"
          onClick={() =>
            setStatus((current) =>
              current === 'connected' ? 'disconnected' : 'connected',
            )
          }
        >
          {status === 'connected' ? 'Disconnect' : 'Connect'}
        </Button>
      </div>
      <div style={{ height: 350, width: '100%', marginTop: 16 }}>
        <DataGrid
          {...data}
          components={{
            Footer: CustomFooterStatusComponent,
          }}
          componentsProps={{
            footer: { status },
          }}
        />
      </div>
    </div>
  );
}
