import * as React from 'react';
import { ApiRef } from '../../../models/api/apiRef';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { useGridState } from '../core/useGridState';

export const useColumnMenu = (apiRef: ApiRef): void => {
  const logger = useLogger('useColumnMenu');
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const showColumnMenu = React.useCallback(
    (field: string) => {
      logger.debug('Opening Column Menu');
      setGridState((state) => ({
        ...state,
        columnMenu: { open: true, field },
      }));
      apiRef.current.hidePreferences();
      forceUpdate();
    },
    [apiRef, forceUpdate, logger, setGridState],
  );

  const hideColumnMenu = React.useCallback(() => {
    logger.debug('Hiding Column Menu');
    setGridState((state) => ({
      ...state,
      columnMenu: { ...state.columnMenu, open: false },
    }));
    forceUpdate();
  }, [forceUpdate, logger, setGridState]);

  useApiMethod(
    apiRef,
    {
      showColumnMenu,
      hideColumnMenu,
    },
    'ColumnMenuApi',
  );
};
