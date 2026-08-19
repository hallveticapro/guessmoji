# SDD ledger — plan: docs/superpowers/plans/2026-08-18-content-audit-harry-potter.md

## Baseline

- Worktree: /Users/andrew/code/github/hallveticapro/guessmoji/.worktrees/content-audit-harry-potter
- Branch: codex/content-audit-harry-potter
- Start commit: b515081
- Baseline: npm test — 10 files, 57 tests passed
- Audit/security note: npm install reported 7 high-severity dependency findings; dependency remediation is outside this plan unless CI or release review makes it load-bearing.
- Arcane release target (read-only discovery): environment `0` / project `06df6f85-3a3b-4b50-bace-7318c13df263` / service `guessmoji` / image `ghcr.io/hallveticapro/guessmoji:latest`; current status running.
- GitHub main protection applied and verified: PR required, zero approvals, admins enforced, linear history and conversation resolution required, force pushes/deletions disabled, no required status checks because the workflow is post-merge only.

## Preflight consistency and dependency scan

| Scope | Producer / first task | Consumer / later task | Shared file or interface | Finding / ruling |
|---|---|---|---|---|
| Task 1 internal | Packet and invariant tests | Audit helpers and packet builder | New content-audit modules | Consistent: RED precedes implementation; legacy catalog zero-findings is deferred to Task 9. |
| Task 2 internal | Selection tests | round-history.ts | selectCategoryRound API | Consistent: deterministic randomness and cycle behavior are specified. |
| Task 3 internal | Storage and GameBoard tests | storage adapter and UI integration | round-history APIs from Task 2 | Consistent: Task 2 names and types are consumed verbatim. |
| Task 4 internal | Core audit reports and regressions | core content remediation | puzzles.ts, banlist, audit tests | Consistent: report supplies exact findings; blind re-review gates changed cards. |
| Task 5 internal | Partition A reports | Partition A remediation/expansion | expandedPacks.ts, banlist, audit tests | Consistent: adds explicit explanation transport and partition-scoped completeness. |
| Task 6 internal | Partition B reports | Partition B remediation/expansion | expandedPacks.ts, banlist, audit tests | Consistent: consumes Task 5 explanation tuple interface. |
| Task 7 internal | Partition C reports | Partition C remediation/expansion | expandedPacks.ts, banlist, audit tests | Consistent: consumes Task 5 explanation tuple interface. |
| Task 8 internal | Harry Potter acceptance tests | 20-card pack | expandedPacks.ts and explanation tuple | Consistent: exact count/scope and staged blind review are specified. |
| Task 9 internal | Integrated catalog | dynamic invariants and docs | shared tests/docs | Consistent: final zero-findings gate occurs after all remediation. |
| Task 10 internal | Reviewed branch | PR, merge, GHCR, Arcane, live verification | external release state | Consistent: no source mutation unless a reviewed fix wave is required. |
| Task 1 → Audit Wave | Packet builder | six audit agents | packet JSON schemas | Consistent: exact coverage is mechanically checked before remediation. |
| Task 1 → Tasks 4-9 | objective audit helpers | content tests and final invariants | findContentInvariantViolations | Consistent: fixture-first, final shipped gate later. |
| Task 2 → Task 3 | SOURCE_CATEGORY_ROUND_COUNT and selection | GameBoard/storage integration | round-history.ts | Consistent. |
| Task 2 → Task 9 | normalized Random Mix dedupe | catalog invariant tests | puzzles.ts | Consistent. |
| Task 4 → Tasks 5-8 | banlist and audit tests | later content changes | answerEmojiBanlist.ts, clue-audit.test.ts | Sequential ownership prevents conflict. |
| Task 5 → Tasks 6-8 | CardSeed explanation position | later expanded cards | expandedPacks.ts | Consistent: optional transport during phased work; Task 9 enforces global completeness. |
| Tasks 5/6/7 → Task 9 | accepted expansion blocks | final counts/docs | expandedPacks.ts, puzzles tests | Consistent: actual counts are documented only after acceptance. |
| Task 8 → Task 9 | Harry Potter category | routes/counts/docs | expandedCategories/expandedPuzzles | Consistent. |
| Task 9 → Task 10 | verified branch and evidence | release | tests/build/docs | Consistent. |

No unresolved preflight conflict blocks Task 1.

