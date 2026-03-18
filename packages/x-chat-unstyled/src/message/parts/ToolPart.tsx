'use client';
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentProps } from '@mui/utils/types';
import type {
  ChatDynamicToolMessagePart,
  ChatPartRenderer,
  ChatPartRendererProps,
  ChatRole,
  ChatToolInvocationState,
  ChatToolMessagePart,
} from '@mui/x-chat-headless';
import { useChat } from '@mui/x-chat-headless';
import { useChatLocaleText } from '../../chat/internals/ChatLocaleContext';
import { formatStructuredValue, shouldCollapsePayload } from './partUtils';

type ToolPart = ChatToolMessagePart | ChatDynamicToolMessagePart;

export interface ToolPartOwnerState {
  messageId: string;
  pendingApproval: boolean;
  role: ChatRole;
  state: ChatToolInvocationState;
}

export interface ToolPartSectionOwnerState extends ToolPartOwnerState {
  section: 'input' | 'output';
}

export interface ToolPartSlots {
  root: React.ElementType;
  header: React.ElementType;
  title: React.ElementType;
  state: React.ElementType;
  section: React.ElementType;
  sectionContent: React.ElementType;
  error: React.ElementType;
  actions: React.ElementType;
  approveButton: React.ElementType;
  denyButton: React.ElementType;
}

export interface ToolPartSlotProps {
  root?: SlotComponentProps<'div', {}, ToolPartOwnerState>;
  header?: SlotComponentProps<'div', {}, ToolPartOwnerState>;
  title?: SlotComponentProps<'div', {}, ToolPartOwnerState>;
  state?: SlotComponentProps<'span', {}, ToolPartOwnerState>;
  section?: SlotComponentProps<'div', {}, ToolPartSectionOwnerState>;
  sectionContent?: SlotComponentProps<'pre', {}, ToolPartSectionOwnerState>;
  error?: SlotComponentProps<'div', {}, ToolPartOwnerState>;
  actions?: SlotComponentProps<'div', {}, ToolPartOwnerState>;
  approveButton?: SlotComponentProps<'button', {}, ToolPartOwnerState>;
  denyButton?: SlotComponentProps<'button', {}, ToolPartOwnerState>;
}

export interface ToolPartProps extends ChatPartRendererProps<ToolPart> {
  className?: string;
  slots?: Partial<ToolPartSlots>;
  slotProps?: ToolPartSlotProps;
}

export type ToolPartExternalProps = Omit<
  ToolPartProps,
  'index' | 'message' | 'onToolCall' | 'part'
>;

