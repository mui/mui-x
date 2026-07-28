import { z } from 'zod';

const designContextSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('figma'),
    nodeId: z.string().min(1).optional(),
    fileUrl: z.string().optional(),
    thumbnailDataUrl: z.string().optional(),
    variables: z.unknown().optional(),
    node: z.unknown().optional(),
  }),
  z.object({
    type: z.literal('opaque'),
    payload: z.unknown().optional(),
  }),
]);

// Mirrors the recipes-backend's `MuiPairing`, kept self-contained. Keep in sync when the backend
// adds a new major version.
const muiPairingSchema = z.object({
  material: z
    .enum(['v5', 'v6', 'v7', 'v9'])
    .describe('Material UI major version. v8 was skipped; valid values are v5, v6, v7, v9.'),
  muiX: z.enum(['v5', 'v6', 'v7', 'v8', 'v9']).describe('MUI X products major version.'),
});

// Loose schema for the pairing the backend echoes back: plain strings so a future major the request
// enum doesn't list yet won't get rejected.
const muiPairingResponseSchema = z.object({
  material: z.string(),
  muiX: z.string(),
});

export const inputSchema = z.object({
  prompt: z.string().min(1).describe('Natural-language brief for the codegen run.'),
  threadId: z
    .string()
    .min(1)
    .optional()
    .describe(
      'Continue an existing conversation. Must be owned by the caller. Omit to start a new thread.',
    ),
  designContext: designContextSchema
    .optional()
    .describe(
      'Design tool context. Use the `figma` variant when the host has a Figma frame in scope; `opaque` is the escape hatch for other tools (Penpot, Sketch, screenshots).',
    ),
  muiPairing: muiPairingSchema
    .optional()
    .describe(
      "Target MUI / MUI X version pairing. Detect from the project's `package.json` (`@mui/material` and `@mui/x-data-grid` ranges) and pass accordingly. Omit to default to the latest stable pairing (currently Material UI v9 + MUI X v9).",
    ),
  model: z.string().optional().describe('Optional model override; otherwise the backend default.'),
});

export const outputSchema = z.object({
  threadId: z.string(),
  files: z.array(
    z.object({
      filename: z.string(),
      contents: z.string(),
    }),
  ),
  explanation: z.string(),
  // Effective pairing the backend applied (the request, the thread's locked pairing, or the
  // default). Shown in the footer.
  muiPairing: muiPairingResponseSchema.optional(),
});

export const generateResponseSchema = z.object({
  threadId: z.string(),
  runId: z.string(),
  muiPairing: muiPairingResponseSchema.optional(),
});

// From the response schema, so the footer renders whatever effective pairing the backend returns.
export type MuiPairing = z.infer<typeof muiPairingResponseSchema>;

/** Structured result of a `generateReactCode` run. Hosts import this instead of re-declaring it. */
export type GenerateReactCodeResult = z.output<typeof outputSchema>;
