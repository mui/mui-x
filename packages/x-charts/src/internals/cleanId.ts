/**
 * Remove spaces to have viable ids
 */
export function cleanId(id: string) {
  return id.replace(' ', '_');
}
