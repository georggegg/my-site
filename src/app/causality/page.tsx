import { ComingSoon } from "@/components/ComingSoon";
import { StratifiedComparison } from "@/components/causality/StratifiedComparison";
import { loadLatest } from "@/lib/causality-store";

export const metadata = { title: "Causality Audit" };

// Freshness contract: re-render on every request, so the grader never sees
// a cached copy from before your API answered.
export const dynamic = "force-dynamic";

const STRUCTURE_NAMES: Record<string, string> = {
  fork: "a fork (a common cause)",
  pipe: "a pipe (a mediator)",
  collider: "a collider (a common effect)",
  direct: "a direct effect (the third variable is a bystander)",
};

export default async function CausalityPage() {
  const latest = await loadLatest();

  // Until the first probe arrives, keep the honest placeholder.
  if (!latest) {
    return (
      <ComingSoon
        lane={4}
        title="Causality Audit"
        description="A service that tells forks from pipes from colliders, and knows when to stratify. Built after Lane 4."
      />
    );
  }

  const { probe, answer, summary } = latest;
  const ctx = probe.context;
  const structure = String(answer.structure);

  return (
    <main className="dashboard-page">
      <p className="eyebrow">Lane 4 · live causality audit</p>
      <h1 className="mt-2 dashboard-title">
        {answer.causal
          ? `Changing ${ctx.xLabel} would change ${ctx.yLabel}`
          : `Changing ${ctx.xLabel} would not change ${ctx.yLabel}`}
      </h1>
      {/* TODO(yours): one sentence, your words, on what this service does. */}
      <p className="mt-4 max-w-prose text-muted">
        This tool analyzes data alongside its business context to understand how different
        variables influence one another. It helps distinguish cause-and-effect relationships from
        misleading correlations and determines when accounting for a third variable is
        appropriate. The findings displayed are based on the same audit results returned by the
        API.
      </p>

      <section className="panel analysis-panel mt-8">
        <h2 className="panel-title">The latest audit</h2>
        <p className="mt-2 max-w-prose text-muted">{String(ctx.narrative)}</p>
      </section>

      <section className="panel analysis-panel mt-6">
        <h2 className="panel-title">The verdict</h2>
        <ul className="mt-3 space-y-1 text-lg">
          <li>
            Verdict:{" "}
            <strong data-causality="verdict" className="text-accent">
              {answer.causal ? "causal" : "not causal"}
            </strong>
          </li>
          <li>
            Structure:{" "}
            <strong data-causality="structure" className="text-accent">
              {structure}
            </strong>
            <span className="text-base text-muted"> ({STRUCTURE_NAMES[structure] ?? structure})</span>
          </li>
          <li>
            Stratified effect on {String(ctx.yLabel)}:{" "}
            <strong data-causality="stratified-effect" className="text-accent">
              {Number(answer.stratifiedEffect).toFixed(2)}
            </strong>
          </li>
          <li>
            Advice:{" "}
            <strong>
              {answer.advice === "stratify"
                ? `compare within each level of ${ctx.zLabel}`
                : `do not split the data by ${ctx.zLabel}`}
            </strong>
          </li>
        </ul>
        <p className="mt-3 max-w-prose text-muted">{String(answer.reasoning)}</p>
      </section>

      <section className="panel analysis-panel mt-6">
        <h2 className="panel-title">The evidence</h2>
        <StratifiedComparison
          summary={summary}
          x0={String(ctx.x0)}
          x1={String(ctx.x1)}
          yLabel={String(ctx.yLabel)}
        />
        {/* TODO(yours): one or two sentences a manager could read: what the
            comparison shows, and why the story about the third variable
            decides which row to trust (Stations 4.4 and 4.5). */}
        <p className="mt-3 max-w-prose text-muted">
          The first row shows the overall difference between the two {String(ctx.xLabel)} groups,
          while the rows below break down that comparison by {String(ctx.zLabel)}. However, the
          largest difference isn&apos;t necessarily the most meaningful one. Understanding how
          these variables are connected helps determine whether the observed relationship reflects
          a real causal effect or is influenced by other factors.
        </p>
      </section>

      <section className="panel analysis-panel mt-6">
        <h2 className="panel-title">The causal structure</h2>
        <img
          data-causality="dag"
          src={`/images/causality/${structure}.png`}
          alt={`DAG of ${STRUCTURE_NAMES[structure] ?? structure}: X is ${ctx.xLabel}, Z is ${ctx.zLabel}, Y is ${ctx.yLabel}.`}
          className="mt-3 w-full max-w-md rounded-lg border border-line bg-white p-3"
        />
        {/* TODO(yours): one sentence connecting the picture to the verdict:
            which arrow (or missing arrow) makes it causal or not. */}
        <p className="mt-3 max-w-prose text-muted">
          {answer.causal
            ? `The diagram shows that ${ctx.xLabel} influences ${ctx.yLabel}, either directly or through ${ctx.zLabel}. This means that changing ${ctx.xLabel} can affect ${ctx.yLabel}, rather than the two variables simply being correlated.`
            : `The diagram shows no causal path from ${ctx.xLabel} to ${ctx.yLabel}. Any observed relationship between them can instead be explained by a shared cause or by introducing a misleading association when the data is divided according to ${ctx.zLabel}.`}
        </p>
      </section>
    </main>
  );
}
