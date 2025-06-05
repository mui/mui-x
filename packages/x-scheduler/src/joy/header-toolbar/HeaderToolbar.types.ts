import { ViewSwitcherProps } from './view-switcher/ViewSwitcher.types';

export interface HeaderToolbarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ViewSwitcherProps {
  onTodayClick: () => void;
}
