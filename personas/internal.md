# Persona: Alex

<!-- Alex is a QA engineer or product manager who owns the staging sign-off process.
     They've been burned by "minor changes" that turned into production incidents.
     They approach every release note like a test plan they haven't written yet. -->

## Who They Are

Alex is a QA lead or senior product manager at a company that takes releases seriously.
They are the last gate between staging and production. They've been doing this long
enough to know that the phrase "low-risk change" in a commit message means something
went wrong somewhere that nobody noticed yet.

They're not adversarial toward engineering. They're on the same team. But they know
that their job is to find the thing nobody else found — and they take that seriously.
When something slips through staging and causes a production incident, Alex is the one
who asks themselves: "what did I miss?"

## Their Day

Morning: checks the overnight build status. Reviews what went into staging since
yesterday. Creates or updates the test plan for the day.
Midday: active testing, bug filing, reproducing edge cases, coordinating with devs on
behavior questions.
End of day: test summary, go/no-go recommendation for tomorrow's release window.

They interact with the internal release note first thing in the morning, before they
start testing. It's how they build their test plan for the day.

## The Moment They Read This

Alex is at their desk at 8:45am, coffee in hand, staging environment open in one browser
window. They pull up the internal release note in another. They have a blank test plan
doc open and a Jira board next to it.

They are reading this note as a checklist-builder. Every change is a potential test
scenario. Every "high-risk" flag is a place to spend more time. Every dependency note
is something they need to set up before they start.

Their emotional state: focused, methodical, slightly protective. They are the last line
of defense and they know it.

**The question they're answering:** "What do I need to test today, in what order, and
what should I pay extra attention to?"

## What They're Hired to Do

Catch regressions and edge cases before they reach production. Give engineering and
product a confident go/no-go on every release. Document what was tested and what was
found. Be the person who finds the thing nobody else was looking for.

Their JTBD: "Give me a complete, honest picture of what changed so I can build a test
plan that actually covers the risk — including the risks the engineers didn't flag."

## What Keeps Them Up at Night

A regression they didn't catch in staging that causes a production incident. A "minor
refactor" that touched something it wasn't supposed to. A config dependency they didn't
know about that causes silent data corruption. A feature flag that wasn't properly
scoped to staging. Missing a known edge case because the internal note didn't mention it.

The feeling of watching an alert fire for something they were supposed to have caught.

## What a Great Day Looks Like

They read the release note, build a test plan in 20 minutes, execute it by noon, file
three minor bugs, and send a go/no-go recommendation with full confidence by 2pm. The
release goes out. Nothing breaks. Engineering thanks them for the catch on that edge
case in the search path they flagged in the morning.

That's the job done right.

## What They Know About Technology

They're technical but not deep code-level. They understand how systems work at a feature
and integration level. They know what a database migration is, what a feature flag is,
what a config change means for testing. They can read Jira tickets, interpret commit
messages with context, and understand when a change is "only the API" versus
"touches the database schema."

They don't write production code. They do write test plans, test scripts, and detailed
bug reports that engineers can act on immediately. They think in test scenarios, not
implementation details.

## What They Don't Care About

- Customer-facing language or marketing framing
- Business outcome summaries (that's for the exec persona)
- Vague descriptions with no testable behavior ("improved performance")
- Anything that's already in production — they're focused on what's in *this* build
- High-level architecture explanations without operational impact
- Changes that have no user-visible or integration-testable effect

Every vague sentence costs them time. They'll have to track down the engineer and ask
what it means — time they don't have on release day.

## Writing Instructions

- **Frame every change as a test scenario.** Not "we changed X" but "validate that X now behaves like Y."
- **Include Jira ticket IDs.** They use them for traceability. Every change should map to a ticket.
- **Flag high-risk areas explicitly.** Changes that touch auth, data persistence, critical paths, or known fragile areas.
- **Include dependencies upfront.** Migrations to run, feature flags to configure, seed data needed, environment-specific setup.
- **Be honest about unknowns.** If a change has known edge cases or behavior that's uncertain, say so.
- **Reference the behavior before the change** when testing a fix — they need to know how to reproduce the original problem to confirm it's fixed.
- **Tone:** Direct, informational, collegial. This is an internal note — no need to soften, sell, or translate. Be complete.

## Output Structure

```
## Staging Build — [YYYY-MM-DD] — [branch name]

**Setup required before testing** *(skip if none)*:
- [Migration: run X]
- [Feature flag: enable Y in staging config]
- [Seed data: load Z fixture]

**What to validate:**
- [PROJ-123] [What changed → what to test → expected behavior]
- [PROJ-456] [What changed → what to test → expected behavior]

**High-risk areas — spend extra time here:**
- [PROJ-789] [Why this is risky, what to look for, known edge cases]

**Tickets in this build:**
- [PROJ-123]: [one-line summary]
- [PROJ-456]: [one-line summary]
- [PROJ-789]: [one-line summary]
```

## Good Example

> ## Staging Build — 2026-03-16 — release/2.14.0
>
> **Setup required before testing:**
> - Run migration: `db:migrate:20260316_add_export_timestamps`
> - Enable feature flag `scheduled_exports` in staging config before testing PROJ-891
>
> **What to validate:**
> - [PROJ-891] Scheduled exports: configure a daily export, confirm it runs on schedule,
>   confirm the `queued_at` timestamp appears in job status. Test with CSV and JSON formats.
> - [PROJ-847] Export failure fix: reproduce by exporting a dataset over 10k rows, confirm
>   the export completes and file is non-empty. Previous behavior: silent failure at ~10,500 rows.
>
> **High-risk areas — spend extra time here:**
> - [PROJ-903] Search rewrite: full-text search now uses a new index. Validate queries with
>   special characters (apostrophes, ampersands, non-ASCII). Known edge case in previous
>   implementation: queries with `&` returned zero results incorrectly.
>
> **Tickets in this build:**
> - PROJ-891: Scheduled export feature (feature-flagged)
> - PROJ-847: Export silent failure fix for large datasets
> - PROJ-903: Search indexing rewrite — full-text and special characters

## Bad Example

> We updated search and exports. Please test them to make sure they work.

**Why this fails:** Alex cannot build a test plan from this. They don't know what the
expected behavior is, what the edge cases are, what ticket to link their bug to, or
whether they need to set anything up first. They'll spend 30 minutes tracking down
engineers to get the information that should have been in this note — and they'll
do it right before the release window closes.
