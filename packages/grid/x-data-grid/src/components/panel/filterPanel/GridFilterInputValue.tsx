import * as React from 'react';
import PropTypes from 'prop-types';
import { TextFieldProps } from '@mui/material/TextField';
import { unstable_useId as useId } from '@mui/material/utils';
import MenuItem from '@mui/material/MenuItem';
import { GridLoadIcon } from '../../icons';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { getValueFromValueOptions } from './filterPanelUtils';

const warnedOnce: Record<string, boolean> = {};
function warnDeprecatedTypeSupport(type: string) {
  console.warn(
    [
      `MUI: Using GridFilterInputValue with a "${type}" column is deprecated.`,
      'Use GridFilterInputSingleSelect instead.',
    ].join('\n'),
  );

  warnedOnce[type] = true;
}

const renderSingleSelectOptions = (
  { valueOptions, valueFormatter, field }: GridColDef,
  api: GridApiCommunity,
  OptionComponent: React.ElementType,
) => {
  const iterableColumnValues =
    typeof valueOptions === 'function'
      ? ['', ...valueOptions({ field })]
      : ['', ...(valueOptions || [])];

  return iterableColumnValues.map((option) => {
    const isOptionTypeObject = typeof option === 'object';

    const key = isOptionTypeObject ? option.value : option;
    const value = isOptionTypeObject ? option.value : option;

    const formattedValue =
      valueFormatter && option !== '' ? valueFormatter({ value: option, field, api }) : option;
    const content = isOptionTypeObject ? option.label : formattedValue;

    return (
      <OptionComponent key={key} value={value}>
        {content}
      </OptionComponent>
    );
  });
};

export const SUBMIT_FILTER_STROKE_TIME = 500;

export interface GridTypeFilterInputValueProps extends GridFilterInputValueProps {
  type?: 'text' | 'number' | 'date' | 'datetime-local' | 'singleSelect';
}

function GridFilterInputValue(props: GridTypeFilterInputValueProps & TextFieldProps) {
  const { item, applyValue, type, apiRef, focusElementRef, ...others } = props;
  if (
    process.env.NODE_ENV !== 'production' &&
    ['date', 'datetime-local', 'singleSelect'].includes(type as string) &&
    !warnedOnce[type as string]
  ) {
    warnDeprecatedTypeSupport(type as string);
  }
  const filterTimeout = React.useRef<any>();
  const [filterValueState, setFilterValueState] = React.useState<string>(item.value ?? '');
  const [applying, setIsApplying] = React.useState(false);
  const id = useId();
  const rootProps = useGridRootProps();

  const baseSelectProps = rootProps.componentsProps?.baseSelect || {};
  const isSelectNative = baseSelectProps.native ?? true;

  const singleSelectProps: TextFieldProps =
    type === 'singleSelect'
      ? {
          select: true,
          SelectProps: {
            native: isSelectNative,
            ...rootProps.componentsProps?.baseSelect,
          },
          children: renderSingleSelectOptions(
            apiRef.current.getColumn(item.columnField),
            apiRef.current,
            isSelectNative ? 'option' : MenuItem,
          ),
        }
      : {};

  const onFilterChange = React.useCallback(
    (event) => {
      let value = event.target.value;
      // NativeSelect casts the value to a string.
      if (type === 'singleSelect') {
        const column = apiRef.current.getColumn(item.columnField);
        const columnValueOptions =
          typeof column.valueOptions === 'function'
            ? column.valueOptions({ field: column.field })
            : column.valueOptions;
        value = getValueFromValueOptions(value, columnValueOptions);
      }

      clearTimeout(filterTimeout.current);
      setFilterValueState(String(value));

      setIsApplying(true);
      // TODO singleSelect doesn't debounce
      filterTimeout.current = setTimeout(() => {
        applyValue({ ...item, value });
        setIsApplying(false);
      }, SUBMIT_FILTER_STROKE_TIME);
    },
    [apiRef, applyValue, item, type],
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(filterTimeout.current);
    };
  }, []);

  React.useEffect(() => {
    const itemValue = item.value ?? '';
    setFilterValueState(String(itemValue));
  }, [item.value]);

  const InputProps = applying ? { endAdornment: <GridLoadIcon /> } : others.InputProps;

  return (
    <rootProps.components.BaseTextField
      id={id}
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
      value={filterValueState}
      onChange={onFilterChange}
      variant="standard"
      type={type || 'text'}
      InputProps={InputProps}
      InputLabelProps={{
        shrink: true,
      }}
      inputRef={focusElementRef}
      {...singleSelectProps}
      {...others}
      {...rootProps.componentsProps?.baseTextField}
    />
  );
}

GridFilterInputValue.propTypes = {
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
} as any;

export { GridFilterInputValue };
