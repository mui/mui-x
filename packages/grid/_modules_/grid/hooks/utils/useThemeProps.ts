import { getThemeProps } from '@material-ui/styles';
import { useTheme } from '@material-ui/core/styles';

export function useThemeProps({ props: inputProps, name }) {
  const props = { ...inputProps };

  const contextTheme: any = useTheme();

  const more = getThemeProps({ theme: contextTheme, name, props });

  const theme = more.theme || contextTheme;
  const isRtl = theme.direction === 'rtl';
  console.log(more)
  return {
    theme,
    isRtl,
    ...more,
  };
}
