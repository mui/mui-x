import { darken, fade, lighten, makeStyles } from '@material-ui/core/styles';

export const getStyles = makeStyles((theme) => ({
  'MuiDataGrid-root': {
    lineHeight: theme.typography.pxToRem(24),
    'box-sizing': 'border-box',
    position: 'relative',
    'font-family': theme.typography.fontFamily,
    'letter-spacing': theme.typography.body2,
    border: '1px solid #bdc3c7',
    'border-radius': theme.shape.borderRadius,
    outline: 'none',
    display: 'flex',
    flex: 1,
    'flex-direction': 'column',

    '& *': {
      'box-sizing': 'border-box',
    },

    '& .main-grid-container': {
      position: 'relative',
      'flex-grow': 1,
      'flex-direction': 'column',
      display: 'flex',
    },

    '& .watermark': {
      position: 'absolute',
      'pointer-events': 'none',
      color: '#8282829e',
      'z-index': 100000,
      width: '100%',
      'text-align': 'center',
      bottom: '50%',
      right: 0,
      'letter-spacing': '5px',
      'font-size': '24px',
    },

    '& .footer': {
      display: 'flex',
      'justify-content': 'space-between',
      'flex-direction': 'row',
      padding: theme.spacing(0, 2),
    },

    '& .row-count, & .selected-row-count': {
      display: 'flex',
      'align-items': 'center',
      'font-size': '0.875rem',
      'font-weight': theme.typography.fontWeightMedium,
      'line-height': 1.43,
      'min-height': '48px',
    },
    '@media (max-width: 650px)': {
      '&  .row-count, &  .selected-row-count': {
        display: 'none',
      },
    },

    '&  .material-cell:focus, &  .material-col-cell:focus': {
      outline: 'dotted',
      'outline-color': '#000',
      'outline-width': '2px',
      'outline-offset': '-3px',
    },
    '&  .overlay': {
      display: 'flex',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: '15px',
      'align-self': 'center',
      'align-items': 'center',
      'z-index': 10,
    },
    '&  .overlay .content': {
      flex: 1,
      display: 'flex',
      'justify-content': 'center',
    },

    '&  .columns-container': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      'overflow-x': 'hidden',
      'overflow-y': 'hidden',
      display: 'flex',
      'flex-direction': 'column',
      'border-bottom': '1px solid',
      'border-color':
        theme.palette.type === 'light'
          ? lighten(fade(theme.palette.divider, 1), 0.88)
          : darken(fade(theme.palette.divider, 1), 0.68),
      'z-index': 100,
      'background-color': '#f9f9f9',
      color: theme.palette.text.primary,
      'font-weight': theme.typography.fontWeightBold,
      'font-size': theme.typography.fontSize,
    },
    '&  .columns-container .material-col-cell-wrapper': {
      display: 'flex',
      width: '100%',
      'align-items': 'center',
    },
    '&  .material-col-cell': {
      position: 'relative',
      display: 'flex',
      padding: '0 16px',
    },
    '&  .material-col-cell.sortable': {
      cursor: 'pointer',
    },

    '&  .material-col-cell.center': {
      'justify-content': 'center',
    },

    '&  .material-col-cell.right': {
      'justify-content': 'flex-end',
    },

    '& .material-col-cell .title': {
      'text-overflow': 'ellipsis',
      overflow: 'hidden',
      'white-space': 'nowrap',
    },
    '& .material-col-cell .column-separator': {
      position: 'absolute',
      right: '-12px',
      'z-index': 100,
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
    },
    '& .material-col-cell .column-separator .icon.separator': {
      color: '#bdc3c7',
    },
    '& .material-col-cell .column-separator:hover .separator.resizable': {
      cursor: 'col-resize',
      color: 'inherit',
    },
    '&  .material-col-cell *': {
      'max-height': '56px',
    },
    '& .material-col-cell.checkbox-selection-header-cell .checkbox-input': {
      padding: '12px',
    },

    '& .material-col-cell-wrapper.scroll .material-col-cell:last-child': {
      'border-right': 'none',
    },

    '&  .data-container': {
      position: 'relative',
      'flex-grow': 1,
      display: 'flex',
      'flex-direction': 'column',
    },
    '&  .window': {
      position: 'absolute',
      bottom: '0px',
      left: '0px',
      right: 0,
      'overflow-x': 'auto',
    },
    '&  .window .viewport': {
      position: 'sticky',
      top: '0px',
      left: '0px',
      display: 'flex',
      'flex-direction': 'column',
      overflow: 'hidden',
    },
    '&  .window .material-row': {
      display: 'flex',
      width: 'fit-content',
      'background-color': '#fff',

      '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.action.hover,
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
    },
    '&  .window .material-row.odd': {
      'background-color': '#fcfcfc',
    },
    '&  .window  .material-row.selected': {
      backgroundColor: fade(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    },

    '&  .window  .material-cell': {
      display: 'block',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
      padding: theme.spacing(0, 2),
      'font-size': theme.typography.fontSize,
      'border-bottom': '1px solid',
      'border-color':
        theme.palette.type === 'light'
          ? lighten(fade(theme.palette.divider, 1), 0.88)
          : darken(fade(theme.palette.divider, 1), 0.68),
    },
    '&  .window  .material-cell.with-renderer': {
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
    },
    '&  .with-border': {
      'border-right': '1px solid',
      'border-color':
        theme.palette.type === 'light'
          ? lighten(fade(theme.palette.divider, 1), 0.88)
          : darken(fade(theme.palette.divider, 1), 0.68),
    },
    '& .window .material-cell.right': {
      'text-align': 'right',
    },
    '& .window .material-cell.center': {
      'text-align': 'center',
    },
    '&  .window  .material-cell.checkbox-selection-cell .checkbox-input': {
      padding: '12px',
    },
  },
}));
