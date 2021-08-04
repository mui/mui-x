import * as React from 'react';
import clsx from 'clsx';
import { GridCellParams } from '@material-ui/data-grid';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import { createStyles, makeStyles } from '@material-ui/styles';
import { debounce } from '@material-ui/core/utils';
import { Theme } from '@material-ui/core/styles';
import { createTheme, muiStyleAlpha } from '../../../_modules_/grid/utils/utils';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      },
      rail: {
        height: '100%',
        backgroundColor: 'transparent',
      },
      track: {
        height: '100%',
        transition: theme.transitions.create('background-color', {
          duration: theme.transitions.duration.shorter,
        }),
        '&.low': {
          backgroundColor: '#f44336',
        },
        '&.medium': {
          backgroundColor: '#efbb5aa3',
        },
        '&.high': {
          backgroundColor: '#088208a3',
        },
      },
      thumb: {
        height: '100%',
        width: 5,
        borderRadius: 0,
        marginTop: 0,
        backgroundColor: muiStyleAlpha('#000000', 0.2),
      },
    }),
  { defaultTheme },
);

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

function EditProgress(props: GridCellParams) {
  const classes = useStyles();
  const { id, value, api, field } = props;
  const [valueState, setValueState] = React.useState(Number(value));

  const updateCellEditProps = React.useCallback(
    (newValue) => {
      api.setEditCellValue({ id, field, value: newValue });
    },
    [api, field, id],
  );

  const debouncedUpdateCellEditProps = React.useMemo(
    () => debounce(updateCellEditProps, 60),
    [updateCellEditProps],
  );

  const handleChange = (event, newValue) => {
    setValueState(newValue);
    debouncedUpdateCellEditProps(newValue);
  };

  React.useEffect(() => {
    setValueState(Number(value));
  }, [value]);

  const handleRef = (element) => {
    if (element) {
      element.querySelector('[role="slider"]').focus();
    }
  };

  return (
    <Slider
      ref={handleRef}
      classes={{
        ...classes,
        track: clsx(classes.track, {
          low: valueState < 0.3,
          medium: valueState >= 0.3 && valueState <= 0.7,
          high: valueState > 0.7,
        }),
      }}
      value={valueState}
      max={1}
      step={0.00001}
      onChange={handleChange}
      ValueLabelComponent={ValueLabelComponent}
      valueLabelDisplay="auto"
      valueLabelFormat={(newValue) => `${(newValue * 100).toLocaleString()} %`}
    />
  );
}

export function renderEditProgress(params: GridCellParams) {
  return <EditProgress {...params} />;
}
