import * as React from 'react';
import { useSlotProps, SlotComponentProps } from '@mui/base/utils';
import Grow from '@mui/material/Grow';
import MuiPaper, { PaperProps } from '@mui/material/Paper';
import MuiPopper, { PopperProps as MuiPopperProps } from '@mui/material/Popper';
import MuiTrapFocus, {
  TrapFocusProps as MuiTrapFocusProps,
} from '@mui/material/Unstable_TrapFocus';
import { PaperProps as MuiPaperProps } from '@mui/material/Paper/Paper';
import { useForkRef, useEventCallback, ownerDocument } from '@mui/material/utils';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { TransitionProps as MuiTransitionProps } from '@mui/material/transitions';
import { PickersActionBar, PickersActionBarProps } from '../../PickersActionBar';
import { PickerStateWrapperProps } from '../hooks/usePickerState';
import { getPickersPopperUtilityClass, PickersPopperClasses } from './pickersPopperClasses';

export interface PickersPopperSlotsComponent {
  /**
   * Custom component for the action bar, it is placed bellow the picker views.
   * @default PickersActionBar
   */
  ActionBar?: React.ElementType<PickersActionBarProps>;
  /**
   * Custom component for the desktop popper [Transition](https://mui.com/material-ui/transitions).
   * @default Grow from @mui/material
   */
  DesktopTransition?: React.JSXElementConstructor<MuiTransitionProps>;
  /**
   * Custom component for the paper rendered inside the picker's Popper.
   * @default Paper from @mui/material
   */
  Paper?: React.ElementType<MuiPaperProps>;
  /**
   * Custom component wrapping the views of the picker (it is the direct child of the Paper component).
   * @default React.Fragment
   */
  PaperContent?: React.ElementType<{ children: React.ReactNode }>;
  /**
   * Custom component for the popper inside which the views are rendered on desktop.
   * @default Popper from @mui/material
   */
  Popper?: React.ElementType<MuiPopperProps>;
  /**
   * Custom component for trapping the focus inside the views.
   * @default TrapFocus from @mui/material
   */
  TrapFocus?: React.ElementType<MuiTrapFocusProps>;
}

export interface PickersPopperSlotsComponentsProps {
  /**
   * Props passed down to the action bar component.
   */
  actionBar?: Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>;
  /**
   * Props passed down to the desktop [Transition](https://mui.com/material-ui/transitions) component.
   */
  desktopTransition?: Partial<MuiTransitionProps>;
  /**
   * Props passed down to [Paper](https://mui.com/material-ui/api/paper/) component.
   */
  paper?: Partial<MuiPaperProps>;
  /**
   * Props passed to down the paper content component.
   * Can't be used without a custom PaperContent component since the default one is React.Fragment.
   */
  paperContent?: Record<string, any>;
  /**
   * Props passed down to [Popper](https://mui.com/material-ui/api/popper/) component.
   */
  popper?: SlotComponentProps<typeof MuiPopper, PickerPopperProps, {}>;
  /**
   * Props passed down to the TrapFocus component.
   */
  trapFocus?: Partial<MuiTrapFocusProps>;
}

export interface PickerPopperProps extends PickerStateWrapperProps {
  role: 'tooltip' | 'dialog';
  TrapFocusProps?: Partial<MuiTrapFocusProps>;
  anchorEl: MuiPopperProps['anchorEl'];
  open: MuiPopperProps['open'];
  containerRef?: React.Ref<HTMLDivElement>;
  children?: React.ReactNode;
  onBlur?: () => void;
  components?: Partial<PickersPopperSlotsComponent>;
  componentsProps?: Partial<PickersPopperSlotsComponentsProps>;
  classes?: Partial<PickersPopperClasses>;
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
    onBlur,
    onDismiss,
    onClear,
    onAccept,
    onCancel,
    onSetToday,
    open,
    role,
    TrapFocusProps,
    components,
    componentsProps,
  } = props;

  React.useEffect(() => {
    function handleKeyDown(nativeEvent: KeyboardEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
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
    if (role === 'tooltip') {
      return;
    }

    if (open) {
      lastFocusedElementRef.current = document.activeElement;
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
  }, [open, role]);

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

  const ActionBar = components?.ActionBar ?? PickersActionBar;
  const PaperContent = components?.PaperContent ?? React.Fragment;
  const Transition = components?.DesktopTransition ?? Grow;
  const TrapFocus = components?.TrapFocus ?? MuiTrapFocus;

  const Paper = components?.Paper ?? PickersPopperPaper;
  const paperProps: PaperProps = useSlotProps({
    elementType: Paper,
    externalSlotProps: componentsProps?.paper,
    additionalProps: {
      tabIndex: -1,
      elevation: 8,
      ref: handlePaperRef,
    },
    className: classes.paper,
    ownerState, // Is overridden below to use `placement
  });

  const Popper = components?.Popper ?? PickersPopperRoot;
  const popperProps = useSlotProps({
    elementType: Popper,
    externalSlotProps: componentsProps?.popper,
    additionalProps: {
      transition: true,
      role,
      open,
      anchorEl,
      onKeyDown: handleKeyDown,
    },
    className: classes.root,
    ownerState: props,
  });

  return (
    <Popper {...popperProps}>
      {({ TransitionProps, placement }) => (
        <TrapFocus
          open={open}
          disableAutoFocus
          // pickers are managing focus position manually
          // without this prop the focus is returned to the button before `aria-label` is updated
          // which would force screen readers to read too old label
          disableRestoreFocus
          disableEnforceFocus={role === 'tooltip'}
          isEnabled={() => true}
          {...TrapFocusProps}
        >
          <Transition {...TransitionProps} {...componentsProps?.desktopTransition}>
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
              ownerState={{ ...ownerState, placement }}
            >
              <PaperContent {...componentsProps?.paperContent}>
                {children}
                <ActionBar
                  onAccept={onAccept}
                  onClear={onClear}
                  onCancel={onCancel}
                  onSetToday={onSetToday}
                  actions={[]}
                  {...componentsProps?.actionBar}
                />
              </PaperContent>
            </Paper>
          </Transition>
        </TrapFocus>
      )}
    </Popper>
  );
}
