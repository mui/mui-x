/* eslint-disable react/no-danger */
import * as React from 'react';
import MarkdownElement from 'docs/src/modules/components/MarkdownElement';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import events from './events.json';
import Box from '@mui/material/Box';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export default function CatalogOfEventsNoSnap() {
  const classes = useStyles();

  return (
    <MarkdownElement className={classes.root}>
      <table>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Description</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.name}>
              <td>
                <code>{event.name}</code>
              </td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </MarkdownElement>
  );
}
