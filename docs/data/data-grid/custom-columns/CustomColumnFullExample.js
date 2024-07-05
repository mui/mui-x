import * as React from 'react';
import clsx from 'clsx';
import {
  generateFilledQuantity,
  randomColor,
  randomCountry,
  randomEmail,
  randomIncoterm,
  randomInt,
  randomName,
  randomRating,
  randomStatusOptions,
} from '@mui/x-data-grid-generator';
import {
  COUNTRY_ISO_OPTIONS,
  COUNTRY_ISO_OPTIONS_SORTED,
  INCOTERM_OPTIONS,
  STATUS_OPTIONS,
} from '@mui/x-data-grid-generator/services/static-data';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import {
  DataGrid,
  GridEditModes,
  gridStringOrNumberComparator,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid';
import {
  alpha,
  Autocomplete,
  autocompleteClasses,
  Avatar,
  Box,
  Chip,
  debounce,
  InputBase,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Rating,
  Select,
  Slider,
  sliderClasses,
  styled,
  Tooltip,
} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';

/** Custom components supporting custom renderers */
const Link = styled('a')({
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  color: 'inherit',
});

const DemoLink = React.memo(function DemoLink(props) {
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Link tabIndex={props.tabIndex} onClick={handleClick} href={props.href}>
      {props.children}
    </Link>
  );
});

const RatingValue = React.memo(function RatingValue(props) {
  const { value } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        lineHeight: '24px',
        color: 'text.secondary',
      }}
    >
      <Rating value={value} sx={{ mr: 1 }} readOnly />{' '}
      {Math.round(Number(value) * 10) / 10}
    </Box>
  );
});

function EditRating(props) {
  const { id, value, field } = props;

  const apiRef = useGridApiContext();

  const changedThroughKeyboard = React.useRef(false);

  const handleChange = async (event) => {
    await apiRef.current.setEditCellValue(
      { id, field, value: Number(event.target.value) },
      event,
    );
    if (!changedThroughKeyboard.current) {
      apiRef.current.stopCellEditMode({ id, field });
    }
    changedThroughKeyboard.current = false;
  };

  const handleRef = (element) => {
    if (element) {
      if (value !== 0) {
        element.querySelector(`input[value="${value}"]`).focus();
      } else {
        element.querySelector('input[value=""]').focus();
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key.startsWith('Arrow')) {
      changedThroughKeyboard.current = true;
    } else {
      changedThroughKeyboard.current = false;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        lineHeight: '24px',
        color: 'text.secondary',
        mr: 1,
      }}
    >
      <Rating
        ref={handleRef}
        name="rating"
        value={Number(value)}
        precision={1}
        onChange={handleChange}
        sx={{ mr: 1 }}
        onKeyDown={handleKeyDown}
      />
      {Number(value)}
    </Box>
  );
}

const Country = React.memo(function Country(props) {
  const { value } = props;

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        '&  > img': {
          mr: 0.5,
          flexShrink: 0,
          width: '20px',
        },
      }}
    >
      <img
        loading="lazy"
        width="20"
        src={`https://flagcdn.com/w20/${value.code.toLowerCase()}.png`}
        srcSet={`https://flagcdn.com/w40/${value.code.toLowerCase()}.png 2x`}
        alt=""
      />
      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value.label}
      </Box>
    </Box>
  );
});

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  height: '100%',
  [`& .${autocompleteClasses.inputRoot}`]: {
    ...theme.typography.body2,
    padding: '1px 0',
    height: '100%',
    '& input': {
      padding: '0 16px',
      height: '100%',
    },
  },
}));

