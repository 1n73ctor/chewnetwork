import React from 'react';

/** Admin console shares the investor portal's dark surface. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="portal-scope">{children}</div>;
}
