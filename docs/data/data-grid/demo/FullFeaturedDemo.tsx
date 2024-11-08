import * as React from 'react';
import {
  DataGridPro,
  GRID_CHECKBOX_SELECTION_FIELD,
  GridToolbar,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';

const AntDesignStyledDataGridPro = styled(DataGridPro)(({ theme }) => ({
  border: '1px solid #303030',
  color: 'rgba(255,255,255,0.85)',
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
    backgroundColor: '#1d1d1d',
    ...theme.applyStyles('light', {
      backgroundColor: '#fafafa',
    }),
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderRight: '1px solid #303030',
    ...theme.applyStyles('light', {
      borderRightColor: '#f0f0f0',
    }),
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: '1px solid #303030',
    ...theme.applyStyles('light', {
      borderBottomColor: '#f0f0f0',
    }),
  },
  '& .MuiDataGrid-cell': {
    color: 'rgba(255,255,255,0.85)',
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
      backgroundColor: '#1d1d1d',
      ...theme.applyStyles('light', {
        backgroundColor: '#fafafa',
      }),
    },
    '& .MuiDataGrid-iconSeparator': {
      display: 'none',
    },
    '& .MuiDataGrid-colCell, .MuiDataGrid-cell': {
      borderRight: '1px solid #303030',
      ...theme.applyStyles('light', {
        borderRightColor: '#f0f0f0',
      }),
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
      borderBottom: '1px solid #303030',
      ...theme.applyStyles('light', {
        borderBottomColor: '#f0f0f0',
      }),
    },
    '& .MuiDataGrid-cell': {
      color: 'rgba(255,255,255,0.65)',
      ...theme.applyStyles('light', {
        color: 'rgba(0,0,0,.85)',
      }),
    },
    '& .MuiPaginationItem-root': {
      borderRadius: 0,
    },
    '& .MuiCheckbox-root svg': {
      width: 16,
      height: 16,
      backgroundColor: 'transparent',
      border: '1px solid rgb(67, 67, 67)',
      borderRadius: 2,
      ...theme.applyStyles('light', {
        borderColor: '#d9d9d9',
      }),
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
    ...theme.applyStyles('light', {
      color: 'rgba(0,0,0,.85)',
    }),
  },
  ...theme.applyStyles('light', {
    borderColor: '#f0f0f0',
    color: 'rgba(0,0,0,.85)',
  }),
}));

const StyledBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: 600,
  width: '100%',
  '& .MuiFormGroup-options': {
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
    '& > div': {
      minWidth: 100,
      margin: theme.spacing(2),
      marginLeft: 0,
    },
  },
}));

type GridDataType = 'Employee' | 'Commodity';
type GridDataThemeOption = 'default' | 'ant';

interface GridPaginationSettings {
  pagination: boolean;
  autoPageSize: boolean;
  pageSize: number | undefined;
}

interface GridConfigOptions {
  size: number;
  type: GridDataType;
  pagesize: number;
  theme: GridDataThemeOption;
}

interface GridToolbarContainerProps {
  onApply: (options: GridConfigOptions) => void;
  size: number;
  type: GridDataType;
  theme: GridDataThemeOption;
}

