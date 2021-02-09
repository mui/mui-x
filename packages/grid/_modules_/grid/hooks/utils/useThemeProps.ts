import { getThemeProps } from '@material-ui/styles';
import { useTheme } from '@material-ui/core/styles';

// TODO: To be removed once we migrate to v5
export function useThemeProps({ props: inputProps, name }) {
  const props = { ...inputProps };

  const contextTheme: any = useTheme();

  const more = getThemeProps({ theme: contextTheme, name, props });

  const theme = more.theme || contextTheme;
  const isRtl = theme.direction === 'rtl';

  return {
    theme,
    isRtl,
    ...more,
  };
}
