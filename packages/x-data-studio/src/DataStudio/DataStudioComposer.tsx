'use client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Tooltip from '@mui/material/Tooltip';
import { createSvgIcon } from '@mui/material/utils';
import { styled } from '../internals/zero-styled';
import type { DataStudioSheetTemplate } from './DataStudio.types';

const SendIcon = createSvgIcon(
  <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />,
  'Send',
);
const SheetIcon = createSvgIcon(
  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" />,
  'Sheet',
);
const BrandIcon = createSvgIcon(
  <path d="M12 3C7.58 3 4 4.34 4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6c0-1.66-3.58-3-8-3zm6 15c0 .35-2.18 1.5-6 1.5s-6-1.15-6-1.5v-2.23c1.42.81 3.66 1.23 6 1.23s4.58-.42 6-1.23V18zm0-5c0 .35-2.18 1.5-6 1.5s-6-1.15-6-1.5v-2.23C7.42 11.58 9.66 12 12 12s4.58-.42 6-1.23V13zM12 10.5c-3.82 0-6-1.15-6-1.5s2.18-1.5 6-1.5 6 1.15 6 1.5-2.18 1.5-6 1.5z" />,
  'Brand',
);

const ComposerRoot = styled('div')(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  overflow: 'auto',
  backgroundColor: (theme.vars || theme).palette.background.default,
}));

const ComposerInner = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  width: '100%',
  maxWidth: 640,
}));

const ComposerHero = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  textAlign: 'center',
}));

const ComposerBrandRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontSize: '0.8125rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: (theme.vars || theme).palette.text.secondary,
}));

const ComposerBrandMark = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 22,
  height: 22,
  borderRadius: '50%',
  backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.14),
  color: (theme.vars || theme).palette.primary.main,
  lineHeight: 1,
  '& svg': { fontSize: 14 },
}));

const ComposerHeading = styled('h2')(({ theme }) => ({
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: 600,
  lineHeight: 1.25,
  color: (theme.vars || theme).palette.text.primary,
}));

const ComposerSubheading = styled('div')(({ theme }) => ({
  fontSize: '0.9375rem',
  color: (theme.vars || theme).palette.text.secondary,
  maxWidth: 480,
}));

const PromptForm = styled('form')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 1, 1, 2),
  borderRadius: 999,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  boxShadow: theme.shadows[1],
  transition: theme.transitions.create(['border-color', 'box-shadow']),
  '&:focus-within': {
    borderColor: (theme.vars || theme).palette.primary.main,
    boxShadow: `${theme.shadows[1]}, 0 0 0 3px ${theme.alpha((theme.vars || theme).palette.primary.main, 0.16)}`,
  },
}));

const PromptInput = styled(InputBase)({
  flex: 1,
  font: 'inherit',
  fontSize: '0.9375rem',
});

const PromptHint = styled('div')(({ theme }) => ({
  alignSelf: 'flex-start',
  marginTop: theme.spacing(-2),
  fontSize: '0.8125rem',
  color: (theme.vars || theme).palette.text.secondary,
}));

const PromptSendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.primary.main,
  color: (theme.vars || theme).palette.primary.contrastText,
  width: 40,
  height: 40,
  transition: theme.transitions.create('background-color'),
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.primary.dark,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.alpha((theme.vars || theme).palette.text.primary, 0.08),
    color: (theme.vars || theme).palette.text.disabled,
  },
}));

const TemplateSectionHeading = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: '0.8125rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: (theme.vars || theme).palette.text.secondary,
  alignSelf: 'flex-start',
}));

const TemplateGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(2),
  width: '100%',
}));

const TemplateCardIcon = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.14),
  color: (theme.vars || theme).palette.primary.main,
  transition: theme.transitions.create(['background-color', 'color']),
  '& svg': { fontSize: 18 },
}));

