import * as React from 'react';
import { useSlotProps, SlotComponentProps } from '@mui/base/utils';
import Grow from '@mui/material/Grow';
import MuiPaper, { PaperProps as MuiPaperProps } from '@mui/material/Paper';
import MuiPopper, {
  PopperProps as MuiPopperProps,
  PopperPlacementType,
} from '@mui/material/Popper';
import MuiTrapFocus, {
  TrapFocusProps as MuiTrapFocusProps,
} from '@mui/material/Unstable_TrapFocus';
import {
  unstable_useForkRef as useForkRef,
  unstable_useEventCallback as useEventCallback,
  unstable_ownerDocument as ownerDocument,
  unstable_composeClasses as composeClasses,
} from '@mui/utils';
import { styled, useThemeProps } from '@mui/material/styles';
import { TransitionProps as MuiTransitionProps } from '@mui/material/transitions';
import { getPickersPopperUtilityClass, PickersPopperClasses } from './pickersPopperClasses';
import { getActiveElement } from '../utils/utils';
import { UncapitalizeObjectKeys } from '../utils/slots-migration';
import { UsePickerValueActions } from '../hooks/usePicker/usePickerValue.types';

export interface PickersPopperSlotsComponent {
  /**
   * Custom component for the paper rendered inside the desktop picker's Popper.
   * @default PickersPopperPaper
   */
  DesktopPaper?: React.JSXElementConstructor<MuiPaperProps>;
  /**
   * Custom component for the desktop popper [Transition](https://mui.com/material-ui/transitions/).
   * @default Grow from @mui/material
   */
  DesktopTransition?: React.JSXElementConstructor<MuiTransitionProps>;
  /**
   * Custom component for trapping the focus inside the views on desktop.
   * @default TrapFocus from @mui/material
   */
  DesktopTrapFocus?: React.JSXElementConstructor<MuiTrapFocusProps>;
  /**
   * Custom component for the popper inside which the views are rendered on desktop.
   * @default Popper from @mui/material
   */
  Popper?: React.ElementType<MuiPopperProps>;
}

export interface PickersPopperSlotsComponentsProps {
  /**
   * Props passed down to the desktop [Paper](https://mui.com/material-ui/api/paper/) component.
   */
  desktopPaper?: SlotComponentProps<
    typeof MuiPaper,
    {},
    PickerPopperProps & { placement: PopperPlacementType | undefined }
  >;
  /**
   * Props passed down to the desktop [Transition](https://mui.com/material-ui/transitions/) component.
   */
  desktopTransition?: Partial<MuiTransitionProps>;
  /**
   * Props passed down to the [TrapFocus](https://mui.com/base/react-focus-trap/) component on desktop.
   */
  desktopTrapFocus?: Partial<MuiTrapFocusProps>;
  /**
   * Props passed down to [Popper](https://mui.com/material-ui/api/popper/) component.
   */
  popper?: SlotComponentProps<typeof MuiPopper, {}, PickerPopperProps>;
}

export interface PickerPopperProps extends UsePickerValueActions {
  role: 'tooltip' | 'dialog';
  anchorEl: MuiPopperProps['anchorEl'];
  open: MuiPopperProps['open'];
  placement?: MuiPopperProps['placement'];
  containerRef?: React.Ref<HTMLDivElement>;
  children?: React.ReactNode;
  onBlur?: () => void;
  slots?: UncapitalizeObjectKeys<PickersPopperSlotsComponent>;
  slotProps?: PickersPopperSlotsComponentsProps;
  classes?: Partial<PickersPopperClasses>;
  shouldRestoreFocus?: () => boolean;
}

const useUtilityClasses = (ownerState: PickerPopperProps) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
    paper: ['paper'],
  };

  return composeClasses(slots, getPickersPopperUtilityClass, classes);
};

const PickersPopperRoot = styled(MuiPopper, {
  name: 'MuiPickersPopper',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  zIndex: theme.zIndex.modal,
}));

const PickersPopperPaper = styled(MuiPaper, {
  name: 'MuiPickersPopper',
  slot: 'Paper',
  overridesResolver: (_, styles) => styles.paper,
})<{
  ownerState: PickerPopperProps & Pick<MuiPopperProps, 'placement'>;
}>(({ ownerState }) => ({
  transformOrigin: 'top center',
  outline: 0,
  ...(ownerState.placement === 'top' && {
    transformOrigin: 'bottom center',
  }),
}));

