import * as React from 'react';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridComponentRenderer, RenderProp } from '../../hooks/utils/useGridComponentRenderer';
import type { GridSlotProps } from '../../models';
import { QuickFilterState, useQuickFilterContext } from './QuickFilterContext';

export type QuickFilterTriggerProps = Omit<GridSlotProps['baseButton'], 'className'> & {
  /**
   * A function to customize rendering of the component.
   */
  render?: RenderProp<GridSlotProps['baseButton'], QuickFilterState>;
  /**
   * Override or extend the styles applied to the component.
   */
  className?: string | ((state: QuickFilterState) => string);
};

/**
 * A button that opens the quick filter.
 * It renders the `baseButton` slot.
 *
 * Demos:
 *
 * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
 *
 * API:
 *
 * - [QuickFilterTrigger API](https://mui.com/x/api/data-grid/quick-filter-trigger/)
 */
const QuickFilterTrigger = forwardRef<HTMLButtonElement, QuickFilterTriggerProps>(
  function QuickFilterTrigger(props, ref) {
    const { render, className, ...other } = props;
    const rootProps = useGridRootProps();
    const { state, onExpandedChange, triggerRef } = useQuickFilterContext();
    const resolvedClassName = typeof className === 'function' ? className(state) : className;
    const handleRef = useForkRef(triggerRef, ref);

    const isFirstRender = React.useRef(true);
    React.useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
      } else if (!state.expanded) {
        triggerRef.current?.focus();
      }
    }, [state.expanded, triggerRef]);

    const element = useGridComponentRenderer(
      rootProps.slots.baseButton,
      render,
      {
        ...rootProps.slotProps?.baseButton,
        onClick: () => onExpandedChange(!state.expanded),
        className: resolvedClassName,
        ...other,
        ref: handleRef,
      },
      state,
    );

    if (state.expanded) {
      return null;
    }

    return <React.Fragment>{element}</React.Fragment>;
  },
);

export { QuickFilterTrigger };
