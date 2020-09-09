import { darken, fade, lighten, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  (theme: Theme) => {
    const borderColor =
      theme.palette.type === 'light'
        ? lighten(fade(theme.palette.divider, 1), 0.88)
        : darken(fade(theme.palette.divider, 1), 0.68);

    return {
      root: {
        boxSizing: 'border-box',
        position: 'relative',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        outline: 'none',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        '& *, & *::before, & *::after': {
          boxSizing: 'inherit',
        },
        '& .MuiDataGrid-mainGridContainer': {
          position: 'relative',
          flexGrow: 1,
          flexDirection: 'column',
          display: 'flex',
        },
        '& .MuiDataGrid-footer': {
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding: theme.spacing(0, 2),
        },
        '& .MuiDataGrid-rowCount, & .MuiDataGrid-selectedRowCount': {
          alignItems: 'center',
          ...theme.typography.body2,
          lineHeight: 1.43,
          minHeight: 48,
          display: 'none',
          [theme.breakpoints.up('md')]: {
            display: 'flex',
          },
        },
        '& .MuiDataGrid-cell:focus, & .MuiDataGrid-colCell:focus': {
          outline: 'dotted',
          outlineWidth: 1,
          outlineOffset: -2,
        },
        '& .MuiDataGrid-overlay': {
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 15,
          alignSelf: 'center',
          alignItems: 'center',
          zIndex: 10,
        },
        '& .MuiDataGrid-overlayContent': {
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
        },
        '& .MuiDataGrid-columnsContainer': {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          borderBottom: `1px solid ${borderColor}`,
          zIndex: 100,
          backgroundColor: fade(theme.palette.primary.main, theme.palette.action.focusOpacity),
          color: theme.palette.text.primary,
          fontWeight: theme.typography.fontWeightBold,
          fontSize: theme.typography.fontSize,
        },
        '& .MuiDataGrid-colCellWrapper': {
          display: 'flex',
          width: '100%',
          alignItems: 'center',
        },
        '& .MuiDataGrid-colCell': {
          position: 'relative',
          display: 'flex',
          padding: '0 16px',
        },
        '& .MuiDataGrid-colCellSortable': {
          cursor: 'pointer',
        },
        '& .MuiDataGrid-colCellCenter': {
          justifyContent: 'center',
        },
        '& .MuiDataGrid-colCellRight': {
          justifyContent: 'flex-end',
        },
        '& .MuiDataGrid-colCellTitle': {
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        },
        '& .MuiDataGrid-columnSeparator': {
          position: 'absolute',
          right: -12,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        },
        '& .MuiDataGrid-iconSeparator': {
          color: borderColor,
        },
        '& .MuiDataGrid-columnSeparator:hover .MuiDataGrid-resizable': {
          cursor: 'col-resize',
          color: 'inherit',
        },
        '& .MuiDataGrid-colCell *': {
          maxHeight: 56,
        },
        '& .MuiDataGrid-colCellWrapper.scroll .MuiDataGrid-colCell:last-child': {
          borderRight: 'none',
        },
        '& .MuiDataGrid-dataContainer': {
          position: 'relative',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        },
        '& .MuiDataGrid-window': {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          overflowX: 'auto',
        },
        '& .MuiDataGrid-viewport': {
          position: 'sticky',
          top: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
        '& .MuiDataGrid-row': {
          display: 'flex',
          width: 'fit-content',
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: theme.palette.action.hover,
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              backgroundColor: 'transparent',
            },
          },
        },
        '& .MuiDataGrid-row.Mui-odd': {
          backgroundColor: fade(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
        '& .MuiDataGrid-row.Mui-selected': {
          backgroundColor: fade(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        },
        '& .MuiDataGrid-cell': {
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: theme.spacing(0, 2),
          ...theme.typography.body1,
          borderBottom: `1px solid ${borderColor}`,
        },
        '& .MuiDataGrid-colCellWrapper .MuiDataGrid-cell': {
          borderBottom: `none`,
        },
        '& .MuiDataGrid-cellWithRenderer': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        },
        '& .MuiDataGrid-withBorder': {
          borderRight: `1px solid ${borderColor}`,
        },
        '& .MuiDataGrid-cellRight': {
          textAlign: 'right',
        },
        '& .MuiDataGrid-cellCenter': {
          textAlign: 'center',
        },
        '& .MuiDataGrid-checkboxInput': {
          padding: 12,
        },
      },
    };
  },
  { name: 'MuiDataGrid' },
);
