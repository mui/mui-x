'use client';
import * as React from 'react';
import { styled } from '../internals/zero-styled';

const Root = styled('div')(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  color: (theme.vars || theme).palette.text.secondary,
  textAlign: 'center',
}));

const Card = styled('div')(({ theme }) => ({
  maxWidth: 420,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: (theme.vars || theme).palette.background.paper,
}));

const Heading = styled('div')(({ theme }) => ({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: (theme.vars || theme).palette.text.primary,
}));

const Body = styled('div')({
  fontSize: '0.8125rem',
  lineHeight: 1.5,
});

const Code = styled('code')(({ theme }) => ({
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '0.8125rem',
  padding: theme.spacing(0, 0.5),
  borderRadius: 4,
  backgroundColor: (theme.vars || theme).palette.action.hover,
}));

export interface UnknownViewTypeProps {
  /** The unrecognized view type from the active Sheet. */
  type: string;
}

/**
 * Fallback rendered when a Sheet's `type` does not match any registered view
 * type. Surfaces the missing key so the developer knows what to register.
 */
export function UnknownViewType({ type }: UnknownViewTypeProps) {
  return (
    <Root>
      <Card>
        <Heading>Unknown view type</Heading>
        <Body>
          The active sheet uses view type <Code>{type || '(empty)'}</Code>, but no matching
          renderer is registered.
        </Body>
        <Body>
          Pass a <Code>DataStudioViewType</Code> for <Code>{type || '(empty)'}</Code> via the{' '}
          <Code>viewTypes</Code> prop on <Code>&lt;DataStudio&gt;</Code>.
        </Body>
      </Card>
    </Root>
  );
}
