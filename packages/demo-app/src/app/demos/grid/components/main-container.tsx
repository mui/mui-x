import styled from 'styled-components';

export const MainContainer = styled.div`
  position: relative;
  flex-grow: 1;
  box-sizing: border-box;

  .ag-theme-balham .ag-row-hover {
    background-color: ${p => p.theme.colors.app} !important;
    color: ${p => p.theme.colors.secondApp} !important;
  }
  .ag-theme-balham .ag-header {
    background-color: ${p => p.theme.colors.grid.headerBackground} !important;
    color: ${p => p.theme.colors.grid.headerTitle} !important;
  }
  .ag-theme-balham .ag-root {
    border: none !important;
  }
  .grid-root {
    &.material-grid {
      .columns-container {
        background-color: ${p => p.theme.colors.grid.headerBackground};
        color: ${p => p.theme.colors.grid.headerTitle};
        border-top: none;

        .material-col-cell-wrapper .material-col-cell {
          border-right-color: ${p => p.theme.colors.grid.headerBorderRight};
        }
      }
      .window {
        .material-row {
          color: ${p => p.theme.colors.grid.rowColor};
          &.odd {
            background-color: ${p => p.theme.colors.grid.oddRowBackground};
          }
          &.even {
            background-color: ${p => p.theme.colors.grid.evenRowBackground};
          }
          .material-cell {
            border-right: none;
            border-bottom-color: #bdc3c773;
          }
          &:hover {
            background-color: ${p => p.theme.colors.grid.rowHoverBackground};
            color: ${p => p.theme.colors.grid.rowHoverColor};
          }
          &.selected {
            background-color: ${p => p.theme.colors.grid.rowSelectedBackground};
            color: ${p => p.theme.colors.grid.rowSelectedColor};
          }
        }
      }
    }
  }
  .splitter-panel {
    background-color: #cecece4f !important;
    color: rgb(53, 54, 58);

    .material-grid .columns-container,
    .ag-header {
      border-top: 1px solid ${p => p.theme.colors.app} !important;
    }
    .grid-title .grid-logo.mui {
      margin: 5px;
    }
  }
  .splitter-handler-wrapper {
    border-right: 2px solid #2c2e2f !important;
  }

  .grid-title {
    background-color: ${p => p.theme.colors.background};
    color: ${p => p.theme.colors.secondTitle};
  }
`;

MainContainer.displayName = 'MainContainer';
