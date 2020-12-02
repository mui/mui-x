import { darken, fade, lighten, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  (theme: Theme) => {
    const borderColor =
      theme.palette.type === 'light'
        ? lighten(fade(theme.palette.divider, 1), 0.88)
        : darken(fade(theme.palette.divider, 1), 0.68);

    const gridStyle: { root: any } = {
      root: {
        flex: 1,
        boxSizing: 'border-box',
        position: 'relative',
        border: `1px solid ${borderColor}`,
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.text.primary,
        ...theme.typography.body2,
        outline: 'none',
        display: 'flex',
        flexDirection: 'column',
        '& *, & *::before, & *::after': {
          boxSizing: 'inherit',
        },
        '& .MuiDataGrid-mainGridContainer': {
          position: 'relative',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        },
        '& .MuiDataGrid-overlay': {
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          backgroundColor: fade(
            theme.palette.background.default,
            theme.palette.action.disabledOpacity,
          ),
        },
        '& .MuiDataGrid-toolbar': {
          display: 'flex',
          alignItems: 'center',
          padding: '4px 4px 0',
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
        },
        '& .MuiDataGrid-scrollArea': {
          position: 'absolute',
          top: 0,
          zIndex: 101,
          width: 20,
          bottom: 0,
        },
        '& .MuiDataGrid-scrollArea-left': {
          left: 0,
        },
        '& .MuiDataGrid-scrollArea-right': {
          right: 0,
        },
        '& .MuiDataGrid-colCellWrapper': {
          display: 'flex',
          width: '100%',
          alignItems: 'center',
        },
        '& .MuiDataGrid-colCell, & .MuiDataGrid-cell': {
          WebkitTapHighlightColor: 'transparent',
          lineHeight: null,
          padding: theme.spacing(0, 2),
        },
        '& .MuiDataGrid-colCell:focus, & .MuiDataGrid-cell:focus': {
          outline: 'dotted',
          outlineWidth: 1,
          outlineOffset: -2,
        },
        '& .MuiDataGrid-colCellCheckbox, & .MuiDataGrid-cellCheckbox': {
          padding: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        '& .MuiDataGrid-colCell': {
          position: 'relative',
          display: 'flex',
        },
        '& .MuiDataGrid-colCellTitleContainer': {
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          display: 'inline-flex',
          flex: 1,
        },
        '& .MuiDataGrid-colCellNumeric .MuiDataGrid-iconButtonContainer': {
          paddingRight: 5,
        },
        '& .MuiDataGrid-colCellSortable': {
          cursor: 'pointer',
        },
        '& .MuiDataGrid-sortIcon': {
          fontSize: 18,
        },
        '& .MuiDataGrid-colCellCenter .MuiDataGrid-colCellTitleContainer': {
          justifyContent: 'center',
        },
        '& .MuiDataGrid-colCellRight .MuiDataGrid-colCellTitleContainer': {
          justifyContent: 'flex-end',
        },
        '& .MuiDataGrid-colCellTitle': {
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontWeight: theme.typography.fontWeightMedium,
        },
        '& .MuiDataGrid-colCellMoving': {
          backgroundColor: theme.palette.action.hover,
        },
        '& .MuiDataGrid-columnSeparator': {
          position: 'absolute',
          right: -12,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: borderColor,
        },
        '& .MuiDataGrid-columnSeparatorResizable': {
          cursor: 'col-resize',
          touchAction: 'none',
          '&:hover': {
            color: theme.palette.text.primary,
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              color: borderColor,
            },
          },
          '&.Mui-resizing': {
            color: theme.palette.text.primary,
          },
        },
        '& .MuiDataGrid-iconSeparator': {
          color: 'inherit',
        },
        '& .MuiDataGrid-menuIcon': {
          visibility: 'hidden',
          fontSize: 20,
          marginRight: -6,
          display: 'flex',
          alignItems: 'center',
        },
        '& .MuiDataGrid-colCell:hover .MuiDataGrid-menuIcon, .MuiDataGrid-menuOpen': {
          visibility: 'visible',
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
            backgroundColor: theme.palette.action.hover,
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              backgroundColor: 'transparent',
            },
          },
          '&.Mui-selected': {
            backgroundColor: fade(theme.palette.primary.main, theme.palette.action.selectedOpacity),
            '&:hover': {
              backgroundColor: fade(
                theme.palette.primary.main,
                theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity,
              ),
              // Reset on touch devices, it doesn't add specificity
              '@media (hover: none)': {
                backgroundColor: fade(
                  theme.palette.primary.main,
                  theme.palette.action.selectedOpacity,
                ),
              },
            },
          },
        },
        '& .MuiDataGrid-cell': {
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          borderBottom: `1px solid ${borderColor}`,
        },
        // The very last cell
        '& .MuiDataGrid-colCellWrapper .MuiDataGrid-cell': {
          borderBottom: 'none',
        },
        '& .MuiDataGrid-cellWithRenderer': {
          display: 'flex',
          alignItems: 'center',
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
        '& .MuiDataGrid-rowCount, & .MuiDataGrid-selectedRowCount': {
          alignItems: 'center',
          display: 'flex',
          margin: theme.spacing(0, 2),
        },
        '& .MuiDataGrid-footer': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: 52, // Match TablePagination min height
          '&.MuiDataGrid-footer-paginationAvailable': {
            '& .MuiDataGrid-rowCount, & .MuiDataGrid-selectedRowCount': {
              visibility: 'hidden',
              [theme.breakpoints.up('md')]: {
                visibility: 'visible',
              },
            },
          },
          '&.MuiDataGrid-footer-justifyContentEnd': {
            justifyContent: 'flex-end',
          },
        },
        '& .MuiDataGrid-colCell-dropZone .MuiDataGrid-colCell-draggable': {
          cursor: 'move',
        },
        '& .MuiDataGrid-colCell-draggable': {
          display: 'flex',
          width: '100%',
          justifyContent: 'inherit',
        },
        '& .MuiDataGrid-colCell-dragging': {
          background: theme.palette.background.paper,
          padding: '0 12px',
          borderRadius: theme.shape.borderRadius,
          opacity: theme.palette.action.disabledOpacity,
        },
      },
    };

    if (theme.palette.type === 'dark') {
      // Values coming from mac OS.
      const track = '#202022';
      const thumb = '#585859';
      const active = '#838384';

      // We style the scroll bar for dark mode.
      gridStyle.root = {
        ...gridStyle.root,
        scrollbarColor: `${thumb} ${track}`,
        '& *::-webkit-scrollbar': {
          backgroundColor: track,
        },
        '& *::-webkit-scrollbar-thumb': {
          borderRadius: 8,
          backgroundColor: thumb,
          minHeight: 24,
          border: `3px solid ${track}`,
        },
        '& *::-webkit-scrollbar-thumb:focus': {
          backgroundColor: active,
        },
        '& *::-webkit-scrollbar-thumb:active': {
          backgroundColor: active,
        },
        '& *::-webkit-scrollbar-thumb:hover': {
          backgroundColor: active,
        },
        '& *::-webkit-scrollbar-corner': {
          backgroundColor: track,
        },
      };
    }
    return gridStyle;
  },
  { name: 'MuiDataGrid' },
);
