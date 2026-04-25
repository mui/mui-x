'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useChatCodeBlockUtilityClasses, type ChatCodeBlockClasses } from './chatCodeBlockClasses';

export interface ChatCodeBlockProps {
  /**
   * The code string to display.
   */
  children: string;
  /**
   * Language identifier shown in the header (e.g. "typescript", "python").
   */
  language?: string;
  /**
   * Optional syntax highlighter. Receives the code string and a language identifier,
   * and should return highlighted React nodes. When omitted, raw code is displayed.
   * @param {string} code - The code string to highlight.
   * @param {string} language - The language identifier for syntax highlighting.
   * @returns {React.ReactNode} The highlighted React nodes.
   */
  highlighter?: (code: string, language: string) => React.ReactNode;
  className?: string;
  classes?: Partial<ChatCodeBlockClasses>;
}

const useThemeProps = createUseThemeProps('MuiChatCodeBlock');

// Inline SVGs — avoids @mui/icons-material dependency
function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="1em"
      height="1em"
      aria-hidden="true"
    >
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="1em"
      height="1em"
      aria-hidden="true"
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

const ChatCodeBlockRoot = styled('div', {
  name: 'MuiChatCodeBlock',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  margin: theme.spacing(0.75, 0),
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

const ChatCodeBlockHeader = styled('div', {
  name: 'MuiChatCodeBlock',
  slot: 'Header',
  overridesResolver: (_, styles) => styles.header,
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 0.5, 0.5, 1.25),
  backgroundColor: (theme.vars || theme).palette.action.hover,
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ChatCodeBlockLanguageLabel = styled('span', {
  name: 'MuiChatCodeBlock',
  slot: 'LanguageLabel',
  overridesResolver: (_, styles) => styles.languageLabel,
})(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.secondary,
  userSelect: 'none',
  lineHeight: 1,
}));

const ChatCodeBlockCopyButton = styled('button', {
  name: 'MuiChatCodeBlock',
  slot: 'CopyButton',
  overridesResolver: (_, styles) => styles.copyButton,
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0.5),
  background: 'transparent',
  border: 'none',
  borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : 2,
  color: (theme.vars || theme).palette.text.secondary,
  cursor: 'pointer',
  lineHeight: 0,
  fontSize: '1rem',
  transition: theme.transitions.create(['background-color', 'color']),
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.action.selected,
    color: (theme.vars || theme).palette.text.primary,
  },
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

const ChatCodeBlockPre = styled('pre', {
  name: 'MuiChatCodeBlock',
  slot: 'Pre',
  overridesResolver: (_, styles) => styles.pre,
})(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(1.5),
  overflow: 'auto',
  background: 'transparent',
  lineHeight: 1.6,
}));

const ChatCodeBlockCode = styled('code', {
  name: 'MuiChatCodeBlock',
  slot: 'Code',
  overridesResolver: (_, styles) => styles.code,
})(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: theme.typography.caption.fontSize,
  display: 'block',
  background: 'none',
  padding: 0,
}));

const ChatCodeBlock = React.forwardRef<HTMLDivElement, ChatCodeBlockProps>(
  function ChatCodeBlock(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatCodeBlock' });
    const { children, language, highlighter, className, classes: classesProp, ...other } = props;

    const classes = useChatCodeBlockUtilityClasses(classesProp);

    const [copyState, setCopyState] = React.useState<'idle' | 'copied'>('idle');
    const resetTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
      return () => {
        if (resetTimerRef.current !== null) {
          clearTimeout(resetTimerRef.current);
        }
      };
    }, []);

    const handleCopy = () => {
      // Guard against environments where the async Clipboard API is missing
      // (older browsers, insecure contexts, some test runners). Without this
      // check the click handler throws a TypeError on `undefined.writeText`
      // and bubbles up as an unhandled error (#10).
      if (
        typeof navigator === 'undefined' ||
        typeof navigator.clipboard?.writeText !== 'function'
      ) {
        return;
      }

      navigator.clipboard.writeText(children).then(
        () => {
          setCopyState('copied');
          if (resetTimerRef.current !== null) {
            clearTimeout(resetTimerRef.current);
          }
          resetTimerRef.current = setTimeout(() => setCopyState('idle'), 2000);
        },
        () => {
          // Clipboard write failed (e.g. permissions denied) — no-op
        },
      );
    };

    return (
      <ChatCodeBlockRoot ref={ref} className={clsx(classes.root, className)} {...other}>
        <ChatCodeBlockHeader className={classes.header}>
          <ChatCodeBlockLanguageLabel className={classes.languageLabel}>
            {language ?? ''}
          </ChatCodeBlockLanguageLabel>
          <ChatCodeBlockCopyButton
            type="button"
            className={classes.copyButton}
            onClick={handleCopy}
            title={copyState === 'copied' ? 'Copied!' : 'Copy'}
          >
            {copyState === 'copied' ? <CheckIcon /> : <CopyIcon />}
          </ChatCodeBlockCopyButton>
        </ChatCodeBlockHeader>
        <ChatCodeBlockPre className={classes.pre}>
          <ChatCodeBlockCode className={classes.code}>
            {highlighter ? highlighter(children, language ?? '') : children}
          </ChatCodeBlockCode>
        </ChatCodeBlockPre>
      </ChatCodeBlockRoot>
    );
  },
);

ChatCodeBlock.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The code string to display.
   */
  children: PropTypes.string.isRequired,
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Optional syntax highlighter. Receives the code string and a language identifier,
   * and should return highlighted React nodes. When omitted, raw code is displayed.
   * @param {string} code - The code string to highlight.
   * @param {string} language - The language identifier for syntax highlighting.
   * @returns {React.ReactNode} The highlighted React nodes.
   */
  highlighter: PropTypes.func,
  /**
   * Language identifier shown in the header (e.g. "typescript", "python").
   */
  language: PropTypes.string,
} as any;

export { ChatCodeBlock };
