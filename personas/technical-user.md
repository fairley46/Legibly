# Persona: Kai

<!-- Kai is a senior engineer or platform architect responsible for keeping their
     team's systems working with this product. They scan for breaking changes first,
     then specifics. Speed and accuracy matter more than warmth. -->

## Who They Are

Kai is a senior backend engineer or platform architect at a company that runs this
product in production, either as direct users or as integrators. They didn't choose
this product — their organization adopted it, and now they're responsible for keeping
it running and keeping it reliable for their team. They've learned to read release
notes carefully because they've been burned before by a "minor update" that wasn't.

They're not hostile. They're busy. They want exactly what they need to do their job,
nothing more.

## Their Day

9am: standups. They're usually also monitoring something.
Midday: code review, pull requests, design docs. The work.
Late afternoon: the fire drill that delays everything else.

They encounter release notes in a Slack notification from the product's changelog channel,
or in a digest email they've set up, or from a teammate saying "did you see what changed?"
They're at their desk, on a laptop, usually with two or three other tabs active.

## The Moment They Read This

Kai has 4 minutes between a code review and their next meeting. The release note landed
in the engineering channel they monitor for exactly this purpose. They open it.

First scan: do I see "Breaking" anywhere? Second scan: is there anything that touches
the parts I care about — our API client, the endpoints we call, auth, rate limits,
the webhook behavior? Third pass: specifics on the things that caught their eye.

Their emotional state: calm, focused, slightly skeptical. They want exact numbers and
explicit behavioral descriptions. They do not want to infer meaning from vague language.
If you write "some performance improvements," they will not trust the note.

**The question they're answering:** "Do I need to do anything before this hits us? And
is there anything here I should tell my team about?"

## What They're Hired to Do

Keep the integration or service their team depends on running correctly. Catch breaking
changes before they become incidents. Make good technical decisions about when to upgrade,
when to hold, when to write a migration. Be the person on the team who actually knows
what changed in the systems they depend on.

Their JTBD: "Give me the exact information I need to evaluate whether this release
requires any action on our end — and make it accurate enough that I can trust it."

## What Keeps Them Up at Night

A breaking change they didn't catch causing an on-call incident at 2am. A behavioral
change to an endpoint they depend on that corrupts data silently. A deprecation they
missed that suddenly removes functionality they're using in production. An update that
changes auth or rate limit behavior without a clear warning.

The worst version: finding out about a breaking change from an alert, not from the notes.

## What a Great Day Looks Like

They read the release note in 90 seconds, confirm nothing requires action, and move on.
Or: they catch a deprecation notice six weeks early, create a ticket to migrate, and
handle it cleanly with zero incident. Their team never knew there was a risk.

That's the job done right.

## What They Know About Technology

Deep. They write code daily. They know what API endpoints, HTTP methods, response codes,
rate limits, auth tokens, webhooks, and SDKs are — not as concepts but as daily working
reality. They understand p99 latency, error rates, and throughput. They can read
technical documentation directly.

You do not need to simplify. You need to be accurate. Vague language ("performance
improvements," "some changes") is not just unhelpful — it's a signal that the notes
can't be trusted.

## What They Don't Care About

- Business outcome framing ("reduces churn risk," "improves retention")
- Customer satisfaction language
- Marketing copy of any kind
- How hard the engineering was to implement
- Non-technical context about why a feature exists
- Executive-facing summaries
- Anything that doesn't describe concrete, testable behavior

Every sentence of business framing is a sentence that tells Kai this note wasn't
written for them.

## Writing Instructions

- **Flag breaking changes first, always.** Use "Breaking:" as a prefix. No exceptions.
- **Include specific numbers.** Before/after metrics, p50/p99 latencies, error rates. Vague is untrustworthy.
- **Reference the exact API surface that changed.** Endpoint paths, field names, config keys, CLI flags.
- **Include migration steps** if behavior changed. Not a suggestion — required.
- **Mention deprecations with explicit timelines.** "Deprecated" without a removal date is useless.
- **Describe behavior, not intent.** What does the system do now? Not "we improved X" — what is the behavior?
- **Tone:** Precise, neutral, direct. No enthusiasm, no softening. Technical accuracy over everything.
- **Length:** As long as it needs to be. Short is not a virtue if it sacrifices accuracy.

## Output Structure

```
## Release [YYYY-MM-DD] — [environment / branch]

**Breaking changes** *(skip section if none)*:
- Breaking: [What changed, exact API surface affected, exact action required]

**Changes:**
- [Change description: what it was, what it is now, behavioral difference if any]
- [Endpoint or config reference if applicable]

**Performance:**
- [Metric: before → after, e.g. "p99 latency: 340ms → 80ms on /v2/search"]

**Deprecations** *(skip section if none)*:
- [What: deprecated. Removal: [date]. Replacement: [what to use instead]]

**No action required** *(include if the release is safe to receive passively)*
```

## Good Example

> ## Release 2026-03-16 — production
>
> **Changes:**
> - `/v2/search` p99 latency: 340ms → 78ms. No change to response schema or
>   pagination behavior. No client-side updates required.
> - Export job status now returns a `queued_at` timestamp in addition to
>   `started_at` and `completed_at`. Existing consumers are unaffected.
>
> **Deprecations:**
> - `/v1/search` deprecated. Removal: 2026-06-01. Use `/v2/search` — same
>   parameters, same response shape.
>
> **No action required** unless you are currently using `/v1/search`.

## Bad Example

> Search was significantly improved with some backend enhancements. Exports also
> got some updates. There may be a deprecation coming for some older endpoints at
> some point in the future.

**Why this fails:** Kai cannot tell if p99 or p50 improved, which endpoints changed,
what the behavioral difference is, or when the deprecation actually happens. "Some
backend enhancements" tells them nothing they can act on. They won't trust this note
and they'll go check the API docs themselves — wasting 20 minutes they didn't have.
