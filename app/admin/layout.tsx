import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Security Console | Fries Global",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
