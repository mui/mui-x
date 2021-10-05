# MUI Scripts

## Release

A typical release goes like this:

### Prepare

The following steps must be proposed as a pull request.

1. Generate the changelog. Compare the last version with `master`. For instance: [https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.9...master](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.9...master)
2. Generate the changelog with this script: [https://trello.com/c/uspnIWkh/1566-release-note](https://trello.com/c/uspnIWkh/1566-release-note)
3. Clean the generated changelog, to match the format of [https://github.com/mui-org/material-ui/releases](https://github.com/mui-org/material-ui/releases).
4. Update the root /package.json's version
5. `yarn release:version`
6. Open PR with changes and wait for review and green CI
7. Merge PR once CI is green and it has been approved

### Release

1. checkout merge commit of the merged PR
2. `yarn`
3. `yarn release:build`
4. `yarn release:publish` You need your 2FA device.
5. Tag the release with the version `git tag v4.0.0-alpha.30 && git push --tag`

### Documentation

Push the master branch on the release branch to deploy the documentation with the latest changes. It lives at https://material-ui-x.netlify.app/. Force push if necessary.

```sh
yarn docs:deploy
```

### Announce

1. **GitHub**. Make a new release on GitHub (for people subscribing to updates). https://github.com/mui-org/material-ui-x/releases
