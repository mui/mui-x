import { ViewType } from './view-switcher/ViewSwitcher.types';

export interface HeaderToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  views?: ViewType[];
  onTodayClick: () => void;
}
