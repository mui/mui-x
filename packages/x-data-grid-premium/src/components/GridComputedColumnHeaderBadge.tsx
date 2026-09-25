'use client';
import { styled } from '@mui/material/styles';
import { useGridSelector } from '@mui/x-data-grid-pro';
import { gridClasses } from '@mui/x-data-grid';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridComputedColumnDefinitionSelector } from '../hooks/features/computedColumns/gridComputedColumnsSelectors';

const GridComputedColumnHeaderBadgeRoot = styled('span', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnHeaderBadge',
})(({ theme }) => ({
  flexShrink: 0,
  marginInlineEnd: theme.spacing(0.75),
  color: (theme.vars || theme).palette.text.secondary,
  fontFamily: 'serif',
  fontStyle: 'italic',
  fontWeight: 600,
  fontSize: theme.typography.pxToRem(13),
  lineHeight: 1,
  userSelect: 'none',
  [`.${gridClasses['columnHeader--computedInvalid']} &`]: {
    color: (theme.vars || theme).palette.warning.main,
  },
}));

/**
 * The `ƒx` badge of a computed column, rendered in the header title container before the title.
 * It is an indicator: the tooltip shows the formula, the warning variant tells the formula is invalid.
 */
export function GridComputedColumnHeaderBadge({ field }: { field: string }) {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const definition = useGridSelector(apiRef, gridComputedColumnDefinitionSelector, field);
  // A data column can use the field of a definition, which is then not injected. The header
  // renders again with the column definition, which is replaced when the validity changes.
  if (definition === null || !apiRef.current.getColumn(field)?.computed) {
    return null;
  }

  const record = apiRef.current.caches.formula?.computedColumns.records.get(field);
  const invalid = record != null && record.staticResult !== null;
  return (
    <rootProps.slots.baseTooltip
      title={definition.formula}
      material={{ describeChild: true }}
      {...rootProps.slotProps?.baseTooltip}
    >
      <GridComputedColumnHeaderBadgeRoot
        role="img"
        aria-label={apiRef.current.getLocaleText(
          invalid ? 'computedColumnHeaderInvalidLabel' : 'computedColumnHeaderLabel',
        )}
        className={gridClasses.computedColumnHeaderBadge}
      >
        ƒx
      </GridComputedColumnHeaderBadgeRoot>
    </rootProps.slots.baseTooltip>
  );
}
