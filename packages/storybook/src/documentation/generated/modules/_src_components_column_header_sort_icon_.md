[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/components/column-header-sort-icon"](_src_components_column_header_sort_icon_.md)

# Module: "src/components/column-header-sort-icon"

## Index

### Interfaces

- [ColumnHeaderSortIconProps](../interfaces/_src_components_column_header_sort_icon_.columnheadersorticonprops.md)

### Variables

- [ColumnHeaderSortIcon](_src_components_column_header_sort_icon_.md#const-columnheadersorticon)

### Functions

- [getIcon](_src_components_column_header_sort_icon_.md#const-geticon)

## Variables

### `Const` ColumnHeaderSortIcon

• **ColumnHeaderSortIcon**: _React.FC‹[ColumnHeaderSortIconProps](../interfaces/_src_components_column_header_sort_icon_.columnheadersorticonprops.md)›_ = React.memo(
({ direction, index, hide }) => {
const icons = useIcons();

    if (hide || direction == null) {
      return null;
    }

    return (
      <span className={'sort-icon'}>
        {index != null && (
          <Badge badgeContent={index} color="default">
            <IconButton aria-label="Sort" size="small">
              {getIcon(icons, direction)}
            </IconButton>
          </Badge>
        )}
        {index == null && (
          <IconButton aria-label="Sort" size="small">
            {getIcon(icons, direction)}
          </IconButton>
        )}
      </span>
    );

},
)

_Defined in [packages/grid/x-grid-modules/src/components/column-header-sort-icon.tsx:17](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/column-header-sort-icon.tsx#L17)_

## Functions

### `Const` getIcon

▸ **getIcon**(`icons`: [IconsOptions](../interfaces/_src_models_gridoptions_.iconsoptions.md), `direction`: [SortDirection](_src_models_sortmodel_.md#sortdirection)): _React.ReactNode_

_Defined in [packages/grid/x-grid-modules/src/components/column-header-sort-icon.tsx:14](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/column-header-sort-icon.tsx#L14)_

**Parameters:**

| Name        | Type                                                                   |
| ----------- | ---------------------------------------------------------------------- |
| `icons`     | [IconsOptions](../interfaces/_src_models_gridoptions_.iconsoptions.md) |
| `direction` | [SortDirection](_src_models_sortmodel_.md#sortdirection)               |

**Returns:** _React.ReactNode_
