import { useTheme } from '@mui/material/styles';

export const useIsRTL = () => {
  const theme = useTheme();
  return theme.direction === 'rtl';
};
