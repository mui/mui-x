import { ViewType } from '../../models/views';

export interface ViewSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  setSelectedView: (view: ViewType) => void;
  selectedView: ViewType;
  views?: ViewType[];
}