function EditCountry(props) {
  const { id, value, field } = props;

  const apiRef = useGridApiContext();

  const handleChange = React.useCallback(
    async (event, newValue) => {
      await apiRef.current.setEditCellValue({ id, field, value: newValue }, event);
      apiRef.current.stopCellEditMode({ id, field });
    },
    [apiRef, field, id],
  );

  return (
    <StyledAutocomplete
      value={value}
      onChange={handleChange}
      options={COUNTRY_ISO_OPTIONS}
      getOptionLabel={(option) => option.label}
      autoHighlight
      fullWidth
      open
      disableClearable
      renderOption={(optionProps, option) => (
        <Box
          component="li"
          sx={{
            '& > img': {
              mr: 1.5,
              flexShrink: 0,
            },
          }}
          {...optionProps}
        >
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <InputBase
          autoFocus
          fullWidth
          id={params.id}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
          {...params.InputProps}
        />
      )}
    />
  );
}

const Center = styled('div')({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
});

const Element = styled('div')(({ theme }) => ({
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
  const { value } = props;
  const valueInPercent = value * 100;

  return (
    <Element>
      <Value>{`${valueInPercent.toLocaleString()} %`}</Value>
      <Bar
        className={clsx({
          low: valueInPercent < 30,
          medium: valueInPercent >= 30 && valueInPercent <= 70,
          high: valueInPercent > 70,
        })}
        style={{ maxWidth: `${valueInPercent}%` }}
      />
    </Element>
  );
});

const StyledSlider = styled(Slider)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  borderRadius: 0,
  [`& .${sliderClasses.rail}`]: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  [`& .${sliderClasses.track}`]: {
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
  [`& .${sliderClasses.thumb}`]: {
    height: '100%',
    width: 5,
    borderRadius: 0,
    marginTop: 0,
    backgroundColor: alpha('#000000', 0.2),
  },
}));

const ValueLabelComponent = React.memo(function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
});

function EditProgress(props) {
  const { id, value, field } = props;
  const [valueState, setValueState] = React.useState(Number(value));

  const apiRef = useGridApiContext();

  const updateCellEditProps = React.useCallback(
    (newValue) => {
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    },
    [apiRef, field, id],
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
      element.querySelector('[type="range"]').focus();
    }
  };

  return (
    <StyledSlider
      ref={handleRef}
      classes={{
        track: clsx({
          low: valueState < 0.3,
          medium: valueState >= 0.3 && valueState <= 0.7,
          high: valueState > 0.7,
        }),
      }}
      value={valueState}
      max={1}
      step={0.00001}
      onChange={handleChange}
      components={{ ValueLabel: ValueLabelComponent }}
      valueLabelDisplay="auto"
      valueLabelFormat={(newValue) => `${(newValue * 100).toLocaleString()} %`}
    />
  );
}

const StyledChip = styled(Chip)(({ theme }) => ({
  justifyContent: 'left',
  '& .icon': {
    color: 'inherit',
  },
  '&.Open': {
    color: (theme.vars || theme).palette.info.dark,
    border: `1px solid ${(theme.vars || theme).palette.info.main}`,
  },
  '&.Filled': {
    color: (theme.vars || theme).palette.success.dark,
    border: `1px solid ${(theme.vars || theme).palette.success.main}`,
  },
  '&.PartiallyFilled': {
    color: (theme.vars || theme).palette.warning.dark,
    border: `1px solid ${(theme.vars || theme).palette.warning.main}`,
  },
  '&.Rejected': {
    color: (theme.vars || theme).palette.error.dark,
    border: `1px solid ${(theme.vars || theme).palette.error.main}`,
  },
}));

const Status = React.memo((props) => {
  const { status } = props;

  let icon = null;
  if (status === 'Rejected') {
    icon = <ReportProblemIcon className="icon" />;
  } else if (status === 'Open') {
    icon = <InfoIcon className="icon" />;
  } else if (status === 'PartiallyFilled') {
    icon = <AutorenewIcon className="icon" />;
  } else if (status === 'Filled') {
    icon = <DoneIcon className="icon" />;
  }

  let label = status;
  if (status === 'PartiallyFilled') {
    label = 'Partially Filled';
  }

  return (
    <StyledChip
      className={status}
      icon={icon}
      size="small"
      label={label}
      variant="outlined"
    />
  );
});

