import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';

export interface OpenStateProps {
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const useOpenState = ({ open, onOpen, onClose }: OpenStateProps) => {
  const isControllingOpenProp = React.useRef(typeof open === 'boolean').current;
  const [openState, setOpenState] = React.useState(false);

  // It is required to update inner state in useEffect in order to avoid situation when
  // Our component is not mounted yet, but `open` state is set to `true` (for example initially opened)
  React.useEffect(() => {
    if (isControllingOpenProp) {
      if (typeof open !== 'boolean') {
        throw new Error('You must not mix controlling and uncontrolled mode for `open` prop');
      }

      setOpenState(open);
    }
  }, [isControllingOpenProp, open]);

  const setOpen = useEventCallback((action: React.SetStateAction<boolean>) => {
    const newOpen = typeof action === 'function' ? action(openState) : action;
    if (!isControllingOpenProp) {
      setOpenState(newOpen);
    }

    if (newOpen && onOpen) {
      onOpen();
    }

    if (!newOpen && onClose) {
      onClose();
    }
  });

  return { open: openState, setOpen };
};
