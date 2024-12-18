export type BadgeProps = {
  badgeContent?: React.ReactNode;
  children: React.ReactNode;
  color?: 'primary' | 'default' | 'error';
  overlap?: 'circular';
  variant?: 'dot';
  invisible?: boolean;
};

export type DividerProps = {};

export type MenuItemProps = {
  autoFocus?: boolean;
  children: React.ReactNode;
  /** For items that aren't interactive themselves (but may contain an interactive widget) */
  inert?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  selected?: boolean;
  value?: number | string | readonly string[];
};
