import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';

export function useMounted(defer = false) {
  const [mountedState, setMountedState] = React.useState(false);

  useEnhancedEffect(() => {
    if (!defer) {
      setMountedState(true);
    }
  }, [defer]);

  React.useEffect(() => {
    if (defer) {
      setMountedState(true);
    }
  }, [defer]);

  return mountedState;
}