function clickedRootScrollbar(event: MouseEvent, doc: Document) {
  return (
    doc.documentElement.clientWidth < event.clientX ||
    doc.documentElement.clientHeight < event.clientY
  );
}

type OnClickAway = (event: MouseEvent | TouchEvent) => void;

/**
 * Based on @mui/material/ClickAwayListener without the customization.
 * We can probably strip away even more since children won't be portaled.
 * @param {boolean} active Only listen to clicks when the popper is opened.
 * @param {(event: MouseEvent | TouchEvent) => void} onClickAway The callback to call when clicking outside the popper.
 * @returns {Array} The ref and event handler to listen to the outside clicks.
 */
function useClickAwayListener(
  active: boolean,
  onClickAway: OnClickAway,
): [React.Ref<Element>, React.MouseEventHandler, React.TouchEventHandler] {
  const movedRef = React.useRef(false);
  const syntheticEventRef = React.useRef(false);

  const nodeRef = React.useRef<Element>(null);

  const activatedRef = React.useRef(false);
  React.useEffect(() => {
    if (!active) {
      return undefined;
    }

    // Ensure that this hook is not "activated" synchronously.
    // https://github.com/facebook/react/issues/20074
    function armClickAwayListener() {
      activatedRef.current = true;
    }

    document.addEventListener('mousedown', armClickAwayListener, true);
    document.addEventListener('touchstart', armClickAwayListener, true);

    return () => {
      document.removeEventListener('mousedown', armClickAwayListener, true);
      document.removeEventListener('touchstart', armClickAwayListener, true);
      activatedRef.current = false;
    };
  }, [active]);

  // The handler doesn't take event.defaultPrevented into account:
  //
  // event.preventDefault() is meant to stop default behaviors like
  // clicking a checkbox to check it, hitting a button to submit a form,
  // and hitting left arrow to move the cursor in a text input etc.
  // Only special HTML elements have these default behaviors.
  const handleClickAway = useEventCallback((event: MouseEvent | TouchEvent) => {
    if (!activatedRef.current) {
      return;
    }

    // Given developers can stop the propagation of the synthetic event,
    // we can only be confident with a positive value.
    const insideReactTree = syntheticEventRef.current;
    syntheticEventRef.current = false;

    const doc = ownerDocument(nodeRef.current);

    // 1. IE11 support, which trigger the handleClickAway even after the unbind
    // 2. The child might render null.
    // 3. Behave like a blur listener.
    if (
      !nodeRef.current ||
      // is a TouchEvent?
      ('clientX' in event && clickedRootScrollbar(event, doc))
    ) {
      return;
    }

    // Do not act if user performed touchmove
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }

    let insideDOM;

    // If not enough, can use https://github.com/DieterHolvoet/event-propagation-path/blob/master/propagationPath.js
    if (event.composedPath) {
      insideDOM = event.composedPath().indexOf(nodeRef.current) > -1;
    } else {
      insideDOM =
        !doc.documentElement.contains(event.target as Node | null) ||
        nodeRef.current.contains(event.target as Node | null);
    }

    if (!insideDOM && !insideReactTree) {
      onClickAway(event);
    }
  });

  // Keep track of mouse/touch events that bubbled up through the portal.
  const handleSynthetic = () => {
    syntheticEventRef.current = true;
  };

  React.useEffect(() => {
    if (active) {
      const doc = ownerDocument(nodeRef.current);

      const handleTouchMove = () => {
        movedRef.current = true;
      };

      doc.addEventListener('touchstart', handleClickAway);
      doc.addEventListener('touchmove', handleTouchMove);

      return () => {
        doc.removeEventListener('touchstart', handleClickAway);
        doc.removeEventListener('touchmove', handleTouchMove);
      };
    }
    return undefined;
  }, [active, handleClickAway]);

  React.useEffect(() => {
    // TODO This behavior is not tested automatically
    // It's unclear whether this is due to different update semantics in test (batched in act() vs discrete on click).
    // Or if this is a timing related issues due to different Transition components
    // Once we get rid of all the manual scheduling (e.g. setTimeout(update, 0)) we can revisit this code+test.
    if (active) {
      const doc = ownerDocument(nodeRef.current);

      doc.addEventListener('click', handleClickAway);

      return () => {
        doc.removeEventListener('click', handleClickAway);
        // cleanup `handleClickAway`
        syntheticEventRef.current = false;
      };
    }
    return undefined;
  }, [active, handleClickAway]);

  return [nodeRef, handleSynthetic, handleSynthetic];
}

