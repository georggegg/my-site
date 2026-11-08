import Link from "next/link";
import { profile } from "@/profile";
import { Guestbook } from "@/components/Guestbook";
import { loadLatest } from "@/lib/reasoning-store";

export const dynamic = "force-dynamic";

const SERVICES = [
  { lane: 2, title: "Reasoning & uncertainty", href: "/reasoning", blurb: "Check an argument, update a probability, and weigh a possible payoff.", live: true, symbol: "01" },
  { lane: 3, title: "Decision simulator", href: "/simulator", blurb: "Explore possible outcomes before choosing how much to risk.", live: false, symbol: "02" },
  { lane: 4, title: "Causality audit", href: "/causality", blurb: "Separate patterns in the data from evidence of cause and effect.", live: false, symbol: "03" },
  { lane: 5, title: "Capstone", href: "/capstone", blurb: "Bring the analysis together in a recommendation for a real decision.", live: false, symbol: "04" },
];

export default async function HomePage() {
  const latest = await loadLatest();
  return (
    <main className="dashboard-page">
      <div className="page-heading"><div><p className="eyebrow">MY WORKSPACE</p><h1>Portfolio overview</h1><p className="page-description">Business questions. Clear reasoning. Decisions backed by data.</p></div><span className="status-pill live"><span />1 service live</span></div>
      <section className="panel profile-intro">
        <div className="intro-copy"><p className="eyebrow">BUSINESS ANALYTICS · UNIVERSITY OF DELAWARE</p><h2>{profile.displayName}</h2><p>{profile.bio}</p><Link className="text-link" href="/about">A little more about me <span aria-hidden="true">→</span></Link></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="intro-photo" src={profile.photoPath} alt={profile.displayName} />
      </section>
      <section className="results-overview" aria-labelledby="latest-heading">
        <div className="section-heading"><h2 id="latest-heading">Latest reasoning results</h2><Link href="/reasoning" className="text-link">View analysis <span aria-hidden="true">↗</span></Link></div>
        <div className="metric-grid">
          <div className="panel metric-card"><p>Logic verdict</p><strong className="metric-value verdict">{latest.syllogism ? String(latest.syllogism.answer.verdict) : "No result yet"}</strong><span>Does the conclusion follow?</span><div className="metric-rule blue" /></div>
          <div className="panel metric-card"><p>Updated probability</p><strong className="metric-value">{latest.plausibility ? `${(Number(latest.plausibility.answer.posterior) * 100).toFixed(1)}%` : "—"}</strong><span>For the latest flagged case</span><div className="metric-rule teal" /></div>
          <div className="panel metric-card"><p>Expected payoff</p><strong className="metric-value">{latest.bernoulli ? Number(latest.bernoulli.answer.expectedValue).toFixed(2) : "—"}</strong><span>Average payoff in the latest scenario</span><div className="metric-rule gold" /></div>
        </div>
      </section>
      <section aria-labelledby="services-heading">
        <div className="section-heading"><h2 id="services-heading">A portfolio of decision services</h2><span className="section-note">Built throughout the course</span></div>
        <ul className="service-grid">{SERVICES.map(service => <li key={service.lane} className={`panel service-card ${service.live ? "service-live" : ""}`}><div className="service-card-top"><span className="service-number">{service.symbol}</span><span className={`status-pill ${service.live ? "live" : "upcoming"}`}>{service.live && <span />}{service.live ? "Live" : "Coming soon"}</span></div><h3><Link href={service.href}>{service.title}<span className="service-arrow" aria-hidden="true">↗</span></Link></h3><p>{service.blurb}</p><div className="service-meta">LANE {service.lane}<span>{service.live ? "Explore service" : "Preview"}</span></div></li>)}</ul>
      </section>
      <section className="guestbook-section" aria-labelledby="guestbook-heading"><div className="section-heading"><div><h2 id="guestbook-heading">Guestbook</h2><p className="page-description">Stopped by? Leave a note.</p></div><span className="section-note">Open to visitors</span></div><Guestbook /></section>
    </main>
  );
}
