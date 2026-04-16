"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";

import { clearStoredSessions } from "@/lib/session-storage";

type SessionLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  clearScope?: "all" | "quiz" | "image";
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;

export function SessionLink({
  href,
  children,
  className,
  clearScope,
  onClick,
  ...props
}: SessionLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (clearScope) {
      clearStoredSessions(clearScope);
    }

    onClick?.(event);
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