export function PickersPopper(inProps: PickerPopperProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickersPopper' });
  const {
    anchorEl,
    children,
    containerRef = null,
    shouldRestoreFocus,
    onBlur,
    onDismiss,
    open,
    role,
    placement,
    slots,
    slotProps,
  } = props;

  React.useEffect(() => {
    function handleKeyDown(nativeEvent: KeyboardEvent) {
      // IE11, Edge (prior to using Blink?) use 'Esc'
      if (open && (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc')) {
        onDismiss();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onDismiss, open]);

  const lastFocusedElementRef = React.useRef<Element | null>(null);
  React.useEffect(() => {
    if (role === 'tooltip' || (shouldRestoreFocus && !shouldRestoreFocus())) {
      return;
    }

    if (open) {
      lastFocusedElementRef.current = getActiveElement(document);
    } else if (
      lastFocusedElementRef.current &&
      lastFocusedElementRef.current instanceof HTMLElement
    ) {
      // make sure the button is flushed with updated label, before returning focus to it
      // avoids issue, where screen reader could fail to announce selected date after selection
      setTimeout(() => {
        if (lastFocusedElementRef.current instanceof HTMLElement) {
          lastFocusedElementRef.current.focus();
        }
      });
    }
  }, [open, role, shouldRestoreFocus]);

  const [clickAwayRef, onPaperClick, onPaperTouchStart] = useClickAwayListener(
    open,
    onBlur ?? onDismiss,
  );
  const paperRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(paperRef, containerRef);
  const handlePaperRef = useForkRef(handleRef, clickAwayRef as React.Ref<HTMLDivElement>);

  const ownerState = props;
  const classes = useUtilityClasses(ownerState);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      // stop the propagation to avoid closing parent modal
      event.stopPropagation();
      onDismiss();
    }
  };

  const Transition = slots?.desktopTransition ?? Grow;
  const TrapFocus = slots?.desktopTrapFocus ?? MuiTrapFocus;

  const Paper = slots?.desktopPaper ?? PickersPopperPaper;
  const paperProps: MuiPaperProps = useSlotProps({
    elementType: Paper,
    externalSlotProps: slotProps?.desktopPaper,
    additionalProps: {
      tabIndex: -1,
      elevation: 8,
      ref: handlePaperRef,
    },
    className: classes.paper,
    ownerState: {} as any, // Is overridden below to use `placement
  });

  const Popper = slots?.popper ?? PickersPopperRoot;
  const popperProps = useSlotProps({
    elementType: Popper,
    externalSlotProps: slotProps?.popper,
    additionalProps: {
      transition: true,
      role,
      open,
      anchorEl,
      placement,
      onKeyDown: handleKeyDown,
    },
    className: classes.root,
    ownerState: props,
  });

  return (
    <Popper {...popperProps}>
      {({ TransitionProps, placement: popperPlacement }) => (
        <TrapFocus
          open={open}
          disableAutoFocus
          // pickers are managing focus position manually
          // without this prop the focus is returned to the button before `aria-label` is updated
          // which would force screen readers to read too old label
          disableRestoreFocus
          disableEnforceFocus={role === 'tooltip'}
          isEnabled={() => true}
          {...slotProps?.desktopTrapFocus}
        >
          <Transition {...TransitionProps} {...slotProps?.desktopTransition}>
            <Paper
              {...paperProps}
              onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                onPaperClick(event);
                paperProps.onClick?.(event);
              }}
              onTouchStart={(event: React.TouchEvent<HTMLDivElement>) => {
                onPaperTouchStart(event);
                paperProps.onTouchStart?.(event);
              }}
              ownerState={{ ...ownerState, placement: popperPlacement }}
            >
              {children}
            </Paper>
          </Transition>
        </TrapFocus>
      )}
    </Popper>
  );
}
