/* eslint-disable no-console */
const path = require('path');
const fse = require('fs-extra');
const { parseDocFolder, getAnchor } = require('@mui/monorepo/docs/scripts/reportBrokenLinks');

const docsSpaceRoot = path.join(__dirname, '../');

function save(lines) {
  const fileContents = [...lines, ''].join('\n');
  fse.writeFileSync(path.join(docsSpaceRoot, '.link-check-errors.txt'), fileContents);
}

const UNSUPPORTED_PATHS = ['/careers/', '/store/'];
const UNSUPPORTED_ANCHORS_PATHS = ['/api/'];

const buffer = [];

function write(text) {
  buffer.push(text);
}

// {[url with hash]: true}
const availableLinksX = {};
const availableLinksCore = {};

// {[url with hash]: list of files using this link}
const usedLinksX = {};
const usedLinksCore = {};

parseDocFolder(path.join(docsSpaceRoot, './pages/'), availableLinksX, usedLinksX, '');
parseDocFolder(
  path.resolve(__dirname, '../../node_modules/@mui/monorepo/docs/pages/'),
  availableLinksCore,
  usedLinksCore,
  '',
);

function getPageUrlFromLink(link) {
  const [rep] = link.split('/#');
  return rep;
}

const usedLinks = { ...usedLinksCore, ...usedLinksX };
const availableLinks = { ...availableLinksCore, ...availableLinksX };

const removeUnsupportedHash = (link) => {
  const doNotSupportAnchors = UNSUPPORTED_ANCHORS_PATHS.some((unsupportedPath) =>
    link.includes(unsupportedPath),
  );
  const rep = doNotSupportAnchors ? getPageUrlFromLink(link) : link;
  return rep;
};
write('Broken links found by `yarn docs:link-check` that exist:\n');
Object.keys(usedLinks)
  .filter((link) => link.startsWith('/'))
  .filter((link) => !availableLinks[removeUnsupportedHash(link)])
  // unstyled sections are added by scripts (cannot be found in markdown)
  .filter((link) => !link.includes('#unstyled'))
  .filter((link) => UNSUPPORTED_PATHS.every((unsupportedPath) => !link.includes(unsupportedPath)))
  .sort()
  .forEach((linkKey) => {
    write(`- https://mui.com${linkKey}`);
    console.log(`https://mui.com${linkKey}`);
    console.log(`used in`);
    usedLinks[linkKey].forEach((f) => console.log(`- ${path.relative(docsSpaceRoot, f)}`));
    console.log('available anchors on the same page:');
    console.log(
      Object.keys(availableLinks)
        .filter((link) => getPageUrlFromLink(link) === getPageUrlFromLink(linkKey))
        .sort()
        .map(getAnchor)
        .join('\n'),
    );
    console.log('\n\n');
  });

save(buffer);
