'use client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import type { SlotComponentProps } from '@mui/utils/types';
import type {
  ChatPartRenderer,
  ChatPartRendererProps,
  ChatTextMessagePart,
} from '@mui/x-chat-headless';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { styled } from '../internals/material/chatStyled';
import { createDefaultSlot, joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatMessageClasses } from './chatMessageClasses';

type CodeButtonLocaleText = {
  messageCopiedCodeButtonLabel: string;
  messageCopyCodeButtonLabel: string;
};

const DEFAULT_LOCALE_TEXT: CodeButtonLocaleText = {
  messageCopiedCodeButtonLabel: 'Copied',
  messageCopyCodeButtonLabel: 'Copy code',
};

type ShikiModule = typeof import('shiki');

const highlightedCodeCache = new Map<string, string>();
let shikiModulePromise: Promise<ShikiModule> | null = null;

function normalizeMarkdownForRender(markdown: string) {
  const fenceMatches = markdown.match(/```/g);

  if ((fenceMatches?.length ?? 0) % 2 === 1) {
    return `${markdown}\n\`\`\``;
  }

  return markdown;
}

function extractLanguage(className: string | undefined) {
  const match = /language-([^\s]+)/.exec(className ?? '');

  return match?.[1]?.trim().toLowerCase() ?? '';
}

function normalizeCodeContent(value: React.ReactNode) {
  const text = React.Children.toArray(value).join('');

  return text.replace(/\n$/, '');
}

async function getShikiModule() {
  if (shikiModulePromise == null) {
    shikiModulePromise = import('shiki');
  }

  return shikiModulePromise;
}

async function highlightCode(code: string, language: string, mode: Theme['palette']['mode']) {
  const cacheKey = `${mode}:${language || 'text'}:${code}`;
  const cached = highlightedCodeCache.get(cacheKey);

  if (cached != null) {
    return cached;
  }

  try {
    const shiki = await getShikiModule();
    const html = await shiki.codeToHtml(code, {
      lang: language || 'text',
      theme: mode === 'dark' ? 'github-dark' : 'github-light',
    });
    highlightedCodeCache.set(cacheKey, html);

    return html;
  } catch {
    return null;
  }
}

function safeUri(uri: string | null | undefined) {
  if (uri == null || uri === '') {
    return '';
  }

  try {
    const trimmed = uri.trim();

    if (trimmed.startsWith('#') || trimmed.startsWith('/')) {
      return trimmed;
    }

    const parsed = new URL(trimmed, 'https://mui.com');
    const protocol = parsed.protocol.toLowerCase();

    if (
      protocol === 'http:' ||
      protocol === 'https:' ||
      protocol === 'mailto:' ||
      protocol === 'tel:'
    ) {
      return trimmed;
    }

    return '';
  } catch {
    return '';
  }
}

function CopyCodeIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" focusable="false" viewBox="0 0 24 24">
      <path d="M9 9h10v11H9z" />
      <path d="M5 4h10v3H8v8H5z" />
    </svg>
  );
}

function CopiedCodeIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" focusable="false" viewBox="0 0 24 24">
      <path d="m9.55 16.6-3.5-3.5 1.4-1.4 2.1 2.1 6-6 1.4 1.4z" />
    </svg>
  );
}

export interface ChatMarkdownTextPartOwnerState {
  copied: boolean;
  language: string;
  messageId: string;
  role: ChatPartRendererProps<ChatTextMessagePart>['message']['role'];
}

export interface ChatMarkdownTextPartSlots {
  root: React.ElementType;
  markdown: React.ElementType;
  inlineCode: React.ElementType;
  codeBlock: React.ElementType;
  codeBlockToolbar: React.ElementType;
  codeBlockLanguage: React.ElementType;
  codeBlockCopyButton: React.ElementType;
}

export interface ChatMarkdownTextPartSlotProps {
  root?: SlotComponentProps<'div', {}, ChatMarkdownTextPartOwnerState>;
  markdown?: SlotComponentProps<'div', {}, ChatMarkdownTextPartOwnerState>;
  inlineCode?: SlotComponentProps<'code', {}, ChatMarkdownTextPartOwnerState>;
  codeBlock?: SlotComponentProps<'div', {}, ChatMarkdownTextPartOwnerState>;
  codeBlockToolbar?: SlotComponentProps<'div', {}, ChatMarkdownTextPartOwnerState>;
  codeBlockLanguage?: SlotComponentProps<'span', {}, ChatMarkdownTextPartOwnerState>;
  codeBlockCopyButton?: SlotComponentProps<'button', {}, ChatMarkdownTextPartOwnerState>;
}

