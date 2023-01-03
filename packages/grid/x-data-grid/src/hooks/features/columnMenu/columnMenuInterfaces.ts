import * as React from 'react';

export interface GridColumnMenuState {
  open: boolean;
  field?: string;
}

export interface GridColumnMenuComponentProps {
  /**
   * Every item has a `displayOrder` based which it will be placed before or after other
   * items in the column menu, `array.prototype.sort` is applied to sort the items.
   * Note: If same `displayOrder` is applied to two or more items they will be sorted
   * based on the definition order
   * @default 100
   */
  displayOrder?: number;
  [key: string]: any;
}

export interface GridColumnMenuRootProps {
  /**
   * Initial `components` - it is internal, to be overrriden by Pro or Premium packages
   * @ignore - do not document.
   */
  defaultComponents: { [key: string]: React.JSXElementConstructor<any> };
  /**
   * Initial `componentsProps` - it is internal, to be overrriden by Pro or Premium packages
   * @ignore - do not document.
   */
  defaultComponentsProps: { [key: string]: GridColumnMenuComponentProps };
  /**
   * `components` could be used to add new and (or) override default column menu items
   * If you register a nee component you must pass it's `displayOrder` in `componentsProps`
   * or it will be placed in the end of the list
   */
  components?: { [key: string]: React.JSXElementConstructor<any> | null };
  /**
   * Could be used to pass new props or override props specific to a column menu component
   * e.g. `displayOrder`
   */
  componentsProps?: { [key: string]: GridColumnMenuComponentProps };
}
