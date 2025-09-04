"use client";

import UserMenu from "@/components/auth/UserMenu";

export function Header() {
  return (
    <header className="header">
      <div className="header-right">
        <UserMenu />
      </div>
    </header>
  );
}