export interface ChatMarkdownTextPartProps extends ChatPartRendererProps<ChatTextMessagePart> {
  className?: string;
  localeText?: Partial<CodeButtonLocaleText>;
  slotProps?: ChatMarkdownTextPartSlotProps;
  slots?: Partial<ChatMarkdownTextPartSlots>;
  sx?: SxProps<Theme>;
}

export type ChatMarkdownTextPartRendererOptions = Omit<
  ChatMarkdownTextPartProps,
  'index' | 'message' | 'onToolCall' | 'part'
>;

const ChatMarkdownRootSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Markdown',
})({
  minWidth: 0,
});

const ChatMarkdownContentSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'MarkdownContent',
})(({ theme }) => ({
  ...theme.typography.body1,
  minWidth: 0,
  [`& .${chatMessageClasses.markdownHeading}`]: {
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.25,
    margin: 0,
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    marginBlock: theme.spacing(1.5, 0.75),
  },
  '& h1': {
    ...theme.typography.h5,
  },
  '& h2': {
    ...theme.typography.h6,
  },
  '& h3': {
    ...theme.typography.subtitle1,
  },
  '& h4, & h5, & h6': {
    ...theme.typography.subtitle2,
  },
  '& p, & ul, & ol, & blockquote, & hr': {
    margin: 0,
  },
  '& ul, & ol': {
    paddingInlineStart: theme.spacing(3),
  },
  '& li + li': {
    marginBlockStart: theme.spacing(0.5),
  },
  [`& .${chatMessageClasses.markdownLink}`]: {
    color: 'inherit',
    fontWeight: theme.typography.fontWeightMedium,
    wordBreak: 'break-word',
  },
  [`& .${chatMessageClasses.markdownBlockquote}`]: {
    borderInlineStart: `3px solid ${theme.palette.divider}`,
    color: theme.palette.text.secondary,
    marginInline: 0,
    paddingInlineStart: theme.spacing(1.5),
  },
  [`& .${chatMessageClasses.inlineCode}`]: {
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
    fontFamily: theme.typography.fontFamily,
    fontSize: '0.875em',
    padding: theme.spacing(0.125, 0.5),
  },
  '& img': {
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    display: 'block',
    height: 'auto',
    maxWidth: '100%',
  },
  '& hr': {
    border: 0,
    borderTop: `1px solid ${theme.palette.divider}`,
    marginBlock: theme.spacing(1.5),
  },
  '& > :first-of-type': {
    marginBlockStart: 0,
  },
  '& > :last-child': {
    marginBlockEnd: 0,
  },
}));

const ChatMarkdownInlineCodeSlot = styled('code', {
  name: 'MuiChatMessage',
  slot: 'InlineCode',
})({});

const ChatMarkdownCodeBlockSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'CodeBlock',
})(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  marginBlock: theme.spacing(1),
  minWidth: 0,
  overflow: 'hidden',
  [`& .${chatMessageClasses.codeBlockPre}`]: {
    margin: 0,
    overflowX: 'auto',
    padding: theme.spacing(1.5),
  },
  '& pre': {
    margin: 0,
    overflowX: 'auto',
    padding: theme.spacing(1.5),
  },
  '& code': {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(13),
  },
  '& .shiki': {
    backgroundColor: 'transparent !important',
    color: `${theme.palette.text.primary} !important`,
  },
  '&:hover, &:focus-within': {
    [`& .${chatMessageClasses.codeBlockCopyButton}`]: {
      opacity: 1,
      pointerEvents: 'auto',
    },
  },
}));

const ChatMarkdownCodeBlockToolbarSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'CodeBlockToolbar',
})(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.action.selected,
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'space-between',
  minHeight: 40,
  padding: theme.spacing(0.5, 1),
}));

const ChatMarkdownCodeBlockLanguageSlot = styled('span', {
  name: 'MuiChatMessage',
  slot: 'CodeBlockLanguage',
})(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
  textTransform: 'lowercase',
}));

