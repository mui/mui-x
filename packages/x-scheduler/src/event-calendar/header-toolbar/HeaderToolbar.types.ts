export interface HeaderToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Called when the mobile menu button is pressed (small screens only).
   * Opens the side panel drawer.
   */
  onMobileMenuClick?: () => void;
}
