# CI quality and image build

The existing `build-and-push` check remains the final result. It always runs and
requires `quality` to succeed before checkout or Docker steps. Failed, cancelled,
or skipped quality work fails closed. Its Docker build, metadata, tags, image
target, canonical-owner publication guard and permissions remain unchanged.

One quality runner checks out the source and runs `npm ci` once, then runs the
unchanged `npm run lint`, `npm run typecheck` and complete `npm run test` commands
concurrently. The shell waits for every child and records every exit status even
when another check fails. It prints each check's separate stdout/stderr log under
a labeled group and exits nonzero if any command fails. INT/TERM terminates the
checks' process groups (including their workers) and remains nonzero. Signal
handlers stay caught while children launch, so a new child cannot inherit ignored
termination signals. After interruption, a second wait pass reaps every launched
PID, including a child whose first wait returned before its cleanup finished. No check, assertion, retry, skip, timeout or worker setting is relaxed.

These checks can share an installed dependency tree: lint has no write/cache flag,
only typecheck writes ignored `tsconfig.tsbuildinfo`, and only Vitest uses its Vite
cache. Tests use local in-memory fixtures. Optional content-audit packet output is
unset in CI; neither other command writes that output. No build runs concurrently
with quality checks. Logs use a unique directory below `RUNNER_TEMP`, outside the
checkout. Three command groups share one fixed-capacity hosted runner; no extra
runner, heap allowance, or test workers are introduced by this revision.

A successful pilot measured the three-runner matrix at 89 seconds wall time and
136 summed runner seconds, versus the original 84.5 seconds for both. That matrix
increased elapsed time and runner use. This revision removes its repeated checkout
and install overhead. One quality runner plus the existing final image-build
runner remain; job startup and billing rounding may still add overhead versus the
original single-job workflow. Comparable hosted timings for this revision remain
pending. Record wall time, queue delays, per-job durations and billed runner use
before claiming savings.

Local validation used Node 24.19.0 and npm 11.17.0 after `npm ci`: lint,
typecheck and all 255 tests (29 files) passed concurrently. Behavioral shell
validation passed all eight combinations of three command exit statuses, child
INT/TERM, and parent INT/TERM; every child was waited for and reaped. Additional
probes reproduce the old delayed-cleanup and fork-window failures, then prove the
corrected wrapper exits only after all child cleanup markers. These local
results establish check/failure handling, not comparable hosted elapsed savings.
