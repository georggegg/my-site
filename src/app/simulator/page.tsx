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
        This simulator evaluates different investment strategies by running thousands of
        simulations across a range of stake sizes. It identifies the strategy that maximizes the
        median final balance, focusing on outcomes that are more representative of a typical
        investor rather than averages influenced by extreme results. All visualizations are
        generated from the same simulation results used by the API.
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
          While larger stakes can produce higher average returns, these figures are often driven by
          a small number of exceptionally favorable outcomes. The median reveals a different
          perspective: consistently investing a smaller fraction can lead to stronger long-term
          results for the typical investor. This highlights the importance of balancing potential
          returns with the risk of substantial losses.
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
          The model distinguishes between two key components: uncertainty and decision-making. Each
          coin flip represents a random market outcome, while the stake fraction is a controllable
          decision variable. By simulating each candidate strategy across thousands of possible
          outcomes, the model compares their performance and identifies the stake size that
          maximizes the median final balance.
        </p>
      </section>
    </main>
  );
}
