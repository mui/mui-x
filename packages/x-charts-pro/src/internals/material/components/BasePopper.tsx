import * as React from 'react';
import Popper, { type PopperProps } from '@mui/material/Popper';
import MUIFocusTrap from '@mui/material/Unstable_TrapFocus';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import { type ChartBasePopperProps } from '../../slots/chartBaseSlotProps';

function clickAwayWrapper(props: ChartBasePopperProps, content: any) {
  if (props.onClickAway === undefined) {
    return content;
  }
  return (
    <ClickAwayListener
      onClickAway={props.onClickAway as any}
      touchEvent={props.clickAwayTouchEvent}
      mouseEvent={props.clickAwayMouseEvent}
    >
      {content}
    </ClickAwayListener>
  );
}

function focusTrapWrapper(props: ChartBasePopperProps, content: any) {
  if (props.focusTrap === undefined) {
    return content;
  }
  return (
    <MUIFocusTrap open disableEnforceFocus disableAutoFocus>
      <div tabIndex={-1}>{content}</div>
    </MUIFocusTrap>
  );
}

function wrappers(props: ChartBasePopperProps, content: any) {
  return focusTrapWrapper(props, clickAwayWrapper(props, content));
}

const transformOrigin = {
  'bottom-start': 'top left',
  'bottom-end': 'top right',
};

export function BasePopper(props: ChartBasePopperProps) {
  const {
    ref,
    open,
    children,
    className,
    clickAwayTouchEvent,
    clickAwayMouseEvent,
    flip,
    focusTrap,
    onExited,
    onClickAway,
    onDidShow,
    onDidHide,
    id,
    target,
    transition,
    placement,
    ...other
  } = props;

  const modifiers = React.useMemo(() => {
    const result: PopperProps['modifiers'] = [
      {
        name: 'preventOverflow',
        options: {
          padding: 8,
        },
      },
    ];
    if (flip) {
      result.push({
        name: 'flip',
        enabled: true,
        options: {
          rootBoundary: 'document',
        },
      });
    }
    if (onDidShow || onDidHide) {
      result.push({
        name: 'isPlaced',
        enabled: true,
        phase: 'main' as const,
        fn: () => {
          onDidShow?.();
        },
        effect: () => () => {
          onDidHide?.();
        },
      });
    }
    return result;
  }, [flip, onDidShow, onDidHide]);

  let content: any;
  if (!transition) {
    content = wrappers(props, children);
  } else {
    const handleExited = (popperOnExited: (() => void) | undefined) => (node: HTMLElement) => {
      if (popperOnExited) {
        popperOnExited();
      }

      if (onExited) {
        onExited(node);
      }
    };

    content = (p: any) =>
      wrappers(
        props,
        <Grow
          {...p.TransitionProps}
          style={{ transformOrigin: transformOrigin[p.placement as keyof typeof transformOrigin] }}
          onExited={handleExited(p.TransitionProps?.onExited)}
        >
          <Paper>{children}</Paper>
        </Grow>,
      );
  }

  return (
    <Popper
      id={id}
      className={className}
      open={open}
      anchorEl={target as any}
      transition={transition}
      placement={placement}
      modifiers={modifiers}
      {...other}
    >
      {content}
    </Popper>
  );
}