function SettingsPanel(props: GridToolbarContainerProps) {
  const { onApply, type, size, theme } = props;
  const [sizeState, setSize] = React.useState<number>(size);
  const [typeState, setType] = React.useState<GridDataType>(type);
  const [selectedPaginationValue, setSelectedPaginationValue] =
    React.useState<number>(-1);
  const [activeTheme, setActiveTheme] = React.useState<GridDataThemeOption>(theme);

  const handleSizeChange = React.useCallback<
    NonNullable<SelectProps<number>['onChange']>
  >((event) => {
    setSize(Number(event.target.value));
  }, []);

  const handleDatasetChange = React.useCallback<
    NonNullable<SelectProps<GridDataType>['onChange']>
  >((event) => {
    setType(event.target.value as GridDataType);
  }, []);

  const handlePaginationChange = React.useCallback<
    NonNullable<SelectProps<number>['onChange']>
  >((event) => {
    setSelectedPaginationValue(Number(event.target.value));
  }, []);

  const handleThemeChange = React.useCallback<
    NonNullable<SelectProps<GridDataThemeOption>['onChange']>
  >((event) => {
    setActiveTheme(event.target.value as GridDataThemeOption);
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
      <FormControl variant="standard">
        <InputLabel>Dataset</InputLabel>
        <Select<GridDataType> value={typeState} onChange={handleDatasetChange}>
          <MenuItem value="Employee">Employee</MenuItem>
          <MenuItem value="Commodity">Commodity</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="standard">
        <InputLabel>Rows</InputLabel>
        <Select<number> value={sizeState} onChange={handleSizeChange}>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={1000}>{Number(1000).toLocaleString()}</MenuItem>
          <MenuItem value={10000}>{Number(10000).toLocaleString()}</MenuItem>
          <MenuItem value={100000}>{Number(100000).toLocaleString()}</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="standard">
        <InputLabel>Page Size</InputLabel>
        <Select<number>
          value={selectedPaginationValue}
          onChange={handlePaginationChange}
        >
          <MenuItem value={-1}>off</MenuItem>
          <MenuItem value={0}>auto</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={1000}>{Number(1000).toLocaleString()}</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="standard">
        <InputLabel>Theme</InputLabel>
        <Select value={activeTheme} onChange={handleThemeChange}>
          <MenuItem value="default">Default Theme</MenuItem>
          <MenuItem value="ant">Ant Design</MenuItem>
        </Select>
      </FormControl>
      <Button size="small" variant="outlined" onClick={handleApplyChanges}>
        <KeyboardArrowRightIcon fontSize="small" /> Apply
      </Button>
    </FormGroup>
  );
}

export default function FullFeaturedDemo() {
  const [isAntDesign, setIsAntDesign] = React.useState<boolean>(false);
  const [type, setType] = React.useState<GridDataType>('Commodity');
  const [size, setSize] = React.useState(100);
  const { loading, data, setRowLength, loadNewData } = useDemoData({
    dataSet: type,
    rowLength: size,
    maxColumns: 40,
    editable: true,
  });

  const [pagination, setPagination] = React.useState<GridPaginationSettings>({
    pagination: false,
    autoPageSize: false,
    pageSize: undefined,
  });

  const getActiveTheme = () => {
    return isAntDesign ? 'ant' : 'default';
  };

  const handleApplyClick: GridToolbarContainerProps['onApply'] = (settings) => {
    if (size !== settings.size) {
      setSize(settings.size);
    }

    if (type !== settings.type) {
      setType(settings.type);
    }

    if (getActiveTheme() !== settings.theme) {
      setIsAntDesign(!isAntDesign);
    }

    if (size !== settings.size || type !== settings.type) {
      setRowLength(settings.size);
      loadNewData();
    }

    const newPaginationSettings: GridPaginationSettings = {
      pagination: settings.pagesize !== -1,
      autoPageSize: settings.pagesize === 0,
      pageSize: settings.pagesize > 0 ? settings.pagesize : undefined,
    };

    setPagination(
      (
        currentPaginationSettings: GridPaginationSettings,
      ): GridPaginationSettings => {
        if (
          currentPaginationSettings.pagination ===
            newPaginationSettings.pagination &&
          currentPaginationSettings.autoPageSize ===
            newPaginationSettings.autoPageSize &&
          currentPaginationSettings.pageSize === newPaginationSettings.pageSize
        ) {
          return currentPaginationSettings;
        }
        return newPaginationSettings;
      },
    );
  };

  const DataGridComponent = isAntDesign ? AntDesignStyledDataGridPro : DataGridPro;

  return (
    <StyledBox>
      <SettingsPanel
        onApply={handleApplyClick}
        size={size}
        type={type}
        theme={getActiveTheme()}
      />
      <DataGridComponent
        {...data}
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: { showQuickFilter: true },
        }}
        loading={loading}
        checkboxSelection
        disableRowSelectionOnClick
        initialState={{
          ...data.initialState,
          pinnedColumns: { left: [GRID_CHECKBOX_SELECTION_FIELD, 'desk'] },
        }}
        {...pagination}
      />
    </StyledBox>
  );
}
