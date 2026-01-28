# Model Context Protocol (MCP) for MUI

<p class="description">Gain access to the official docs and code examples in your AI client.</p>

## What is MCP?

The Model Context Protocol (MCP) is a new open standard for connecting AI assistants to real, trusted sources of documentation and code.
For users, this means you get answers that are accurate, up-to-date, and directly reference the official docs.

Want to learn more about MCP?
See the [official MCP documentation](https://modelcontextprotocol.io/docs/getting-started/intro).

## Why MCP?

Popular AI coding assistants are excellent at providing answers, especially to straightforward questions.
However, when faced with a deeper, more complex question which requires understanding concepts from multiple parts of the documentation, they often hallucinate links, cite non-existent documentation, or provide answers that are hard to verify.
MCP solves these problems by:

- Quoting **real, direct sources** in answers
- Linking to **actual documentation** - no imaginary links that lead to 404s
- Using component code from officially published registries

## Installation & Setup

The MCP is available as a separate package that runs locally and communicates via your AI client using the `stdio` transport.
Use the following command to test the MCP in the [MCP inspector](https://modelcontextprotocol.io/docs/tools/inspector):

```bash
npx -y @mui/mcp@latest
```

### Cursor/Windsurf

1. Open MCP configuration in Windsurf ("Settings" -> "MCP" -> "Add Server")
2. Add a new MCP:

```json
"mcp": {
  "servers": {
    "mui-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@mui/mcp@latest"]
    }
  }
}
```

### VS Code

Apart from the setup provided above, VS Code requires the following conditions to be met for the MCP to be usable:

1. Enable Agent mode (for Copilot Chat)
2. Add the following to your `settings.json`:

```json
  "chat.mcp.enabled": true,
  "chat.mcp.discovery.enabled": true
```

### Zed

There are two ways you can add the Material UI MCP server in Zed:

#### As an extension

Go to the Extensions page either via the keybinding `cmd-shift-x`/`ctrl-shift-x` (macOS/Linux), or via the Command Palette, searching for `zed: extensions`.

Then, search for "MUI MCP" and install the extension.
No configuration is required to have this server working, but you can optionally add the `preferred_theme` and `component_filter` fields.

#### As a custom server

This approach is essentially the same as adding it in VS Code and forks.

1. Search for `agent: add context server` in the Command Palette.
2. Add the following JSON in the modal:

```json
{
  "mui-mcp-server": {
    "command": {
      "path": "npx",
      "args": ["-y", "@mui/mcp@latest"]
      "env": {}
    }
  }
}
```

---

For more details, examples, and troubleshooting, see the full MCP server [documentation and guide on the Material UI Docs](https://mui.com/material-ui/getting-started/mcp/)
