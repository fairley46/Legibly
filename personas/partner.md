# Persona: Marcus

<!-- Marcus is a senior engineer at a company that has built a production integration
     on top of this platform. Their customers depend on the integration working. A
     platform change that breaks their integration is their problem, not the platform's. -->

## Who They Are

Marcus is a senior engineer at a company that has built a product or integration on top
of this platform — a Salesforce app, an embedded analytics widget, an HR connector, a
payment gateway integration. He didn't build it alone, but he's the person who owns it
now. His customers don't know this platform exists. They just know that his product works
or doesn't work.

When this platform ships a breaking change and Marcus doesn't catch it, his customers
file tickets against *his* product. His team takes the on-call. His NPS takes the hit.

He is not hostile to the platform. He wants it to succeed. But he has learned — through
painful experience — to read every release note carefully before it reaches production.

## Their Day

Morning: reviews alerts from overnight, checks API status page, scans changelog notifications.
Midday: core engineering work — the integration codebase, code reviews, architecture decisions.
Week-rhythm: a biweekly sync with the platform's partner team. He comes with questions.

He has set up a Slack integration that posts changelog notifications directly into his
team's engineering channel. He catches release notes there, usually within a few hours
of publish. He's at his desk, laptop, multiple monitors.

## The Moment They Read This

Marcus opens the release note in his Slack engineering channel at 9:30am, before standup.
He has a coffee. He has about 3 minutes.

He reads top to bottom. He is scanning for two things:
1. **Is there anything labeled "Action Required" or "Breaking"?** If yes, this goes to the top of today's work.
2. **Does anything touch the API surfaces our integration relies on?** Auth, webhooks, the specific endpoints we call, rate limits, response schema.

His emotional state: alert, methodical. He approaches release notes like a code review —
looking for the thing that will bite him if he misses it.

**The question he's answering:** "Do I need to update my integration before this reaches
production? And if so, by when?"

## What They're Hired to Do

Keep the integration working for his customers. Evaluate API changes and deprecations early
enough to respond before they become incidents. Communicate upstream changes to his team
clearly so they can plan migrations. Be the person in his org who owns the platform relationship.

His JTBD: "Tell me what changed in the platform before it affects my customers. Give me
enough specificity to evaluate the impact and plan a response. Tell me when I need to act."

## What Keeps Them Up at Night

A platform API change silently breaking his integration and his customers noticing before
he does. A deprecation notice he missed with a removal date that already passed. A rate
limit change that starts throttling his API calls in production at 3am. An auth token
format that changes without a migration window.

The worst scenario: his customers experience an outage and file tickets against his product,
and the root cause is a platform change he was notified about but didn't read carefully enough.

## What a Great Day Looks Like

He reads the release note, confirms nothing requires action, and marks it reviewed. Or:
he spots a deprecation notice for an endpoint they're using, creates a ticket, schedules
a migration three weeks out, and handles it before any customer is affected. His team
never knew there was a risk. The platform shipped; his integration kept working.

That's what good looks like.

## What They Know About Technology

Deep. He builds APIs and knows how they're built. He understands REST semantics, HTTP
methods, status codes, OAuth flows, webhook delivery patterns, rate limit headers, pagination,
versioning strategies, and SDK dependencies. He knows what a breaking change is versus a
non-breaking addition, and he holds the platform to that distinction.

He will notice if a note describes something as non-breaking that actually is. He reads
carefully. Be accurate.

## What They Don't Care About

- Business value framing for end users ("customers will love this")
- Internal engineering changes with no API surface impact
- Changes to the platform's UI that don't affect his integration
- Executive-facing summaries
- Performance improvements that don't affect API response times or rate limits
- Marketing language of any kind
- Changes to other partner categories that don't affect his integration type

Every sentence not about the API surface is a sentence that doesn't belong in his note.

## Writing Instructions

- **Lead with action-required items.** If something requires partner action, that's bullet one. Non-optional.
- **Clearly label breaking vs. informational.** "Action required:" and "Informational:" as explicit prefixes.
- **Be explicit about backward compatibility.** "Existing integrations are unaffected" is a sentence worth writing.
- **Include version context.** Which API version does this affect? Is v1 impacted? v2?
- **Deprecation timelines are mandatory.** A deprecation notice without a removal date is useless.
- **Reference the exact API surface.** Endpoint paths, field names, OAuth scopes, webhook event types.
- **Include migration guidance** when behavior changes. Where does he look? What does he change?
- **Tone:** Professional, direct, complete. Partner notes should feel like API documentation, not marketing.

## Output Structure

```
## Partner Update — [YYYY-MM-DD]

**Action required** *(skip if nothing requires partner action)*:
- [What partners must do, what the deadline is, what happens if they don't act]

**API changes:**
- [Endpoint or field: what changed, what the new behavior is, backward-compatible or not]

**Deprecation notices** *(skip if none)*:
- [What: deprecated as of [date]. Removal: [date]. Replacement: [endpoint or pattern]]

**Performance and reliability:**
- [Changes that affect API response times, rate limits, or reliability — specific numbers]

**Informational** *(no action needed)*:
- [Changes to the platform that partners should know about but don't need to act on]
```

## Good Example

> ## Partner Update — 2026-03-16
>
> **API changes:**
> - `/v2/webhooks` now supports a `retry_policy` field (optional). Accepts `{"max_retries": 3, "backoff": "exponential"}`.
>   Existing integrations are unaffected — omitting the field preserves current behavior.
> - Export job status response now includes `queued_at` timestamp. Non-breaking addition.
>   Existing consumers can ignore it.
>
> **Deprecation notices:**
> - `/v1/webhooks` deprecated as of 2026-03-16. Removal: 2026-07-01. Migrate to `/v2/webhooks` —
>   same payload format, added `retry_policy` support.
>
> **Performance and reliability:**
> - Webhook delivery p99 latency reduced from 4.2s to 0.9s. No integration changes required.

## Bad Example

> We made some improvements to webhooks that partners will find useful. There's also a
> new timestamp field in exports. Some older endpoints may be going away eventually.

**Why this fails:** Marcus cannot tell if he needs to act. "May be going away eventually"
gives him no timeline to plan against. He can't assess backward compatibility from "some
improvements." He'll flag this to his team as "unclear — needs follow-up with partner
support," which means a 3-day delay to get the specifics he needed from this note.
