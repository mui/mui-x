import * as React from 'react';
import { MarkdownElement } from '@mui/internal-core-docs/MarkdownDocs';

// Ordered from newest to oldest.
// When a new major version is released:
// 1. Update its `releaseDate` from `null` to the actual release date.
// 2. Set `ltsEndDate` on the previous stable version (typically releaseDate + 2 years).
// All statuses will update automatically based on the current date.
//
// #target-branch-reference
// Add a new entry when creating a new major version branch.
// For example, when creating v10 from v9, add `{ version: '^10.0.0', releaseDate: null, plannedRelease: 'April 2027' }`
const muiXVersions = [
  // { version: '^10.0.0', releaseDate: null, plannedRelease: 'April 2027' },
  { version: '^9.0.0', releaseDate: '2026-04-08' },
  { version: '^8.0.0', releaseDate: '2025-04-17', ltsEndDate: '2028-04-08' },
  { version: '^7.0.0', releaseDate: '2024-03-23', ltsEndDate: '2027-04-17' },
  { version: '^6.0.0', releaseDate: '2023-03-03', ltsEndDate: '2026-03-23' },
  { version: '^5.0.0', releaseDate: '2021-11-23', ltsEndDate: '2025-03-03' },
  { version: '^4.0.0', releaseDate: '2021-09-28', ltsEndDate: '2023-11-23' },
];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getVersionStatus(version, now) {
  if (!version.releaseDate || new Date(version.releaseDate) > now) {
    return { type: 'preRelease' };
  }

  if (!version.ltsEndDate) {
    return { type: 'currentStable' };
  }

  if (now < new Date(version.ltsEndDate)) {
    return { type: 'lts', endDate: version.ltsEndDate };
  }

  return { type: 'outOfSupport', endDate: version.ltsEndDate };
}

function renderStatus(status) {
  switch (status.type) {
    case 'preRelease':
      return '🚧 Pre-release (Continuous support)';
    case 'currentStable':
      return '✅ Current stable major (Continuous support)';
    case 'lts':
      return (
        <React.Fragment>
          ⚠️ LTS - Support for security issues and regressions{' '}
          <strong>until {formatDate(status.endDate)}</strong>.
        </React.Fragment>
      );

    case 'outOfSupport':
      return `❌ Out of support since ${formatDate(status.endDate)}.`;
    default:
      return '';
  }
}

export default function SupportedVersions() {
  const now = new Date();
  const props = { sx: { width: '100%' } };

  return (
    <MarkdownElement {...props}>
      <table>
        <thead>
          <tr>
            <th align="right">MUI X version</th>
            <th align="left">Release</th>
            <th align="left">Supported</th>
          </tr>
        </thead>
        <tbody>
          {muiXVersions.map((version) => (
            <tr key={version.version}>
              <td align="right">{version.version}</td>
              <td>{version.releaseDate ?? version.plannedRelease ?? 'TBD'}</td>
              <td>{renderStatus(getVersionStatus(version, now))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MarkdownElement>
  );
}
