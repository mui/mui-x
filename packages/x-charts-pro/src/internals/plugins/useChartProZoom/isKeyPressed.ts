'use client';
export function isKeyPressed(set: Set<string>, keys?: string[]): boolean {
  if (!keys || keys.length === 0) return true;
  return keys.every((key) => {
    if (key === 'Shift') return set.has('Shift');
    if (key === 'Control') return set.has('Control');
    if (key === 'Alt') return set.has('Alt');
    if (key === 'Meta') return set.has('Meta');
    if (key === 'ControlOrMeta') return set.has('Control') || set.has('Meta');
    // For letter keys
    return set.has(key);
  });
}
