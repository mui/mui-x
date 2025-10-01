export interface DateNavigatorProps extends React.HTMLAttributes<HTMLDivElement> {
  isSidePanelOpen: boolean;
  setIsSidePanelOpen: (open: boolean) => void;
}
