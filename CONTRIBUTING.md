# Contributing to MUI X

## MUI X vs. MUI organization

MUI X is an extension of the core open-source libraries of the MUI organization (Material UI, Base UI, MUI System).
The repositories are part of the same codebase.
`mui/mui-x` imports the code infrastructure from [`mui/material-ui`](https://github.com/mui/material-ui).
You can find the "contributing" guide for the main repository in [mui/material-ui/CONTRIBUTING.md](https://github.com/mui/material-ui/blob/HEAD/CONTRIBUTING.md).

Most of the content in the main repository "contributing" guide applies to this repository.
There are, however, a few differences:

- The default GitHub branch might be different.
- The local documentation site opens on a different port: 3001 instead of 3000.
- You would need to sign a contributor license agreement (CLA) if the PR changes code located in the following folders: `x-data-grid-pro`, `x-data-grid-premium`, `x-date-pickers-pro`
- Testing see [/test/README.md](test/README.md) for details.

## Experiments

Run `pnpm docs:dev` and open <http://localhost:3001/experiments/> to browse the experiments.
Add experiment pages to `docs/pages/experiments/<product>/` and demo files to `docs/data/experiments/<product>/`.
Set the page's `getLayout` to render `ExperimentLayout` from `docs/src/modules/components/ExperimentLayout` for the Material UI theme and CSS baseline.
This keeps the sidebar mounted when navigating between experiments.
Pass `fullScreen` to `ExperimentLayout` for a layout that fills the viewport.
The theme follows the documentation site's light/dark mode and text direction preferences.
The sidebar lists all experiment pages by product and remembers its visibility for the browser session.
Restart the docs server after adding or renaming an experiment to refresh the sidebar.
Experiments are available locally and in deployed documentation, including production.
