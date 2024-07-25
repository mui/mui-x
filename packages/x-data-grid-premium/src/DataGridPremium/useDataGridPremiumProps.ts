import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  DATA_GRID_PRO_PROPS_DEFAULT_VALUES,
  GRID_DEFAULT_LOCALE_TEXT,
  DataGridProProps,
  GridSignature,
} from '@mui/x-data-grid-pro';
import { computeSlots, useProps } from '@mui/x-data-grid-pro/internals';
import {
  DataGridPremiumProps,
  DataGridPremiumProcessedProps,
  DataGridPremiumPropsWithDefaultValue,
} from '../models/dataGridPremiumProps';
import { GridPremiumSlotsComponent } from '../models';
import { GRID_AGGREGATION_FUNCTIONS } from '../hooks/features/aggregation';
import { DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS } from '../constants/dataGridPremiumDefaultSlotsComponents';

interface GetDataGridPremiumPropsDefaultValues extends DataGridPremiumProps {}

type DataGridProForcedProps = {
  [key in keyof DataGridProProps]?: DataGridPremiumProcessedProps[key];
};
type GetDataGridProForcedProps = (
  themedProps: GetDataGridPremiumPropsDefaultValues,
) => DataGridProForcedProps;

const getDataGridPremiumForcedProps: GetDataGridProForcedProps = (themedProps) => ({
  signature: GridSignature.DataGridPremium,
  ...(themedProps.unstable_dataSource
    ? {
        filterMode: 'server',
        sortingMode: 'server',
        paginationMode: 'server',
      }
    : {}),
});

/**
 * The default values of `DataGridPremiumPropsWithDefaultValue` to inject in the props of DataGridPremium.
 */
export const DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES: DataGridPremiumPropsWithDefaultValue = {
  ...DATA_GRID_PRO_PROPS_DEFAULT_VALUES,
  cellSelection: false,
  disableAggregation: false,
  disableRowGrouping: false,
  rowGroupingColumnMode: 'single',
  aggregationFunctions: GRID_AGGREGATION_FUNCTIONS,
  aggregationRowsScope: 'filtered',
  getAggregationPosition: (groupNode) => (groupNode.depth === -1 ? 'footer' : 'inline'),
  disableClipboardPaste: false,
  splitClipboardPastedText: (pastedText) => {
    // Excel on Windows adds an empty line break at the end of the copied text.
    // See https://github.com/mui/mui-x/issues/9103
    const text = pastedText.replace(/\r?\n$/, '');
    return text.split(/\r\n|\n|\r/).map((row) => row.split('\t'));
  },
};

const defaultSlots = DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS;

export const useDataGridPremiumProps = (inProps: DataGridPremiumProps) => {
  const themedProps = useProps(
    // eslint-disable-next-line material-ui/mui-name-matches-component-name
    useThemeProps({
      props: inProps,
      name: 'MuiDataGrid',
    }),
  );

  const localeText = React.useMemo(
    () => ({ ...GRID_DEFAULT_LOCALE_TEXT, ...themedProps.localeText }),
    [themedProps.localeText],
  );

  const slots = React.useMemo<GridPremiumSlotsComponent>(
    () =>
      computeSlots<GridPremiumSlotsComponent>({
        defaultSlots,
        slots: themedProps.slots,
      }),
    [themedProps.slots],
  );

  return React.useMemo<DataGridPremiumProcessedProps>(
    () => ({
      ...DATA_GRID_PREMIUM_PROPS_DEFAULT_VALUES,
      ...themedProps,
      localeText,
      slots,
      ...getDataGridPremiumForcedProps(themedProps),
    }),
    [themedProps, localeText, slots],
  );
};
