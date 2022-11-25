/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Link from 'docs/src/modules/components/Link';

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
    <Box
      sx={(theme) => ({
        width: '100%',
        overflow: 'auto',
        // Taken from MarkdownElement
        ...theme.typography.caption,
        color: theme.palette.text.primary,
        '& code': {
          ...theme.typography.caption,
          fontFamily: theme.typography.fontFamilyCode,
          fontWeight: 400,
          WebkitFontSmoothing: 'subpixel-antialiased',
          display: 'inline-block',
          padding: '0 5px',
          color: `var(--muidocs-palette-text-primary, ${theme.palette.text.primary})`,
          backgroundColor: alpha(theme.palette.primary.light, 0.15),
          borderRadius: 5,
          fontSize: theme.typography.pxToRem(13),
          direction: 'ltr /*! @noflip */',
        },
      })}
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
            ({ languageTag, localeName, importName, missingKeysNb, totalKeysNb, githubLink }) => (
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
                <TableCell>
                  <ProgressBar numerator={totalKeysNb - missingKeysNb} denumerator={totalKeysNb} />
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
    </Box>
  );
}

LocalisationTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default LocalisationTable;
