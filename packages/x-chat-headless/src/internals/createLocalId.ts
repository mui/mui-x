/**
 * Generates a unique local identifier for messages and attachments.
 */
export function createLocalId() {
  return crypto.randomUUID();
}
