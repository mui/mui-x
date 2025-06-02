export type ViewType = 'week' | 'day' | 'month' | 'agenda';

export interface ViewSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  setSelectedView: (view: ViewType) => void;
  selectedView: ViewType;
  views?: ViewType[];
}
