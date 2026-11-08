import { NextResponse } from "next/server";
import { saveLatest, type ProblemType } from "@/lib/reasoning-store";

/**
 * Challenge 2, step 4: calculate an answer using the course-provided logic,
 * save it for the results page, and return it to the caller.
 */
export async function POST(req: Request) {
  const problem = await req.json().catch(() => null);
  if (!problem || typeof problem.type !== "string") {
    return NextResponse.json(
      { error: "expected a JSON problem with a `type` field" },
      { status: 400 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let answer: Record<string, any> | undefined;

  if (problem.type === "syllogism") {
    const forms: Record<string, { verdict: string; fallacy?: string }> = {
      "A": { verdict: "valid" },
      "not-B": { verdict: "valid" },
      "B": { verdict: "invalid", fallacy: "affirming the consequent" },
      "not-A": { verdict: "invalid", fallacy: "denying the antecedent" },
    };
    answer = forms[problem.observation.asserts];
  }

  if (problem.type === "plausibility") {
    const { baseRate, hitRate, falseAlarmRate } = problem;
    const N = 10000;
    const trueFlags = N * baseRate * hitRate;
    const falseFlags = N * (1 - baseRate) * falseAlarmRate;
    answer = { posterior: trueFlags / (trueFlags + falseFlags) };
  }

  if (problem.type === "bernoulli") {
    const { theta, payoffs, probabilityOf } = problem;
    answer = {
      support: [0, 1],
      expectedValue: theta * payoffs.onSuccess + (1 - theta) * payoffs.onFailure,
      probabilityStatement: probabilityOf === 1 ? theta : 1 - theta,
    };
  }

  if (answer === undefined) {
    return NextResponse.json({ error: "unknown problem type" }, { status: 400 });
  }

  // The memory step: overwrite this type's "latest" row so your /reasoning
  // page can display the same problem and answer (see lib/reasoning-store).
  await saveLatest(problem.type as ProblemType, problem, answer);

  return NextResponse.json(answer);
}
