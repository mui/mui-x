# Scripts

## Release

> Tip: For people who are doing the release for the first time, make sure you sign in to npm from the command line using security-key flow as well as have two-factor authentication enabled.
> You can follow [this guide](https://docs.npmjs.com/accessing-npm-using-2fa) for more information on how to set it up.

> Tip: You can use `release:publish:dry-run` to test the release process without actually publishing the packages.
> Be sure install [verdaccio](https://verdaccio.org/) (local npm registry) before doing it.

> Tip: You can copy raw markdown checklist below to the release Pull Request and follow it step by step marking completed items.

A typical release goes like this:

### Prepare the release of the packages

The following steps must be proposed as a pull request.

1. Compare the last tag with the branch upon which you want to release (`next` for the alpha / beta releases and `master` for the current stable version).
   To do so, use `pnpm release:changelog` The options are the following:

```bash
pnpm release:changelog
   --githubToken   YOUR_GITHUB_TOKEN (needs "public_repo" permission)
   --lastRelease   The release to compare against (default: the last one)
   --release       The branch to release (default: master)
```

> :warning: the script will add a separator string in form of a comment like this right after the highlights:
> `<!--/ DO_NOT_REMOVE /-->`
> This string needs to stay where it gets inserted for the automated discord announcement to work.

You can also provide the GitHub token by setting `process.env.GITHUB_TOKEN` variable.

In case of a problem, another method to generate the changelog is available at the end of this page.

2. Clean the generated changelog, to match the format of [https://github.com/mui/mui-x/releases](https://github.com/mui/mui-x/releases).
3. Update the root `package.json`'s version
4. Update the versions of the other `package.json` files and of the dependencies with `pnpm release:version` (`pnpm release:version prerelease` for alpha / beta releases).
5. Open PR with changes and wait for review and green CI.
6. Once CI is green and you have enough approvals, send a message on the `team-x` slack channel announcing a merge freeze.
7. Merge PR.

### Release the packages

1. Checkout the last version of the working branch
2. `pnpm i && pnpm release:build` (make sure you have the latest dependencies installed, and build the packages)
3. `pnpm release:publish` (release the versions on npm, you need your 2FA device)
4. `pnpm release:tag` (push the newly created tag)

### Publish the documentation

The documentation must be updated on the `docs-vX` branch (`docs-v4` for `v4.X` releases, `docs-v5` for `v5.X` releases, ...)

Push the working branch on the documentation release branch to deploy the documentation with the latest changes.

<!-- #default-branch-switch -->

```bash
git push -f upstream master:docs-v7
```

You can follow the deployment process [on the Netlify Dashboard](https://app.netlify.com/sites/material-ui-x/deploys?filter=docs-v7)
Once deployed, it will be accessible at https://material-ui-x.netlify.app/ for the `docs-v7` deployment.

### Publish GitHub release

After documentation is deployed, publish a new release on [GitHub releases page](https://github.com/mui/mui-x/releases)

Create a new release on the newly published tag, then copy/paste the new changes in the changelog while removing the "version" and "date" sections. If in doubt, check the previous release notes.

### Announce

Follow the instructions in https://mui-org.notion.site/Releases-7490ef9581b4447ebdbf86b13164272d.

## A script failed, what can I do?

### Manual changelog generation

Compare the last tag with the branch upon which you want to release (`next` for the alpha / beta releases and `master` for the current stable version).

For instance: [https://github.com/mui/mui-x/compare/v4.0.0-alpha.9...master](https://github.com/mui/mui-x/compare/v4.0.0-alpha.9...master) (if you want to release `master` and the last tag is `v4.0.0-alpha.9`)
You can use the following script in your browser console on any GitHub page to automatically navigate to the page comparing `master` with the last tag.

```js
(async () => {
  const releaseBranch = 'master';
  const tagResponse = await fetch('https://api.github.com/repos/mui/mui-x/tags?per_page=1');
  const tagData = await tagResponse.json();
  const lastTag = tagData[0].name;
  const diffPage = `https://github.com/mui/mui-x/compare/${lastTag}...${releaseBranch}`;
  window.location.href = diffPage;
})();
```

### Manually create the release tag

If the `pnpm release:tag` fails you can create and push the tag using the following command: `git tag -a v4.0.0-alpha.30 -m "Version 4.0.0-alpha.30" && git push upstream --tag`.

### release:publish failed

If you receive an error message like `There are no new packages that should be published`. Ensure you are publishing to the correct registry, not `verdaccio` or anything else. If you need to reset your configuration, you can run `npm config delete registry`.
