import * as React from 'react';
import { XGrid, GridToolbar } from '@material-ui/x-grid';
import {
  useDemoData,
  getCommodityColumns,
  getEmployeeColumns,
  getRealData,
} from '@material-ui/x-grid-data-generator';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: 400,
    width: '100%',
    '& .MuiFormGroup-options': {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15,
      '& fieldset': {
        padding: `0 10px`,
      },
      '& button': {
        marginLeft: 20,
      },
    },
  },
});

// eslint-disable-next-line react/prop-types
const SettingsPanel = ({ onApply, type, size }) => {
  const [sizeState, setSize] = React.useState(size);
  const [typeState, setType] = React.useState(type);
  const [selectedPaginationValue, setSelectedPaginationValue] = React.useState(-1);

  const onSizeChange = React.useCallback((e) => {
    setSize(Number(e.target.value));
  }, []);

  const onDatasetChange = React.useCallback((e) => {
    setType(e.target.value);
  }, []);

  const onPaginationChange = React.useCallback((e) => {
    setSelectedPaginationValue(e.target.value);
  }, []);

  const applyChanges = React.useCallback(() => {
    onApply({ size: sizeState, type: typeState, pagesize: selectedPaginationValue });
  }, [sizeState, typeState, selectedPaginationValue, onApply]);

  return (
    <FormGroup className="MuiFormGroup-options" row>
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Dataset</FormLabel>
        <Select value={typeState} onChange={onDatasetChange}>
          <MenuItem value="Employee">Employee</MenuItem>
          <MenuItem value="Commodity">Commodity</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Rows</FormLabel>
        <Select value={sizeState} onChange={onSizeChange}>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={1000}>{Number(1000).toLocaleString()}</MenuItem>
          <MenuItem value={10000}>{Number(10000).toLocaleString()}</MenuItem>
          <MenuItem value={100000}>{Number(100000).toLocaleString()}</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" component="fieldset">
        <FormLabel component="legend">Page Size</FormLabel>
        <Select value={selectedPaginationValue} onChange={onPaginationChange}>
          <MenuItem value={-1}>off</MenuItem>
          <MenuItem value={0}>auto</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={1000}>{Number(1000).toLocaleString()}</MenuItem>
        </Select>
      </FormControl>
      <Button size="small" variant="outlined" color="primary" onClick={applyChanges}>
        <KeyboardArrowRightIcon fontSize="small" /> Apply
      </Button>
    </FormGroup>
  );
};

export default function FullFeaturedDemo() {
  const classes = useStyles();
  const [type, setType] = React.useState('Commodity');
  const [size, setSize] = React.useState(100);
  const { data } = useDemoData({
    dataSet: type as any,
    rowLength: size,
    maxColumns: 20,
  });
  const [gridData, setGridData] = React.useState({});
  const [pagination, setPagination] = React.useState({});

  const onApplyClick = async (settings) => {
    if (size !== settings.size) {
      setSize(settings.size);
    }

    if (type !== settings.type) {
      setType(settings.type.toLowerCase());
    }

    const newData = await getRealData(
      settings.size,
      settings.type === 'Commodity' ? getCommodityColumns() : getEmployeeColumns(),
    );
    setGridData(newData);

    const newPagination = {
      pagination: settings.pagesize !== -1,
      autoPageSize: settings.pagesize === 0,
      pageSize: settings.pagesize > 0 ? settings.pagesize : undefined,
    };

    setPagination((p: any) => {
      if (
        p.pagination === newPagination.pagination &&
        p.autoPageSize === newPagination.autoPageSize &&
        p.pageSize === newPagination.pageSize
      ) {
        return p;
      }
      return newPagination;
    });
  };

  return (
    <div className={classes.root}>
      <SettingsPanel onApply={onApplyClick} size={size} type={type} />
      <XGrid
        columns={(gridData as any).columns || data.columns}
        rows={(gridData as any).rows || data.rows}
        components={{
          Toolbar: GridToolbar,
        }}
        checkboxSelection
        {...pagination}
      />
    </div>
  );
}
