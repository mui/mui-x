// The block period that the CSS spec recommends for `font-display: block`.
const FONT_TIMEOUT = 3000;

/**
 * Starts the web font loads of the document and waits for them to settle.
 * `print()` does not wait for web fonts, so without this it can use a fallback font.
 * Stops waiting after 3 seconds, so a stalled font does not block the export.
 * @param document Document whose fonts to load
 */
export async function waitForFonts(document: Document): Promise<void> {
  // jsdom has no `fonts`.
  if (!document.fonts) {
    return;
  }

  // `fonts.ready` resolves at once until a layout starts the font loads.
  document.body.getBoundingClientRect();

  let timeout: ReturnType<typeof setTimeout> | undefined;
  await Promise.race([
    document.fonts.ready,
    new Promise<void>((resolve) => {
      timeout = setTimeout(resolve, FONT_TIMEOUT);
    }),
  ]);
  clearTimeout(timeout);
}