function EditStatus(props) {
  const { id, value, field } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  const handleChange = async (event) => {
    const isValid = await apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value,
    });

    if (isValid && rootProps.editMode === GridEditModes.Cell) {
      apiRef.current.stopCellEditMode({ id, field, cellToFocusAfter: 'below' });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
    }
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      MenuProps={{
        onClose: handleClose,
      }}
      sx={{
        height: '100%',
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          pl: 1,
        },
      }}
      autoFocus
      fullWidth
      open
    >
      {STATUS_OPTIONS.map((option) => {
        let IconComponent = null;
        if (option === 'Rejected') {
          IconComponent = ReportProblemIcon;
        } else if (option === 'Open') {
          IconComponent = InfoIcon;
        } else if (option === 'PartiallyFilled') {
          IconComponent = AutorenewIcon;
        } else if (option === 'Filled') {
          IconComponent = DoneIcon;
        }

        let label = option;
        if (option === 'PartiallyFilled') {
          label = 'Partially Filled';
        }

        return (
          <MenuItem key={option} value={option}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <IconComponent fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={label} sx={{ overflow: 'hidden' }} />
          </MenuItem>
        );
      })}
    </Select>
  );
}

const Incoterm = React.memo(function Incoterm(props) {
  const { value } = props;

  if (!value) {
    return null;
  }

  const valueStr = value.toString();
  const tooltip = valueStr.slice(valueStr.indexOf('(') + 1, valueStr.indexOf(')'));
  const code = valueStr.slice(0, valueStr.indexOf('(')).trim();

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <span>{code}</span>
      <Tooltip title={tooltip}>
        <InfoIcon sx={{ color: '#2196f3', alignSelf: 'center', ml: '8px' }} />
      </Tooltip>
    </Box>
  );
});

function EditIncoterm(props) {
  const { id, value, field } = props;

  const apiRef = useGridApiContext();

  const handleChange = async (event) => {
    await apiRef.current.setEditCellValue(
      { id, field, value: event.target.value },
      event,
    );
    apiRef.current.stopCellEditMode({ id, field });
  };

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      apiRef.current.stopCellEditMode({ id, field });
    }
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      MenuProps={{
        onClose: handleClose,
      }}
      sx={{
        height: '100%',
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          pl: 1,
        },
      }}
      autoFocus
      fullWidth
      open
    >
      {INCOTERM_OPTIONS.map((option) => {
        const tooltip = option.slice(option.indexOf('(') + 1, option.indexOf(')'));
        const code = option.slice(0, option.indexOf('(')).trim();

        return (
          <MenuItem key={option} value={option}>
            <ListItemIcon sx={{ minWidth: 36 }}>{code}</ListItemIcon>
            <ListItemText primary={tooltip} sx={{ overflow: 'hidden' }} />
          </MenuItem>
        );
      })}
    </Select>
  );
}

