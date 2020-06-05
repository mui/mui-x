import React from 'react';
import styled from 'styled-components';
import { GridOptions } from '../../models';

export type DivProps = React.HTMLAttributes<HTMLDivElement>;

export interface GridRootProps {
  options: GridOptions;
}

export const RootStyle = styled.div<GridRootProps>`
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
  &.grid-root {
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue',
      sans-serif;
    border: 1px solid #bdc3c7;
    border-radius: 4px;
    outline: none;
    display: flex;
    flex-direction: column;

    .main-grid-container {
      position: relative;
      flex-grow: 1;
      display: flex;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      padding: 0 16px;
    }
    .row-count {
      display: flex;
      align-items: center;
      font-size: 0.875rem;
      font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
      font-weight: 400;
      line-height: 1.43;
      letter-spacing: 0.01071em;
      min-height: 48px;
    }
    .material-cell:focus,
    .material-col-cell:focus {
      outline: dashed;
      outline-color: black;
      outline-width: 2px;
      outline-offset: -3px;
    }
    .overlay {
      top: ${p => p.options.headerHeight}px;
    }
    .columns-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      overflow-x: hidden;
      overflow-y: hidden;
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid #bdc3c7;
      z-index: 100;

      min-height: ${p => p.options.headerHeight}px;
      max-height: ${p => p.options.headerHeight}px;
      line-height: ${p => p.options.headerHeight}px;

      background-color: #f9f9f9;
      color: #000000;
      font-weight: 600;
      font-size: 12px;

      .material-col-cell-wrapper {
        display: flex;
        width: 100%;
        align-items: center;

        .material-col-cell {
          position: relative;
          display: flex;
          padding: 0 16px;
          border-right: ${p => (p.options.showColumnSeparator ? '1px solid #bdc3c7' : 'none')};

          &.sortable {
            cursor: pointer;
          }

          &.center {
            justify-content: center;
          }

          &.right {
            justify-content: flex-end;
          }

          .title {
            text-transform: capitalize;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          & > .icon,
          .sort-icon > .icon {
            min-height: ${p => p.options.headerHeight}px;
          }
          .column-separator {
            position: absolute;
            right: -12px;
            z-index: 100;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: ${p => p.options.headerHeight}px;

            .icon.separator {
              color: #bdc3c7;
            }
            &:hover .separator.resizable {
              cursor: col-resize;
              color: inherit;
            }
          }
          * {
            max-height: ${p => p.options.headerHeight}px;
          }
          &.checkbox-selection-header-cell .checkbox-input {
            padding: 12px;
          }
        }
        &.scroll .material-col-cell:last-child {
          border-right: none;
        }
      }
    }
    .data-container {
      position: relative;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    .window {
      position: absolute;
      top: ${p => p.options.headerHeight}px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      overflow-y: auto;
      overflow-x: auto;

      .viewport {
        position: sticky;
        top: 0px;
        left: 0px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .material-row {
        display: flex;
        width: fit-content;
        max-height: ${p => p.options.rowHeight}px;
        min-height: ${p => p.options.rowHeight}px;
        background-color: #fff;

        &.even {
          background-color: #fff;
        }

        &.odd {
          background-color: #fcfcfc;
        }

        &:hover {
          cursor: pointer;
          background-color: #4b99ec52;
        }
        &.selected {
          background-color: #4a98ec;
          color: #fff;
        }

        .material-cell {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 16px;
          line-height: ${p => p.options.rowHeight - 1}px; /* 1 = border bottom; */
          max-height: ${p => p.options.rowHeight}px;
          min-height: ${p => p.options.rowHeight}px;
          font-size: 12px;
          border-bottom: 1px solid #bdc3c7;

          &.with-renderer {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          &.with-border {
            border-right: 1px solid #bdc3c7;
          }
          &.right {
            text-align: right;
          }
          &.center {
            text-align: center;
          }
          &.checkbox-selection-cell .checkbox-input {
            padding: 12px;
          }
        }
      }
    }
  }
`;
RootStyle.displayName = 'RootStyle';

export const GridRoot = React.forwardRef<HTMLDivElement, GridRootProps & DivProps>((props, ref) => {
  const { options, children, className, ...rest } = props;
  return (
    <RootStyle ref={ref} className={'material-grid grid-root ' + (className || '')} options={options} {...rest}>
      {children}
    </RootStyle>
  );
});

GridRoot.displayName = 'GridRoot';
