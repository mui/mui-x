---
productId: x-chat
title: Customization overview
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Customization overview

<p class="description">Choose the right API to customize the Chat — from theme tokens to slot overrides and custom part renderers.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Choosing the right API

| I want to...                                                  | Use                         | Where                                                                                             |
| :------------------------------------------------------------ | :-------------------------- | :------------------------------------------------------------------------------------------------ |
| Change colors, fonts, spacing                                 | `ThemeProvider`             | [Look and feel](/x/react-chat/customization/look-and-feel/#theme-component-overrides)             |
| Apply one-off styles to this instance                         | `sx` prop                   | [Look and feel](/x/react-chat/customization/look-and-feel/#applying-one-off-styles-with-sx)       |
| Switch between bubble and flat layout                         | `variant` / `density` props | [Look and feel](/x/react-chat/customization/look-and-feel/#choosing-a-layout-style)               |
| Use Tailwind CSS                                              | Headless primitives         | [Look and feel](/x/react-chat/customization/look-and-feel/#tailwind-css)                          |
| Pass extra props to a subcomponent                            | `slotProps`                 | [Structure](/x/react-chat/customization/structure/#passing-extra-props-to-slots)                  |
| Replace a subcomponent entirely                               | `slots`                     | [Structure](/x/react-chat/customization/structure/#swapping-slots)                                |
| Render custom message types (tickets, charts, and so on)      | `partRenderers`             | [Structure](/x/react-chat/customization/structure/#rendering-tool-calls-as-cards-instead-of-json) |
| Hide a built-in feature (attach, scroll-to-bottom, and so on) | `features` prop             | [Structure](/x/react-chat/customization/structure/#feature-flags)                                 |
| Translate the UI                                              | `localeText`                | [Structure](/x/react-chat/customization/structure/#localization)                                  |

:::warning
Replacing a slot replaces its built-in keyboard navigation and ARIA wiring too. When you swap `slots`, re-apply the props your component receives—see [Structure](/x/react-chat/customization/structure/#swapping-slots).
:::

## Customization layers

Styling and structure APIs stack—each layer wins over the one above it, so reach for the lightest layer that solves the problem:

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

The remaining APIs from the table aren't part of this stack—`variant`/`density` (layout style), the `features` prop (visibility), and `localeText` (strings) are orthogonal switches that work alongside any layer, while the headless primitives (Tailwind CSS) replace the stack entirely rather than layering on it.

## The 80/20 rule

Most apps only need the top two layers:

```tsx
<ThemeProvider theme={myTheme}>
  <ChatBox adapter={adapter} sx={{ height: 600 }} />
</ThemeProvider>
```

{{"demo": "EightyTwentyDemo.js", "bg": "inline"}}

Reach for `slots` or `partRenderers` only when the theme can't express what you need—for example, replacing the Composer with a fully custom input, or rendering tool-call results as cards instead of JSON.

## Next steps

- [Look and feel](/x/react-chat/customization/look-and-feel/)—theming, brand examples (Slack, WhatsApp, ChatGPT, Claude, v0.dev), Tailwind
- [Structure](/x/react-chat/customization/structure/)—customization recipes, slots, `slotProps`, feature flags, structural props, part renderers, and localization
