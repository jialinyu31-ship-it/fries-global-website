"use client";

import type { MouseEvent, ReactNode } from "react";

type EmailLinkProps = {
  children: ReactNode;
  className?: string;
  subject?: string;
};

const addressCodes = [104, 101, 108, 108, 111, 64, 102, 114, 105, 101, 115, 103, 108, 111, 98, 97, 108, 46, 99, 111, 109];

export function EmailLink({ children, className, subject }: EmailLinkProps) {
  function openEmail(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const address = String.fromCharCode(...addressCodes);
    const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
    window.location.assign(`mailto:${address}${query}`);
  }

  return <a className={className} href="#contact" onClick={openEmail}>{children}</a>;
}
