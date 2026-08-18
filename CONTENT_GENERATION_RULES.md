# Guessmoji Content Generation Rules

## Purpose

This document is the authoritative standard for creating or revising Guessmoji categories and cards. It covers category design, answer selection, emoji clues, difficulty, reveal copy, safety, validation, and blind review.

Quality outranks card count. Do not add obscure answers, weak clues, generic filler, or dubious facts to meet a numerical target.

## Core Principles

Every category and card should be:

- Guessable by its intended audience.
- Challenging for a clear reason rather than arbitrary or obscure.
- Distinct from the other cards in its category.
- Safe for classroom and family group play.
- Accurate, concise, and useful after reveal.
- Compatible with a 10-card round drawn from a larger category pool.

The category name is part of the clue. Do not spend emoji space repeating information the player already has from the category.

## Category Brief

Define the category before generating cards. Record:

- Name, slug, description, icon, color theme, and recommended grade band.
- A clear inclusion and exclusion boundary.
- The intended audience: general players, regular fans, or enthusiastic fans.
- Three to six subthemes that provide coverage across the category.
- Whether the category uses strict concrete-answer rules or semantic/rebus rules.
- Category-context emojis that clues must not use because they merely restate the category.
- Any additional category-specific answer or clue bans.

Category icons may communicate the theme on selection screens, but they should not become automatic filler in every clue. For example, `🌊` is useful as the Ocean Animals category icon but is banned from Ocean Animals clues because the category already supplies the ocean context.

## Pool Size And Coverage

- Category pools must contain a multiple of 10 cards.
- Target 30 strong cards when the category supports them.
- Prefer at least 20 cards when 30 would require weak material.
- Allow 10 cards for a naturally narrow category.
- Never pad a category with obscure answers, near-duplicates, or low-quality clues.
- Plan three to six subthemes before selecting answers and distribute cards across them.
- Avoid letting one franchise, character family, species group, era, or subtype dominate unless that is the category's stated purpose.

A game round contains 10 unique cards sampled from the category pool. Product behavior for unseen-card history and round cycling is tracked in `TASKS.md`.

## Answer Selection

Judge recognizability against the category's stated audience and grade band:

- Easy answers should be familiar to most of the intended audience.
- Medium answers may assume familiarity from regular fans.
- Hard answers may target enthusiastic fans but must still be notable within the category.

Hard must not mean arbitrary, barely related, or dependent on specialist trivia.

The same normalized answer may appear in more than one source category only when it genuinely belongs in both. Each occurrence must have a category-appropriate clue. Random Mix must deduplicate normalized answers so a player does not receive the same answer twice under different IDs.

## Emoji Clue Construction

### Standard Shape

- Use three to five emojis for most clues.
- Longer rebus-style clues are allowed for titles, phrases, and idioms when the added emojis carry meaningful information.
- Include at least two independent, answer-specific associations.
- Make every emoji defensible in the explanation.
- Do not use decorative, misleading, or generic filler.
- Do not spell the answer with letters or numbers unless an intentional rebus is appropriate for the category.
- Keep the finished clue readable on one line across supported screens.

Independent associations should provide different paths to the answer. Three emojis that all communicate only "large," for example, count as one association rather than three.

### Use Category Context

Treat the visible category as information already given to the player. Clues should distinguish one answer from neighboring answers inside that category.

Do not use an emoji that merely repeats the category's setting or icon. Examples include:

- `🌊` throughout Ocean Animals.
- `🎬` throughout a movie category.
- `🎮` throughout a video game category.
- `🍽️` throughout a food category.

These symbols may be appropriate in a different category where they add answer-specific meaning.

### Prevent Answer Leaks

Apply a semantic rule by default and stricter rules to concrete-answer categories.

For strict categories—such as animals, foods, plants, everyday objects, instruments, vehicles, weather, and similar concrete subjects:

- Never use an emoji that directly depicts the answer.
- Never use an emoji that directly depicts a revealing component of a compound answer.
- Prefer behavior, appearance, function, habitat beyond the category context, relationships, effects, and notable attributes.
- Add every applicable direct or component representation to `src/data/answerEmojiBanlist.ts`.

Examples:

- `Whale` must not use `🐋`.
- `Seahorse` must not use `🐴`.
- `Starfish` must not use `⭐`.
- `Blackbird` must not use `🐦`.
- `Apple` must not use `🍎` or `🍏`.

For semantic categories—such as movies, books, characters, phrases, and idioms—an emoji may represent part of an answer when it contributes to a larger associative or rebus clue. The full clue must match the intended difficulty and should not become an unexplained literal transcription. For example, an easy `The Lion King` clue may use `🦁` and `👑` alongside a story-specific association.

When uncertain, choose the less revealing clue and rely on the hint as the safety net.

### Control Repetition

Review emoji use across the entire category, not only one card at a time.

- An emoji appearing on more than 20 percent of a category's cards triggers review.
- Treat presentation variants of the same base emoji as one emoji for this review.
- The 20 percent threshold is a warning, not an automatic rejection; a reviewer may approve meaningful repetition.
- Category-context filler remains banned even when it stays below 20 percent.
- No two cards in one category may have substantially interchangeable clues.
- Every card must retain at least two associations that distinguish it from neighboring cards.

## Difficulty And Hint Calibration

Difficulty combines answer familiarity and clue indirectness.

