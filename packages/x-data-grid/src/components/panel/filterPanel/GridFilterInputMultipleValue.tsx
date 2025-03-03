import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_useId as useId } from '@mui/utils';
import { AutocompleteProps } from '../../../models/gridBaseSlots';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { GridFilterInputValueProps } from '../../../models/gridFilterInputComponent';

export type GridFilterInputMultipleValueProps = GridFilterInputValueProps<
  Omit<AutocompleteProps<string, true, false, true>, 'options'>
> & {
  type?: 'text' | 'number' | 'date' | 'datetime-local';
};

function GridFilterInputMultipleValue(props: GridFilterInputMultipleValueProps) {
  const { item, applyValue, type, apiRef, focusElementRef, slotProps } = props;

  const id = useId();
  const [options, setOptions] = React.useState<string[]>([]);
  const [filterValueState, setFilterValueState] = React.useState(item.value || []);

  const rootProps = useGridRootProps();

  React.useEffect(() => {
    const itemValue = item.value ?? [];
    setFilterValueState(itemValue.map(String));
  }, [item.value]);

  const handleChange = React.useCallback<
    NonNullable<AutocompleteProps<string, true, false, true>['onChange']>
  >(
    (event, value) => {
      setFilterValueState(value.map(String));

      applyValue({
        ...item,
        value: [
          ...value.map((filterItemValue) =>
            type === 'number' ? Number(filterItemValue) : filterItemValue,
          ),
        ],
      });
    },
    [applyValue, item, type],
  );

  const handleInputChange = React.useCallback(
    (event: React.SyntheticEvent, value: string) => {
      if (value === '') {
        setOptions([]);
      } else {
        setOptions([value]);
      }
    },
    [setOptions],
  );

  const BaseAutocomplete = rootProps.slots.baseAutocomplete as React.JSXElementConstructor<
    AutocompleteProps<string, true, false, true>
  >;

  return (
    <BaseAutocomplete
      multiple
      freeSolo
      options={options}
      id={id}
      value={filterValueState}
      onChange={handleChange}
      onInputChange={handleInputChange}
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      placeholder={apiRef.current.getLocaleText('filterPanelInputPlaceholder')}
      slotProps={{
        textField: {
          type: type || 'text',
          inputRef: focusElementRef,
        },
      }}
      {...slotProps?.root}
    />
  );
}

GridFilterInputMultipleValue.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  applyValue: PropTypes.func.isRequired,
  className: PropTypes.string,
  clearButton: PropTypes.node,
  disabled: PropTypes.bool,
  focusElementRef: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  headerFilterMenu: PropTypes.node,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: function (props, propName) {
        if (props[propName] == null) {
          return null;
        } else if (typeof props[propName] !== 'object' || props[propName].nodeType !== 1) {
          return new Error("Expected prop '" + propName + "' to be of type Element");
        }
      },
    }),
  ]),
  /**
   * It is `true` if the filter either has a value or an operator with no value
   * required is selected (for example `isEmpty`)
   */
  isFilterActive: PropTypes.bool,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  slotProps: PropTypes.object,
  tabIndex: PropTypes.number,
  type: PropTypes.oneOf(['date', 'datetime-local', 'number', 'text']),
} as any;

export { GridFilterInputMultipleValue };
