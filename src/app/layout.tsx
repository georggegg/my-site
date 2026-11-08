import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { DashboardNavigation, PageBar } from "@/components/DashboardNavigation";
import { profile } from "@/profile";
import { resolvedTheme } from "@/theme";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profile.displayName} — Decision Services`,
  description: profile.tagline,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const theme = resolvedTheme();
  // Your palette and fonts become CSS variables here; globals.css maps them
  // into Tailwind utilities. One theme file, zero CSS edits.
  const themeVars = {
    "--paper": theme.paper,
    "--surface": theme.surface,
    "--ink": theme.ink,
    "--muted": theme.muted,
    "--line": theme.line,
    "--accent": theme.accent,
    "--accent-ink": theme.accentInk,
    "--heading-font": theme.headingFont,
    "--body-font": theme.bodyFont,
  } as CSSProperties;

  return (
    <html lang="en" className={fontVariables} style={themeVars}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <DashboardNavigation />
        <div className="dashboard-workspace">
          <PageBar />
          <div id="main-content" className="workspace-content">{children}</div>
          <footer className="dashboard-footer">
            <span>{profile.displayName} · A portfolio of decision services</span>
            <span>Good Decisions at Any Scale</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
