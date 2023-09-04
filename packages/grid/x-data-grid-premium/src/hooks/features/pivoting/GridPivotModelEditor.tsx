import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { unstable_useId as useId } from '@mui/utils';
import DeleteIcon from '@mui/icons-material/Delete';
import type { GridColDef } from '@mui/x-data-grid';
import type { PivotModel } from './useGridPivoting';

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
    <FormControl sx={{ my: 1 }} size="small">
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
  );
}

interface SingleSelectProps extends Omit<React.ComponentProps<typeof FormControl>, 'onChange'> {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: string[];
}

function SingleSelect({ label, value, onChange, options, ...props }: SingleSelectProps) {
  const labelId = useId();
  const id = useId();

  return (
    <FormControl size="small" {...props}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={id}
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => <Chip label={selected} size="small" />}
        fullWidth
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

function FieldsEditor<
  TFields extends string,
  TValues extends Array<{ field: string } & Partial<Record<TFields, any>>>,
>({
  values,
  options,
  onChange,
  label,
  fieldsConfig,
  style,
}: {
  values: TValues;
  options: string[];
  onChange: (values: TValues) => void;
  label: string;
  fieldsConfig: {
    key: TFields;
    options: string[];
  }[];
  style?: React.CSSProperties;
}) {
  const [emptyValues, setEmptyValues] = React.useState<TValues>([] as any as TValues);

  return (
    <div style={style}>
      <Typography variant="caption" component="div">
        {label}
      </Typography>
      {values.map((valueObj, index) => {
        const field = valueObj.field;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', my: 1.5, gap: '10px' }} key={field}>
            <SingleSelect
              label="Field"
              value={field}
              onChange={(event) => {
                const newValues = values.map((value, valIndex) => {
                  if (valIndex === index) {
                    return { ...value, field: event.target.value };
                  }
                  return value;
                }) as TValues;
                onChange(newValues);
              }}
              options={[field].concat(options)}
              sx={{ flex: '0 1 60%' }}
            />
            {fieldsConfig.map((fieldConfig) => {
              const { key } = fieldConfig;
              return (
                <SingleSelect
                  key={key}
                  label={key}
                  value={valueObj[key]}
                  onChange={(event) => {
                    const newValues = values.map((value, valIndex) => {
                      if (valIndex === index) {
                        return { ...value, [key]: event.target.value };
                      }
                      return value;
                    }) as TValues;
                    onChange(newValues);
                  }}
                  options={fieldConfig.options}
                  sx={{ flex: '0 1 40%' }}
                />
              );
            })}
            <IconButton
              size="small"
              onClick={() => {
                onChange(values.filter((_, valIndex) => valIndex !== index) as TValues);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })}
      {emptyValues.map((value, emptyIndex) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              my: 1.5,
              gap: '10px',
              justifyContent: 'space-between',
            }}
            key={emptyIndex}
          >
            <SingleSelect
              label="Field"
              value=""
              onChange={(event) => {
                setEmptyValues((prevValues) => {
                  return prevValues.filter((_, index) => index !== emptyIndex) as TValues;
                });
                onChange([...values, { ...value, field: event.target.value }] as TValues);
              }}
              options={options}
              sx={{ flex: '0 1 60%' }}
            />
            <IconButton
              size="small"
              onClick={() => {
                setEmptyValues((prevValues) => {
                  return prevValues.filter((_, index) => index !== emptyIndex) as TValues;
                });
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })}
      <Button
        onClick={() => {
          setEmptyValues((prevValues) => {
            return [...prevValues, { field: '' }] as TValues;
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

export default function GridPivotModelEditor({
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
      if (pivotModel.columns.find((col) => col.field === field)) {
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
      <Typography variant="caption" component="div">
        Rows
      </Typography>
      <FieldsSelect
        options={availableFields}
        values={pivotModel.rows}
        onChange={(newRows) => {
          onPivotModelChange((prevModel) => ({ ...prevModel, rows: newRows }));
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5%', marginTop: 4 }}>
        <FieldsEditor
          values={pivotModel.columns}
          options={availableFields}
          onChange={(newValues) => {
            onPivotModelChange((prevModel) => ({
              ...prevModel,
              columns: newValues,
            }));
          }}
          label="Columns"
          fieldsConfig={[{ key: 'sort', options: ['asc', 'desc'] }]}
          style={{ flex: 1 }}
        />
        <FieldsEditor
          values={pivotModel.values}
          options={availableFields}
          onChange={(newValues) => {
            onPivotModelChange((prevModel) => ({
              ...prevModel,
              values: newValues,
            }));
          }}
          label="Values"
          fieldsConfig={[{ key: 'aggFunc', options: ['sum', 'avg', 'min', 'max', 'size'] }]}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
}
