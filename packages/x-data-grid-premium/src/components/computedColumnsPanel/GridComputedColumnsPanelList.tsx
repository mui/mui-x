'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import useId from '@mui/utils/useId';
import composeClasses from '@mui/utils/composeClasses';
import {
  GridMenu,
  getDataGridUtilityClass,
  gridColumnLookupSelector,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import { useGridPrivateApiContext } from '../../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import type {
  GridComputedColumnDefinition,
  GridComputedColumnValidationIssue,
} from '../../hooks/features/computedColumns/gridComputedColumnsInterfaces';
import { gridComputedColumnsSelector } from '../../hooks/features/computedColumns/gridComputedColumnsSelectors';
import { FORMULA_FONT_FAMILY } from '../GridFormulaEditable';

export interface GridComputedColumnsPanelListProps {
  /**
   * Called when the user wants to add a column.
   */
  onAdd: () => void;
  /**
   * Called when the user wants to edit a column.
   * @param {string} field The field of the column.
   */
  onEdit: (field: string) => void;
  /**
   * The item to focus when the list mounts (the column that was just applied).
   */
  focusField?: string | null;
}

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['computedColumnsPanelList'],
    item: ['computedColumnsPanelListItem'],
    empty: ['computedColumnsPanelEmpty'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridComputedColumnsPanelListRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelList',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  font: vars.typography.font.body,
});

const GridComputedColumnsPanelListItems = styled('ul', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelListItems',
})<{ ownerState: OwnerState }>({
  listStyle: 'none',
  margin: 0,
  padding: vars.spacing(1, 0),
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
});

const GridComputedColumnsPanelListItem = styled('li', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelListItem',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(0.5),
  padding: vars.spacing(0, 0.75, 0, 0.5),
  minWidth: 0,
});

// The whole row opens the editor; the kebab beside it is a separate control so
// keyboard users reach both.
const GridComputedColumnsPanelListItemButton = styled('button', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelListItemButton',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(1),
  flex: 1,
  minWidth: 0,
  padding: vars.spacing(0.75, 1),
  border: 0,
  borderRadius: vars.radius.base,
  background: 'none',
  color: 'inherit',
  font: 'inherit',
  textAlign: 'start',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: vars.colors.interactive.hover,
  },
  '&:focus-visible': {
    outline: `2px solid ${vars.colors.interactive.selected}`,
    outlineOffset: -2,
  },
});

const GridComputedColumnsPanelListItemBadge = styled('span', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelListItemBadge',
})<{ ownerState: OwnerState }>(({ theme }) => ({
  flexShrink: 0,
  width: 20,
  color: vars.colors.foreground.muted,
  fontFamily: 'serif',
  fontStyle: 'italic',
  fontWeight: 600,
  fontSize: '0.85em',
  lineHeight: 1,
  userSelect: 'none',
  // The same warning variant as the header badge.
  '&[data-invalid="true"]': {
    color: (theme.vars || theme).palette.warning.main,
  },
}));

const GridComputedColumnsPanelListItemText = styled('span', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelListItemText',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.spacing(0.25),
  flex: 1,
  minWidth: 0,
  '& > *': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

const GridComputedColumnsPanelListItemFormula = styled('span', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelListItemFormula',
})<{ ownerState: OwnerState }>({
  font: vars.typography.font.small,
  fontFamily: FORMULA_FONT_FAMILY,
  fontVariantLigatures: 'none',
  color: vars.colors.foreground.muted,
});

const GridComputedColumnsPanelEmpty = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelEmpty',
})<{ ownerState: OwnerState }>({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  textWrap: 'balance',
  padding: vars.spacing(2),
  color: vars.colors.foreground.muted,
});

const GridComputedColumnsPanelListFooter = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelListFooter',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  padding: vars.spacing(1.5),
  borderTop: `1px solid ${vars.colors.border.base}`,
});

interface GridComputedColumnsPanelListItemMenuProps {
  field: string;
  onEdit: (field: string) => void;
  onRemove: (field: string) => void;
}

function GridComputedColumnsPanelListItemMenu(props: GridComputedColumnsPanelListItemMenuProps) {
  const { field, onEdit, onRemove } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const [open, setOpen] = React.useState(false);
  const menuId = useId();
  const triggerId = useId();
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <rootProps.slots.baseIconButton
        size="small"
        {...rootProps.slotProps?.baseIconButton}
        id={triggerId}
        aria-haspopup="true"
        aria-controls={open ? menuId : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-label={apiRef.current.getLocaleText('computedColumnsPanelItemMenuLabel')}
        onClick={() => setOpen(!open)}
        ref={triggerRef}
      >
        <rootProps.slots.columnMenuIcon fontSize="small" />
      </rootProps.slots.baseIconButton>
      <GridMenu target={triggerRef.current} open={open} onClose={handleClose} position="bottom-end">
        <rootProps.slots.baseMenuList
          id={menuId}
          aria-labelledby={triggerId}
          autoFocusItem
          {...rootProps.slotProps?.baseMenuList}
        >
          <rootProps.slots.baseMenuItem
            onClick={() => {
              handleClose();
              onEdit(field);
            }}
            {...rootProps.slotProps?.baseMenuItem}
          >
            {apiRef.current.getLocaleText('columnMenuEditComputedColumn')}
          </rootProps.slots.baseMenuItem>
          <rootProps.slots.baseMenuItem
            onClick={() => {
              handleClose();
              onRemove(field);
            }}
            {...rootProps.slotProps?.baseMenuItem}
          >
            {apiRef.current.getLocaleText('columnMenuRemoveComputedColumn')}
          </rootProps.slots.baseMenuItem>
        </rootProps.slots.baseMenuList>
      </GridMenu>
    </React.Fragment>
  );
}

