/* eslint-disable react/no-danger */
/* eslint-disable react/prop-types */
import * as React from 'react';
import MarkdownElement from 'docs/src/modules/components/MarkdownElement';
import HighlightedCode from 'docs/src/modules/components/HighlightedCode';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import events from './events.json';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

const EventRow = ({ event }) => {
  const [open, setOpen] = React.useState(false);

  const example = React.useMemo(() => {
    const args = ['details // GridCallbackDetails'];
    if (event.event) {
      args.unshift(`event,  // ${event.event}`);
    }
    if (event.params) {
      args.unshift(`params, // ${event.params}`);
    }

    return `
const onEvent: GridEventListener<GridEvents.${event.name}> =
 (
    ${args.join('\n    ')}
  ) => {...}    
  
// Imperative subscription    
apiRef.current.subscribeEvent(
  GridEvents.${event.name},
  onEvent,
);

// Hook subscription (only available inside the Grid scope)
useGridApiEventHandler(GridEvents.${event.name}, onEvent);    
`;
  }, [event]);

  return (
    <React.Fragment>
      <TableRow key={event.name}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <code>{event.name}</code>
        </TableCell>
        <TableCell>
          <div
            dangerouslySetInnerHTML={{
              __html: event.description,
            }}
          />
          {!!event.params && (
            <div>
              <Typography variant="subtitle2" component="span">
                Params:{' '}
              </Typography>
              <span
                dangerouslySetInnerHTML={{
                  __html: event.params,
                }}
              />
            </div>
          )}
          {!!event.event && (
            <div>
              <Typography variant="subtitle2" component="span">
                Event:{' '}
              </Typography>
              <span
                dangerouslySetInnerHTML={{
                  __html: event.event,
                }}
              />
            </div>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <HighlightedCode code={example} language="tsx" />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default function CatalogOfEventsNoSnap() {
  const classes = useStyles();

  return (
    <MarkdownElement className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <EventRow event={event} />
          ))}
        </TableBody>
      </Table>
    </MarkdownElement>
  );
}
