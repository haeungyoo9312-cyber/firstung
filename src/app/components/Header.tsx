"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Arrow } from "./Arrow";
import { Firebase } from "./Firebase";
import UserMenu from "@/components/auth/UserMenu";

export function Header() {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/" && (
        <Link className="button back-button" href="/">
          <Arrow /> Back to home
        </Link>
      )}

      <header className="header">
        <div className="header-left">
          <Firebase />
        </div>
        <div className="header-right">
          <UserMenu />
        </div>
      </header>
    </>
  );
}
