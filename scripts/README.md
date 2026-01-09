# Scripts

## Release

> Tip: For people who are doing the release for the first time, make sure you sign in to npm from the command line using security-key flow as well as have two-factor authentication enabled.
> You can follow [this guide](https://docs.npmjs.com/accessing-npm-using-2fa) for more information on how to set it up.

> Tip: You can use `release:publish:dry-run` to test the release process without actually publishing the packages.
> Be sure install [verdaccio](https://verdaccio.org/) (local npm registry) before doing it.

> Tip: You can copy raw markdown checklist below to the release Pull Request and follow it step by step marking completed items.

A typical release goes like this:

### Prepare the release of the packages

> [!INFO]
> You can now use the new automated release preparation script by running `pnpm release:prepare`. This script automates steps 1-5 below by:
>
> - Asking for the major version to update (v8.x, v7.x, v6.x, etc.)
> - Determining the new version based on the selected major version:
>   - For non-latest major versions: patch/minor/custom
>   - For latest major version: patch/minor/major/custom and prerelease options:
>     - Start alpha prerelease (if no prerelease exists)
>     - Increase alpha version or start beta (if alpha exists)
>     - Increase beta version or go to major (if beta exists)
> - Creating a new branch from upstream/master (for latest major) or upstream/vX.x (for older versions)
> - Updating the root package.json and all product package versions
> - Generating and formatting the changelog
> - Creating a PR with all changes and a complete checklist
>
> This script is fully interactive and will guide you through the release process.

The following steps must be proposed as a pull request.

1. Compare the last tag with the branch upon which you want to release (`next` for the alpha / beta releases and `master` for the current stable version).
   To do so, use `pnpm release:changelog` The options are the following:

```bash
pnpm release:changelog
   --githubToken   YOUR_GITHUB_TOKEN (needs "public_repo" permission)
   --lastRelease   The release to compare against (default: the last one)
   --release       The branch to release (default: master)
   --nextVersion   Expected version of the next release (if not provided, __VERSION__ placeholders must be updated manually)
```

> :warning: the script will add a separator string in form of a comment like this right after the highlights:
> `<!--/ DO_NOT_REMOVE /-->`
> This string needs to stay where it gets inserted for the automated discord announcement to work.

You can also provide the GitHub token by setting `process.env.GITHUB_TOKEN` variable.

In case of a problem, another method to generate the changelog is available at the end of this page.

2. Clean the generated changelog, to match the format of [https://github.com/mui/mui-x/releases](https://github.com/mui/mui-x/releases).
3. Update the root `package.json`'s version
4. Update the versions of the other `package.json` files and of the dependencies with `pnpm release:version` (`pnpm release:version prerelease` for alpha / beta releases).

> [!WARNING]
> Make sure of the following when versioning the packages with `release:version`:
>
> - Do not skip the version bump if Lerna detects a change in the package. It is important to release the package if there are **any** changes to it.
> - If Lerna doesn't suggest a version bump for the package, don't release it.
> - When releasing a package, make sure to sync the version of the package with the version of the root `package.json` file.

5. Open PR with changes and wait for review and green CI.
6. Once CI is green and you have enough approvals, send a message on the `team-x` slack channel announcing a merge freeze.
7. Merge PR.

### Release the packages

> [!WARNING]
> If one of the packages hasn't been published before, a team member with admin role must do the initial publish. To find team member, use the command:
>
> ```bash
> npm team ls mui:MUI-X
> npm org ls mui
> ```
>
> Cross-reference both lists to find a team member with admin rights.
>
> After publishing you'll have to setup the access parameters for [trusted publishing](http://docs.npmjs.com/trusted-publishers#configuring-trusted-publishing). You can find > them under `https://www.npmjs.com/package/<pkg>/access`. Use the following values:
>
> - **Publisher:** GitHub actions
> - **Organization or user:** mui
> - **Repository:** mui-x
> - **Workflow filename:** publish.yml
> - **Environment name:** npm-publish
>
> and click _Set up connection_

1. Go to the [publish action](https://github.com/mui/mui-x/actions/workflows/publish.yml).
2. Choose "Run workflow" dropdown

   > - **Branch:** master
   > - **Commit SHA to release from:** the commit that contains the merged release on master. This commit is linked to the GitHub release.
   > - **Run in dry-run mode:** Used for debugging.
   > - **Create GitHub release:** Keep selected if you want a GitHub release to be automatically created from the changelog.
   > - **npm dist tag to publish to** Use to publish legacy or canary versions.

3. Click "Run workflow"
4. Refresh the page to see the newly created workflow, and click it.
5. The next screen shows "@username requested your review to deploy to npm-publish", click "Review deployments" and authorize your workflow run. **Never approve workflow runs you didn't initiaite.**

The action publishes packages, and prepares the GitHub release. The release tag is created during GitHub release. The GitHub release is created in draft mode.

> [!WARNING]
> If the `pnpm release:tag` fails you can create and push the tag using the following command: `git tag -a v4.0.0-alpha.30 -m "Version 4.0.0-alpha.30" && git push upstream --tag`.
> Make sure to copy the git tag command above so that the tag is annotated!

### Publish the documentation

The documentation must be updated on the `docs-vX` branch (`docs-v4` for `v4.X` releases, `docs-v5` for `v5.X` releases, ...)

Push the working branch on the documentation release branch to deploy the documentation with the latest changes.

```bash
pnpm docs:deploy
```

<!-- #target-branch-reference -->

You can follow the deployment process [on the Netlify Dashboard](https://app.netlify.com/sites/material-ui-x/deploys?filter=docs-v9)
Once deployed, it will be accessible at https://material-ui-x.netlify.app/ for the `docs-v9` deployment.

### Publish GitHub release

After the documentation deployment is done, review and then publish the release that was created in draft mode during the release step [GitHub releases page](https://github.com/mui/mui-x/releases)

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

### release:publish failed

If you receive an error message like `There are no new packages that should be published`. Ensure you are publishing to the correct registry, not `verdaccio` or anything else. If you need to reset your configuration, you can run `npm config delete registry`.
