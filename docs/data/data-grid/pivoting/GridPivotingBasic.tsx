import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  GridColDef,
  GridRowModel,
  unstable_useGridPivoting,
  PivotModel,
} from '@mui/x-data-grid-premium';
import { unstable_useId as useId } from '@mui/utils';
import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
  Box,
  Chip,
  Button,
  IconButton,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const initialRows: GridRowModel[] = [
  { id: 1, product: 'Product 1', type: 'Type A', price: 10, quantity: 2 },
  { id: 2, product: 'Product 2', type: 'Type A', price: 12, quantity: 3 },
  { id: 3, product: 'Product 3', type: 'Type B', price: 8, quantity: 1 },
  { id: 4, product: 'Product 4', type: 'Type C', price: 20, quantity: 8 },
];

const initialColumns: GridColDef[] = [
  { field: 'product' },
  { field: 'type' },
  { field: 'price' },
  { field: 'quantity' },
];

function FieldsSelect({
  options,
  label = '',
  values,
  onChange,
}: {
  options: string[];
  values: string[];
  label?: string;
  onChange: (values: string[]) => void;
}) {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const newValues = typeof value === 'string' ? value.split(',') : value;
    onChange(newValues);
  };

  const labelId = useId();
  const id = useId();

  return (
    <div>
      <FormControl sx={{ my: 1, width: 300 }} size="small">
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          labelId={labelId}
          id={id}
          multiple
          value={values}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {values.concat(options).map((option) => (
            <MenuItem key={option} value={option} dense>
              <Checkbox checked={values.indexOf(option) > -1} size="small" />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

function SingleSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: string[];
}) {
  const labelId = useId();
  const id = useId();

  return (
    <FormControl sx={{ my: 1, width: 300 }} size="small">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={id}
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => <Chip label={selected} size="small" />}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option} dense>
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function ValuesEditor({
  values,
  options,
  onChange,
}: {
  values: PivotModel['values'];
  options: string[];
  onChange: (values: PivotModel['values']) => void;
}) {
  const [emptyValues, setEmptyValues] = React.useState<PivotModel['values']>([]);

  return (
    <div>
      <Typography variant="caption">Values</Typography>
      {values.map(({ field }, index) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SingleSelect
              label="Field"
              value={field}
              onChange={(event) => {
                const newValues = values.map((value, valIndex) => {
                  if (valIndex === index) {
                    return { ...value, field: event.target.value };
                  }
                  return value;
                });
                onChange(newValues);
              }}
              options={[field].concat(options)}
            />
            <IconButton
              size="small"
              onClick={() => {
                onChange(values.filter((_, valIndex) => valIndex !== index));
              }}
              sx={{ mx: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })}
      {emptyValues.map((value, emptyIndex) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SingleSelect
              label="Field"
              value=""
              onChange={(event) => {
                setEmptyValues((prevValues) => {
                  return prevValues.filter((_, index) => index !== emptyIndex);
                });
                onChange([...values, { ...value, field: event.target.value }]);
              }}
              options={options}
            />
            <IconButton
              size="small"
              onClick={() => {
                setEmptyValues((prevValues) => {
                  return prevValues.filter((_, index) => index !== emptyIndex);
                });
              }}
              sx={{ mx: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })}
      <Button
        onClick={() => {
          setEmptyValues((prevValues) => {
            return [...prevValues, { field: '', aggFunc: 'sum' }];
          });
        }}
        variant="outlined"
        size="small"
        sx={{ mb: 1 }}
      >
        Add
      </Button>
    </div>
  );
}

function PivotModelEditor({
  pivotModel,
  columns,
  onPivotModelChange,
}: {
  pivotModel: PivotModel;
  columns: GridColDef[];
  onPivotModelChange: React.Dispatch<React.SetStateAction<PivotModel>>;
}) {
  const [fields] = React.useState(() => columns.map((col) => col.field));

  const availableFields = React.useMemo(() => {
    return fields.filter((field) => {
      if (pivotModel.rows.includes(field)) {
        return false;
      }
      if (pivotModel.columns.includes(field)) {
        return false;
      }
      if (pivotModel.values.find((obj) => obj.field === field)) {
        return false;
      }
      return true;
    });
  }, [pivotModel.columns, pivotModel.rows, pivotModel.values, fields]);

  return (
    <div>
      <FieldsSelect
        options={availableFields}
        label="Rows"
        values={pivotModel.rows}
        onChange={(newRows) => {
          onPivotModelChange((prevModel) => ({ ...prevModel, rows: newRows }));
        }}
      />
      <FieldsSelect
        options={availableFields}
        label="Columns"
        values={pivotModel.columns}
        onChange={(newColumns) => {
          onPivotModelChange((prevModel) => ({
            ...prevModel,
            columns: newColumns,
          }));
        }}
      />
      <ValuesEditor
        values={pivotModel.values}
        options={availableFields}
        onChange={(newValues) => {
          onPivotModelChange((prevModel) => ({
            ...prevModel,
            values: newValues,
          }));
        }}
      />
    </div>
  );
}

export default function GridPivotingBasic() {
  const apiRef = useGridApiRef();

  const [pivotModel, setPivotModel] = React.useState<PivotModel>({
    rows: ['type'],
    columns: [],
    values: [{ field: 'price', aggFunc: 'sum' }],
  });

  const { isPivot, setIsPivot, props } = unstable_useGridPivoting({
    rows: initialRows,
    columns: initialColumns,
    pivotModel,
  });

  return (
    <div style={{ width: '100%' }}>
      <FormControlLabel
        control={
          <Switch checked={isPivot} onChange={(e) => setIsPivot(e.target.checked)} />
        }
        label="Pivot"
      />
      {isPivot && (
        <PivotModelEditor
          columns={initialColumns}
          pivotModel={pivotModel}
          onPivotModelChange={setPivotModel}
        />
      )}
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPremium
          key={isPivot.toString()}
          {...props}
          apiRef={apiRef}
          experimentalFeatures={{ columnGrouping: true }}
        />
      </div>
    </div>
  );
}
