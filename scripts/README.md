# MUI Scripts

## Release

A typical release goes like this:

### Prepare the release of the packages

The following steps must be proposed as a pull request.

1. Compare the last tag with the branch upon which you want to release (`next` for the alpha / beta releases and `master` for the current stable version).
   To do so, use `yarn release:changelog` The options are the following:

   ```bash
   yarn release:changelog
      --githubToken   YOUR_GITHUB_TOKEN (needs "public_repo" permission)
      --lastRelease   The release to compare against (default: the last one)
      --release       The branch to release (default: master)
   ```

   You can also provide the github token by setting `process.env.GITHUB_TOKEN` variable.

   In case of problem, another method to generate the changelog is available at the end of this page.

2. Clean the generated changelog, to match the format of [https://github.com/mui-org/material-ui-x/releases](https://github.com/mui-org/material-ui-x/releases).
3. Update the root `package.json`'s version
4. Update the versions of the other `package.json` files and of the dependencies with `yarn release:version`.
5. Open PR with changes and wait for review and green CI.
6. Merge PR once CI is green, and it has been approved.

### Release the packages

1. Checkout the last version of the working branch
2. Make sure you have the latest dependencies installed: `yarn`.
3. Build the packages: `yarn release:build`.
4. Release the versions on NPM: `yarn release:publish` (you need your 2FA device).
5. Create a new tag named with the release you just did `git tag v4.0.0-alpha.30 && git push upstream --tag`

### Publish the documentation

The documentation must be updated on the `docs-vX` branch (`docs-v4` for `v4.X` releases, `docs-v5` for `v5.X` releases, ...)
Push the working branch on the documentation release branch to deploy the documentation with the latest changes.

```sh
git push upstream master:docs-v5 -f
```

You can follow the deployment process [on the Netlify Dashboard](https://app.netlify.com/sites/material-ui-x/deploys?filter=docs-v5)
Once deployed, it will be accessible at https://material-ui-x.netlify.app/ for the `docs-v5` deployment.

### Announce

Follow the instructions in https://mui-org.notion.site/Releases-7490ef9581b4447ebdbf86b13164272d.

## Manual changelog generation

1. Compare the last tag with the branch upon which you want to release (`next` for the alpha / beta releases and `master` for the current stable version).

For instance: [https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.9...master](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.9...master) (if you want to release `master` and the last tag is `v4.0.0-alpha.9`)
You can use the following script in your browser console on any GitHub page to automatically navigate to the page comparing `master` with the last tag.

```js
(async () => {
  const releaseBranch = 'master';
  const tagResponse = await fetch(
    'https://api.github.com/repos/mui-org/material-ui-x/tags?per_page=1',
  );
  const tagData = await tagResponse.json();
  const lastTag = tagData[0].name;
  const diffPage = `https://github.com/mui-org/material-ui-x/compare/${lastTag}...${releaseBranch}`;
  window.location.href = diffPage;
})();
```
