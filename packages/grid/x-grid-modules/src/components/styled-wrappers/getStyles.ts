import { makeStyles } from '@material-ui/core/styles';

export const getStyles = makeStyles({
  gridRoot: {
    'box-sizing': 'border-box',
    position: 'relative',
    'font-family': `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif`,
    border: '1px solid #bdc3c7',
    'border-radius': '4px',
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
      padding: '0 16px',
    },

    '& .row-count, & .selected-row-count': {
      display: 'flex',
      'align-items': 'center',
      'font-size': '0.875rem',
      'font-family': `'Roboto', 'Helvetica', 'Arial', sans-serif`,
      'font-weight': 400,
      'line-height': 1.43,
      'letter-spacing': '0.01071em',
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
      'border-bottom': '1px solid #bdc3c7',
      'z-index': 100,
      'background-color': '#f9f9f9',
      color: '#000000',
      'font-weight': 600,
      'font-size': '12px',
    },
    '&  .columns-container .material-col-cell-wrapper': {
      display: 'flex',
      width: '100%',
      'align-items': 'center',
    },
    '&  .columns-container .material-col-cell-wrapper .material-col-cell': {
      position: 'relative',
      display: 'flex',
      padding: '0 16px',
    },
    '&  .columns-container .material-col-cell-wrapper .material-col-cell.sortable': {
      cursor: 'pointer',
    },

    '&   .columns-container .material-col-cell-wrapper .material-col-cell.center': {
      'justify-content': 'center',
    },

    '&   .columns-container .material-col-cell-wrapper .material-col-cell.right': {
      'justify-content': 'flex-end',
    },

    '&  .columns-container .material-col-cell-wrapper  .material-col-cell .title': {
      'text-transform': 'capitalize',
      'text-overflow': 'ellipsis',
      overflow: 'hidden',
      'white-space': 'nowrap',
    },
    '&   .columns-container .material-col-cell-wrapper .material-col-cell .column-separator': {
      position: 'absolute',
      right: '-12px',
      'z-index': 100,
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
    },
    '&   .columns-container .material-col-cell-wrapper .material-col-cell .column-separator .icon.separator': {
      color: '#bdc3c7',
    },
    '&   .columns-container .material-col-cell-wrapper .material-col-cell .column-separator:hover .separator.resizable': {
      cursor: 'col-resize',
      color: 'inherit',
    },
    '&   .columns-container .material-col-cell-wrapper .material-col-cell *': {
      'max-height': '56px',
    },
    '&   .columns-container .material-col-cell-wrapper .material-col-cell.checkbox-selection-header-cell .checkbox-input': {
      padding: '12px',
    },

    '&   .columns-container .material-col-cell-wrapper .material-col-cell-wrapper.scroll .material-col-cell:last-child': {
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
    },
    '&  .window .material-row.even': {
      'background-color': '#fff',
    },

    '&  .window .material-row.odd': {
      'background-color': '#fcfcfc',
    },

    '&  .window .material-row:hover': {
      cursor: 'pointer',
      'background-color': '#4b99ec52',
    },
    '&  .window  .material-row.selected': {
      'background-color': '#4a98ec',
      color: '#fff',
    },

    '&  .window  .material-cell': {
      display: 'block',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
      padding: '0 16px',
      'font-size': '12px',
      'border-bottom': '1px solid #bdc3c7',
    },
    '&  .window  .material-cell.with-renderer': {
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
    },
    '&  .with-border': {
      'border-right': '1px solid #bdc3c7',
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
});
