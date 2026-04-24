import { MarkdownElement } from '@mui/internal-core-docs/MarkdownDocs';

export default function V9LicenseUpgradeWarning() {
  return (
    <MarkdownElement>
      <aside className="MuiCallout-root MuiCallout-warning">
        <div className="MuiCallout-icon-container">
          <svg focusable="false" aria-hidden="true" viewBox="0 0 20 20">
            <use xlinkHref="#warning-icon" />
          </svg>
        </div>
        <div className="MuiCallout-content">
          <p>
            If you&apos;re upgrading from v8 to v9, you&apos;ll need to generate a new license key
            from your <a href="/r/x-license-account/">MUI Store account</a>. The new v9 key inherits
            the same expiration date as your existing v8 key, so there&apos;s no extra cost during
            your current term. See{' '}
            <a href="/r/x-license-key-upgrade/">How can I generate a v9 license key?</a> for
            step-by-step instructions.
          </p>
          <p>
            When it&apos;s time to renew, you&apos;ll need to choose which key to renew, note that
            v9 renewals are priced differently from v8 renewals.
          </p>
        </div>
      </aside>
    </MarkdownElement>
  );
}