const TemplateCard = styled('button')(({ theme }) => ({
  appearance: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  cursor: 'pointer',
  font: 'inherit',
  textAlign: 'left',
  color: 'inherit',
  transition: theme.transitions.create(['border-color', 'box-shadow', 'transform']),
  '&:hover': {
    borderColor: (theme.vars || theme).palette.primary.main,
    boxShadow: theme.shadows[2],
    transform: 'translateY(-2px)',
    [`& ${TemplateCardIcon}`]: {
      backgroundColor: theme.alpha((theme.vars || theme).palette.primary.main, 0.2),
    },
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: 'none',
  },
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

const TemplateCardLabel = styled('div')(({ theme }) => ({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: (theme.vars || theme).palette.text.primary,
}));

const TemplateCardDescription = styled('div')(({ theme }) => ({
  fontSize: '0.8125rem',
  lineHeight: 1.4,
  color: (theme.vars || theme).palette.text.secondary,
}));

const ComposerCancelButton = styled('button')(({ theme }) => ({
  appearance: 'none',
  border: 'none',
  background: 'none',
  marginTop: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  font: 'inherit',
  fontSize: '0.8125rem',
  color: (theme.vars || theme).palette.text.secondary,
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    color: (theme.vars || theme).palette.text.primary,
    textDecoration: 'underline',
  },
}));

const TemplatesEmpty = styled('div')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px dashed ${(theme.vars || theme).palette.divider}`,
  fontSize: '0.8125rem',
  color: (theme.vars || theme).palette.text.secondary,
  textAlign: 'center',
}));

export interface DataStudioComposerProps {
  /** Templates surfaced as cards under the prompt input. */
  templates?: ReadonlyArray<DataStudioSheetTemplate>;
  /**
   * Whether the host has wired a Copilot chat adapter. The prompt input is
   * disabled (with an explanatory tooltip) when `false`.
   */
  promptEnabled: boolean;
  /**
   * Called when the user submits a prompt and AI is enabled.
   * @param {string} prompt The submitted prompt text.
   */
  onSubmitPrompt: (prompt: string) => void;
  /**
   * Called when the user activates a template card.
   * @param {string} templateId The id of the picked template.
   */
  onPickTemplate: (templateId: string) => void;
  /**
   * When provided, a "Cancel" affordance is shown so the user can dismiss the
   * Composer without creating a Sheet. Omitted for the empty-studio front door
   * (there's nothing to return to).
   */
  onCancel?: () => void;
}

/**
 * Empty-state / front-door for `<DataStudio>`. Renders when there's nothing
 * to display — typically when no data sources have been provided yet — with:
 *
 *   - a centered prompt input for AI Sheet creation (disabled until a copilot
 *     adapter is wired), and
 *   - a grid of template cards backed by the `sheetTemplates` prop.
 *
 * The built-in templates (Spreadsheet always; Pivot + Chart on premium) are
 * resolved upstream and passed in via `templates`, so cards appear with no
 * consumer wiring. The empty state only shows when the resolved set is empty
 * (e.g. a consumer trimmed every template with `sheetTemplates={() => []}`).
 */
export function DataStudioComposer(props: DataStudioComposerProps) {
  const { templates, promptEnabled, onSubmitPrompt, onPickTemplate, onCancel } = props;
  const [draft, setDraft] = React.useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !promptEnabled) {
      return;
    }
    onSubmitPrompt(trimmed);
    setDraft('');
  };

  const sendButton = (
    <PromptSendButton
      type="submit"
      aria-label="Send prompt"
      disabled={!promptEnabled || draft.trim().length === 0}
    >
      <SendIcon fontSize="small" />
    </PromptSendButton>
  );

  return (
    <ComposerRoot>
      <ComposerInner>
        <ComposerHero>
          <ComposerBrandRow>
            <ComposerBrandMark aria-hidden>
              <BrandIcon />
            </ComposerBrandMark>
            Data Studio
          </ComposerBrandRow>
          <ComposerHeading>What would you like to build?</ComposerHeading>
          <ComposerSubheading>
            Describe what you want, or start with one of the templates below.
          </ComposerSubheading>
        </ComposerHero>

        <PromptForm onSubmit={handleSubmit} aria-label="Create from prompt">
          <PromptInput
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={
              promptEnabled
                ? 'Show me orders broken down by region…'
                : 'Configure Copilot to enable AI sheet creation'
            }
            disabled={!promptEnabled}
            inputProps={{ 'aria-label': 'Prompt' }}
          />
          {promptEnabled ? (
            sendButton
          ) : (
            <Tooltip title="Configure copilotChatAdapter to enable">
              <span>{sendButton}</span>
            </Tooltip>
          )}
        </PromptForm>

        {!promptEnabled ? (
          <PromptHint>Configure copilotChatAdapter to enable AI sheet creation.</PromptHint>
        ) : null}

        <TemplateSectionHeading>Start from a template</TemplateSectionHeading>
        {templates && templates.length > 0 ? (
          <TemplateGrid role="list">
            {templates.map((template) => {
              const Icon = template.icon ?? SheetIcon;
              return (
                <TemplateCard
                  key={template.id}
                  type="button"
                  role="listitem"
                  onClick={() => onPickTemplate(template.id)}
                  aria-label={`Create from ${template.label} template`}
                >
                  <TemplateCardIcon aria-hidden>
                    <Icon />
                  </TemplateCardIcon>
                  <TemplateCardLabel>{template.label}</TemplateCardLabel>
                  {template.description ? (
                    <TemplateCardDescription>{template.description}</TemplateCardDescription>
                  ) : null}
                </TemplateCard>
              );
            })}
          </TemplateGrid>
        ) : (
          <TemplatesEmpty>
            No templates registered yet. Pass <code>sheetTemplates</code> to{' '}
            <code>&lt;DataStudio&gt;</code> to surface starting points.
          </TemplatesEmpty>
        )}

        {onCancel ? (
          <ComposerCancelButton type="button" onClick={onCancel}>
            Cancel
          </ComposerCancelButton>
        ) : null}
      </ComposerInner>
    </ComposerRoot>
  );
}
