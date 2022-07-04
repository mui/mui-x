import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { unstable_useId as useId } from '@mui/material/utils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';

export type GridFilterInputMultipleValueProps = {
  type?: 'text' | 'number';
} & GridFilterInputValueProps &
  Omit<AutocompleteProps<any[], true, false, true>, 'options' | 'renderInput'>;

function GridFilterInputMultipleValue(props: GridFilterInputMultipleValueProps) {
  const {
    item,
    applyValue,
    type,
    apiRef,
    focusElementRef,
    color,
    error,
    helperText,
    size,
    variant,
    ...other
  } = props;
  const TextFieldProps = {
    color,
    error,
    helperText,
    size,
    variant,
  };

  const [filterValueState, setFilterValueState] = React.useState(item.value || []);
  const id = useId();

  const rootProps = useGridRootProps();

  React.useEffect(() => {
    const itemValue = item.value ?? [];
    setFilterValueState(itemValue.map(String));
  }, [item.value]);

  const handleChange = React.useCallback(
    (event, value) => {
      setFilterValueState(value.map(String));
      applyValue({ ...item, value: [...value] });
    },
    [applyValue, item],
  );

  return (
    <Autocomplete
      multiple
      freeSolo
      limitTags={1}
      options={[]}
      filterOptions={(options, params): any[] => {
        const { inputValue } = params;
        return inputValue == null || inputValue === '' ? [] : [inputValue];
      }}
      id={id}
      value={filterValueState}
      onChange={handleChange}
      renderTags={(value: any[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip variant="outlined" size="small" label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <rootProps.components.BaseTextField
          {...params}
          label={apiRef.current.getLocaleText('filterPanelInputLabel')}
          placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: true,
          }}
          inputRef={focusElementRef}
          type={type || 'text'}
          {...TextFieldProps}
          {...rootProps.componentsProps?.baseTextField}
        />
      )}
      {...other}
    />
  );
}

GridFilterInputMultipleValue.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  applyValue: PropTypes.func.isRequired,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  item: PropTypes.shape({
    columnField: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operatorValue: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
  type: PropTypes.oneOf(['number', 'text']),
} as any;

export { GridFilterInputMultipleValue };
