import * as React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import type { SxProps } from '@mui/system';
import type { Theme } from '@mui/material/styles';

function ContentCopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

export interface CodeBlockSlotProps {
  root?: { sx?: SxProps<Theme>; className?: string };
  header?: { sx?: SxProps<Theme>; className?: string };
  languageLabel?: { sx?: SxProps<Theme>; className?: string };
  copyButton?: { sx?: SxProps<Theme>; className?: string; 'aria-label'?: string };
  pre?: { sx?: SxProps<Theme>; className?: string };
  code?: React.HTMLAttributes<HTMLElement>;
}

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  maxHeight?: number | string;
  showLineNumbers?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  slotProps?: CodeBlockSlotProps;
}

function toSxArray(sx: SxProps<Theme>) {
  return Array.isArray(sx) ? sx : [sx];
}

function mergeSx(defaultSx: SxProps<Theme>, sx: SxProps<Theme> | undefined): SxProps<Theme> {
  return sx ? [...toSxArray(defaultSx), ...toSxArray(sx)] : defaultSx;
}

export function CodeBlock({
  code,
  language = 'tsx',
  filename,
  maxHeight,
  showLineNumbers = false,
  copyLabel = 'Copy code',
  copiedLabel = 'Copied!',
  slotProps,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const lines = React.useMemo(() => code.split('\n'), [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Box
      className={slotProps?.root?.className}
      sx={mergeSx(
        {
          position: 'relative',
          borderRadius: 2,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100'),
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        },
        slotProps?.root?.sx,
      )}
    >
      <Box
        className={slotProps?.header?.className}
        sx={mergeSx(
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            px: 1.5,
            py: 0.75,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200'),
          },
          slotProps?.header?.sx,
        )}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            className={slotProps?.languageLabel?.className}
            sx={mergeSx(
              {
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
              },
              slotProps?.languageLabel?.sx,
            )}
          >
            {language}
          </Typography>
          {filename ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {filename}
            </Typography>
          ) : null}
        </Box>
        <Tooltip title={copied ? copiedLabel : copyLabel}>
          <IconButton
            size="small"
            onClick={handleCopy}
            className={slotProps?.copyButton?.className}
            aria-label={slotProps?.copyButton?.['aria-label'] ?? copyLabel}
            sx={mergeSx(
              {
                color: copied ? 'success.main' : 'text.secondary',
              },
              slotProps?.copyButton?.sx,
            )}
          >
            {copied ? <CheckIcon /> : <ContentCopyIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        component="pre"
        className={slotProps?.pre?.className}
        sx={mergeSx(
          {
            m: 0,
            p: 1.5,
            maxHeight,
            overflow: 'auto',
            fontSize: '0.8125rem',
            lineHeight: 1.6,
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
            '& code': {
              fontFamily: 'inherit',
            },
          },
          slotProps?.pre?.sx,
        )}
      >
        {showLineNumbers ? (
          <Box
            component="code"
            {...slotProps?.code}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto minmax(0, 1fr)',
              columnGap: 1.5,
            }}
          >
            {lines.map((line, index) => (
              <React.Fragment key={`${index}-${line}`}>
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{
                    color: 'text.disabled',
                    textAlign: 'right',
                    userSelect: 'none',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {index + 1}
                </Box>
                <Box component="span" sx={{ minWidth: 0, whiteSpace: 'pre' }}>
                  {line || ' '}
                </Box>
              </React.Fragment>
            ))}
          </Box>
        ) : (
          <code {...slotProps?.code}>{code}</code>
        )}
      </Box>
    </Box>
  );
}
