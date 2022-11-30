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
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: 26,
  borderRadius: 2,
}));

const Value = styled('div')({
  position: 'absolute',
  lineHeight: '24px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});

const Bar = styled('div')({
  height: '100%',
  '&.low': {
    backgroundColor: '#f44336',
  },
  '&.medium': {
    backgroundColor: '#efbb5aa3',
  },
  '&.high': {
    backgroundColor: '#088208a3',
  },
});

const ProgressBar = React.memo(function ProgressBar(props) {
  const { numerator, denumerator } = props;
  const valueInPercent = Math.floor((numerator / denumerator) * 100);

  return (
    <Root>
      <Value>
        {`${numerator}/${denumerator}`}
        {numerator === denumerator ? '🎉' : ''}
      </Value>
      <Bar
        className={clsx({
          low: valueInPercent < 30,
          medium: valueInPercent >= 30 && valueInPercent <= 70,
          high: valueInPercent > 70,
        })}
        style={{ maxWidth: `${valueInPercent}%` }}
      />
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
