import * as React from 'react';
import PropTypes from 'prop-types';
import { XGrid, GridToolbar } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const useStylesAntdDesign = makeStyles((theme) => ({
  root: {
    border: 0,
    color:
      theme.palette.type === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
    '& .MuiDataGrid-columnsContainer': {
      backgroundColor: theme.palette.type === 'light' ? '#fafafa' : '#1d1d1d',
    },
    '& .MuiDataGrid-iconSeparator': {
      display: 'none',
    },
    '& .MuiDataGrid-colCell, .MuiDataGrid-cell': {
      borderRight: `1px solid ${
        theme.palette.type === 'light' ? '#f0f0f0' : '#303030'
      }`,
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
      borderBottom: `1px solid ${
        theme.palette.type === 'light' ? '#f0f0f0' : '#303030'
      }`,
    },
    '& .MuiDataGrid-cell': {
      color:
        theme.palette.type === 'light'
          ? 'rgba(0,0,0,.85)'
          : 'rgba(255,255,255,0.65)',
    },
    '& .MuiPaginationItem-root': {
      borderRadius: 0,
    },
    '& .MuiCheckbox-root svg': {
      width: 16,
      height: 16,
      backgroundColor: 'transparent',
      border: `1px solid ${
        theme.palette.type === 'light' ? '#d9d9d9' : 'rgb(67, 67, 67)'
      }`,
      borderRadius: 2,
    },
    '& .MuiCheckbox-root svg path': {
      display: 'none',
    },
    '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
      backgroundColor: '#1890ff',
      borderColor: '#1890ff',
    },
    '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
      position: 'absolute',
      display: 'table',
      border: '2px solid #fff',
      borderTop: 0,
      borderLeft: 0,
      transform: 'rotate(45deg) translate(-50%,-50%)',
      opacity: 1,
      transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
      content: '""',
      top: '50%',
      left: '39%',
      width: 5.71428571,
      height: 9.14285714,
    },
    '& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
      width: 8,
      height: 8,
      backgroundColor: '#1890ff',
      transform: 'none',
      top: '39%',
      border: 0,
    },
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: 600,
    width: '100%',
    '& .MuiFormGroup-options': {
      alignItems: 'center',
      marginBottom: theme.spacing(2),
      '& fieldset': {
        padding: theme.spacing(0, 1),
      },
      '& button': {
        marginLeft: theme.spacing(3),
      },
    },
  },
}));

function SettingsPanel(props) {
  const { onApply, type, size, theme } = props;
  const [sizeState, setSize] = React.useState(size);
  const [typeState, setType] = React.useState(type);
  const [selectedPaginationValue, setSelectedPaginationValue] = React.useState(-1);
  const [activeTheme, setActiveTheme] = React.useState(theme);

  const handleSizeChange = React.useCallback((event) => {
    setSize(Number(event.target.value));
  }, []);

  const handleDatasetChange = React.useCallback((event) => {
    setType(event.target.value);
  }, []);

  const handlePaginationChange = React.useCallback((event) => {
    setSelectedPaginationValue(event.target.value);
  }, []);

  const handleThemeChange = React.useCallback((event) => {
    setActiveTheme(event.target.value);
  }, []);

  const handleApplyChanges = React.useCallback(() => {
    onApply({
      size: sizeState,
      type: typeState,
      pagesize: selectedPaginationValue,
      theme: activeTheme,
    });
  }, [sizeState, typeState, selectedPaginationValue, activeTheme, onApply]);

  return (
    <FormGroup className="MuiFormGroup-options" row>
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Dataset</FormLabel>
        <Select value={typeState} onChange={handleDatasetChange}>
          <MenuItem value="Employee">Employee</MenuItem>
          <MenuItem value="Commodity">Commodity</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Rows</FormLabel>
        <Select value={sizeState} onChange={handleSizeChange}>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={1000}>{Number(1000).toLocaleString()}</MenuItem>
          <MenuItem value={10000}>{Number(10000).toLocaleString()}</MenuItem>
          <MenuItem value={100000}>{Number(100000).toLocaleString()}</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Page Size</FormLabel>
        <Select value={selectedPaginationValue} onChange={handlePaginationChange}>
          <MenuItem value={-1}>off</MenuItem>
          <MenuItem value={0}>auto</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={1000}>{Number(1000).toLocaleString()}</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Theme</FormLabel>
        <Select value={activeTheme} onChange={handleThemeChange}>
          <MenuItem value="default">Default Theme</MenuItem>
          <MenuItem value="antd">Antd Design</MenuItem>
        </Select>
      </FormControl>
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={handleApplyChanges}
      >
        <KeyboardArrowRightIcon fontSize="small" /> Apply
      </Button>
    </FormGroup>
  );
}

SettingsPanel.propTypes = {
  onApply: PropTypes.func,
  size: PropTypes.number,
  theme: PropTypes.string,
  type: PropTypes.string,
};

export default function FullFeaturedDemo() {
  const classes = useStyles();
  const AntdDesignClasses = useStylesAntdDesign();
  const [isAntdDesign, setIsAntdDesign] = React.useState(false);
  const [type, setType] = React.useState('Commodity');
  const [size, setSize] = React.useState(100);
  const { data, setRowLength, loadNewData } = useDemoData({
    dataSet: type,
    rowLength: size,
    maxColumns: 20,
  });
  const [pagination, setPagination] = React.useState({});

  const getActiveTheme = () => {
    return isAntdDesign ? 'antd' : 'default';
  };

  const handleApplyClick = (settings) => {
    if (size !== settings.size) {
      setSize(settings.size);
    }

    if (type !== settings.type) {
      setType(settings.type.toLowerCase());
    }

    if (getActiveTheme() !== settings.theme) {
      setIsAntdDesign(!isAntdDesign);
    }

    if (size !== settings.size || type !== settings.type) {
      setRowLength(settings.size);
      loadNewData();
    }

    const newPaginationSettings = {
      pagination: settings.pagesize !== -1,
      autoPageSize: settings.pagesize === 0,
      pageSize: settings.pagesize > 0 ? settings.pagesize : undefined,
    };

    setPagination((currentPaginationSettings) => {
      if (
        currentPaginationSettings.pagination === newPaginationSettings.pagination &&
        currentPaginationSettings.autoPageSize ===
          newPaginationSettings.autoPageSize &&
        currentPaginationSettings.pageSize === newPaginationSettings.pageSize
      ) {
        return currentPaginationSettings;
      }
      return newPaginationSettings;
    });
  };

  return (
    <div className={classes.root}>
      <SettingsPanel
        onApply={handleApplyClick}
        size={size}
        type={type}
        theme={getActiveTheme()}
      />
      <XGrid
        className={isAntdDesign ? AntdDesignClasses.root : undefined}
        {...data}
        components={{
          Toolbar: GridToolbar,
        }}
        checkboxSelection
        {...pagination}
      />
    </div>
  );
}