const ChatMarkdownCodeBlockCopyButtonSlot = styled(IconButton, {
  name: 'MuiChatMessage',
  slot: 'CodeBlockCopyButton',
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  opacity: 0,
  padding: theme.spacing(0.75),
  pointerEvents: 'none',
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

function CodeBlock(props: {
  code: string;
  language: string;
  localeText: CodeButtonLocaleText;
  ownerState: ChatMarkdownTextPartOwnerState;
  slotProps?: ChatMarkdownTextPartSlotProps;
  slots?: Partial<ChatMarkdownTextPartSlots>;
}) {
  const { code, language, localeText, ownerState, slotProps, slots } = props;
  const theme = useTheme();
  const [copied, setCopied] = React.useState(false);
  const [highlightedHtml, setHighlightedHtml] = React.useState<string | null>(null);
  const mode = theme.palette.mode;
  const CodeBlockRoot = slots?.codeBlock ?? ChatMarkdownCodeBlockSlot;
  const Toolbar = slots?.codeBlockToolbar ?? ChatMarkdownCodeBlockToolbarSlot;
  const Language = slots?.codeBlockLanguage ?? ChatMarkdownCodeBlockLanguageSlot;
  const CopyButton = slots?.codeBlockCopyButton ?? ChatMarkdownCodeBlockCopyButtonSlot;
  const resolvedOwnerState = React.useMemo(
    () => ({
      ...ownerState,
      copied,
      language,
    }),
    [copied, language, ownerState],
  );
  const codeBlockProps = mergeSlotPropsWithClassName(
    slotProps?.codeBlock,
    chatMessageClasses.codeBlock,
  )(resolvedOwnerState);
  const toolbarProps = mergeSlotPropsWithClassName(
    slotProps?.codeBlockToolbar,
    chatMessageClasses.codeBlockToolbar,
  )(resolvedOwnerState);
  const languageProps = mergeSlotPropsWithClassName(
    slotProps?.codeBlockLanguage,
    chatMessageClasses.codeBlockLanguage,
  )(resolvedOwnerState);
  const copyButtonProps = mergeSlotPropsWithClassName(
    slotProps?.codeBlockCopyButton,
    chatMessageClasses.codeBlockCopyButton,
  )(resolvedOwnerState);

  React.useEffect(() => {
    let active = true;

    void highlightCode(code, language, mode).then((result) => {
      if (active) {
        setHighlightedHtml(result);
      }
    });

    return () => {
      active = false;
    };
  }, [code, language, mode]);

  React.useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setCopied(false);
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  return (
    <CodeBlockRoot {...codeBlockProps}>
      <Toolbar {...toolbarProps}>
        <Language {...languageProps}>{language || 'text'}</Language>
        <CopyButton
          {...copyButtonProps}
          aria-label={
            copied ? localeText.messageCopiedCodeButtonLabel : localeText.messageCopyCodeButtonLabel
          }
          onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
            (
              copyButtonProps as { onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void }
            ).onClick?.(event);
            if (event.defaultPrevented) {
              return;
            }
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
            } catch {
              setCopied(false);
            }
          }}
          size="small"
        >
          {copied ? <CopiedCodeIcon /> : <CopyCodeIcon />}
        </CopyButton>
      </Toolbar>
      {highlightedHtml ? (
        <div
          className={chatMessageClasses.codeBlockPre}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className={chatMessageClasses.codeBlockPre}>
          <code>{code}</code>
        </pre>
      )}
    </CodeBlockRoot>
  );
}