type ToolPartComponent = ((
  props: ToolPartProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

function ToolPayloadSection(props: {
  label: string;
  ownerState: ToolPartOwnerState;
  section: 'input' | 'output';
  slotProps?: ToolPartSlotProps;
  slots?: Partial<ToolPartSlots>;
  value: unknown;
}) {
  const { label, ownerState, section, slotProps, slots, value } = props;
  const formatted = React.useMemo(() => formatStructuredValue(value), [value]);
  const collapsed = shouldCollapsePayload(formatted);
  const sectionOwnerState = React.useMemo<ToolPartSectionOwnerState>(
    () => ({
      ...ownerState,
      section,
    }),
    [ownerState, section],
  );
  const Section = slots?.section ?? 'div';
  const SectionContent = slots?.sectionContent ?? 'pre';
  const sectionProps = useSlotProps({
    elementType: Section,
    externalSlotProps: slotProps?.section,
    ownerState: sectionOwnerState,
  });
  const sectionContentProps = useSlotProps({
    elementType: SectionContent,
    externalSlotProps: slotProps?.sectionContent,
    ownerState: sectionOwnerState,
  });

  if (!collapsed) {
    return (
      <Section {...sectionProps}>
        <strong>{label}</strong>
        <SectionContent {...sectionContentProps}>{formatted}</SectionContent>
      </Section>
    );
  }

  return (
    <Section {...sectionProps}>
      <details>
        <summary>{label}</summary>
        <SectionContent {...sectionContentProps}>{formatted}</SectionContent>
      </details>
    </Section>
  );
}

export const ToolPartComponent_ = React.forwardRef(function ToolPartRenderer(
  props: ToolPartProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { addToolApprovalResponse } = useChat();
  const {
    className,
    index: _index,
    message,
    onToolCall: _onToolCall,
    part,
    slots,
    slotProps,
    ...other
  } = props;
  void _index;
  void _onToolCall;
  const [pendingApproval, setPendingApproval] = React.useState(false);
  const localeText = useChatLocaleText();
  const ownerState = React.useMemo<ToolPartOwnerState>(
    () => ({
      messageId: message.id,
      pendingApproval,
      role: message.role,
      state: part.toolInvocation.state,
    }),
    [message.id, message.role, part.toolInvocation.state, pendingApproval],
  );
  const Root = slots?.root ?? 'div';
  const Header = slots?.header ?? 'div';
  const Title = slots?.title ?? 'div';
  const State = slots?.state ?? 'span';
  const Error = slots?.error ?? 'div';
  const Actions = slots?.actions ?? 'div';
  const ApproveButton = slots?.approveButton ?? 'button';
  const DenyButton = slots?.denyButton ?? 'button';
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    ownerState,
    additionalProps: {
      ref,
      className,
    },
  });
  const headerProps = useSlotProps({
    elementType: Header,
    externalSlotProps: slotProps?.header,
    ownerState,
  });
  const titleProps = useSlotProps({
    elementType: Title,
    externalSlotProps: slotProps?.title,
    ownerState,
  });
  const stateProps = useSlotProps({
    elementType: State,
    externalSlotProps: slotProps?.state,
    ownerState,
  });
  const errorProps = useSlotProps({
    elementType: Error,
    externalSlotProps: slotProps?.error,
    ownerState,
  });
  const actionsProps = useSlotProps({
    elementType: Actions,
    externalSlotProps: slotProps?.actions,
    ownerState,
  });
  const approveButtonProps = useSlotProps({
    elementType: ApproveButton,
    externalSlotProps: slotProps?.approveButton,
    ownerState,
  });
  const denyButtonProps = useSlotProps({
    elementType: DenyButton,
    externalSlotProps: slotProps?.denyButton,
    ownerState,
  });
  const { toolInvocation } = part;
  const toolTitle = toolInvocation.title ?? toolInvocation.toolName;
  const stateLabel = localeText.toolStateLabel(toolInvocation.state);

  const handleApproval = React.useCallback(
    async (approved: boolean) => {
      setPendingApproval(true);
      try {
        await addToolApprovalResponse({
          id: toolInvocation.toolCallId,
          approved,
        });
      } catch {
        // Errors are surfaced through the chat runtime error channel.
      } finally {
        setPendingApproval(false);
      }
    },
    [addToolApprovalResponse, toolInvocation.toolCallId],
  );

  const showInput =
    (toolInvocation.state === 'input-streaming' ||
      toolInvocation.state === 'input-available' ||
      toolInvocation.state === 'approval-requested' ||
      toolInvocation.state === 'approval-responded') &&
    toolInvocation.input !== undefined;

  const showOutput =
    toolInvocation.state === 'output-available' && toolInvocation.output !== undefined;

  return (
    <Root {...rootProps}>
      <Header {...headerProps}>
        <Title {...titleProps}>{toolTitle}</Title>
        {stateLabel ? <State {...stateProps}>{stateLabel}</State> : null}
      </Header>
      {showInput ? (
        <ToolPayloadSection
          label={localeText.messageToolInputLabel}
          ownerState={ownerState}
          section="input"
          slotProps={slotProps}
          slots={slots}
          value={toolInvocation.input}
        />
      ) : null}
      {showOutput ? (
        <ToolPayloadSection
          label={localeText.messageToolOutputLabel}
          ownerState={ownerState}
          section="output"
          slotProps={slotProps}
          slots={slots}
          value={toolInvocation.output}
        />
      ) : null}
      {toolInvocation.state === 'output-error' && toolInvocation.errorText ? (
        <Error {...errorProps}>{toolInvocation.errorText}</Error>
      ) : null}
      {toolInvocation.state === 'output-denied' ? (
        <Error {...errorProps}>
          {toolInvocation.approval?.reason ?? localeText.toolStateLabel('output-denied')}
        </Error>
      ) : null}
      {toolInvocation.state === 'approval-requested' ? (
        <Actions {...actionsProps}>
          <ApproveButton
            {...approveButtonProps}
            disabled={pendingApproval}
            onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
              (
                approveButtonProps as {
                  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
                }
              ).onClick?.(event);
              if (!event.defaultPrevented) {
                await handleApproval(true);
              }
            }}
            type="button"
          >
            {localeText.messageToolApproveButtonLabel}
          </ApproveButton>
          <DenyButton
            {...denyButtonProps}
            disabled={pendingApproval}
            onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
              (
                denyButtonProps as {
                  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
                }
              ).onClick?.(event);
              if (!event.defaultPrevented) {
                await handleApproval(false);
              }
            }}
            type="button"
          >
            {localeText.messageToolDenyButtonLabel}
          </DenyButton>
        </Actions>
      ) : null}
    </Root>
  );
}) as ToolPartComponent;

// Use a separate export name to avoid conflict with the ToolPart type alias
export { ToolPartComponent_ as ToolPart };

export function createToolPartRenderer(
  defaultProps: ToolPartExternalProps = {},
): ChatPartRenderer<ToolPart> {
  return function ToolPartRendererFn(rendererProps) {
    return <ToolPartComponent_ {...defaultProps} {...rendererProps} />;
  };
}