### Easy

- The answer is broadly familiar to the intended audience.
- The emojis provide several strong associations.
- A blind reviewer should identify the answer as the first or strongest guess without a hint.

### Medium

- The answer may require regular category familiarity, or the clue may be more indirect.
- The answer should appear among a few plausible guesses without a hint.
- The hint should make the intended answer clear.

### Hard

- The answer may target enthusiastic fans and use subtler associations.
- A reasonable connection must still be visible before the hint.
- The answer should become fairly identifiable after the hint.
- Do not use specialist trivia or arbitrary symbolism as difficulty.

Hints are a safety net. A hint should narrow the field without naming the answer, embedding it, spelling it, rhyming with it, or merely restating a direct definition.

## Card Fields

Each default card must provide explicit, polished content for every supported field. Do not rely on generic generated fallbacks.

- `answer`: Use the recognizable canonical name, with consistent spelling and punctuation.
- `emojis`: Supply the pre-reveal visual clue under the rules above.
- `difficulty`: Reflect both recognizability and clue indirectness.
- `hint`: Narrow the possibilities before reveal without giving away the answer.
- `explanation`: Decode every emoji and explain how the clue leads to the answer.
- `details`: Give concise identifying or category-relevant context.
- `funFact`: Add one interesting, non-repeated, verified fact.
- `tags`: Use concise search or grouping terms that genuinely apply.

The hint, explanation, details, and fun fact have different jobs and should not repeat one another.

Verify factual claims against a reliable source during generation or review. Source URLs do not belong in player-facing card data, but reviewers should be able to repeat the verification if a claim is questioned. Prefer stable, uncontroversial facts and rewrite claims that cannot be verified confidently.

## Safety And Tone

Default content must be classroom-safe and broadly family-friendly.

Exclude:

- Sexual content.
- Drugs or substance-use references.
- Slurs or demeaning stereotypes.
- Graphic violence, gore, or disturbing imagery.
- Real-world tragedies presented as entertainment.
- Mature or horror material that requires an opt-in category.

Age-appropriate mild fantasy battles, comic-book action, and gentle spooky themes are allowed. Keep wording friendly, direct, and free of generic hype or filler.

## Generation Workflow

1. Write the category brief and classify its clue policy.
2. Create the subtheme coverage plan.
3. Select recognizable answers before writing clues.
4. Remove near-duplicates and weak quota-filling answers.
5. Draft complete cards, including all reveal fields.
6. Update the answer emoji banlist for direct and revealing component representations.
7. Audit clue length, answer leaks, category-context filler, repetition, and pairwise distinctiveness.
8. Verify details and fun facts.
9. Run objective automated checks.
10. Run the clean-context blind review.
11. Revise failed or ambiguous cards and repeat the applicable checks.

## Automated Validation

Objective rules should fail tests or validation:

- Duplicate category, card, or normalized identifiers.
- Card counts that are not multiples of 10.
- Missing required fields or generic fallback copy in shipped default cards.
- Direct-answer or revealing-component emoji leaks covered by the banlist.
- Exact duplicate clues inside a category.
- Random Mix duplicate normalized answers.
- Invalid category references, difficulty values, or malformed records.

Judgment-based checks should produce review findings rather than automatic failures:

- An emoji exceeds the 20 percent repetition threshold.
- Two clues appear semantically interchangeable.
- A clue lacks two genuinely independent associations.
- An answer seems too obscure for its audience or difficulty.
- A hint gives too much or too little help.
- Category coverage is unbalanced.
- A factual claim needs stronger verification.

Run `src/lib/clue-audit.test.ts` whenever cards or the answer emoji banlist change.

## Clean-Context Blind Review

The author or generating agent must not perform the final guessability review. Use a separate subagent with no inherited task context and do not reveal the answer key early.

Review in three stages:

1. Give the reviewer only the category, intended grade band, difficulty, and emoji clue. Record its first guess, plausible alternatives, and reasoning.
2. Give the reviewer the hint. Record the revised guess before revealing any answer.
3. Reveal the intended answer and ask the reviewer to identify ambiguity, unfair leaps, answer leaks, or misleading emojis.

For a batch, complete each stage for all cards before moving to the next stage so earlier answers do not contaminate later guesses.

Pass criteria:

- Easy: the intended answer is the first or strongest pre-hint guess.
- Medium: the intended answer is among a few plausible pre-hint guesses and becomes clear with the hint.
- Hard: a reasonable pre-hint connection exists and the answer becomes fairly identifiable after the hint.

Revise and re-review any card that has no reasonable path, produces several equally strong answers after the hint, depends on hidden trivia, or passes only because the reviewer already knew the intended answer.

## Final Review Checklist

Before shipping a category or card batch, confirm:

- The category brief, audience, boundaries, subthemes, and clue policy are explicit.
- The pool size is a multiple of 10 and contains no quota padding.
- Answers cover the category without excessive subtype concentration.
- Each clue uses meaningful emoji space and contains two independent associations.
- Strict-category cards contain no direct or revealing component emoji.
- Category-context filler is absent.
- Repetition warnings and similar clue pairs have been reviewed.
- Difficulty and hints meet the blind-review criteria.
- All reveal fields are explicit, distinct, and polished.
- Facts have been verified against reliable sources.
- Safety rules are satisfied.
- Automated checks pass.
- Clean-context blind review passes.

