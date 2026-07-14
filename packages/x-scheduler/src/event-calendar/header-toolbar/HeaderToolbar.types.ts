export interface HeaderToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Called when the compact menu button is pressed (compact layout only).
   * Opens the side panel drawer.
   */
  onCompactMenuClick?: () => void;
}