/**
 * The list view of the computed columns panel: one row per stored definition
 * (badge, name, formula, kebab menu), an empty state and the Add button. The
 * issues come from the runtime records, which the columns hydration refreshes —
 * the list re-renders with the column lookup for that reason.
 */
function GridComputedColumnsPanelList(props: GridComputedColumnsPanelListProps) {
  const { onAdd, onEdit, focusField } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const model = useGridSelector(apiRef, gridComputedColumnsSelector);
  const columnLookup = useGridSelector(apiRef, gridColumnLookupSelector);

  const items = React.useMemo(
    () =>
      model.map((definition) => ({
        definition,
        // A definition colliding with a data column is not injected: nothing to validate.
        issues:
          columnLookup[definition.field]?.computed === true
            ? (apiRef.current.getComputedColumnIssues?.(definition.field) ?? [])
            : [],
      })),
    [apiRef, model, columnLookup],
  );

  // Focus lands on the applied column's item when the list mounts after Apply,
  // and on the next item (or the Add button) after a removal.
  const [pendingFocusField, setPendingFocusField] = React.useState<string | null | undefined>(
    focusField,
  );
  const itemRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const addButtonRef = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => {
    if (pendingFocusField === undefined) {
      return;
    }
    setPendingFocusField(undefined);
    const target =
      pendingFocusField === null ? null : (itemRefs.current.get(pendingFocusField) ?? null);
    (target ?? addButtonRef.current)?.focus();
  }, [pendingFocusField]);

  const handleRemove = React.useCallback(
    (field: string) => {
      const index = model.findIndex((definition) => definition.field === field);
      const next = model[index + 1] ?? model[index - 1];
      setPendingFocusField(next === undefined ? null : next.field);
      apiRef.current.removeComputedColumn(field);
    },
    [apiRef, model],
  );

  const getLocaleText = apiRef.current.getLocaleText;

  const renderBadge = (
    definition: GridComputedColumnDefinition,
    issues: GridComputedColumnValidationIssue[],
  ) => {
    const invalid = issues.length > 0;
    const badge = (
      <GridComputedColumnsPanelListItemBadge
        ownerState={rootProps}
        role="img"
        aria-label={getLocaleText(
          invalid ? 'computedColumnHeaderInvalidLabel' : 'computedColumnHeaderLabel',
        )}
        data-invalid={invalid ? 'true' : undefined}
      >
        ƒx
      </GridComputedColumnsPanelListItemBadge>
    );
    if (!invalid) {
      return badge;
    }
    return (
      <rootProps.slots.baseTooltip
        title={issues.map((issue) => issue.message).join('\n')}
        material={{ describeChild: true }}
        {...rootProps.slotProps?.baseTooltip}
      >
        {badge}
      </rootProps.slots.baseTooltip>
    );
  };

  return (
    <GridComputedColumnsPanelListRoot ownerState={rootProps} className={classes.root}>
      {items.length === 0 ? (
        <GridComputedColumnsPanelEmpty ownerState={rootProps} className={classes.empty}>
          {getLocaleText('computedColumnsPanelEmpty')}
        </GridComputedColumnsPanelEmpty>
      ) : (
        <GridComputedColumnsPanelListItems ownerState={rootProps}>
          {items.map(({ definition, issues }) => (
            <GridComputedColumnsPanelListItem
              key={definition.field}
              ownerState={rootProps}
              className={classes.item}
            >
              <GridComputedColumnsPanelListItemButton
                ownerState={rootProps}
                type="button"
                ref={(node: HTMLButtonElement | null) => {
                  if (node) {
                    itemRefs.current.set(definition.field, node);
                  } else {
                    itemRefs.current.delete(definition.field);
                  }
                }}
                onClick={() => onEdit(definition.field)}
              >
                {renderBadge(definition, issues)}
                <GridComputedColumnsPanelListItemText ownerState={rootProps}>
                  <span>{definition.headerName || definition.field}</span>
                  <GridComputedColumnsPanelListItemFormula ownerState={rootProps}>
                    {definition.formula}
                  </GridComputedColumnsPanelListItemFormula>
                </GridComputedColumnsPanelListItemText>
              </GridComputedColumnsPanelListItemButton>
              <GridComputedColumnsPanelListItemMenu
                field={definition.field}
                onEdit={onEdit}
                onRemove={handleRemove}
              />
            </GridComputedColumnsPanelListItem>
          ))}
        </GridComputedColumnsPanelListItems>
      )}
      <GridComputedColumnsPanelListFooter ownerState={rootProps}>
        <rootProps.slots.baseButton
          ref={addButtonRef}
          size="small"
          startIcon={<rootProps.slots.computedColumnIcon fontSize="small" />}
          onClick={onAdd}
          {...rootProps.slotProps?.baseButton}
        >
          {getLocaleText('computedColumnsPanelAddButton')}
        </rootProps.slots.baseButton>
      </GridComputedColumnsPanelListFooter>
    </GridComputedColumnsPanelListRoot>
  );
}

export { GridComputedColumnsPanelList };
