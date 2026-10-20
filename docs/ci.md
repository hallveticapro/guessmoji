# CI quality and image build

The existing `build-and-push` check remains the final result. It always runs and
first requires success from the entire quality matrix before checkout or Docker
steps. A failed, cancelled, or skipped prerequisite fails closed. Matrix fail-fast
is disabled so independent checks finish and expose their failures.

Lint, typecheck, and the complete unit suite now run on three isolated Ubuntu
runners. Each owns its dependency installation, compiler state, fixtures,
temporary files, and test outputs. No tests, assertions, retries, timeouts, or
content checks have changed. The existing Docker build, metadata, image target,
and canonical-owner publication guard remain unchanged after the quality gate.

Three quality runners plus the existing final image-build runner replace one
runner. The expected quality critical path is the slowest lane rather than the
sum, but repeated checkout/install and runner-minute rounding can increase billed
usage. Queue and concurrency limits can reduce the benefit. Record comparable
successful GitHub runs' elapsed time, each job duration, queue delays, and total
billed runner minutes before reporting savings; after timings are pending.
