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
import Box from '@mui/material/Box';
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

function escapeHTML(value) {
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const EventRow = ({ event }) => {
  const [open, setOpen] = React.useState(false);

  const example = React.useMemo(() => {
    const args = ['details, // GridCallbackDetails'];
    if (event.event) {
      args.unshift(`event,  // ${event.event}`);
    }
    if (event.params) {
      args.unshift(`params, // ${event.params}`);
    }

    return `
const onEvent: GridEventListener<GridEvents.${event.name}> = (
  ${args.join('\n  ')}
) => {...}    
  
// Imperative subscription    
apiRef.current.subscribeEvent(
  GridEvents.${event.name},
  onEvent,
);

// Hook subscription (only available inside the scope of the grid)
useGridApiEventHandler(GridEvents.${event.name}, onEvent);    
`;
  }, [event]);

  return (
    <React.Fragment key={event.name}>
      <TableRow>
        <TableCell style={{ borderBottom: 'unset' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{ borderBottom: 'unset' }}>
          <code>{event.name}</code>
        </TableCell>
        <TableCell style={{ borderBottom: 'unset' }}>
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
              <code
                dangerouslySetInnerHTML={{
                  __html: escapeHTML(event.params),
                }}
              />
            </div>
          )}
          {!!event.event && (
            <div>
              <Typography variant="subtitle2" component="span">
                Event:{' '}
              </Typography>
              <code
                dangerouslySetInnerHTML={{
                  __html: escapeHTML(event.event),
                }}
              />
            </div>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <HighlightedCode code={example} language="tsx" />
            </Box>
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
