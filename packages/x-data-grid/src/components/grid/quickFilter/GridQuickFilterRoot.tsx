import * as React from 'react';
import { unstable_debounce as debounce } from '@mui/utils';
import { GridQuickFilterRootContext } from './GridQuickFilterRootContext';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../../hooks/utils/useGridSelector';
import { gridQuickFilterValuesSelector } from '../../../hooks/features/filter';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import type { GridFilterModel } from '../../../models';

export type GridQuickFilterRootProps = {
  children: React.ReactNode;
  /**
   * Function responsible for parsing text input in an array of independent values for quick filtering.
   * @param {string} input The value entered by the user
   * @returns {any[]} The array of value on which quick filter is applied
   * @default (searchText: string) => searchText
   *   .split(' ')
   *   .filter((word) => word !== '')
   */
  parser?: (input: string) => any[];
  /**
   * Function responsible for formatting values of quick filter in a string when the model is modified
   * @param {any[]} values The new values passed to the quick filter model
   * @returns {string} The string to display in the text field
   * @default (values: string[]) => values.join(' ')
   */
  formatter?: (values: NonNullable<GridFilterModel['quickFilterValues']>) => string;
  /**
   * The debounce time in milliseconds.
   * @default 150
   */
  debounceMs?: number;
};

const DEFAULT_PARSER = (searchText: string) => searchText.split(' ').filter((word) => word !== '');

const DEFAULT_FORMATTER = (values: string[]) => values.join(' ');

/**
 * Demos:
 *
 * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
 *
 * API:
 *
 * - [GridQuickFilterRoot API](https://mui.com/x/api/data-grid/grid-quick-filter-root/)
 */
function GridQuickFilterRoot(props: GridQuickFilterRootProps) {
  const rootProps = useGridRootProps();
  const {
    children,
    parser = DEFAULT_PARSER,
    formatter = DEFAULT_FORMATTER,
    debounceMs = rootProps.filterDebounceMs,
  } = props;
  const apiRef = useGridApiContext();
  const initialValue = useGridSelector(apiRef, gridQuickFilterValuesSelector);
  const [value, setValue] = React.useState(formatter(initialValue ?? []));
  const controlRef = React.useRef<HTMLInputElement>(null);

  const setQuickFilterValueDebounced = React.useMemo(
    () =>
      debounce((newValue: string) => {
        apiRef.current.setQuickFilterValues(parser(newValue));
      }, debounceMs),
    [apiRef, debounceMs, parser],
  );

  const handleValueChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setValue(newValue);
      setQuickFilterValueDebounced(newValue);
    },
    [setQuickFilterValueDebounced],
  );

  const handleClear = React.useCallback(() => {
    setValue('');
    apiRef.current.setQuickFilterValues([]);
    controlRef.current?.focus();
  }, [apiRef, controlRef]);

  const contextValue = React.useMemo(
    () => ({
      value,
      onValueChange: handleValueChange,
      clearValue: handleClear,
      controlRef,
    }),
    [value, handleValueChange, handleClear, controlRef],
  );

  return (
    <GridQuickFilterRootContext.Provider value={contextValue}>
      {children}
    </GridQuickFilterRootContext.Provider>
  );
}

export { GridQuickFilterRoot };