export const ChatMarkdownTextPart = React.forwardRef(function ChatMarkdownTextPart(
  inProps: ChatMarkdownTextPartProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    className,
    index,
    localeText: localeTextProp,
    message,
    onToolCall,
    part,
    slotProps,
    slots,
    sx,
  } = inProps;
  void index;
  void onToolCall;
  const localeText = React.useMemo(
    () => ({
      ...DEFAULT_LOCALE_TEXT,
      ...localeTextProp,
    }),
    [localeTextProp],
  );
  const normalizedText = React.useMemo(() => normalizeMarkdownForRender(part.text), [part.text]);
  const ownerState = React.useMemo<ChatMarkdownTextPartOwnerState>(
    () => ({
      copied: false,
      language: '',
      messageId: message.id,
      role: message.role,
    }),
    [message.id, message.role],
  );
  const Root = React.useMemo(
    () => slots?.root ?? createDefaultSlot(ChatMarkdownRootSlot, sx),
    [slots?.root, sx],
  );
  const Markdown = React.useMemo(
    () => slots?.markdown ?? createDefaultSlot(ChatMarkdownContentSlot, undefined),
    [slots?.markdown],
  );
  const InlineCode = slots?.inlineCode ?? ChatMarkdownInlineCodeSlot;
  const rootProps = mergeSlotPropsWithClassName(
    slotProps?.root,
    className
      ? joinClassNames(chatMessageClasses.markdown, className)
      : chatMessageClasses.markdown,
  )(ownerState);
  const markdownProps = mergeSlotPropsWithClassName(
    slotProps?.markdown,
    chatMessageClasses.markdownContent,
  )(ownerState);
  const inlineCodeProps = mergeSlotPropsWithClassName(
    slotProps?.inlineCode,
    chatMessageClasses.inlineCode,
  )(ownerState);
  const markdownComponents = React.useMemo(
    () =>
      ({
        a(props: React.ComponentProps<'a'>) {
          const href = safeUri(props.href);
          if (href === '') {
            return <span>{props.children}</span>;
          }

          return (
            <Link
              {...props}
              className={joinClassNames(chatMessageClasses.markdownLink, props.className)}
              href={href}
              rel="noreferrer noopener"
              target="_blank"
            />
          );
        },
        blockquote(props: React.ComponentProps<'blockquote'>) {
          return (
            <blockquote
              {...props}
              className={joinClassNames(chatMessageClasses.markdownBlockquote, props.className)}
            />
          );
        },
        code(
          props: React.ComponentProps<'code'> & {
            inline?: boolean;
          },
        ) {
          const { children, className: codeClassName, inline, ...other } = props;

          if (inline !== true) {
            return (
              <code className={codeClassName} {...other}>
                {children}
              </code>
            );
          }

          return (
            <InlineCode
              {...inlineCodeProps}
              className={joinClassNames(
                chatMessageClasses.inlineCode,
                inlineCodeProps.className,
                codeClassName,
              )}
            >
              {children}
            </InlineCode>
          );
        },
        h1(props: React.ComponentProps<'h1'>) {
          return (
            // eslint-disable-next-line jsx-a11y/heading-has-content
            <h1
              {...props}
              className={joinClassNames(chatMessageClasses.markdownHeading, props.className)}
            />
          );
        },
        h2(props: React.ComponentProps<'h2'>) {
          return (
            // eslint-disable-next-line jsx-a11y/heading-has-content
            <h2
              {...props}
              className={joinClassNames(chatMessageClasses.markdownHeading, props.className)}
            />
          );
        },
        h3(props: React.ComponentProps<'h3'>) {
          return (
            // eslint-disable-next-line jsx-a11y/heading-has-content
            <h3
              {...props}
              className={joinClassNames(chatMessageClasses.markdownHeading, props.className)}
            />
          );
        },
        h4(props: React.ComponentProps<'h4'>) {
          return (
            // eslint-disable-next-line jsx-a11y/heading-has-content
            <h4
              {...props}
              className={joinClassNames(chatMessageClasses.markdownHeading, props.className)}
            />
          );
        },
        h5(props: React.ComponentProps<'h5'>) {
          return (
            // eslint-disable-next-line jsx-a11y/heading-has-content
            <h5
              {...props}
              className={joinClassNames(chatMessageClasses.markdownHeading, props.className)}
            />
          );
        },
        h6(props: React.ComponentProps<'h6'>) {
          return (
            // eslint-disable-next-line jsx-a11y/heading-has-content
            <h6
              {...props}
              className={joinClassNames(chatMessageClasses.markdownHeading, props.className)}
            />
          );
        },
        img(props: React.ComponentProps<'img'>) {
          const src = safeUri(props.src);
          if (src === '') {
            return null;
          }

          return <img {...props} alt={props.alt ?? ''} src={src} />;
        },
        pre(props: React.ComponentProps<'pre'>) {
          const child = React.Children.toArray(props.children).find(
            React.isValidElement,
          ) as React.ReactElement<React.HTMLAttributes<HTMLElement>>;

          if (child == null) {
            return <pre {...props} />;
          }

          const code = normalizeCodeContent(child.props.children);
          const language = extractLanguage(child.props.className);

          return (
            <CodeBlock
              code={code}
              language={language}
              localeText={localeText}
              ownerState={ownerState}
              slotProps={slotProps}
              slots={slots}
            />
          );
        },
      }) as any,
    [InlineCode, inlineCodeProps, localeText, ownerState, slotProps, slots],
  );

  return (
    <Root {...rootProps} ref={ref}>
      <Markdown {...markdownProps}>
        <ReactMarkdown
          components={markdownComponents}
          remarkPlugins={[remarkGfm]}
          skipHtml
          urlTransform={safeUri}
        >
          {normalizedText}
        </ReactMarkdown>
      </Markdown>
    </Root>
  );
});

export function createChatMarkdownTextPartRenderer(
  defaultProps: ChatMarkdownTextPartRendererOptions = {},
): ChatPartRenderer<ChatTextMessagePart> {
  return function ChatMarkdownTextPartRenderer(props) {
    return <ChatMarkdownTextPart {...defaultProps} {...props} />;
  };
}
