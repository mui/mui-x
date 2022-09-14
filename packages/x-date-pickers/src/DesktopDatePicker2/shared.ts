import { useThemeProps } from '@mui/material/styles';
import { DefaultizedProps } from '@mui/x-date-pickers/internals';
import { DesktopDatePicker2Props } from './DesktopDatePicker2.types';

export function useDatePicker2DefaultizedProps<
  TDate,
  // TODO: Reduce the extension scope.
  Props extends DesktopDatePicker2Props<TDate>,
>(props: Props, name: string): DefaultizedProps<Props, 'openTo' | 'views'> {
  const themeProps = useThemeProps({
    props,
    name,
  });

  const views = themeProps.views ?? ['year', 'day'];

  return {
    openTo: 'day',
    ...themeProps,
    views,
  };
}
