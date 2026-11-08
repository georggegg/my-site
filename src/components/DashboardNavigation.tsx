"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { profile } from "@/profile";

const links = [
  { href: "/", label: "Overview", icon: "grid" },
  { href: "/about", label: "About me", icon: "person" },
  { href: "/reasoning", label: "Reasoning & uncertainty", icon: "chart" },
  { href: "/simulator", label: "Decision simulator", icon: "chart", upcoming: true },
  { href: "/causality", label: "Causality audit", icon: "network", upcoming: true },
  { href: "/capstone", label: "Capstone", icon: "folder", upcoming: true },
];

function Icon({ type }: { type: string }) {
  const paths: Record<string, string> = {
    grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
    person: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21v-2a8 8 0 0 1 16 0v2",
    chart: "M4 3v17h17 M8 15v-4 M13 15V6 M18 15V9",
    network: "M9 4h6v6H9z M2 17h6v5H2z M16 17h6v5h-6z M12 10v4 M5 17v-3h14v3",
    folder: "M3 6h7l2 3h9v11H3z",
  };
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[type] ?? paths.grid} /></svg>;
}

export function DashboardNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <aside className="dashboard-sidebar">
      <Link href="/" className="sidebar-brand" onClick={() => setOpen(false)}>
        <span className="brand-mark"><Icon type="chart" /></span>
        <span>Decision Studio<small>Giorgi Zirakadze</small></span>
      </Link>
      <button className="mobile-menu" aria-expanded={open} aria-controls="portfolio-navigation" onClick={() => setOpen(!open)}>{open ? "Close menu" : "Menu"}</button>
      <nav id="portfolio-navigation" aria-label="Main navigation" className={`sidebar-navigation ${open ? "is-open" : ""}`}>
        <p className="nav-caption">WORKSPACE</p>
        {links.slice(0, 2).map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} className="sidebar-link" onClick={() => setOpen(false)}><Icon type={link.icon} /><span>{link.label}</span></Link>)}
        <p className="nav-caption services-caption">DECISION SERVICES</p>
        {links.slice(2).map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} className="sidebar-link" onClick={() => setOpen(false)}><Icon type={link.icon} /><span>{link.label}{link.upcoming && <small>Coming soon</small>}</span>{!link.upcoming && <span className="nav-live" aria-label="Live" />}</Link>)}
        <a href={profile.repoUrl} className="sidebar-link source-link" target="_blank" rel="noreferrer"><Icon type="folder" /><span>View on GitHub</span><span aria-hidden="true">↗</span></a>
      </nav>
      <div className="sidebar-profile">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={profile.photoPath} alt="" />
        <div><strong>{profile.displayName}</strong><span>Business analytics · UD</span></div>
      </div>
    </aside>
  );
}

export function PageBar() {
  const pathname = usePathname();
  const title = links.find(link => link.href === pathname)?.label ?? "Portfolio";
  return <header className="page-bar"><div><span className="text-muted">Portfolio</span><span className="breadcrumb-divider" aria-hidden="true">/</span><strong>{title}</strong></div><span className="page-bar-note">Good Decisions at Any Scale</span></header>;
}