Task 1: minor (deferred): Packet coverage tests assert counts/IDs and answer order but not full metadata projection or blind/full parity; final review should decide whether to add those assertions.
Task 1: fix round 1/5 (1 addressed, 1 open — normalized-empty values can create false duplicates; commits 85454b0..44e8b95)
Task 1: fix round 2/5 (1 addressed, 0 open — post-normalization empty-key guard restored; commits 44e8b95..b2531cd)
Task 1: complete (commits b515081..b2531cd, review clean; one deferred minor)

Task 2: fix round 1/5 (2 open — preserve distinct cards with empty normalized answers; strengthen normalized-answer dedupe fixture; commits b2531cd..bfefbed)
Task 2: fix round 2/5 (2 addressed, 0 open — empty normalized answers preserved and fixture proves normalized deduplication; commits bfefbed..a440c8d)
Task 2: complete (commits b2531cd..a440c8d, independent re-review clean; 13 files / 82 tests, typecheck, lint, and diff-check passed)
Task 3: fix round 1/5 (3 open — timer changes must not consume rounds; Restart must reset the current round rather than select a new one; strengthen Random Mix cap/remount coverage; commits a440c8d..ce76a9a)
Task 3: fix round 2/5 (3 addressed, 1 open — timer duration changes while revealed must preserve the stopped state; commits ce76a9a..7c8d779)
Task 3: fix round 3/5 (1 addressed, 0 open — revealed timer remains stopped across duration changes; commits e4a8366..a27074f)
Task 3: complete (commits a440c8d..a27074f excluding interleaved Task 4 commit, final independent review clean; focused suite 32/32, typecheck and lint passed)
Task 4: staged blind re-review complete for 71 changed retained cards — Stage 1 70/71 clue-only, Stage 2 71/71 with hints, final 71/71 after applying the authoritative semantic-category rule; no unresolved playability failures.
Task 4: fix round 1/5 (4 open from source-aware review — dynamic packet-count assertion, record post-change blind evidence, replace two misleading cultural glyphs, strengthen seven weak/repetitive fun facts; commit 7c8d779..e4a8366)
Task 4: fix round 2/5 (4 addressed, 1 open — staged blind evidence must be regenerated from the final post-fix clue state; commits a27074f..30f17b9)
Task 4: fix round 3/5 (final-state staged review complete for 71 cards: 69 pass, 2 open — Ariel resolves to the film title; A Minecraft Movie resolves only to the game)
Task 4: fix round 4/5 (2 addressed, 0 open — Ariel and A Minecraft Movie disambiguated; fresh staged two-card review 2/2 pass; commits 30f17b9..6c3d53d)
Task 4: fix round 5/5 (1 open after raw-evidence review — Ariel still converges on The Little Mermaid through Stage 2; require exact character-level convergence)
Task 4: complete (commits 7c8d779..1a1c0f2 excluding interleaved Task 3 commits; Ariel exact pre-hint guess 0.98 and passes as easy; final independent closeout review clean; no unresolved core findings)
Task 5: initial implementation commit 684377f (100 existing cards remediated; 110 additions drafted in 11 blocks; objective suite 105/105 green).
Task 5: fix round 1/5 open — source-aware review requires dropping the dinosaur expansion block, repairing strict/component leaks, repetition and near-duplicates, removing a wine reference, correcting diversity claims, and strengthening six reveal facts; staged blind review of the pre-fix 210-card set remains in progress.
Task 5: pre-fix staged blind review complete for 210 cards — 131 clue-only pass, 186 post-hint/final pass, 24 fail. Fix commit ce033be drops the ten-card dinosaur expansion and addresses the source-aware findings; final-state re-review is pending.
Task 5: fix round 2/5 open — resolve Eagle/Pteranodon targeting, Apple/Cherry similarity, generic repetition introduced by fixes, Crackers specificity, and all still-applicable pre-fix blind failures before final-state staging.
Task 5: fix round 3/5 open after commit 12d16c8 — remove nine residual compound leaks plus Cupcake's cake component, reduce four repetition warnings, and complete the in-progress final-state staged review.
Task 5: fix round 4/5 open after commit e02c0d5 — Banana Split leak, new repetition/filler, Spinosaurus mismatch, under-specific Granola Bar/Sunflower Seeds, Macaw/Bell Pepper, and all still-live explanation mismatches from the 12d staged review.
Task 5: fix round 5/5 open after commit 571f8bb — final source findings (Animal Crackers/Sunflower Seeds leaks, six explanation mismatches, two repetition warnings) plus five delta blind failures (Lobster, Cheesecake, Banana Split, String Cheese, Animal Crackers). Noncompliant expansion blocks must be dropped rather than padded.
Task 5: acceptance decision after commit 44df7df — accept Animals x2, Bugs, Fruit, Vegetables, Breakfast; omit Ocean Animals, Birds, Desserts, Snacks expansion blocks; Dinosaurs stays original ten. Snacks base has 8 accepted cards and requires two new one-for-one remediation replacements for failed Granola Bar/String Cheese before closeout.
Task 5: complete (commits 684377f..6cd5890; final 160 owned cards with 60 accepted additions across 6 ten-card blocks; rejected blocks fully omitted; Hummus easy and Jerky medium replacements both pass staged blind review; independent source review and full validation clean).
Task 6: initial implementation commit a072e4d (200 existing cards remediated; Science/Space/Myths/World Geography blocks drafted; 16 blocks omitted; Mortal Kombat replaced by Pinball). Staged blind: 199 clue-only pass, 238 post-hint pass, 212 final pass / 28 fail. Fix round 1/5 open for source-review repetition/leaks/distinctiveness plus all blind failures; packet-balance assertion deferred to Task 9.
Task 6: fix round 2/5 open after commit 101f216 — remove category-context/direct symbols, repetition regressions, repair two normalized banlist keys, strengthen retained weak cards, and fix delta blind Addition/Graph leaks; fresh delta review was 50/52 pass.
Task 6: complete (commits a072e4d..dfa5701; 200 existing Partition B cards remediated, 40 additions retained in four complete blocks, and the Mortal Kombat safety correction applied; full Stage-3 packet was 212/240 before the targeted fix waves, with the final targeted Space-pair blind JSON `task-6-round5-space-pair-blind.json` at commit dfa5701 passing 2/2; focused tests, typecheck, lint, build, and diff-check passed; packet-balance remains a Task 9 gate).
Task 7: implementation complete pending blind review (based on dfa5701; all 200 existing Partition C cards now have explicit explanations and targeted leak/context/fact/hint/difficulty repairs; 13 complete ten-card blocks retained for 130 additions, six flagged blocks omitted in full, and Literal Phrases remains at ten pending its Idioms boundary; C total 330; focused tests 48/48, puzzle tests 18/18, full suite 119/119, typecheck, lint, build, and diff-check passed; fresh clean-context blind review for all changed/new cards remains required).
Task 7: fix round 1/5 open after bccf4a6 — atomically removed the six blind-rejected addition blocks (Music Genres, Camping, National Parks, Beach Day, Kitchen Tools, Plants), retained seven complete blocks for 70 additions, repaired source-review leaks/filler/hints/facts and cross-partition Desserts S'mores, and added focused regressions; C total 270, fresh delta blind review pending.
Task 7: fix round 2/5 open after 34bf864 — atomically removed Musical Instruments, Holidays, Winter Holidays, and Emotions additions (40 cards), retained only Jobs/Idioms/Robots (30 additions), repaired remaining answer-bearing hints, idiom overlap, source-register gaps, and documented the Literal Phrases/Idioms boundary; C total 230, fresh delta blind review pending.

