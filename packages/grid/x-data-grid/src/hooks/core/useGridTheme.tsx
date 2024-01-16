import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { GridPrivateApiCommon } from '../../models/api/gridApiCommon';

export const useGridTheme = (apiRef: React.MutableRefObject<GridPrivateApiCommon>): void => {
  const theme = useTheme();

  if (!apiRef.current.state.theme) {
    apiRef.current.state.theme = theme;
  }

  const isFirstEffect = React.useRef(true);
  React.useEffect(() => {
    if (isFirstEffect.current) {
      isFirstEffect.current = false;
    } else {
      apiRef.current.setState((state) => ({ ...state, theme }));
    }
  }, [apiRef, theme]);
};
