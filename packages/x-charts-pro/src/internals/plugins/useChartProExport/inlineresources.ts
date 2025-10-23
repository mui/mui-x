/**
 * Inline resources implementation
 * Based on inlineresources library functionality
 */

interface InlineOptions {
  baseUrl?: string;
  cache?: boolean | 'none' | 'repeated';
  cacheBucket?: Record<string, any>;
  nonce?: string;
}

interface ErrorReport {
  resourceType: string;
  url?: string;
  msg: string;
}

/**
 * Get the data URI for an image URL
 */
async function getDataURIForImageURL(url: string, _options: InlineOptions = {}): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Failed to convert image to data URI: ${url}`));
    reader.readAsDataURL(blob);
  });
}

/**
 * Inline image elements
 */
async function inlineImages(doc: Document, options: InlineOptions = {}): Promise<ErrorReport[]> {
  const images = Array.from(doc.getElementsByTagName('img'));
  const svgImages = Array.from(doc.getElementsByTagName('image'));
  const inputImages = Array.from(doc.getElementsByTagName('input')).filter(
    (input) => input.type === 'image',
  );

  const allImages = [...images, ...svgImages, ...inputImages];
  const errors: ErrorReport[] = [];

  await Promise.all(
    allImages.map(async (img) => {
      try {
        let src: string | null = null;

        if (img.hasAttribute('src')) {
          src = img.getAttribute('src');
        } else if (img.hasAttributeNS('http://www.w3.org/1999/xlink', 'href')) {
          src = img.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
        } else if (img.hasAttribute('href')) {
          src = img.getAttribute('href');
        }

        if (src && !src.startsWith('data:')) {
          const dataUri = await getDataURIForImageURL(src, options);

          if (img.hasAttribute('src')) {
            img.setAttribute('src', dataUri);
          } else if (img.hasAttributeNS('http://www.w3.org/1999/xlink', 'href')) {
            img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', dataUri);
          } else if (img.hasAttribute('href')) {
            img.setAttribute('href', dataUri);
          }
        }
      } catch (error) {
        errors.push({
          resourceType: 'image',
          url: img.getAttribute('src') || '',
          msg: `Unable to load image: ${error}`,
        });
      }
    }),
  );

  return errors;
}

/**
 * Inline CSS background images
 */
async function inlineBackgroundImages(
  doc: Document,
  options: InlineOptions = {},
): Promise<ErrorReport[]> {
  const errors: ErrorReport[] = [];
  const elements = doc.getElementsByTagName('*');

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i] as HTMLElement;
    const style = window.getComputedStyle(element);
    const backgroundImage = style.backgroundImage;

    if (backgroundImage && backgroundImage !== 'none') {
      const urlMatch = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (urlMatch && !urlMatch[1].startsWith('data:')) {
        try {
          const dataUri = await getDataURIForImageURL(urlMatch[1], options);
          element.style.backgroundImage = `url("${dataUri}")`;
        } catch (error) {
          errors.push({
            resourceType: 'backgroundImage',
            url: urlMatch[1],
            msg: `Unable to load background image: ${error}`,
          });
        }
      }
    }
  }

  return errors;
}

/**
 * Inline external stylesheets
 */
async function inlineStylesheets(
  doc: Document,
  options: InlineOptions = {},
): Promise<ErrorReport[]> {
  const links = Array.from(doc.getElementsByTagName('link')).filter(
    (link) => link.rel === 'stylesheet' && (!link.type || link.type === 'text/css'),
  );

  const errors: ErrorReport[] = [];

  await Promise.all(
    links.map(async (link) => {
      try {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('data:')) {
          const response = await fetch(href);
          const cssText = await response.text();

          const style = doc.createElement('style');
          style.type = 'text/css';
          if (options.nonce) {
            style.nonce = options.nonce;
          }
          style.textContent = cssText;

          link.parentNode?.insertBefore(style, link);
          link.parentNode?.removeChild(link);
        }
      } catch (error) {
        errors.push({
          resourceType: 'stylesheet',
          url: link.getAttribute('href') || '',
          msg: `Unable to load stylesheet: ${error}`,
        });
      }
    }),
  );

  return errors;
}

/**
 * Inline fonts from @font-face rules
 */
async function inlineFonts(doc: Document, options: InlineOptions = {}): Promise<ErrorReport[]> {
  const errors: ErrorReport[] = [];
  const styleSheets = Array.from(doc.styleSheets);

  for (const styleSheet of styleSheets) {
    try {
      const rules = Array.from(styleSheet.cssRules || []);

      for (const rule of rules) {
        if (rule.type === CSSRule.FONT_FACE_RULE) {
          const fontFaceRule = rule as CSSFontFaceRule;
          const src = fontFaceRule.style.getPropertyValue('src');

          if (src) {
            const urlMatches = src.match(/url\(['"]?([^'"]+)['"]?\)/g);
            if (urlMatches) {
              let newSrc = src;

              for (const urlMatch of urlMatches) {
                const url = urlMatch.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1];
                if (url && !url.startsWith('data:')) {
                  try {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const dataUri = await new Promise<string>((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result as string);
                      reader.onerror = (e) =>
                        reject(new Error('Failed to read font', { cause: e }));
                      reader.readAsDataURL(blob);
                    });

                    newSrc = newSrc.replace(urlMatch, `url("${dataUri}")`);
                  } catch (error) {
                    errors.push({
                      resourceType: 'font',
                      url,
                      msg: `Unable to load font: ${error}`,
                    });
                  }
                }
              }

              fontFaceRule.style.setProperty('src', newSrc);
            }
          }
        }
      }
    } catch (error) {
      // Some stylesheets might not be accessible due to CORS
      continue;
    }
  }

  return errors;
}

/**
 * Inline all external resources in a document
 */
export async function inlineReferences(
  doc: Document,
  options: InlineOptions = {},
): Promise<ErrorReport[]> {
  const allErrors: ErrorReport[] = [];

  // Inline images
  const imageErrors = await inlineImages(doc, options);
  allErrors.push(...imageErrors);

  // Inline stylesheets
  const stylesheetErrors = await inlineStylesheets(doc, options);
  allErrors.push(...stylesheetErrors);

  // Inline background images
  const bgErrors = await inlineBackgroundImages(doc, options);
  allErrors.push(...bgErrors);

  // Inline fonts
  const fontErrors = await inlineFonts(doc, options);
  allErrors.push(...fontErrors);

  return allErrors;
}
