/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import Link from 'docs/src/modules/components/Link';
import MarkdownElement from 'docs/src/modules/components/MarkdownElement';

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  minWidth: '100%',
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  borderRadius: 5,
  fontWeight: 600,
  color: (theme.vars || theme).palette.text.secondary,

  '&.low': {
    color:
      (theme.vars || theme).palette.mode === 'dark'
        ? (theme.vars || theme).palette.text.primary
        : (theme.vars || theme).palette.error.dark,

    '& .progress-bar': {
      backgroundColor: (theme.vars || theme).palette.error.main,
      opacity: 0.3,
    },
    '& .progress-background': {
      border: `1.5px solid ${(theme.vars || theme).palette.error.dark}`,
    },
  },
  '&.medium': {
    color:
      (theme.vars || theme).palette.mode === 'dark'
        ? (theme.vars || theme).palette.text.primary
        : (theme.vars || theme).palette.warning.dark,

    '& .progress-bar': {
      backgroundColor: (theme.vars || theme).palette.warning.main,
      opacity: 0.3,
    },
    '& .progress-background': {
      border: `1.5px solid ${(theme.vars || theme).palette.warning.dark}`,
    },
  },
  '&.high': {
    color:
      (theme.vars || theme).palette.mode === 'dark'
        ? (theme.vars || theme).palette.text.primary
        : (theme.vars || theme).palette.success.dark,

    '& .progress-bar': {
      backgroundColor: (theme.vars || theme).palette.success.main,
      opacity: 0.3,
    },
    '& .progress-background': {
      border: `1.5px solid ${green[200]}`,
      '&.completed': {
        border: `1.5px solid ${(theme.vars || theme).palette.success.dark}`,
      },
    },
  },
}));

const Value = styled('span')({
  lineHeight: 1.6,
  zIndex: 1,
  position: 'relative',
});

const Bar = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
});
const Background = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 5,
});

const ProgressBar = React.memo(function ProgressBar(props) {
  const { numerator, denumerator } = props;
  const valueInPercent =
    numerator === denumerator ? 100 : Math.floor((numerator / denumerator) * 95);

  return (
    <Root
      className={clsx({
        low: valueInPercent < 50,
        medium: valueInPercent >= 50 && valueInPercent <= 80,
        high: valueInPercent > 80,
      })}
    >
      <Background
        className={
          numerator === denumerator ? 'progress-background completed' : 'progress-background'
        }
      />
      <Bar className="progress-bar" style={{ right: `${100 - valueInPercent}%` }} />
      <Value>{numerator === denumerator ? 'Done! 🎉' : `${numerator}/${denumerator}`}</Value>
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
        px: [2, 0],
      }}
    >
      <table>
        <thead>
          <tr>
            <th align="left">Locale</th>
            <th align="left">BCP 47 language tag</th>
            <th align="left">Import name</th>
            <th align="left">Completion</th>
            <th align="left">Related file</th>
          </tr>
        </thead>
        <tbody>
          {data.map(
            ({
              languageTag,
              localeName,
              importName,
              missingKeysCount,
              totalKeysCount,
              githubLink,
            }) => (
              <tr key={languageTag}>
                <td align="left">{localeName}</td>
                <td align="left">{languageTag}</td>
                <td align="left">
                  <code>{importName}</code>
                </td>
                <td className="progress">
                  <ProgressBar
                    numerator={totalKeysCount - missingKeysCount}
                    denumerator={totalKeysCount}
                  />
                </td>
                <td align="left">
                  <Link variant="body2" rel="nofollow" href={githubLink}>
                    Edit
                  </Link>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </MarkdownElement>
  );
}

LocalisationTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default LocalisationTable;
