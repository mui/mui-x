import * as React from 'react';
import { GridMenu, useGridSelector } from '@mui/x-data-grid-pro';
import useId from '@mui/utils/useId';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import {
  gridAiAssistantActiveConversationIdSelector,
  gridAiAssistantConversationsSelector,
} from '../../hooks/features/aiAssistant/gridAiAssistantSelectors';

function GridAiAssistantPanelConversationsMenu() {
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const activeConversationId = useGridSelector(apiRef, gridAiAssistantActiveConversationIdSelector);
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

  return (
    <React.Fragment>
      <rootProps.slots.baseTooltip
        title={apiRef.current.getLocaleText('aiAssistantPanelConversationHistory')}
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
          {conversations.map((conversation) => (
            <rootProps.slots.baseMenuItem
              key={conversation.id}
              selected={activeConversationId === conversation.id}
              material={{ dense: true }}
              onClick={() => {
                apiRef.current.aiAssistant.setAiAssistantActiveConversationId(conversation.id);
                handleClose();
              }}
            >
              {conversation.title}
            </rootProps.slots.baseMenuItem>
          ))}
        </rootProps.slots.baseMenuList>
      </GridMenu>
    </React.Fragment>
  );
}

export { GridAiAssistantPanelConversationsMenu };
