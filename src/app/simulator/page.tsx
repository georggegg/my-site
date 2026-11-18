import { ComingSoon } from "@/components/ComingSoon";
import { CandidateOutcomes } from "@/components/simulator/CandidateOutcomes";
import { loadLatest } from "@/lib/simulator-store";

export const metadata = { title: "Decision Simulator" };

// Freshness contract: without this line, Next.js may serve a cached copy of
// this page, and the grader would see stale numbers seconds after your API
// answered. force-dynamic re-renders the page on every request.
export const dynamic = "force-dynamic";

export default async function SimulatorPage() {
  const latest = await loadLatest();

  // Until the first game arrives, keep the honest placeholder.
  if (!latest) {
    return (
      <ComingSoon
        lane={3}
        title="Decision Simulator"
        description="A service that simulates investment games and recommends the stake that is best for the typical investor. Built after Lane 3."
      />
    );
  }

  const { problem, answer, candidates } = latest;
  const stakePct = Math.round(Number(answer.recommendedFraction) * 100);
  const lossPct = Math.round(Number(answer.probLoss) * 100);

  return (
    <main className="dashboard-page">
      <p className="eyebrow">Lane 3 · live decision service</p>
      <h1 className="mt-2 dashboard-title">
        Stake {stakePct}% each year: it leaves the typical investor best off
      </h1>
      <p className="mt-4 max-w-prose text-muted">
        My simulator plays the latest game thousands of times for every stake on the list, then
        recommends the stake whose typical (median) investor ends with the most. Every number on
        this page comes from the same saved answer my API gave.
      </p>

      <section className="panel analysis-panel mt-8">
        <h2 className="panel-title">The latest game</h2>
        <p className="mt-2 max-w-prose text-muted">{String(problem.scenario)}</p>
        <p className="mt-2 text-sm text-muted">
          Heads: the staked part grows {Number(problem.upPct)}%. Tails: it shrinks{" "}
          {Number(problem.downPct)}%. {Number(problem.horizonYears)} years, starting from $
          {Number(problem.buyIn).toLocaleString("en-US")}.
        </p>
      </section>

      <section className="panel analysis-panel mt-6">
        <h2 className="panel-title">The recommendation</h2>
        <ul className="mt-3 space-y-1 text-lg">
          <li>
            Recommended stake fraction:{" "}
            <strong data-simulator="recommended-fraction" className="text-accent">
              {Number(answer.recommendedFraction).toFixed(2)}
            </strong>
          </li>
          <li>
            Typical (median) final balance: $
            <strong data-simulator="median-final" className="text-accent">
              {Math.round(Number(answer.medianFinalBalance)).toLocaleString("en-US")}
            </strong>
          </li>
          <li>
            Probability of ending below the buy-in:{" "}
            <strong data-simulator="prob-loss" className="text-accent">
              {Number(answer.probLoss).toFixed(3)}
            </strong>
            <span className="text-base text-muted"> (about {lossPct}% of simulated investors)</span>
          </li>
        </ul>
        <p className="mt-3 max-w-prose text-muted">{String(answer.reasoning)}</p>
      </section>

      <section className="panel analysis-panel mt-6">
        <h2 className="panel-title">How every stake turned out</h2>
        <CandidateOutcomes
          candidates={candidates}
          buyIn={Number(problem.buyIn)}
          recommended={Number(answer.recommendedFraction)}
        />
        <p className="mt-3 max-w-prose text-muted">
          The biggest stake has the highest average, because a few very lucky investors pull it up,
          but the typical investor does far worse with it. Staking less each year gives up a little
          upside in exchange for a much better typical result, and that is the stake I recommend.
        </p>
      </section>

      <section className="panel analysis-panel mt-6">
        <h2 className="panel-title">The model behind it</h2>
        <img
          data-simulator="dag"
          src="/images/dag.png"
          alt="DAG of the investment game: initial wealth and the stake fraction (a decision) feed wealth after each year, which also depends on that year's coin flip."
          className="mt-3 w-full max-w-xl rounded-lg border border-line bg-white p-3"
        />
        <p className="mt-3 max-w-prose text-muted">
          The coin flip each year is the random part, which my simulator draws over and over. The
          stake fraction is the rectangle: it is my choice, so the simulator tries every candidate
          in turn and compares the results.
        </p>
      </section>
    </main>
  );
}
