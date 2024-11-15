import * as React from 'react';
import { ButtonProps } from '@mui/material/Button';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';

export interface GridExportTriggerState {}

export interface GridExportTriggerProps extends ButtonProps {
  exportType: 'csv' | 'excel' | 'print';
  render?: RenderProp<GridExportTriggerState>;
}

const GridExportTrigger = React.forwardRef<HTMLButtonElement, GridExportTriggerProps>(
  function GridExportTrigger(props, ref) {
    const { render, exportType, ...other } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      switch (exportType) {
        case 'csv':
          apiRef.current.exportDataAsCsv();
          break;
        case 'excel':
          // @ts-expect-error Excel export not available in community version
          apiRef.current.exportDataAsExcel();
          break;
        case 'print':
          apiRef.current.exportDataAsPrint();
          break;
        default:
          break;
      }

      props.onClick?.(event);
    };

    const { renderElement } = useGridComponentRenderer({
      render,
      defaultElement: rootProps.slots.baseButton,
      props: {
        ref,
        onClick: handleClick,
        ...rootProps.slotProps?.baseButton,
        ...other,
      },
    });

    return renderElement();
  },
);

export { GridExportTrigger };
