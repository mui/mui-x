export type ViewType = 'week' | 'day' | 'month' | 'agenda';

export interface ViewSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  views?: ViewType[];
}
