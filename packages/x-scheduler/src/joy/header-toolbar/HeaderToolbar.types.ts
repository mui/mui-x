import { ViewSwitcherProps, ViewType } from './view-switcher/ViewSwitcher.types';

export interface HeaderToolbarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ViewSwitcherProps {
  onTodayClick: () => void;
}
