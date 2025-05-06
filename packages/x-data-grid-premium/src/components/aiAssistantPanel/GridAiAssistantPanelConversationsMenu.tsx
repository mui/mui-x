import * as React from 'react';
import { GridMenu, useGridSelector } from '@mui/x-data-grid-pro';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import {
  gridAiAssistantActiveConversationIndexSelector,
  gridAiAssistantConversationsSelector,
} from '../../hooks/features/aiAssistant/gridAiAssistantSelectors';

function GridAiAssistantPanelConversationsMenu() {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const activeConversationIndex = useGridSelector(
    apiRef,
    gridAiAssistantActiveConversationIndexSelector,
  );
  const conversations = useGridSelector(apiRef, gridAiAssistantConversationsSelector);
  const [open, setOpen] = React.useState(false);
  const menuId = useId();
  const triggerId = useId();
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Ordered by most recent prompt in conversations
  const sortedConversations = React.useMemo(() => {
    return [...conversations].sort((a, b) => {
      if (!a.prompts.length) {
        return -1;
      }
      // New conversations should be at the top
      if (!b.prompts.length) {
        return 1;
      }
      return (
        b.prompts[b.prompts.length - 1].createdAt.getTime() -
        a.prompts[a.prompts.length - 1].createdAt.getTime()
      );
    });
  }, [conversations]);

  return (
    <React.Fragment>
      <rootProps.slots.baseTooltip
        title={apiRef.current.getLocaleText('aiAssistantPanelConversationHistory')}
        enterDelay={500}
      >
        <span>
          <rootProps.slots.baseIconButton
            {...rootProps.slotProps?.baseIconButton}
            disabled={conversations.length === 0}
            id={triggerId}
            aria-haspopup="true"
            aria-controls={open ? menuId : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label={apiRef.current.getLocaleText('aiAssistantPanelConversationHistory')}
            onClick={handleOpen}
            ref={triggerRef}
          >
            <rootProps.slots.aiAssistantPanelHistoryIcon fontSize="small" />
          </rootProps.slots.baseIconButton>
        </span>
      </rootProps.slots.baseTooltip>
      <GridMenu target={triggerRef.current} open={open} onClose={handleClose} position="bottom-end">
        <rootProps.slots.baseMenuList
          id={menuId}
          aria-labelledby={triggerId}
          autoFocusItem
          {...rootProps.slotProps?.baseMenuList}
        >
          {sortedConversations.map((conversation, sortedIndex) => {
            const conversationIndex = conversations.findIndex((c) => c === conversation);
            return (
              <rootProps.slots.baseMenuItem
                key={`${conversation.id}-${sortedIndex}`}
                selected={conversationIndex === activeConversationIndex}
                onClick={() => {
                  apiRef.current.aiAssistant.setActiveConversationIndex(conversationIndex);
                  handleClose();
                }}
              >
                {conversation.title}
              </rootProps.slots.baseMenuItem>
            );
          })}
        </rootProps.slots.baseMenuList>
      </GridMenu>
    </React.Fragment>
  );
}

export { GridAiAssistantPanelConversationsMenu };
