import { darken, fade, lighten, makeStyles } from '@material-ui/core/styles';
import { ROOT_CSS_CLASS } from '@material-ui/x-grid-modules';

export const getStyles = makeStyles((theme) => {
  const borderColor =
    theme.palette.type === 'light'
      ? lighten(fade(theme.palette.divider, 1), 0.88)
      : darken(fade(theme.palette.divider, 1), 0.68);

  const gridStyle: any = {};
  gridStyle[ROOT_CSS_CLASS] = {
    lineHeight: theme.typography.pxToRem(24),
    boxSizing: 'border-box',
    position: 'relative',
    fontFamily: theme.typography.fontFamily,
    letterSpacing: theme.typography.body2,
    border: '1px solid #bdc3c7',
    borderRadius: theme.shape.borderRadius,
    outline: 'none',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',

    '& *': {
      boxSizing: 'border-box',
    },

    '& .main-grid-container': {
      position: 'relative',
      flexGrow: 1,
      flexDirection: 'column',
      display: 'flex',
    },
    '& .footer': {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row',
      padding: theme.spacing(0, 2),
    },
    '& .row-count, & .selected-row-count': {
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.875rem',
      fontWeight: theme.typography.fontWeightMedium,
      lineHeight: 1.43,
      minHeight: '48px',
    },
    '@media (max-width: 650px)': {
      '&  .row-count, &  .selected-row-count': {
        display: 'none',
      },
    },
    '&  .MuiDataGrid-cell:focus, &  .MuiDataGrid-col-cell:focus': {
      outline: 'dotted',
      outlineWidth: '1px',
      outlineOffset: '-2px',
    },
    '&  .overlay': {
      display: 'flex',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: '15px',
      alignSelf: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    '&  .overlay .content': {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
    },

    '&  .columns-container': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      overflowX: 'hidden',
      overflowY: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      borderBottom: `1px solid ${borderColor}`,
      zIndex: 100,
      backgroundColor: '#f9f9f9',
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.fontSize,
    },
    '&  .columns-container .MuiDataGrid-col-cell-wrapper': {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
    },
    '&  .MuiDataGrid-col-cell': {
      position: 'relative',
      display: 'flex',
      padding: '0 16px',
    },
    '&  .MuiDataGrid-col-cell.sortable': {
      cursor: 'pointer',
    },

    '&  .MuiDataGrid-col-cell.center': {
      justifyContent: 'center',
    },

    '&  .MuiDataGrid-col-cell.right': {
      justifyContent: 'flex-end',
    },

    '& .MuiDataGrid-col-cell .title': {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    '& .MuiDataGrid-col-cell .column-separator': {
      position: 'absolute',
      right: '-12px',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    '& .MuiDataGrid-col-cell .column-separator .icon.separator': {
      color: '#bdc3c7',
    },
    '& .MuiDataGrid-col-cell .column-separator:hover .separator.resizable': {
      cursor: 'col-resize',
      color: 'inherit',
    },
    '&  .MuiDataGrid-col-cell *': {
      maxHeight: '56px',
    },
    '& .MuiDataGrid-col-cell.checkbox-selection-header-cell .checkbox-input': {
      padding: '12px',
    },

    '& .MuiDataGrid-col-cell-wrapper.scroll .MuiDataGrid-col-cell:last-child': {
      borderRight: 'none',
    },

    '&  .data-container': {
      position: 'relative',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    '&  .window': {
      position: 'absolute',
      bottom: '0px',
      left: '0px',
      right: 0,
      overflowX: 'auto',
    },
    '&  .window .viewport': {
      position: 'sticky',
      top: '0px',
      left: '0px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    '&  .window .MuiDataGrid-row': {
      display: 'flex',
      width: 'fit-content',
      backgroundColor: '#fff',

      '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.action.hover,
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
    },
    '&  .window .MuiDataGrid-row.odd': {
      backgroundColor: '#fcfcfc',
    },
    '&  .window  .MuiDataGrid-row.selected': {
      backgroundColor: fade(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    },
    '&  .window  .MuiDataGrid-cell': {
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      padding: theme.spacing(0, 2),
      fontSize: theme.typography.fontSize,
      borderBottom: `1px solid ${borderColor}`,
    },
    '&  .window  .MuiDataGrid-cell.with-renderer': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    '&  .with-border': {
      borderRight: `1px solid ${borderColor}`,
    },
    '& .window .MuiDataGrid-cell.right': {
      textAlign: 'right',
    },
    '& .window .MuiDataGrid-cell.center': {
      textAlign: 'center',
    },
    '&  .window  .MuiDataGrid-cell.checkbox-selection-cell .checkbox-input': {
      padding: '12px',
    },
  };
  return gridStyle;
});
