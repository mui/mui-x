import path from 'path';
import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import readFile from '../../../util/readFile';

const SLOT_RENAMES: Record<string, string> = {
  // Message family
  messageGroup: 'group',
  messageRoot: 'message',
  messageAvatar: 'avatar',
  messageContent: 'content',
  messageMeta: 'meta',
  messageActions: 'actions',
  // Composer family
  composerRoot: 'composer',
  composerInput: 'input',
  composerSendButton: 'send',
  composerAttachButton: 'attach',
  composerAttachmentList: 'attachmentList',
  composerToolbar: 'toolbar',
  composerHelperText: 'helperText',
};

// Slot keys we rename only when they appear inside a `slots` or `slotProps`
// JSX attribute (object expression). Renaming everywhere would clash with
// locale-text keys (e.g. `composerSendButtonLabel`).
const SLOT_ATTRIBUTE_NAMES = new Set(['slots', 'slotProps']);

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  // Find every <JSXAttribute name="slots"|"slotProps" value={{ ... }}> and
  // rename matching property keys inside the object expression.
  root.find(j.JSXAttribute).forEach((attrPath) => {
    const node = attrPath.node;
    const attrName = node.name && node.name.type === 'JSXIdentifier' ? node.name.name : null;
    if (!attrName || !SLOT_ATTRIBUTE_NAMES.has(attrName)) {
      return;
    }
    if (!node.value || node.value.type !== 'JSXExpressionContainer') {
      return;
    }
    const expr = node.value.expression;
    if (!expr || expr.type !== 'ObjectExpression') {
      return;
    }
    expr.properties.forEach((prop: any) => {
      if (prop.type !== 'ObjectProperty' && prop.type !== 'Property') {
        return;
      }
      const key = prop.key;
      if (!key) {
        return;
      }
      if (key.type === 'Identifier' && SLOT_RENAMES[key.name]) {
        prop.key = j.identifier(SLOT_RENAMES[key.name]);
        // If the property was using shorthand (key === value), keep it shorthand by
        // also re-pointing the value identifier when names match.
        if (prop.shorthand) {
          prop.shorthand = false;
        }
      } else if (key.type === 'StringLiteral' && SLOT_RENAMES[key.value]) {
        prop.key = j.identifier(SLOT_RENAMES[key.value]);
      } else if (key.type === 'Literal' && typeof key.value === 'string' && SLOT_RENAMES[key.value]) {
        prop.key = j.identifier(SLOT_RENAMES[key.value]);
      }
    });
  });

  return root.toSource(printOptions);
}

export const testConfig = () => ({
  name: 'rename-slots',
  specFiles: [
    {
      name: 'rename slot keys on ChatBox',
      actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
      expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
    },
  ],
});