## Initial blind audit wave

- Coverage: partition A 200/200, B 200/200, C 200/200; 600 total and 600 unique opaque IDs at every stage.
- ID-set parity: stage 1, stage 2, and final IDs match within all three partitions.
- Results: A 186 pass / 14 fail; B 191 pass / 9 fail; C 188 pass / 12 fail; aggregate 565 pass / 35 fail.
- High-priority remediation IDs: A 0082, 0174; B 0205, 0295, 0305, 0378, 0399; C 0411, 0413, 0481, 0487, 0491, 0505, 0522, 0531.

## Rules and factual audit wave

- Coverage: 600/600 cards and 59/59 source categories, with exact opaque-card and category ID parity against the full audit packets.
- Partition A: 30 pass / 170 remediate; factual status 184 verified / 16 uncertain; expansion decisions 10 expand-by-10, 7 expand-by-20, 2 retain; 2 critical and 218 important findings.
- Partition B: 0 pass / 200 remediate; factual status 193 verified / 6 uncertain / 1 correction-needed; all 20 categories expand-by-10; 1 critical and 247 important findings.
- Partition C: 0 pass / 200 remediate; factual status 188 verified / 10 uncertain / 2 correction-needed; expansion decisions 19 expand-by-10 and 1 retain; 223 critical and 165 important findings.
- Every card assessment includes at least one source URL. The remediation tasks must preserve source-backed factual corrections, use the category-level context bans and repetition findings, and re-run staged blind review on every changed or added clue.
- Expansion remains selective: a recommendation is permission to attempt the proposed complete block, not automatic acceptance. A block ships only if all ten cards pass the content invariants, factual review, and staged blind review as a whole.
