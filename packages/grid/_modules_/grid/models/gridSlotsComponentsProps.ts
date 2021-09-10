import type { GridColumnsHeaderProps } from '../components/columnHeaders/GridColumnHeaders';

/**
 * Overrideable components props dynamically passed to the component at rendering.
 */
export interface GridSlotsComponentsProps {
  checkbox?: any;
  columnMenu?: any;
  columnsPanel?: any;
  columnsHeader?: GridColumnsHeaderProps;
  errorOverlay?: any;
  filterPanel?: any;
  footer?: any;
  header?: any;
  loadingOverlay?: any;
  noResultsOverlay?: any;
  noRowsOverlay?: any;
  pagination?: any;
  panel?: any;
  preferencesPanel?: any;
  toolbar?: any;
}
