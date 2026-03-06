#!/usr/bin/env python3
"""Create and open a StackBlitz project via POST API."""

import html
import json
import tempfile
import webbrowser
from pathlib import Path


def create_stackblitz(
    title: str,
    files: dict[str, str],
    dependencies: dict[str, str] | None = None,
    description: str = "",
    template: str = "node",
    initial_file: str | None = None,
    open_browser: bool = True,
) -> str:
    """
    Generate HTML that auto-submits to StackBlitz and open in browser.

    Args:
        title: Project name
        files: Dict of file_path -> content
        dependencies: Dict of package_name -> version
        description: Project description
        template: node, typescript, javascript, angular-cli, or create-react-app
        initial_file: File to display initially (e.g., "src/Demo.tsx")
        open_browser: If True, open in default browser. If False, just create file.

    Returns:
        Path to generated HTML file
    """
    dependencies = dependencies or {}

    # Build file inputs with proper HTML escaping
    file_inputs = "\n      ".join(
        f'<input type="hidden" name="project[files][{path}]" value="{html.escape(content)}"/>'
        for path, content in files.items()
    )

    # Build action URL with optional file param
    action_url = "https://stackblitz.com/run"
    if initial_file:
        from urllib.parse import quote
        action_url += f"?file={quote(initial_file, safe='')}"

    html_content = f"""<!DOCTYPE html>
<html>
  <head>
    <title>Open in StackBlitz</title>
  </head>
  <body>
    <form id="form" method="post" action="{action_url}" target="_self">
      <input type="hidden" name="project[title]" value="{html.escape(title)}"/>
      <input type="hidden" name="project[description]" value="{html.escape(description)}"/>
      <input type="hidden" name="project[template]" value="{html.escape(template)}"/>
      <input type="hidden" name="project[dependencies]" value="{html.escape(json.dumps(dependencies))}"/>
      {file_inputs}
    </form>
    <script>document.getElementById("form").submit();</script>
  </body>
</html>"""

    # Write to temp file
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".html", delete=False, prefix="stackblitz-"
    ) as f:
        f.write(html_content)
        filepath = f.name

    if open_browser:
        webbrowser.open(f"file://{filepath}")
    return filepath


def main():
    """CLI entry point. Reads JSON config from stdin or file."""
    import argparse
    import sys

    parser = argparse.ArgumentParser(description="Create StackBlitz project")
    parser.add_argument(
        "config",
        nargs="?",
        help="JSON config file path (or - for stdin)",
    )
    parser.add_argument(
        "--no-open",
        action="store_true",
        help="Don't open in browser (for agent-browser workflow)",
    )
    args = parser.parse_args()

    # Read config from file, stdin, or use example
    if args.config == "-":
        config = json.load(sys.stdin)
    elif args.config:
        config = json.loads(Path(args.config).read_text())
    else:
        parser.print_help()
        sys.exit(1)

    filepath = create_stackblitz(
        title=config["title"],
        files=config["files"],
        dependencies=config.get("dependencies", {}),
        description=config.get("description", ""),
        template=config.get("template", "node"),
        initial_file=config.get("initial_file"),
        open_browser=not args.no_open,
    )
    if args.no_open:
        print(f"Created: {filepath}")
    else:
        print(f"Opened: {filepath}")


if __name__ == "__main__":
    main()
