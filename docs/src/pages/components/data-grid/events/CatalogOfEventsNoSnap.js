/* eslint-disable react/no-danger */
import * as React from 'react';
import MarkdownElement from 'docs/src/modules/components/MarkdownElement';
import { makeStyles } from '@material-ui/core/styles';
import events from './events.json';

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
              <td
                dangerouslySetInnerHTML={{
                  __html: event.description,
                }}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </MarkdownElement>
  );
}
