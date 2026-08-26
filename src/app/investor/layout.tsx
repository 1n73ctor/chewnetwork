import React from 'react';

/**
 * The investor portal keeps the standalone app's dark palette and component
 * classes; `.portal-scope` re-binds the theme tokens for this subtree only.
 */
export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  return <div className="portal-scope">{children}</div>;
}
