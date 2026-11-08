import { ComingSoon } from "@/components/ComingSoon";
import { loadLatest } from "@/lib/reasoning-store";
import { TwoWayTable } from "@/components/reasoning/TwoWayTable";
import { BernoulliFourViews } from "@/components/reasoning/BernoulliFourViews";

export const metadata = { title: "Reasoning & Uncertainty Service" };

/**
 * ── Challenge 2, step 5: the face ─────────────────────────────────────────
 * Why this page exists: an API decides, a page justifies. The grader reads
 * the three data-reasoning="..." numbers below and checks each one matches
 * the answer your API gave moments earlier. Everything else on the page is
 * for humans: the tables and views that show WHY each number is right.
 *
 */

// Freshness contract: without this line, Next.js may serve a cached copy of
// this page, and the grader would see stale numbers seconds after your API
// answered. force-dynamic re-renders the page on every request.
export const dynamic = "force-dynamic";

export default async function ReasoningPage() {
  // The same rows your /api/reasoning/decide wrote via saveLatest().
  const { syllogism, plausibility, bernoulli } = await loadLatest();

  // Until the first probe arrives (or before Supabase is wired up), the
  // portfolio card keeps its honest placeholder.
  if (!syllogism && !plausibility && !bernoulli) {
    return (
      <ComingSoon
        lane={2}
        title="Reasoning & Uncertainty"
        description="A service that audits syllogisms, updates beliefs on base rates, and reads Bernoulli businesses. Built after Lane 2."
      />
    );
  }

  return (
    <main className="dashboard-page reasoning-dashboard">
      <p className="eyebrow">
        Lane 2 · live decision service
      </p>
      <h1 className="mt-2 dashboard-title">Reasoning &amp; uncertainty</h1>
      <p className="mt-4 max-w-prose text-muted">
        My service checks whether a conclusion follows from a rule and calculates
        probabilities and average payoffs. Below are its latest saved answers, with
        the work behind each one.
      </p>

      <div className="analysis-grid">
      {/* ── Latest syllogism audit ─────────────────────────────────────── */}
      <section className="panel analysis-panel">
        <h2 className="panel-title">Latest syllogism audit</h2>
        {syllogism ? (
          <div className="mt-3">
            <p className="text-muted">
              Rule: if {String(syllogism.problem.rule?.if)}, then{" "}
              {String(syllogism.problem.rule?.then)}.
            </p>
            <p className="mt-1 text-muted">
              {String(syllogism.problem.observation?.statement)}{" "}
              {String(syllogism.problem.conclusion?.statement)}
            </p>
            <p className="result-strip mt-4">
              Verdict:{" "}
              <strong data-reasoning="verdict" className="text-accent">
                {String(syllogism.answer.verdict)}
              </strong>
              {typeof syllogism.answer.fallacy === "string" && (
                <span className="text-muted"> ({syllogism.answer.fallacy})</span>
              )}
            </p>
            <p className="mt-2 max-w-prose text-sm text-muted">
              If A guarantees B, observing A lets us conclude B, and observing that B
              did not happen rules out A. Seeing B alone does not prove A caused it;
              B could have happened another way. Likewise, the absence of A does not
              rule out B. The service uses the supplied logic labels to check these
              patterns.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-muted">No syllogism probe yet.</p>
        )}
      </section>

      {/* ── Latest plausibility update ─────────────────────────────────── */}
      <section className="panel analysis-panel">
        <h2 className="panel-title">Latest plausibility update</h2>
        {plausibility ? (
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              The problem, exactly as the grader sent it
            </p>
            <p className="mt-1 max-w-prose text-muted">{String(plausibility.problem.scenario)}</p>
            <TwoWayTable
              baseRate={Number(plausibility.problem.baseRate)}
              hitRate={Number(plausibility.problem.hitRate)}
              falseAlarmRate={Number(plausibility.problem.falseAlarmRate)}
            />
            <p className="result-strip mt-4">
              Posterior:{" "}
              <strong data-reasoning="posterior" className="text-accent">
                {Number(plausibility.answer.posterior).toFixed(3)}
              </strong>
            </p>
            <p className="mt-2 max-w-prose text-sm text-muted">
              With the rates given in this problem, a flagged case has a{" "}
              {(Number(plausibility.answer.posterior) * 100).toFixed(1)}% chance of
              actually having the condition. A flag is a reason to investigate;
              it is not proof on its own.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-muted">No plausibility probe yet.</p>
        )}
      </section>

      {/* ── Latest Bernoulli read ──────────────────────────────────────── */}
      <section className="panel analysis-panel">
        <h2 className="panel-title">Latest Bernoulli read: four views</h2>
        {bernoulli ? (
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              The problem, exactly as the grader sent it
            </p>
            <p className="mt-1 max-w-prose text-muted">{String(bernoulli.problem.scenario)}</p>
            <BernoulliFourViews
              theta={Number(bernoulli.problem.theta)}
              onSuccess={Number(bernoulli.problem.payoffs?.onSuccess)}
              onFailure={Number(bernoulli.problem.payoffs?.onFailure)}
            />
            <p className="result-strip mt-4">
              Expected payoff:{" "}
              <strong data-reasoning="expected-value" className="text-accent">
                {Number(bernoulli.answer.expectedValue).toFixed(2)}
              </strong>
              <span className="ml-3 text-base text-muted">
                P(X = {String(bernoulli.problem.probabilityOf)}) ={" "}
                {Number(bernoulli.answer.probabilityStatement).toFixed(2)}
              </span>
            </p>
            <p className="mt-2 max-w-prose text-sm text-muted">
              The expected payoff weights each possible payoff by its chance of
              happening. It describes the average over many repetitions with the
              same odds, not a guaranteed result on the next attempt.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-muted">No Bernoulli probe yet.</p>
        )}
      </section>
      </div>
    </main>
  );
}
