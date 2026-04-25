---
productId: x-chat
title: Customization Overview
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Customization

<p class="description">Pick the right API for what you want to change. Everything in ChatBox is customizable — the only question is which knob to reach for.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Which API should I use?

| I want to... | Use | Where |
| :--- | :--- | :--- |
| Change colors, fonts, spacing | `ThemeProvider` | [Look & Feel](/x/react-chat/customization/look-and-feel/) |
| Apply one-off styles to this instance | `sx` prop | [Look & Feel](/x/react-chat/customization/look-and-feel/) |
| Switch between bubble and flat layout | `variant` / `density` props | [Look & Feel](/x/react-chat/customization/look-and-feel/) |
| Use Tailwind CSS | Headless primitives | [Look & Feel](/x/react-chat/customization/look-and-feel/) |
| Pass extra props to a subcomponent | `slotProps` | [Structure](/x/react-chat/customization/structure/) |
| Replace a subcomponent entirely | `slots` | [Structure](/x/react-chat/customization/structure/) |
| Render custom message types (tickets, charts, ...) | `partRenderers` | [Structure](/x/react-chat/customization/structure/) |
| Hide a built-in feature (attach, scroll-to-bottom, ...) | `features` prop | [Structure](/x/react-chat/customization/structure/) |
| Translate the UI | `localeText` | [Structure](/x/react-chat/customization/structure/) |

## Customization layers

Each layer wins over the one above it — reach for the lightest layer that solves your problem.

```text
theme          ← global rules for your whole app
  ↓
sx             ← one-off styles on a single ChatBox
  ↓
slotProps      ← extra props on a specific subcomponent
  ↓
slots          ← replace a subcomponent with your own
  ↓
partRenderers  ← render a specific message part type
```

## The 80/20 rule

Most apps only need the top two layers:

```tsx
<ThemeProvider theme={myTheme}>
  <ChatBox adapter={adapter} sx={{ height: 600 }} />
</ThemeProvider>
```

Reach for `slots` or `partRenderers` only when the theme can't express what you need — for example, replacing the composer with a fully custom input, or rendering tool-call results as cards instead of JSON.

## Next steps

- [Look & Feel](/x/react-chat/customization/look-and-feel/) — theming, brand examples (Slack, WhatsApp, ChatGPT, Claude, v0.dev), Tailwind
- [Structure](/x/react-chat/customization/structure/) — slots, `slotProps`, feature flags, custom part renderers, localization