/** Custom cell renderers */
// Avatar
function renderAvatar(params) {
  if (params.value == null) {
    return '';
  }

  return (
    <Avatar style={{ backgroundColor: params.value.color }}>
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

// Email
function renderEmail(params) {
  const email = params.value ?? '';

  return (
    <DemoLink href={`mailto:${email}`} tabIndex={params.tabIndex}>
      {email}
    </DemoLink>
  );
}

// Rating
function renderRating(params) {
  if (params.value == null) {
    return '';
  }

  return <RatingValue value={params.value} />;
}

function renderEditRating(params) {
  return <EditRating {...params} />;
}

// Country
function renderCountry(params) {
  if (params.value == null) {
    return '';
  }

  return <Country value={params.value} />;
}

function renderEditCountry(params) {
  return <EditCountry {...params} />;
}

// Sparkline
function renderSparkline(params) {
  if (params.value == null) {
    return '';
  }

  return (
    <SparkLineChart
      data={params.value}
      width={params.colDef.computedWidth}
      plotType="bar"
    />
  );
}

// Progress
function renderProgress(params) {
  if (params.value == null) {
    return '';
  }

  return (
    <Center>
      <ProgressBar value={params.value} />
    </Center>
  );
}

function renderEditProgress(params) {
  return <EditProgress {...params} />;
}

// Status
function renderStatus(params) {
  if (params.value == null) {
    return '';
  }

  return <Status status={params.value} />;
}

function renderEditStatus(params) {
  return <EditStatus {...params} />;
}

// Incoterm
function renderIncoterm(params) {
  return <Incoterm value={params.value} />;
}

function renderEditIncoterm(params) {
  return <EditIncoterm {...params} />;
}

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 120,
    editable: true,
  },
  {
    field: 'avatar',
    headerName: 'Avatar',
    display: 'flex',
    renderCell: renderAvatar,
    valueGetter: (value, row) =>
      row.name == null || row.avatar == null
        ? null
        : { name: row.name, color: row.avatar },
    sortable: false,
    filterable: false,
  },
  {
    field: 'email',
    headerName: 'Email',
    renderCell: renderEmail,
    width: 150,
    editable: true,
  },
  {
    field: 'rating',
    headerName: 'Rating',
    display: 'flex',
    renderCell: renderRating,
    renderEditCell: renderEditRating,
    width: 180,
    type: 'number',
    editable: true,
    availableAggregationFunctions: ['avg', 'min', 'max', 'size'],
  },
  {
    field: 'country',
    headerName: 'Country',
    type: 'singleSelect',
    valueOptions: COUNTRY_ISO_OPTIONS_SORTED,
    valueFormatter: (value) => value?.label,
    renderCell: renderCountry,
    renderEditCell: renderEditCountry,
    sortComparator: (v1, v2, param1, param2) =>
      gridStringOrNumberComparator(v1.label, v2.label, param1, param2),
    width: 150,
    editable: true,
  },
  {
    field: 'salary',
    headerName: 'Salary',
    type: 'number',
    valueFormatter: (value) => {
      if (!value || typeof value !== 'number') {
        return value;
      }
      return `${value.toLocaleString()}$`;
    },
    editable: true,
  },
  {
    field: 'monthlyActivity',
    headerName: 'Monthly activity',
    type: 'custom',
    resizable: false,
    filterable: false,
    sortable: false,
    editable: false,
    groupable: false,
    display: 'flex',
    renderCell: renderSparkline,
    width: 150,
    valueGetter: (value, row) => row.monthlyActivity,
  },
  {
    field: 'budget',
    headerName: 'Budget left',
    renderCell: renderProgress,
    renderEditCell: renderEditProgress,
    availableAggregationFunctions: ['min', 'max', 'avg', 'size'],
    type: 'number',
    width: 120,
    editable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    renderCell: renderStatus,
    renderEditCell: renderEditStatus,
    type: 'singleSelect',
    valueOptions: STATUS_OPTIONS,
    width: 150,
    editable: true,
  },
  {
    field: 'incoTerm',
    headerName: 'Incoterm',
    renderCell: renderIncoterm,
    renderEditCell: renderEditIncoterm,
    type: 'singleSelect',
    valueOptions: INCOTERM_OPTIONS,
    editable: true,
  },
];

const rows = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  name: randomName({}, {}),
  avatar: randomColor(),
  email: randomEmail(),
  rating: randomRating(),
  country: randomCountry(),
  salary: randomInt(35000, 80000),
  monthlyActivity: Array.from({ length: 30 }, () => randomInt(1, 25)),
  budget: generateFilledQuantity({ quantity: 100 }),
  status: randomStatusOptions(),
  incoTerm: randomIncoterm(),
}));

export default function CustomColumnFullExample() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
