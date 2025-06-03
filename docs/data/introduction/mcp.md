# Model Context Protocol (MCP) for MUI

<p class="description">Gain access to the official Material UI and code in your AI client.</p>

## Introduction & What is MCP?

The Model Context Protocol (MCP) is a new open standard for connecting AI assistants to real, trusted sources of documentation and code. For MUI X users, this means you get answers that are accurate, up-to-date, and directly reference the official docs.

Want to learn more about MCP? See the [official MCP documentation](https://modelcontextprotocol.io/introduction).

## Why the Model Context Protocol?

Traditional AI coding assistants are excellent at providing answers, especially to straightforward questions. However, when faced with a deeper, more complex question which requires understanding concepts from multiple parts of the documentation, they often hallucinate links, cite non-existent documentation, or provide answers that are hard to verify. MCP solves these problems by:

- Quoting **real, direct sources** in answers
- Linking to **actual documentation** _(no imaginary links that lead to 404s)_
- Using component code from officially published registries

## Getting Started: Installation & Setup

The MCP is available as a separate package and runs locally, communicating via your AI client using the `stdio` transport. Use the following command to test the MCP in the [MCP inspector](https://modelcontextprotocol.io/docs/tools/inspector):

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

### VS Code

Apart from the setup provided above, VS Code requires the following conditions to be met for the MCP to be usable:

1. Enable Agent mode (for Copilot Chat)
2. Add the following to your `settings.json`:

```json
  "chat.mcp.enabled": true,
  "chat.mcp.discovery.enabled": true
```

---

For more details, examples, and troubleshooting, see the full MCP server [documentation and guide on the Material UI Docs](https://mui.com/material-ui/getting-started/mcp)
