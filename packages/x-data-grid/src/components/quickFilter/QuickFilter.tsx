import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_debounce as debounce } from '@mui/utils';
import { QuickFilterContext } from './QuickFilterContext';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridQuickFilterValuesSelector } from '../../hooks/features/filter';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { GridFilterModel } from '../../models';
import { isDeepEqual } from '../../utils/utils';

export type QuickFilterProps = {
  children: React.ReactNode;
  /**
   * Function responsible for parsing text input in an array of independent values for quick filtering.
   * @param {string} input The value entered by the user
   * @returns {any[]} The array of value on which quick filter is applied
   * @default (searchText: string) => searchText.split(' ').filter((word) => word !== '')
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
  /**
   * The initial expanded state of the quick filter control.
   * @default false
   */
  initialExpanded?: boolean;
  /**
   * The expanded state of the quick filter control.
   */
  expanded?: boolean;
  /**
   * Callback function that is called when the quick filter input is expanded or collapsed.
   * @param {boolean} expanded The new expanded state of the quick filter control
   */
  onExpandedChange?: (expanded: boolean) => void;
};

const DEFAULT_PARSER = (searchText: string) => searchText.split(' ').filter((word) => word !== '');

const DEFAULT_FORMATTER = (values: string[]) => values.join(' ');

/**
 * The top level Quick Filter component that provides context to child components.
 * It does not render any DOM elements.
 *
 * Demos:
 *
 * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
 *
 * API:
 *
 * - [QuickFilter API](https://mui.com/x/api/data-grid/quick-filter/)
 */
function QuickFilter(props: QuickFilterProps) {
  const rootProps = useGridRootProps();
  const {
    parser = DEFAULT_PARSER,
    formatter = DEFAULT_FORMATTER,
    debounceMs = rootProps.filterDebounceMs,
    initialExpanded = false,
    expanded,
    onExpandedChange,
    children,
  } = props;

  const apiRef = useGridApiContext();
  const controlRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const quickFilterValues = useGridSelector(apiRef, gridQuickFilterValuesSelector);
  const [value, setValue] = React.useState(formatter(quickFilterValues ?? []));
  const [internalExpanded, setInternalExpanded] = React.useState(initialExpanded);

  // Use the controlled value if provided, otherwise use the internal state
  const expandedValue = expanded ?? internalExpanded;

  const handleExpandedChange = React.useCallback(
    (newExpanded: boolean) => {
      if (onExpandedChange) {
        onExpandedChange(newExpanded);
      }
      if (expanded === undefined) {
        setInternalExpanded(newExpanded);
      }
    },
    [onExpandedChange, expanded],
  );

  const prevQuickFilterValuesRef = React.useRef(quickFilterValues);

  React.useEffect(() => {
    if (!isDeepEqual(prevQuickFilterValuesRef.current, quickFilterValues)) {
      // The model of quick filter value has been updated
      prevQuickFilterValuesRef.current = quickFilterValues;

      // Update the input value if needed to match the new model
      setValue((prevSearchValue) =>
        isDeepEqual(parser(prevSearchValue), quickFilterValues)
          ? prevSearchValue
          : formatter(quickFilterValues ?? []),
      );
    }
  }, [quickFilterValues, formatter, parser]);

  const setQuickFilterValueDebounced = React.useMemo(
    () =>
      debounce((newValue: string) => {
        apiRef.current.setQuickFilterValues(parser(newValue));
      }, debounceMs),
    [apiRef, debounceMs, parser],
  );
  React.useEffect(() => setQuickFilterValueDebounced.clear, [setQuickFilterValueDebounced]);

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
    handleExpandedChange(false);
  }, [apiRef, controlRef, handleExpandedChange]);

  const contextValue = React.useMemo(
    () => ({
      controlRef,
      triggerRef,
      state: {
        value,
        expanded: expandedValue,
      },
      clearValue: handleClear,
      onValueChange: handleValueChange,
      onExpandedChange: handleExpandedChange,
    }),
    [value, expandedValue, handleValueChange, handleClear, handleExpandedChange],
  );

  return <QuickFilterContext.Provider value={contextValue}>{children}</QuickFilterContext.Provider>;
}

QuickFilter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * The debounce time in milliseconds.
   * @default 150
   */
  debounceMs: PropTypes.number,
  /**
   * The expanded state of the quick filter control.
   */
  expanded: PropTypes.bool,
  /**
   * Function responsible for formatting values of quick filter in a string when the model is modified
   * @param {any[]} values The new values passed to the quick filter model
   * @returns {string} The string to display in the text field
   * @default (values: string[]) => values.join(' ')
   */
  formatter: PropTypes.func,
  /**
   * The initial expanded state of the quick filter control.
   * @default false
   */
  initialExpanded: PropTypes.bool,
  /**
   * Callback function that is called when the quick filter input is expanded or collapsed.
   * @param {boolean} expanded The new expanded state of the quick filter control
   */
  onExpandedChange: PropTypes.func,
  /**
   * Function responsible for parsing text input in an array of independent values for quick filtering.
   * @param {string} input The value entered by the user
   * @returns {any[]} The array of value on which quick filter is applied
   * @default (searchText: string) => searchText.split(' ').filter((word) => word !== '')
   */
  parser: PropTypes.func,
} as any;

export { QuickFilter };
