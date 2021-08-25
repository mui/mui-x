import * as React from 'react';
import ownerDocument from '@material-ui/core/utils/ownerDocument';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { GridPrintExportApi } from '../../../models/api/gridPrintExportApi';
import { useLogger } from '../../utils/useLogger';


export const useGridPrintExport = (apiRef: GridApiRef): void => {
  const logger = useLogger('useGridPrintExport');

  const exportDataAsPrint = React.useCallback(
    (): void => {
      logger.debug(`Export data as Print`);

      const gridElement = apiRef!.current.rootElementRef!.current;
      console.log(gridElement);
      const iframe = document.createElement('iframe');
      iframe.style.height = '0';
      iframe.style.width = '0';
      iframe.style.position = 'absolute';
      gridElement!.appendChild(iframe);
      iframe.contentWindow!.document.open();
      iframe.contentWindow!.document.write(gridElement!.innerHTML);
      iframe.contentWindow!.document.close();
      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();
      gridElement!.removeChild(iframe);
    },
    [logger, apiRef],
  );

  const printExportApi: GridPrintExportApi = {
    exportDataAsPrint,
  };

  useGridApiMethod(apiRef, printExportApi, 'GridPrintExportApi');
};
