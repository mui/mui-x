/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Link from 'docs/src/modules/components/Link';
import MarkdownElement from 'docs/src/modules/components/MarkdownElement';

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: 26,
  borderRadius: 2,
  '&.low': {
    color: (theme.vars || theme).palette.error.contrastText,
    backgroundColor: (theme.vars || theme).palette.error.light,
    '& .progress-bar': {
      backgroundColor: (theme.vars || theme).palette.error.dark,
    },
  },
  '&.medium': {
    color: (theme.vars || theme).palette.warning.contrastText,
    backgroundColor: (theme.vars || theme).palette.warning.light,
    '& .progress-bar': {
      backgroundColor: (theme.vars || theme).palette.warning.dark,
    },
  },
  '&.high': {
    color: (theme.vars || theme).palette.success.contrastText,
    backgroundColor: (theme.vars || theme).palette.success.light,
    '& .progress-bar': {
      backgroundColor: (theme.vars || theme).palette.success.dark,
    },
  },
}));

const Value = styled('span')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const Bar = styled('div')({
  height: '100%',
});

const ProgressBar = React.memo(function ProgressBar(props) {
  const { numerator, denumerator } = props;
  const valueInPercent = Math.floor((numerator / denumerator) * 100);

  return (
    <Root
      className={clsx({
        low: valueInPercent < 50,
        medium: valueInPercent >= 50 && valueInPercent <= 80,
        high: valueInPercent > 80,
      })}
    >
      <Value>
        {numerator === denumerator && '🎉 '}
        {`${numerator}/${denumerator}`}
        {numerator === denumerator && ' 🎉'}
      </Value>
      <Bar className="progress-bar" style={{ maxWidth: `${valueInPercent}%` }} />
    </Root>
  );
});

ProgressBar.propTypes = {
  denumerator: PropTypes.number.isRequired,
  numerator: PropTypes.number.isRequired,
};

function LocalisationTable(props) {
  const { data } = props;
  return (
    <MarkdownElement
      sx={{
        width: '100%',
        overflow: 'auto',
        '& td.progress': {
          padding: 0,
        },
        '& p': {
          margin: 0,
        },
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Locale</TableCell>
            <TableCell>BCP 47 language tag</TableCell>
            <TableCell>Import name</TableCell>
            <TableCell>Completion</TableCell>
            <TableCell>Related file</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(
            ({
              languageTag,
              localeName,
              importName,
              missingKeysCount,
              totalKeysCount,
              githubLink,
            }) => (
              <TableRow key={languageTag}>
                <TableCell>
                  <Typography variant="body2">{localeName}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{languageTag}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    <code>{importName}</code>
                  </Typography>
                </TableCell>
                <TableCell className="progress">
                  <ProgressBar
                    numerator={totalKeysCount - missingKeysCount}
                    denumerator={totalKeysCount}
                  />
                </TableCell>
                <TableCell>
                  <Link variant="body2" rel="nofollow" href={githubLink}>
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </MarkdownElement>
  );
}

LocalisationTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default LocalisationTable;
